"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    image?: string;
  };
}

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
  comments: Comment[];
}

export default function PostPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!session) return;

    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

    try {
      const method = newIsLiked ? "POST" : "DELETE";
      await fetch(`/api/posts/${postId}/like`, { method });
    } catch (error) {
      setIsLiked(!newIsLiked);
      setLikesCount((prev) => (newIsLiked ? prev - 1 : prev + 1));
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments((prev) => [newComment, ...prev]);
        setComment("");
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="bg-white border border-gray-200 rounded-lg animate-pulse">
            <div className="md:flex">
              <div className="md:w-1/2 aspect-square bg-gray-200"></div>
              <div className="md:w-1/2 p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!post) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto py-8 px-4 text-center">
          <h2 className="text-2xl font-semibold mb-2">Post not found</h2>
          <p className="text-gray-500">The post you're looking for doesn't exist.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="md:flex">
            {/* Image */}
            <div className="md:w-1/2 aspect-square bg-black">
              <img
                src={post.imageUrl}
                alt={post.caption || "Post image"}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Details */}
            <div className="md:w-1/2 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <Link
                  href={`/profile/${post.user.username}`}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                    {post.user.image ? (
                      <img
                        src={post.user.image}
                        alt={post.user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-semibold">
                        {post.user.username[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="font-semibold text-sm">{post.user.username}</span>
                </Link>
                <button className="p-2">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              {/* Comments */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-80">
                {/* Caption as first comment */}
                {post.caption && (
                  <div className="flex gap-3">
                    <Link href={`/profile/${post.user.username}`}>
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {post.user.image ? (
                          <img
                            src={post.user.image}
                            alt={post.user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm font-semibold">
                            {post.user.username[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                    </Link>
                    <div>
                      <p className="text-sm">
                        <Link
                          href={`/profile/${post.user.username}`}
                          className="font-semibold mr-1"
                        >
                          {post.user.username}
                        </Link>
                        {post.caption}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                )}

                {/* Comments */}
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <Link href={`/profile/${c.user.username}`}>
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {c.user.image ? (
                          <img
                            src={c.user.image}
                            alt={c.user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm font-semibold">
                            {c.user.username[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                    </Link>
                    <div>
                      <p className="text-sm">
                        <Link
                          href={`/profile/${c.user.username}`}
                          className="font-semibold mr-1"
                        >
                          {c.user.username}
                        </Link>
                        {c.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleLike}
                      className="hover:opacity-50 transition-opacity"
                    >
                      <Heart
                        size={24}
                        className={isLiked ? "fill-red-500 text-red-500" : ""}
                      />
                    </button>
                    <button className="hover:opacity-50 transition-opacity">
                      <MessageCircle size={24} />
                    </button>
                    <button className="hover:opacity-50 transition-opacity">
                      <Send size={24} />
                    </button>
                  </div>
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className="hover:opacity-50 transition-opacity"
                  >
                    <Bookmark size={24} className={isSaved ? "fill-black" : ""} />
                  </button>
                </div>

                <p className="font-semibold text-sm mb-1">
                  {likesCount} {likesCount === 1 ? "like" : "likes"}
                </p>
                <p className="text-xs text-gray-500 uppercase">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </p>
              </div>

              {/* Comment form */}
              <form
                onSubmit={handleComment}
                className="flex items-center border-t border-gray-200 px-4 py-3"
              >
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-1 text-sm outline-none bg-transparent"
                />
                <button
                  type="submit"
                  disabled={!comment.trim() || isSubmitting}
                  className="text-blue-500 font-semibold text-sm disabled:opacity-50"
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
