import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

// GET single document
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        folder: true,
        versions: {
          orderBy: { version: "desc" },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 }
    );
  }
}

// PUT update document
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, content, folderId, createVersion = false } = body;

    // Check if document exists
    const existingDoc = await prisma.document.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { version: "desc" },
          take: 1,
        },
      },
    });

    if (!existingDoc) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Create new version if content changed and createVersion is true
    if (createVersion && content !== undefined && content !== existingDoc.content) {
      const latestVersion = existingDoc.versions[0]?.version || 0;
      await prisma.documentVersion.create({
        data: {
          documentId: id,
          content: content,
          version: latestVersion + 1,
        },
      });
    }

    const document = await prisma.document.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(content !== undefined && { content }),
        ...(folderId !== undefined && { folderId: folderId || null }),
      },
      include: {
        folder: true,
        versions: {
          orderBy: { version: "desc" },
          take: 5,
        },
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 }
    );
  }
}

// DELETE document
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    
    // Check if document exists
    const existingDoc = await prisma.document.findUnique({
      where: { id },
    });

    if (!existingDoc) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    await prisma.document.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
