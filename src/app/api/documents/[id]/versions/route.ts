import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

// GET all versions for a document
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    
    // Check if document exists
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const versions = await prisma.documentVersion.findMany({
      where: { documentId: id },
      orderBy: { version: "desc" },
    });

    return NextResponse.json(versions);
  } catch (error) {
    console.error("Error fetching versions:", error);
    return NextResponse.json(
      { error: "Failed to fetch versions" },
      { status: 500 }
    );
  }
}
