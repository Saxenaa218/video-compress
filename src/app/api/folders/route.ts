import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all folders
export async function GET() {
  try {
    const folders = await prisma.folder.findMany({
      include: {
        documents: {
          select: { id: true, name: true },
        },
        children: true,
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json(
      { error: "Failed to fetch folders" },
      { status: 500 }
    );
  }
}

// POST create new folder
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, parentId } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Folder name is required" },
        { status: 400 }
      );
    }

    const folder = await prisma.folder.create({
      data: {
        name,
        parentId: parentId || null,
      },
      include: {
        documents: true,
        children: true,
      },
    });

    return NextResponse.json(folder, { status: 201 });
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json(
      { error: "Failed to create folder" },
      { status: 500 }
    );
  }
}
