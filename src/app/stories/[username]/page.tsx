"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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

export default function StoriesPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const router = useRouter();
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchStories();
  }, [username]);

  useEffect(() => {
    if (storyGroups.length === 0) return;

    // Auto-advance story
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentGroupIndex, currentStoryIndex, storyGroups]);

  const fetchStories = async () => {
    try {
      const response = await fetch("/api/stories");
      if (response.ok) {
        const data = await response.json();
        setStoryGroups(data);
        
        // Find the group index for the username
        const groupIndex = data.findIndex(
          (group: StoryGroup) => group.user.username === username
        );
        if (groupIndex !== -1) {
          setCurrentGroupIndex(groupIndex);
        }
      }
    } catch (error) {
      console.error("Failed to fetch stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const currentGroup = storyGroups[currentGroupIndex];
    if (!currentGroup) return;

    if (currentStoryIndex < currentGroup.stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
    } else if (currentGroupIndex < storyGroups.length - 1) {
      setCurrentGroupIndex((prev) => prev + 1);
      setCurrentStoryIndex(0);
    } else {
      router.push("/");
    }
    setProgress(0);
  };

  const handlePrev = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
    } else if (currentGroupIndex > 0) {
      setCurrentGroupIndex((prev) => prev - 1);
      const prevGroup = storyGroups[currentGroupIndex - 1];
      setCurrentStoryIndex(prevGroup.stories.length - 1);
    }
    setProgress(0);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (storyGroups.length === 0) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl mb-4">No stories available</p>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const currentGroup = storyGroups[currentGroupIndex];
  const currentStory = currentGroup?.stories[currentStoryIndex];

  if (!currentStory) {
    router.push("/");
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 right-4 z-50 text-white hover:opacity-70 transition-opacity"
      >
        <X size={32} />
      </button>

      {/* Navigation buttons */}
      {currentGroupIndex > 0 || currentStoryIndex > 0 ? (
        <button
          onClick={handlePrev}
          className="absolute left-4 z-50 text-white hover:opacity-70 transition-opacity"
        >
          <ChevronLeft size={48} />
        </button>
      ) : null}
      
      {currentGroupIndex < storyGroups.length - 1 ||
      currentStoryIndex < currentGroup.stories.length - 1 ? (
        <button
          onClick={handleNext}
          className="absolute right-4 z-50 text-white hover:opacity-70 transition-opacity"
        >
          <ChevronRight size={48} />
        </button>
      ) : null}

      {/* Story content */}
      <div className="relative max-w-md w-full h-full max-h-[90vh] flex flex-col">
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 z-40 flex gap-1 p-2">
          {currentGroup.stories.map((_, index) => (
            <div key={index} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width:
                    index < currentStoryIndex
                      ? "100%"
                      : index === currentStoryIndex
                      ? `${progress}%`
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* User info */}
        <div className="absolute top-6 left-0 right-0 z-40 flex items-center gap-3 px-4">
          <Link href={`/profile/${currentGroup.user.username}`}>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-600">
              {currentGroup.user.image ? (
                <img
                  src={currentGroup.user.image}
                  alt={currentGroup.user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-white">
                  {currentGroup.user.username[0].toUpperCase()}
                </div>
              )}
            </div>
          </Link>
          <Link
            href={`/profile/${currentGroup.user.username}`}
            className="text-white text-sm font-semibold"
          >
            {currentGroup.user.username}
          </Link>
          <span className="text-white/70 text-sm">
            {new Date(currentStory.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Story image */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src={currentStory.imageUrl}
            alt="Story"
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Click areas for navigation */}
        <div className="absolute inset-0 flex">
          <div className="w-1/2 cursor-pointer" onClick={handlePrev} />
          <div className="w-1/2 cursor-pointer" onClick={handleNext} />
        </div>
      </div>
    </div>
  );
}
