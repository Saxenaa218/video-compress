import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Streamix - Watch Movies & Stream",
  description: "Watch your favorite movies with adaptive streaming. Powered by TMDB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-900 font-sans">
        {children}
      </body>
    </html>
  );
}
