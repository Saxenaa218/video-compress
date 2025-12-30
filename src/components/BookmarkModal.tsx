"use client";

import { useState, useEffect } from "react";
import { Bookmark, Tag, BookmarkFormData } from "@/types";

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookmarkFormData) => Promise<void>;
  bookmark?: Bookmark | null;
  tags: Tag[];
  onCreateTag: (name: string, color: string) => Promise<Tag>;
}

export function BookmarkModal({
  isOpen,
  onClose,
  onSubmit,
  bookmark,
  tags,
  onCreateTag,
}: BookmarkModalProps) {
  const [formData, setFormData] = useState<BookmarkFormData>({
    title: "",
    description: "",
    url: "",
    tags: [],
  });
  const [urlError, setUrlError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const [showNewTagForm, setShowNewTagForm] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#6366f1");

  useEffect(() => {
    if (bookmark) {
      setFormData({
        title: bookmark.title,
        description: bookmark.description || "",
        url: bookmark.url,
        tags: bookmark.tags.map((t) => t.tagId),
      });
    } else {
      setFormData({ title: "", description: "", url: "", tags: [] });
    }
    setUrlError("");
  }, [bookmark, isOpen]);

  const validateUrl = (url: string): boolean => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const fetchMetadata = async () => {
    if (!formData.url || !validateUrl(formData.url)) {
      setUrlError("Please enter a valid URL");
      return;
    }

    setIsFetchingMetadata(true);
    try {
      const response = await fetch("/api/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formData.url }),
      });
      const data = await response.json();
      if (data.title || data.description) {
        setFormData((prev) => ({
          ...prev,
          title: prev.title || data.title,
          description: prev.description || data.description,
        }));
      }
    } catch (error) {
      console.error("Error fetching metadata:", error);
    } finally {
      setIsFetchingMetadata(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUrl(formData.url)) {
      setUrlError("Please enter a valid URL");
      return;
    }

    if (!formData.title || !formData.url) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting bookmark:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((id) => id !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    try {
      const tag = await onCreateTag(newTagName.trim(), newTagColor);
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag.id],
      }));
      setNewTagName("");
      setNewTagColor("#6366f1");
      setShowNewTagForm(false);
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {bookmark ? "Edit Bookmark" : "Add Bookmark"}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* URL Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, url: e.target.value }));
                    setUrlError("");
                  }}
                  onBlur={() => {
                    if (formData.url && !validateUrl(formData.url)) {
                      setUrlError("Please enter a valid URL");
                    }
                  }}
                  placeholder="https://example.com"
                  className={`flex-1 px-3 py-2 rounded-lg border ${
                    urlError
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
                <button
                  type="button"
                  onClick={fetchMetadata}
                  disabled={isFetchingMetadata || !formData.url}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-50 transition-colors"
                >
                  {isFetchingMetadata ? "..." : "Fetch"}
                </button>
              </div>
              {urlError && (
                <p className="mt-1 text-sm text-red-500">{urlError}</p>
              )}
            </div>

            {/* Title Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Bookmark title"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Description Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Optional description"
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      formData.tags.includes(tag.id)
                        ? "ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-gray-800"
                        : "hover:opacity-80"
                    }`}
                    style={{
                      backgroundColor: tag.color + "20",
                      color: tag.color,
                    }}
                  >
                    {tag.name}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowNewTagForm(true)}
                  className="px-3 py-1 rounded-full text-sm font-medium border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 hover:border-indigo-500 hover:text-indigo-500 transition-colors"
                >
                  + New Tag
                </button>
              </div>

              {showNewTagForm && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Tag name"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <input
                    type="color"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="w-10 h-8 rounded cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={handleCreateTag}
                    className="px-3 py-1.5 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewTagForm(false);
                      setNewTagName("");
                    }}
                    className="px-3 py-1.5 text-gray-500 text-sm hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.title || !formData.url}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Saving..." : bookmark ? "Update" : "Add Bookmark"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
