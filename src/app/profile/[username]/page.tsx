"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import { Grid, Bookmark, Settings, Heart, MessageCircle } from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  name?: string;
  bio?: string;
  image?: string;
  website?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  isOwnProfile: boolean;
}

interface Post {
  id: string;
  imageUrl: string;
  _count: {
    likes: number;
    comments: number;
  };
}

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchPosts();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${username}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/users/${username}/posts`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const handleFollow = async () => {
    if (!profile) return;
    setFollowLoading(true);

    try {
      const method = profile.isFollowing ? "DELETE" : "POST";
      const response = await fetch(`/api/users/${username}/follow`, { method });

      if (response.ok) {
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                isFollowing: !prev.isFollowing,
                followersCount: prev.isFollowing
                  ? prev.followersCount - 1
                  : prev.followersCount + 1,
              }
            : null
        );
      }
    } catch (error) {
      console.error("Failed to follow/unfollow:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="animate-pulse">
            <div className="flex gap-8 md:gap-20 mb-10">
              <div className="w-20 h-20 md:w-36 md:h-36 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-4">
                <div className="w-48 h-6 bg-gray-200 rounded"></div>
                <div className="w-full h-4 bg-gray-200 rounded"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto py-8 px-4 text-center">
          <h2 className="text-2xl font-semibold mb-2">User not found</h2>
          <p className="text-gray-500">The user you're looking for doesn't exist.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Profile Header */}
        <div className="flex gap-8 md:gap-20 mb-10">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 md:w-36 md:h-36 rounded-full overflow-hidden bg-gray-200">
              {profile.image ? (
                <img
                  src={profile.image}
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl md:text-6xl font-semibold text-gray-400">
                  {profile.username?.[0]?.toUpperCase() || "?"}
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-xl">{profile.username}</h1>
              <div className="flex gap-2">
                {profile.isOwnProfile ? (
                  <>
                    <Link
                      href="/accounts/edit"
                      className="px-4 py-1.5 bg-gray-100 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors"
                    >
                      Edit profile
                    </Link>
                    <Link href="/accounts/settings" className="p-1.5">
                      <Settings size={24} />
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleFollow}
                      disabled={followLoading}
                      className={`px-6 py-1.5 rounded-lg font-semibold text-sm transition-colors ${
                        profile.isFollowing
                          ? "bg-gray-100 hover:bg-gray-200"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      {followLoading
                        ? "..."
                        : profile.isFollowing
                        ? "Following"
                        : "Follow"}
                    </button>
                    <Link
                      href={`/messages/${profile.id}`}
                      className="px-4 py-1.5 bg-gray-100 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors"
                    >
                      Message
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mb-4">
              <div>
                <span className="font-semibold">{profile.postsCount}</span>{" "}
                <span className="text-gray-500">posts</span>
              </div>
              <div>
                <span className="font-semibold">{profile.followersCount}</span>{" "}
                <span className="text-gray-500">followers</span>
              </div>
              <div>
                <span className="font-semibold">{profile.followingCount}</span>{" "}
                <span className="text-gray-500">following</span>
              </div>
            </div>

            {/* Bio */}
            <div>
              {profile.name && <p className="font-semibold">{profile.name}</p>}
              {profile.bio && <p className="whitespace-pre-wrap">{profile.bio}</p>}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-900 font-semibold"
                >
                  {profile.website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200">
          <div className="flex justify-center gap-16">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex items-center gap-2 py-4 border-t-2 -mt-px transition-colors ${
                activeTab === "posts"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500"
              }`}
            >
              <Grid size={12} />
              <span className="text-xs uppercase font-semibold tracking-wider">Posts</span>
            </button>
            {profile.isOwnProfile && (
              <button
                onClick={() => setActiveTab("saved")}
                className={`flex items-center gap-2 py-4 border-t-2 -mt-px transition-colors ${
                  activeTab === "saved"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500"
                }`}
              >
                <Bookmark size={12} />
                <span className="text-xs uppercase font-semibold tracking-wider">Saved</span>
              </button>
            )}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/post/${post.id}`}
              className="aspect-square relative group"
            >
              <img
                src={post.imageUrl}
                alt="Post"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-8 text-white">
                <div className="flex items-center gap-2">
                  <Heart size={20} fill="white" />
                  <span className="font-semibold">{post._count.likes}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle size={20} fill="white" />
                  <span className="font-semibold">{post._count.comments}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 border-2 border-black rounded-full flex items-center justify-center">
              <Grid size={32} />
            </div>
            <h3 className="text-3xl font-light mb-2">No Posts Yet</h3>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
