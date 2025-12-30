import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // URL validation
    let urlObj: URL;
    try {
      urlObj = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });
      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract title
      const title = $("meta[property='og:title']").attr("content") ||
        $("meta[name='twitter:title']").attr("content") ||
        $("title").text() ||
        "";

      // Extract description
      const description = $("meta[property='og:description']").attr("content") ||
        $("meta[name='description']").attr("content") ||
        $("meta[name='twitter:description']").attr("content") ||
        "";

      // Extract favicon
      let favicon = $("link[rel='icon']").attr("href") ||
        $("link[rel='shortcut icon']").attr("href") ||
        $("link[rel='apple-touch-icon']").attr("href") ||
        `${urlObj.origin}/favicon.ico`;

      // Make favicon URL absolute if it's relative
      if (favicon && !favicon.startsWith("http")) {
        favicon = new URL(favicon, urlObj.origin).href;
      }

      return NextResponse.json({
        title: title.trim(),
        description: description.trim(),
        favicon,
      });
    } catch (fetchError) {
      console.error("Error fetching URL:", fetchError);
      // Return basic info if fetch fails
      return NextResponse.json({
        title: "",
        description: "",
        favicon: `${urlObj.origin}/favicon.ico`,
      });
    }
  } catch (error) {
    console.error("Error extracting metadata:", error);
    return NextResponse.json(
      { error: "Failed to extract metadata" },
      { status: 500 }
    );
  }
}
