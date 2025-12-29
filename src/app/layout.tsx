import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Video Chat - Real-time Video Meetings",
  description: "A video chat application for real-time video calls and group meetings with WebRTC",
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
