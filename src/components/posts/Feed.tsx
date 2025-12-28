"use client";

import { useState, useEffect, useCallback } from "react";
import PostCard from "./PostCard";

interface Post {
  id: string;
  caption?: string;
  imageUrl: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    name?: string;
    image?: string;
  };
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  comments?: Array<{
    id: string;
    content: string;
    user: {
      username: string;
    };
  }>;
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (cursor?: string) => {
    try {
      const url = new URL("/api/posts", window.location.origin);
      if (cursor) url.searchParams.set("cursor", cursor);
      url.searchParams.set("limit", "10");

      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        if (cursor) {
          setPosts((prev) => [...prev, ...data.posts]);
        } else {
          setPosts(data.posts);
        }
        setNextCursor(data.nextCursor);
        setHasMore(!!data.nextCursor);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const loadMore = () => {
    if (nextCursor && hasMore) {
      fetchPosts(nextCursor);
    }
  };

  const handleLike = (postId: string, isLiked: boolean) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked,
              likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1,
            }
          : post
      )
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg animate-pulse">
            <div className="flex items-center gap-3 p-3">
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="aspect-square bg-gray-200"></div>
            <div className="p-3 space-y-2">
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
              <div className="w-full h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">Welcome to Instagram</h3>
        <p className="text-gray-500 mb-4">
          Follow people to see their photos and videos here.
        </p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onLike={handleLike} />
      ))}
      {hasMore && (
        <div className="flex justify-center py-4">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
