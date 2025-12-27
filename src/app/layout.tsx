import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Audio Editor - Upload & Edit Audio Files",
  description: "Upload and edit audio files in your browser. Support for MP3, WAV, AAC, FLAC, OGG, WebM, and M4A formats. Trim, adjust volume, and export audio clips.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
