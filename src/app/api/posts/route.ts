import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

type PostWithRelations = {
  id: string;
  caption: string | null;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: {
    id: string;
    username: string;
    name: string | null;
    image: string | null;
  };
  likes: { userId: string }[];
  comments: Array<{
    id: string;
    content: string;
    createdAt: Date;
    user: {
      id: string;
      username: string;
      image: string | null;
    };
  }>;
  _count: {
    likes: number;
    comments: number;
  };
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "10");

    const posts = await prisma.post.findMany({
      take: limit + 1,
      ...(cursor && {
        cursor: {
          id: cursor,
        },
        skip: 1,
      }),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        comments: {
          take: 2,
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
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    let nextCursor: string | undefined = undefined;
    if (posts.length > limit) {
      const nextItem = posts.pop();
      nextCursor = nextItem!.id;
    }

    const postsWithLikeStatus = posts.map((post: PostWithRelations) => ({
      ...post,
      isLiked: session?.user?.id
        ? post.likes.some((like: { userId: string }) => like.userId === session.user.id)
        : false,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
    }));

    return NextResponse.json({
      posts: postsWithLikeStatus,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
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

    const { caption, imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        caption,
        imageUrl,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
