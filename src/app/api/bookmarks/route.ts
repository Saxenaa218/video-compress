import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Helper function to fetch favicon from a URL
async function getFavicon(url: string): Promise<string | null> {
  try {
    const urlObj = new URL(url);
    // Use Google's favicon service as a reliable source
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
  } catch {
    return null;
  }
}

// GET /api/bookmarks - List all bookmarks with filtering, search, and sorting
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
    const sort = searchParams.get("sort") || "recently-added";
    const archived = searchParams.get("archived") === "true";

    // Build where clause
    const where: Record<string, unknown> = {
      isArchived: archived,
    };

    // Search by title
    if (search) {
      where.title = {
        contains: search,
      };
    }

    // Filter by tags (many-to-many)
    if (tags.length > 0) {
      where.tags = {
        some: {
          id: {
            in: tags,
          },
        },
      };
    }

    // Build orderBy clause
    type OrderByType = Record<string, "asc" | "desc">;
    let orderBy: OrderByType[] = [];
    switch (sort) {
      case "recently-visited":
        orderBy = [{ lastVisited: "desc" }, { createdAt: "desc" }];
        break;
      case "most-visited":
        orderBy = [{ viewCount: "desc" }];
        break;
      case "recently-added":
      default:
        orderBy = [{ isPinned: "desc" }, { createdAt: "desc" }];
        break;
    }

    const bookmarks = await prisma.bookmark.findMany({
      where,
      orderBy,
      include: {
        tags: true,
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

// POST /api/bookmarks - Create a new bookmark
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, url, tagIds = [] } = body;

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Check for duplicate URL
    const existingBookmark = await prisma.bookmark.findUnique({
      where: { url },
    });

    if (existingBookmark) {
      return NextResponse.json(
        { error: "A bookmark with this URL already exists" },
        { status: 409 }
      );
    }

    // Fetch favicon
    const favicon = await getFavicon(url);

    const bookmark = await prisma.bookmark.create({
      data: {
        title,
        description,
        url,
        favicon,
        tags: {
          connect: tagIds.map((id: string) => ({ id })),
        },
      },
      include: {
        tags: true,
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
