import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitHub Timeline - Visualize Your GitHub Journey",
  description: "Generate a visual timeline of any GitHub user's public repositories. Perfect for showcasing your coding journey to prospective employers.",
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
