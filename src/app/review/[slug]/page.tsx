"use client";

import { useEffect, useState, useRef, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star, Video, StopCircle, Trash2, CheckCircle } from "lucide-react";

interface Topic {
  id: string;
  title: string;
  description: string;
  slug: string;
}

export default function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Video state
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response = await fetch(`/api/testimonials?slug=${slug}`);
        const data = await response.json();

        if (response.ok) {
          setTopic(data.topic);
        } else {
          setError(data.error || "Topic not found");
        }
    } catch {
      setError("Failed to load topic");
    } finally {
      setLoading(false);
    }
  };
  fetchTopic();
  }, [slug]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setVideoBlob(blob);
        setVideoUrl(URL.createObjectURL(blob));

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Could not access camera. Please allow camera access.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const removeVideo = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoBlob(null);
    setVideoUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // For simplicity, we'll submit without video upload
      // In production, you'd upload the video to a storage service first
      let uploadedVideoUrl: string | undefined;

      if (videoBlob) {
        // Convert to base64 for demo purposes
        // In production, upload to S3/CloudStorage
        const reader = new FileReader();
        uploadedVideoUrl = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(videoBlob);
        });
      }

      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topicId: topic?.id,
          reviewerName,
          reviewerEmail,
          rating,
          text,
          videoUrl: uploadedVideoUrl,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to submit testimonial");
      }
    } catch {
      alert("Failed to submit testimonial");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Topic Not Found</CardTitle>
            <CardDescription>
              {error || "This review link may be invalid or the topic may no longer be active."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="max-w-md text-center">
          <CardContent className="py-12">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold">Thank You!</h2>
            <p className="mt-2 text-muted-foreground">
              Your testimonial has been submitted successfully.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{topic.title}</CardTitle>
            {topic.description && (
              <CardDescription>{topic.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Rating */}
              <div className="space-y-2">
                <Label>Your Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Recording */}
              <div className="space-y-2">
                <Label>Video Testimonial (Optional)</Label>
                <div className="rounded-lg border p-4">
                  {!videoUrl && !isRecording && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={startRecording}
                      className="w-full"
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Record Video
                    </Button>
                  )}

                  {isRecording && (
                    <div className="space-y-4">
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className="w-full rounded-lg bg-black"
                      />
                      <div className="flex justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={stopRecording}
                        >
                          <StopCircle className="mr-2 h-4 w-4" />
                          Stop Recording
                        </Button>
                      </div>
                    </div>
                  )}

                  {videoUrl && !isRecording && (
                    <div className="space-y-4">
                      <video
                        src={videoUrl}
                        controls
                        className="w-full rounded-lg"
                      />
                      <div className="flex justify-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={removeVideo}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            removeVideo();
                            startRecording();
                          }}
                        >
                          <Video className="mr-2 h-4 w-4" />
                          Re-record
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Text Testimonial */}
              <div className="space-y-2">
                <Label htmlFor="text">Your Testimonial</Label>
                <Textarea
                  id="text"
                  placeholder="Share your experience..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                  rows={4}
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={reviewerEmail}
                  onChange={(e) => setReviewerEmail(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Testimonial"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
