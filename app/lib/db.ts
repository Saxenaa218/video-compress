// Simple in-memory database for demonstration
// In production, use a real database like PostgreSQL or MongoDB

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

export interface Video {
  id: string;
  userId: string;
  title: string;
  filename: string;
  embedId: string;
  createdAt: Date;
}

export interface ReviewRequest {
  id: string;
  videoId: string;
  requesterId: string;
  reviewerId: string;
  message: string;
  status: 'pending' | 'accepted' | 'completed';
  createdAt: Date;
}

// In-memory storage (will reset on server restart)
// For production, replace with a real database
class Database {
  private users: Map<string, User> = new Map();
  private videos: Map<string, Video> = new Map();
  private reviewRequests: Map<string, ReviewRequest> = new Map();

  // User methods
  createUser(user: User): User {
    this.users.set(user.id, user);
    return user;
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  // Video methods
  createVideo(video: Video): Video {
    this.videos.set(video.id, video);
    return video;
  }

  getVideoById(id: string): Video | undefined {
    return this.videos.get(id);
  }

  getVideoByEmbedId(embedId: string): Video | undefined {
    return Array.from(this.videos.values()).find(v => v.embedId === embedId);
  }

  getVideosByUserId(userId: string): Video[] {
    return Array.from(this.videos.values()).filter(v => v.userId === userId);
  }

  deleteVideo(id: string): boolean {
    return this.videos.delete(id);
  }

  // Review request methods
  createReviewRequest(request: ReviewRequest): ReviewRequest {
    this.reviewRequests.set(request.id, request);
    return request;
  }

  getReviewRequestById(id: string): ReviewRequest | undefined {
    return this.reviewRequests.get(id);
  }

  getReviewRequestsByRequesterId(requesterId: string): ReviewRequest[] {
    return Array.from(this.reviewRequests.values()).filter(r => r.requesterId === requesterId);
  }

  getReviewRequestsByReviewerId(reviewerId: string): ReviewRequest[] {
    return Array.from(this.reviewRequests.values()).filter(r => r.reviewerId === reviewerId);
  }

  updateReviewRequestStatus(id: string, status: 'pending' | 'accepted' | 'completed'): ReviewRequest | undefined {
    const request = this.reviewRequests.get(id);
    if (request) {
      request.status = status;
      this.reviewRequests.set(id, request);
    }
    return request;
  }
}

// Export singleton instance
export const db = new Database();
