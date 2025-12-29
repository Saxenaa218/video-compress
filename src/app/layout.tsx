import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Video Compressor - Compress Videos Online",
  description: "Upload and compress your videos easily. Reduce file size while maintaining quality using our fast and secure video compression tool.",
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
