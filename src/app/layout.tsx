import type { Metadata } from "next";
import "./globals.css";
import { SurveyProvider } from "@/context/SurveyContext";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Survey App",
  description: "Create, conduct, and analyze surveys",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <SurveyProvider>
          <Header />
          <main className="min-h-screen bg-gray-100">
            {children}
          </main>
        </SurveyProvider>
      </body>
    </html>
  );
}
