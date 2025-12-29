"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Star, Video, MessageSquare, Share2 } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            Testimonial
          </Link>
          <nav className="flex items-center gap-4">
            {session ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Collect Video Testimonials
            <span className="text-primary"> with Ease</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Create topics, share unique links, and let your customers record
            video testimonials with star ratings. Build social proof for your
            business effortlessly.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href={session ? "/dashboard" : "/auth/signup"}>
              <Button size="lg" className="w-full sm:w-auto">
                Start Collecting Testimonials
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="mt-24">
          <h2 className="text-center text-3xl font-bold">How It Works</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8" />}
              title="Create a Topic"
              description="Set up a topic for your product, service, or project that you want to collect testimonials for."
            />
            <FeatureCard
              icon={<Share2 className="h-8 w-8" />}
              title="Share the Link"
              description="Get a unique shareable link that you can send to your customers or embed on your website."
            />
            <FeatureCard
              icon={<Video className="h-8 w-8" />}
              title="Record Video"
              description="Your customers can easily record a video testimonial directly in their browser."
            />
            <FeatureCard
              icon={<Star className="h-8 w-8" />}
              title="Rate with Stars"
              description="Customers can add star ratings and written feedback along with their video testimonial."
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Testimonial. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
