"use client";

import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { ImagePlus, ArrowLeft } from "lucide-react";

function CreatePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isStory = searchParams.get("type") === "story";
  
  const [step, setStep] = useState<"upload" | "caption">("upload");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
    setSelectedImage(URL.createObjectURL(file));
    setStep("caption");
    setError("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        handleFileSelect({ target: input } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError("");

    try {
      // Upload image first
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const { url: imageUrl } = await uploadResponse.json();

      // Create post or story
      const endpoint = isStory ? "/api/stories" : "/api/posts";
      const body = isStory
        ? { imageUrl }
        : { imageUrl, caption };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Failed to create ${isStory ? "story" : "post"}`);
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setCaption("");
    setStep("upload");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            {step === "caption" ? (
              <button onClick={handleReset} className="p-1">
                <ArrowLeft size={24} />
              </button>
            ) : (
              <div className="w-6"></div>
            )}
            <h1 className="font-semibold">
              Create new {isStory ? "story" : "post"}
            </h1>
            {step === "caption" ? (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="text-blue-500 font-semibold hover:text-blue-600 disabled:opacity-50"
              >
                {loading ? "Sharing..." : "Share"}
              </button>
            ) : (
              <div className="w-6"></div>
            )}
          </div>

          {/* Content */}
          {step === "upload" ? (
            <div
              className="aspect-square flex flex-col items-center justify-center p-8"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <ImagePlus size={64} className="text-gray-400 mb-4" />
              <p className="text-xl mb-4">Drag photos here</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold text-sm hover:bg-blue-600 transition-colors"
              >
                Select from computer
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            </div>
          ) : (
            <div className="md:flex">
              {/* Image preview */}
              <div className="md:w-1/2 aspect-square relative bg-black">
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {/* Caption */}
              {!isStory && (
                <div className="md:w-1/2 p-4">
                  <textarea
                    placeholder="Write a caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    maxLength={2200}
                    className="w-full h-40 resize-none outline-none text-sm"
                  />
                  <div className="text-right text-xs text-gray-400">
                    {caption.length}/2,200
                  </div>
                </div>
              )}
            </div>
          )}

          {error && step === "caption" && (
            <div className="px-4 pb-4">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="max-w-2xl mx-auto py-8 px-4">
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </div>
      </MainLayout>
    }>
      <CreatePageContent />
    </Suspense>
  );
}
