import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all documents
export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      include: {
        folder: true,
        versions: {
          orderBy: { version: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

// POST create new document
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, content = "", folderId } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Document name is required" },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: {
        name,
        content,
        folderId: folderId || null,
      },
      include: {
        folder: true,
      },
    });

    // Create initial version
    await prisma.documentVersion.create({
      data: {
        documentId: document.id,
        content: content,
        version: 1,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}
