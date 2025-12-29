import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voting App",
  description: "Vote for your favorite items",
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
