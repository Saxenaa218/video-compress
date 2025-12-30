import { NextResponse } from "next/server";
import { marked } from "marked";

// POST convert markdown to HTML
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, format = "html", documentName = "document" } = body;

    if (content === undefined) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Convert markdown to HTML
    const html = await marked(content);

    if (format === "html") {
      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${documentName}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      line-height: 1.6;
      color: #333;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
    }
    pre {
      background: #f4f4f4;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
    }
    code {
      background: #f4f4f4;
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-size: 0.9em;
    }
    pre code {
      background: none;
      padding: 0;
    }
    blockquote {
      border-left: 4px solid #ddd;
      margin: 0;
      padding-left: 1rem;
      color: #666;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 0.5rem;
      text-align: left;
    }
    th {
      background: #f4f4f4;
    }
    img {
      max-width: 100%;
    }
    a {
      color: #0066cc;
    }
  </style>
</head>
<body>
${html}
</body>
</html>`;
      return NextResponse.json({ html: fullHtml, format: "html" });
    }

    // For PDF, we return the HTML content to be rendered client-side
    // Client will use html2canvas + jspdf for PDF generation
    return NextResponse.json({ html, format: "pdf" });
  } catch (error) {
    console.error("Error exporting document:", error);
    return NextResponse.json(
      { error: "Failed to export document" },
      { status: 500 }
    );
  }
}
