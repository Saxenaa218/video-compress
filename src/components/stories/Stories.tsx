"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";

interface Story {
  id: string;
  imageUrl: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    image?: string;
  };
}

interface StoryGroup {
  user: {
    id: string;
    username: string;
    image?: string;
  };
  stories: Story[];
}

export default function Stories() {
  const { data: session } = useSession();
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch("/api/stories");
      if (response.ok) {
        const data = await response.json();
        setStoryGroups(data);
      }
    } catch (error) {
      console.error("Failed to fetch stories:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 overflow-x-auto">
        <div className="flex gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-gray-200"></div>
              <div className="w-12 h-2 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 overflow-x-auto">
      <div className="flex gap-4">
        {/* Add Story Button */}
        <Link href="/create?type=story" className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center relative">
            {session?.user?.image ? (
              <>
                <img
                  src={session.user.image}
                  alt="Your story"
                  className="w-full h-full rounded-full object-cover opacity-70"
                />
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Plus size={12} className="text-white" />
                </div>
              </>
            ) : (
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-500">
                  {session?.user?.username?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Plus size={12} className="text-white" />
                </div>
              </div>
            )}
          </div>
          <span className="text-xs text-center truncate w-16">Your story</span>
        </Link>

        {/* Story Groups */}
        {storyGroups.map((group) => (
          <StoryItem key={group.user.id} group={group} />
        ))}
      </div>
    </div>
  );
}

function StoryItem({ group }: { group: StoryGroup }) {
  return (
    <Link
      href={`/stories/${group.user.username}`}
      className="flex flex-col items-center gap-1 flex-shrink-0"
    >
      <div className="w-16 h-16 rounded-full p-0.5 story-ring">
        <div className="w-full h-full rounded-full bg-white p-0.5">
          {group.user.image ? (
            <img
              src={group.user.image}
              alt={group.user.username}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold">
              {group.user.username[0].toUpperCase()}
            </div>
          )}
        </div>
      </div>
      <span className="text-xs text-center truncate w-16">{group.user.username}</span>
    </Link>
  );
}
