import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/auth';
import { db } from '@/app/lib/db';
import { v4 as uuidv4 } from 'uuid';

// Get all review requests for the current user (both sent and received)
export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const sentRequests = db.getReviewRequestsByRequesterId(session.userId);
  const receivedRequests = db.getReviewRequestsByReviewerId(session.userId);

  // Enrich with video and user data
  const enrichRequest = (request: typeof sentRequests[0]) => {
    const video = db.getVideoById(request.videoId);
    const requester = db.getUserById(request.requesterId);
    const reviewer = db.getUserById(request.reviewerId);
    
    return {
      id: request.id,
      videoId: request.videoId,
      videoTitle: video?.title || 'Unknown',
      videoEmbedUrl: video ? `/embed/${video.embedId}` : null,
      requesterName: requester?.name || 'Unknown',
      requesterEmail: requester?.email || 'Unknown',
      reviewerName: reviewer?.name || 'Unknown',
      reviewerEmail: reviewer?.email || 'Unknown',
      message: request.message,
      status: request.status,
      createdAt: request.createdAt,
    };
  };

  return NextResponse.json({
    sent: sentRequests.map(enrichRequest),
    received: receivedRequests.map(enrichRequest),
  });
}

// Create a new review request
export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { videoId, reviewerEmail, message } = await request.json();

    if (!videoId || !reviewerEmail) {
      return NextResponse.json(
        { error: 'Video ID and reviewer email are required' },
        { status: 400 }
      );
    }

    // Verify video exists and belongs to the requester
    const video = db.getVideoById(videoId);
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    if (video.userId !== session.userId) {
      return NextResponse.json(
        { error: 'You can only request reviews for your own videos' },
        { status: 403 }
      );
    }

    // Find the reviewer by email
    const reviewer = db.getUserByEmail(reviewerEmail);
    if (!reviewer) {
      return NextResponse.json(
        { error: 'Reviewer not found. They need to create an account first.' },
        { status: 404 }
      );
    }

    if (reviewer.id === session.userId) {
      return NextResponse.json(
        { error: 'You cannot request a review from yourself' },
        { status: 400 }
      );
    }

    // Create the review request
    const reviewRequest = db.createReviewRequest({
      id: uuidv4(),
      videoId,
      requesterId: session.userId,
      reviewerId: reviewer.id,
      message: message || '',
      status: 'pending',
      createdAt: new Date(),
    });

    return NextResponse.json({
      reviewRequest: {
        id: reviewRequest.id,
        videoId: reviewRequest.videoId,
        reviewerEmail: reviewer.email,
        message: reviewRequest.message,
        status: reviewRequest.status,
        createdAt: reviewRequest.createdAt,
      },
    });
  } catch (error) {
    console.error('Review request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update review request status
export async function PATCH(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Request ID and status are required' },
        { status: 400 }
      );
    }

    if (!['pending', 'accepted', 'completed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const reviewRequest = db.getReviewRequestById(id);
    if (!reviewRequest) {
      return NextResponse.json(
        { error: 'Review request not found' },
        { status: 404 }
      );
    }

    // Only the reviewer can update the status
    if (reviewRequest.reviewerId !== session.userId) {
      return NextResponse.json(
        { error: 'Only the reviewer can update the status' },
        { status: 403 }
      );
    }

    const updated = db.updateReviewRequestStatus(id, status);

    return NextResponse.json({
      reviewRequest: updated,
    });
  } catch (error) {
    console.error('Update review request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
