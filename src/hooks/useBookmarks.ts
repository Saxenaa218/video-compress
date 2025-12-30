"use client";

import { useState, useEffect, useCallback } from "react";
import { Bookmark, Tag, SortOption, BookmarkFormData } from "@/types";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = useCallback(
    async (
      search: string = "",
      selectedTags: string[] = [],
      sortBy: SortOption = "createdAt",
      showArchived: boolean = false
    ) => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (selectedTags.length > 0)
          params.set("tags", selectedTags.join(","));
        params.set("sortBy", sortBy);
        params.set("archived", showArchived.toString());

        const response = await fetch(`/api/bookmarks?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch bookmarks");
        const data = await response.json();
        setBookmarks(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchTags = useCallback(async () => {
    try {
      const response = await fetch("/api/tags");
      if (!response.ok) throw new Error("Failed to fetch tags");
      const data = await response.json();
      setTags(data);
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  }, []);

  const createBookmark = async (data: {
    title: string;
    description: string;
    url: string;
    tags: string[];
  }) => {
    const response = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create bookmark");
    }
    return response.json();
  };

  const updateBookmark = async (
    id: string,
    data: BookmarkFormData | (Partial<Bookmark> & { tags?: string[] })
  ) => {
    // Convert BookmarkFormData to API format if needed
    const payload = 'isPinned' in data || 'isArchived' in data 
      ? data 
      : { 
          title: data.title,
          description: data.description,
          url: data.url,
          tags: data.tags
        };
        
    const response = await fetch(`/api/bookmarks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update bookmark");
    }
    return response.json();
  };

  const deleteBookmark = async (id: string) => {
    const response = await fetch(`/api/bookmarks/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete bookmark");
    }
    return response.json();
  };

  const togglePin = async (id: string, isPinned: boolean) => {
    return updateBookmark(id, { isPinned: !isPinned });
  };

  const toggleArchive = async (id: string, isArchived: boolean) => {
    return updateBookmark(id, { isArchived: !isArchived });
  };

  const createTag = async (name: string, color: string) => {
    const response = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, color }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create tag");
    }
    const tag = await response.json();
    await fetchTags();
    return tag;
  };

  const deleteTag = async (id: string) => {
    const response = await fetch(`/api/tags/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete tag");
    }
    await fetchTags();
    return response.json();
  };

  const visitBookmark = async (id: string, url: string) => {
    // Update view count in the background
    fetch(`/api/bookmarks/${id}`).catch(console.error);
    window.open(url, "_blank");
  };

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    bookmarks,
    tags,
    loading,
    error,
    fetchBookmarks,
    fetchTags,
    createBookmark,
    updateBookmark,
    deleteBookmark,
    togglePin,
    toggleArchive,
    createTag,
    deleteTag,
    visitBookmark,
  };
}
