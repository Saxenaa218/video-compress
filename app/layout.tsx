import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tetris Game",
  description: "A classic Tetris game clone built with Next.js and React",
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
