import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";

export const metadata: Metadata = {
  title: "Instagram Clone",
  description: "A full-featured Instagram clone built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
