import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VideoShare - Upload and Share Videos",
  description: "Upload videos and share them with embedded links. Request video reviews from other users.",
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
