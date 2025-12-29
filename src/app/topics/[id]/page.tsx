"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Copy, Star, Video } from "lucide-react";

interface Topic {
  _id: string;
  title: string;
  description: string;
  slug: string;
}

interface Testimonial {
  _id: string;
  reviewerName: string;
  reviewerEmail: string;
  rating: number;
  text: string;
  videoUrl?: string;
  createdAt: string;
}

export default function TopicDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { status } = useSession();
  const router = useRouter();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicRes, testimonialsRes] = await Promise.all([
          fetch(`/api/topics/${id}`),
          fetch(`/api/topics/${id}/testimonials`),
        ]);

      const topicData = await topicRes.json();
      const testimonialsData = await testimonialsRes.json();

      if (topicRes.ok) {
        setTopic(topicData.topic);
      }
      if (testimonialsRes.ok) {
        setTestimonials(testimonialsData.testimonials);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  if (status === "authenticated") {
    fetchData();
  }
  }, [status, id]);

  const copyLink = () => {
    if (topic) {
      const link = `${window.location.origin}/review/${topic.slug}`;
      navigator.clipboard.writeText(link);
      alert("Link copied to clipboard!");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Topic not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            Testimonial
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{topic.title}</h1>
              {topic.description && (
                <p className="mt-2 text-muted-foreground">{topic.description}</p>
              )}
            </div>
            <Button variant="outline" onClick={copyLink}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Review Link
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            Testimonials ({testimonials.length})
          </h2>
        </div>

        {testimonials.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg text-muted-foreground">
                No testimonials yet. Share your review link to start collecting
                testimonials.
              </p>
              <Button className="mt-4" variant="outline" onClick={copyLink}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Review Link
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <Card key={testimonial._id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {testimonial.reviewerName}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {testimonial.reviewerEmail && (
                    <CardDescription>{testimonial.reviewerEmail}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{testimonial.text}</p>
                  {testimonial.videoUrl && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Video className="h-4 w-4" />
                        <span>Video testimonial attached</span>
                      </div>
                      <video
                        controls
                        className="mt-2 w-full rounded-lg"
                        src={testimonial.videoUrl}
                      />
                    </div>
                  )}
                  <p className="mt-4 text-xs text-muted-foreground">
                    {new Date(testimonial.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
