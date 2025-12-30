"use client";

import { useState, useEffect, useCallback } from "react";
import { Bookmark, Tag, SortOption } from "@/types";
import {
  BookmarkCard,
  BookmarkForm,
  SearchBar,
  TagFilter,
  SortDropdown,
  ThemeToggle,
} from "@/components";

export default function Home() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("recently-added");
  const [showArchived, setShowArchived] = useState(false);

  // Fetch bookmarks
  const fetchBookmarks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
      params.set("sort", sortOption);
      params.set("archived", showArchived.toString());

      const res = await fetch(`/api/bookmarks?${params.toString()}`);
      const data = await res.json();
      setBookmarks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedTags, sortOption, showArchived]);

  // Fetch tags
  const fetchTags = async () => {
    try {
      const res = await fetch("/api/tags");
      const data = await res.json();
      setTags(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching tags:", error);
      setTags([]);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  useEffect(() => {
    fetchTags();
  }, []);

  // Handle creating a new bookmark
  const handleCreateBookmark = async (data: {
    title: string;
    description: string;
    url: string;
    tagIds: string[];
  }) => {
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        fetchBookmarks();
        setShowForm(false);
      } else {
        const error = await res.json();
        alert(error.error || "Failed to create bookmark");
      }
    } catch (error) {
      console.error("Error creating bookmark:", error);
    }
  };

  // Handle updating a bookmark
  const handleUpdateBookmark = async (data: {
    title: string;
    description: string;
    url: string;
    tagIds: string[];
  }) => {
    if (!editingBookmark) return;

    try {
      const res = await fetch(`/api/bookmarks/${editingBookmark.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        fetchBookmarks();
        setEditingBookmark(null);
        setShowForm(false);
      } else {
        const error = await res.json();
        alert(error.error || "Failed to update bookmark");
      }
    } catch (error) {
      console.error("Error updating bookmark:", error);
    }
  };

  // Handle deleting a bookmark
  const handleDeleteBookmark = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bookmark?")) return;

    try {
      await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
      fetchBookmarks();
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  // Handle toggling pin status
  const handleTogglePin = async (id: string, isPinned: boolean) => {
    try {
      await fetch(`/api/bookmarks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned }),
      });
      fetchBookmarks();
    } catch (error) {
      console.error("Error toggling pin:", error);
    }
  };

  // Handle toggling archive status
  const handleToggleArchive = async (id: string, isArchived: boolean) => {
    try {
      await fetch(`/api/bookmarks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived }),
      });
      fetchBookmarks();
    } catch (error) {
      console.error("Error toggling archive:", error);
    }
  };

  // Handle visiting a bookmark (increment view count)
  const handleVisitBookmark = async (id: string) => {
    try {
      await fetch(`/api/bookmarks/${id}?view=true`);
      // Don't refetch immediately to avoid flicker
    } catch (error) {
      console.error("Error updating view count:", error);
    }
  };

  // Handle creating a new tag
  const handleCreateTag = async (name: string): Promise<Tag> => {
    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const tag = await res.json();
    fetchTags();
    return tag;
  };

  // Handle tag filter toggle
  const handleToggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleOpenEditForm = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBookmark(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-card-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-foreground">📚 Bookmark Manager</h1>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => {
                  setEditingBookmark(null);
                  setShowForm(true);
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2"
              >
                <span>+</span>
                <span className="hidden sm:inline">Add Bookmark</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Controls */}
        <div className="space-y-4 mb-6">
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar onSearch={setSearchQuery} />
            </div>
            <SortDropdown value={sortOption} onChange={setSortOption} />
          </div>

          {/* Tag Filter */}
          <TagFilter
            tags={tags}
            selectedTags={selectedTags}
            onToggleTag={handleToggleTag}
            onClearTags={() => setSelectedTags([])}
          />

          {/* View Toggle (All / Archived) */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowArchived(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !showArchived
                  ? "bg-primary text-white"
                  : "bg-card-bg border border-card-border hover:bg-card-border"
              }`}
            >
              📖 All Bookmarks
            </button>
            <button
              onClick={() => setShowArchived(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showArchived
                  ? "bg-primary text-white"
                  : "bg-card-bg border border-card-border hover:bg-card-border"
              }`}
            >
              📦 Archived
            </button>
          </div>
        </div>

        {/* Bookmark List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {showArchived ? "📦" : "📚"}
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {showArchived ? "No archived bookmarks" : "No bookmarks yet"}
            </h2>
            <p className="text-muted mb-4">
              {showArchived
                ? "Archived bookmarks will appear here"
                : searchQuery || selectedTags.length > 0
                ? "No bookmarks match your filters"
                : "Start by adding your first bookmark!"}
            </p>
            {!showArchived && !searchQuery && selectedTags.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
              >
                + Add Your First Bookmark
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={handleOpenEditForm}
                onDelete={handleDeleteBookmark}
                onTogglePin={handleTogglePin}
                onToggleArchive={handleToggleArchive}
                onVisit={handleVisitBookmark}
              />
            ))}
          </div>
        )}
      </main>

      {/* Bookmark Form Modal */}
      {showForm && (
        <BookmarkForm
          bookmark={editingBookmark}
          tags={tags}
          onSubmit={editingBookmark ? handleUpdateBookmark : handleCreateBookmark}
          onCancel={handleCloseForm}
          onCreateTag={handleCreateTag}
        />
      )}
    </div>
  );
}
