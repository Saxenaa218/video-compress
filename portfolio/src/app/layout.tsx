import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "John Developer | Full Stack Developer Portfolio",
  description:
    "Portfolio website of John Developer - a Full Stack Developer specializing in React, TypeScript, Node.js, and modern web technologies. View my projects, skills, and experience.",
  keywords: [
    "Full Stack Developer",
    "React Developer",
    "TypeScript",
    "Node.js",
    "Next.js",
    "Web Developer",
    "Portfolio",
    "Frontend Developer",
    "Backend Developer",
  ],
  authors: [{ name: "John Developer", url: "https://johndeveloper.com" }],
  creator: "John Developer",
  publisher: "John Developer",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://johndeveloper.com",
    siteName: "John Developer Portfolio",
    title: "John Developer | Full Stack Developer",
    description:
      "Full Stack Developer specializing in React, TypeScript, and modern web technologies.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "John Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "John Developer | Full Stack Developer",
    description:
      "Full Stack Developer specializing in React, TypeScript, and modern web technologies.",
    images: ["/og-image.png"],
    creator: "@johndeveloper",
  },
  alternates: {
    canonical: "https://johndeveloper.com",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
