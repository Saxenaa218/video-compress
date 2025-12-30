"use client";

import { Bookmark, Tag } from "@/types";
import { useState, useEffect } from "react";

interface BookmarkFormProps {
  bookmark?: Bookmark | null;
  tags: Tag[];
  onSubmit: (data: {
    title: string;
    description: string;
    url: string;
    tagIds: string[];
  }) => void;
  onCancel: () => void;
  onCreateTag: (name: string) => Promise<Tag>;
}

export function BookmarkForm({
  bookmark,
  tags,
  onSubmit,
  onCancel,
  onCreateTag,
}: BookmarkFormProps) {
  const [title, setTitle] = useState(bookmark?.title || "");
  const [description, setDescription] = useState(bookmark?.description || "");
  const [url, setUrl] = useState(bookmark?.url || "");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    bookmark?.tags.map((t) => t.id) || []
  );
  const [newTagName, setNewTagName] = useState("");
  const [urlError, setUrlError] = useState("");
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  useEffect(() => {
    if (bookmark) {
      setTitle(bookmark.title);
      setDescription(bookmark.description || "");
      setUrl(bookmark.url);
      setSelectedTagIds(bookmark.tags.map((t) => t.id));
    }
  }, [bookmark]);

  const validateUrl = (value: string): boolean => {
    if (!value) {
      setUrlError("URL is required");
      return false;
    }
    try {
      new URL(value);
      setUrlError("");
      return true;
    } catch {
      setUrlError("Please enter a valid URL (e.g., https://example.com)");
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUrl(url)) return;
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      url: url.trim(),
      tagIds: selectedTagIds,
    });
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    setIsCreatingTag(true);
    try {
      const tag = await onCreateTag(newTagName.trim());
      setSelectedTagIds([...selectedTagIds, tag.id]);
      setNewTagName("");
    } finally {
      setIsCreatingTag(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card-bg border border-card-border rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {bookmark ? "Edit Bookmark" : "Add New Bookmark"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* URL */}
            <div>
              <label className="block text-sm font-medium mb-1">URL *</label>
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (urlError) validateUrl(e.target.value);
                }}
                onBlur={() => validateUrl(url)}
                placeholder="https://example.com"
                className={`w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  urlError ? "border-danger" : "border-card-border"
                }`}
                required
              />
              {urlError && (
                <p className="text-danger text-sm mt-1">{urlError}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Bookmark"
                className="w-full px-3 py-2 bg-background border border-card-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description..."
                rows={3}
                className="w-full px-3 py-2 bg-background border border-card-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                      selectedTagIds.includes(tag.id)
                        ? "border-transparent"
                        : "border-card-border bg-card-bg hover:bg-card-border"
                    }`}
                    style={
                      selectedTagIds.includes(tag.id)
                        ? { backgroundColor: tag.color, color: "white" }
                        : {}
                    }
                  >
                    {tag.name}
                  </button>
                ))}
              </div>

              {/* Create new tag */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="New tag name"
                  className="flex-1 px-3 py-1.5 bg-background border border-card-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCreateTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleCreateTag}
                  disabled={!newTagName.trim() || isCreatingTag}
                  className="px-3 py-1.5 bg-primary text-white rounded-md text-sm hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingTag ? "..." : "+ Add"}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-card-border rounded-md hover:bg-card-border transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors"
              >
                {bookmark ? "Update" : "Add"} Bookmark
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
