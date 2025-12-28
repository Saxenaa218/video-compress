"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";

export default function EditProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    website: "",
    image: "",
  });

  useEffect(() => {
    if (session?.user?.username) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${session?.user?.username}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.name || "",
          bio: data.bio || "",
          website: data.website || "",
          image: data.image || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (response.ok) {
        const { url } = await response.json();
        setFormData((prev) => ({ ...prev, image: url }));
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/users/${session?.user?.username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await update();
        router.push(`/profile/${session?.user?.username}`);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-xl mx-auto py-8 px-4">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 rounded-full bg-gray-200"></div>
              <div className="space-y-2">
                <div className="w-32 h-4 bg-gray-200 rounded"></div>
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold mb-6">Edit profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile picture */}
          <div className="flex items-center gap-8 bg-gray-100 p-4 rounded-xl">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-gray-500">
                  {session?.user?.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{session?.user?.username}</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-500 text-sm font-semibold hover:text-blue-600"
              >
                Change profile photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-semibold mb-2">Website</label>
            <input
              type="url"
              name="website"
              placeholder="Website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold mb-2">Bio</label>
            <textarea
              name="bio"
              placeholder="Bio"
              value={formData.bio}
              onChange={handleChange}
              maxLength={150}
              rows={3}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-1 focus:ring-gray-300 resize-none"
            />
            <p className="text-right text-xs text-gray-500">{formData.bio.length} / 150</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Submit"}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
