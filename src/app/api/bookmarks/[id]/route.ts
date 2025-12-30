import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/bookmarks/[id] - Get a single bookmark (and increment view count)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const incrementView = request.nextUrl.searchParams.get("view") === "true";

    if (incrementView) {
      // Increment view count and update last visited
      const bookmark = await prisma.bookmark.update({
        where: { id },
        data: {
          viewCount: { increment: 1 },
          lastVisited: new Date(),
        },
        include: { tags: true },
      });
      return NextResponse.json(bookmark);
    }

    const bookmark = await prisma.bookmark.findUnique({
      where: { id },
      include: { tags: true },
    });

    if (!bookmark) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(bookmark);
  } catch (error) {
    console.error("Error fetching bookmark:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmark" },
      { status: 500 }
    );
  }
}

// PUT /api/bookmarks/[id] - Update a bookmark
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, url, tagIds, isPinned, isArchived } = body;

    // Validate URL if provided
    if (url) {
      try {
        new URL(url);
      } catch {
        return NextResponse.json(
          { error: "Invalid URL format" },
          { status: 400 }
        );
      }

      // Check for duplicate URL (excluding current bookmark)
      const existingBookmark = await prisma.bookmark.findFirst({
        where: {
          url,
          NOT: { id },
        },
      });

      if (existingBookmark) {
        return NextResponse.json(
          { error: "A bookmark with this URL already exists" },
          { status: 409 }
        );
      }
    }

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (url !== undefined) {
      updateData.url = url;
      // Update favicon when URL changes
      try {
        const urlObj = new URL(url);
        updateData.favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
      } catch {
        // Keep existing favicon
      }
    }
    if (isPinned !== undefined) updateData.isPinned = isPinned;
    if (isArchived !== undefined) updateData.isArchived = isArchived;

    // Handle tag updates
    if (tagIds !== undefined) {
      updateData.tags = {
        set: tagIds.map((tagId: string) => ({ id: tagId })),
      };
    }

    const bookmark = await prisma.bookmark.update({
      where: { id },
      data: updateData,
      include: { tags: true },
    });

    return NextResponse.json(bookmark);
  } catch (error) {
    console.error("Error updating bookmark:", error);
    return NextResponse.json(
      { error: "Failed to update bookmark" },
      { status: 500 }
    );
  }
}

// DELETE /api/bookmarks/[id] - Delete a bookmark
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.bookmark.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Bookmark deleted successfully" });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}
