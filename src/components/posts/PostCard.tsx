"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";

interface PostCardProps {
  post: {
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
  };
  onLike?: (postId: string, isLiked: boolean) => void;
}

export default function PostCard({ post, onLike }: PostCardProps) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isSaved, setIsSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = async () => {
    if (!session) return;

    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

    try {
      const method = newIsLiked ? "POST" : "DELETE";
      await fetch(`/api/posts/${post.id}/like`, { method });
      onLike?.(post.id, newIsLiked);
    } catch (error) {
      // Revert on error
      setIsLiked(!newIsLiked);
      setLikesCount((prev) => (newIsLiked ? prev - 1 : prev + 1));
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment }),
      });
      setComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="bg-white border border-gray-200 rounded-lg mb-4">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <Link href={`/profile/${post.user.username}`} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-0.5">
            <div className="w-full h-full rounded-full bg-white p-0.5">
              {post.user.image ? (
                <img
                  src={post.user.image}
                  alt={post.user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                  {post.user.username[0].toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <span className="font-semibold text-sm">{post.user.username}</span>
        </Link>
        <button className="p-2">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Image */}
      <div className="relative aspect-square bg-gray-100">
        <img
          src={post.imageUrl}
          alt={post.caption || "Post image"}
          className="w-full h-full object-cover"
          onDoubleClick={handleLike}
        />
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className="hover:opacity-50 transition-opacity">
              <Heart
                size={24}
                className={isLiked ? "fill-red-500 text-red-500" : ""}
              />
            </button>
            <Link href={`/post/${post.id}`}>
              <MessageCircle size={24} className="hover:opacity-50 transition-opacity" />
            </Link>
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

        {/* Likes count */}
        <p className="font-semibold text-sm mb-1">
          {likesCount} {likesCount === 1 ? "like" : "likes"}
        </p>

        {/* Caption */}
        {post.caption && (
          <p className="text-sm mb-1">
            <Link href={`/profile/${post.user.username}`} className="font-semibold mr-1">
              {post.user.username}
            </Link>
            {post.caption}
          </p>
        )}

        {/* Comments preview */}
        {post.commentsCount > 0 && (
          <Link href={`/post/${post.id}`} className="text-sm text-gray-500 mb-1 block">
            View all {post.commentsCount} comments
          </Link>
        )}

        {post.comments?.slice(0, 2).map((comment) => (
          <p key={comment.id} className="text-sm mb-0.5">
            <Link href={`/profile/${comment.user.username}`} className="font-semibold mr-1">
              {comment.user.username}
            </Link>
            {comment.content}
          </p>
        ))}

        {/* Timestamp */}
        <p className="text-xs text-gray-500 mt-2 uppercase">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </p>
      </div>

      {/* Comment form */}
      <form onSubmit={handleComment} className="flex items-center border-t border-gray-200 px-4 py-3">
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
    </article>
  );
}
