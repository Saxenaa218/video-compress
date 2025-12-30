import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const showArchived = searchParams.get("archived") === "true";

  try {
    const where: {
      isArchived: boolean;
      title?: { contains: string };
      tags?: { some: { tagId: { in: string[] } } };
    } = {
      isArchived: showArchived,
    };

    if (search) {
      where.title = { contains: search };
    }

    if (tags.length > 0) {
      where.tags = { some: { tagId: { in: tags } } };
    }

    let orderBy: { [key: string]: "asc" | "desc" };
    switch (sortBy) {
      case "lastVisited":
        orderBy = { lastVisited: "desc" };
        break;
      case "viewCount":
        orderBy = { viewCount: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    const bookmarks = await prisma.bookmark.findMany({
      where,
      orderBy: [{ isPinned: "desc" }, orderBy],
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, url, tags } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: "Title and URL are required" },
        { status: 400 }
      );
    }

    // URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Try to fetch favicon
    let favicon = null;
    try {
      const urlObj = new URL(url);
      favicon = `${urlObj.origin}/favicon.ico`;
    } catch {
      // Ignore favicon fetch errors
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        title,
        description: description || null,
        url,
        favicon,
        tags: {
          create:
            tags?.map((tagId: string) => ({
              tag: { connect: { id: tagId } },
            })) || [],
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json(
      { error: "Failed to create bookmark" },
      { status: 500 }
    );
  }
}
