import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Increment view count and update last visited
    const bookmark = await prisma.bookmark.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
        lastVisited: new Date(),
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json(bookmark);
  } catch (error) {
    console.error("Error fetching bookmark:", error);
    return NextResponse.json(
      { error: "Bookmark not found" },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { title, description, url, tags, isPinned, isArchived } = body;

    // URL validation if URL is provided
    if (url) {
      try {
        new URL(url);
      } catch {
        return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
      }
    }

    // Get new favicon if URL changed
    let favicon = undefined;
    if (url) {
      try {
        const urlObj = new URL(url);
        favicon = `${urlObj.origin}/favicon.ico`;
      } catch {
        // Ignore favicon fetch errors
      }
    }

    // First, delete existing tag relationships if tags are being updated
    if (tags !== undefined) {
      await prisma.bookmarkTag.deleteMany({
        where: { bookmarkId: id },
      });
    }

    const bookmark = await prisma.bookmark.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(url !== undefined && { url }),
        ...(favicon !== undefined && { favicon }),
        ...(isPinned !== undefined && { isPinned }),
        ...(isArchived !== undefined && { isArchived }),
        ...(tags !== undefined && {
          tags: {
            create: tags.map((tagId: string) => ({
              tag: { connect: { id: tagId } },
            })),
          },
        }),
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
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
