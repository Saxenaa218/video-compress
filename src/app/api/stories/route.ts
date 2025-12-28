import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

type StoryUser = {
  id: string;
  username: string;
  image: string | null;
};

type StoryWithUser = {
  id: string;
  imageUrl: string;
  createdAt: Date;
  expiresAt: Date;
  userId: string;
  user: StoryUser;
};

type GroupedStory = {
  user: StoryUser;
  stories: StoryWithUser[];
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get stories from users the current user follows (including own stories)
    const now = new Date();

    const stories = await prisma.story.findMany({
      where: {
        expiresAt: {
          gt: now,
        },
        OR: [
          { userId: session.user.id },
          {
            user: {
              followers: {
                some: {
                  followerId: session.user.id,
                },
              },
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    });

    // Group stories by user
    const groupedStories: Record<string, GroupedStory> = {};
    stories.forEach((story: StoryWithUser) => {
      const userId = story.userId;
      if (!groupedStories[userId]) {
        groupedStories[userId] = {
          user: story.user,
          stories: [],
        };
      }
      groupedStories[userId].stories.push(story);
    });

    return NextResponse.json(Object.values(groupedStories));
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Stories expire in 24 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const story = await prisma.story.create({
      data: {
        imageUrl,
        userId: session.user.id,
        expiresAt,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    console.error("Error creating story:", error);
    return NextResponse.json(
      { error: "Failed to create story" },
      { status: 500 }
    );
  }
}
