import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({ users: [] });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query } },
          { name: { contains: query } },
        ],
      },
      take: 20,
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    return NextResponse.json({
      users: users.map((user) => ({
        ...user,
        followersCount: user._count.followers,
      })),
    });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}
