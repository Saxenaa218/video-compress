import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simple FTP Client",
  description: "A lightweight FTP client application for connecting to FTP servers and managing file transfers",
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
