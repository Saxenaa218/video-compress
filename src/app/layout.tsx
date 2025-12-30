import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Markdown Editor",
  description: "An in-browser markdown editor with live preview, document management, and export functionality",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
