import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Topic from "@/models/Topic";
import Testimonial from "@/models/Testimonial";

// GET: Get topic by slug for public review page
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const topic = await Topic.findOne({ slug, isActive: true });

    if (!topic) {
      return NextResponse.json(
        { error: "Topic not found or inactive" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      topic: {
        id: topic._id,
        title: topic.title,
        description: topic.description,
        slug: topic.slug,
      }
    });
  } catch (error: unknown) {
    console.error("Get topic error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Submit a testimonial
export async function POST(request: NextRequest) {
  try {
    const { topicId, reviewerName, reviewerEmail, rating, text, videoUrl } = await request.json();

    if (!topicId || !reviewerName || !rating || !text) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    await dbConnect();

    const topic = await Topic.findOne({ _id: topicId, isActive: true });

    if (!topic) {
      return NextResponse.json(
        { error: "Topic not found or inactive" },
        { status: 404 }
      );
    }

    const testimonial = await Testimonial.create({
      topicId,
      reviewerName,
      reviewerEmail,
      rating,
      text,
      videoUrl,
    });

    return NextResponse.json(
      { 
        message: "Testimonial submitted successfully",
        testimonial,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Submit testimonial error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
