import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pacman Game - Classic Arcade Game",
  description: "Play the classic Pacman arcade game built with Next.js and React. Navigate the maze, collect pellets, and avoid ghosts!",
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
