"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { TagFilter } from "@/components/TagFilter";
import { BookmarkCard } from "@/components/BookmarkCard";
import { BookmarkModal } from "@/components/BookmarkModal";
import { EmptyState } from "@/components/EmptyState";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useDebounce } from "@/hooks/useDebounce";
import { Bookmark, SortOption, BookmarkFormData } from "@/types";

export default function Home() {
  const {
    bookmarks,
    tags,
    loading,
    fetchBookmarks,
    createBookmark,
    updateBookmark,
    deleteBookmark,
    togglePin,
    toggleArchive,
    createTag,
    visitBookmark,
  } = useBookmarks();

  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("createdAt");
  const [showArchived, setShowArchived] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const refreshBookmarks = useCallback(() => {
    fetchBookmarks(debouncedSearch, selectedTags, sortBy, showArchived);
  }, [debouncedSearch, selectedTags, sortBy, showArchived, fetchBookmarks]);

  useEffect(() => {
    refreshBookmarks();
  }, [refreshBookmarks]);

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleAddBookmark = async (data: BookmarkFormData) => {
    await createBookmark(data);
    refreshBookmarks();
    showToast("Bookmark added successfully!");
  };

  const handleUpdateBookmark = async (data: BookmarkFormData) => {
    if (!editingBookmark) return;
    await updateBookmark(editingBookmark.id, data);
    refreshBookmarks();
    showToast("Bookmark updated successfully!");
  };

  const handleDeleteBookmark = async (id: string) => {
    if (confirm("Are you sure you want to delete this bookmark?")) {
      await deleteBookmark(id);
      refreshBookmarks();
      showToast("Bookmark deleted successfully!");
    }
  };

  const handleTogglePin = async (id: string, isPinned: boolean) => {
    await togglePin(id, isPinned);
    refreshBookmarks();
    showToast(isPinned ? "Bookmark unpinned" : "Bookmark pinned");
  };

  const handleToggleArchive = async (id: string, isArchived: boolean) => {
    await toggleArchive(id, isArchived);
    refreshBookmarks();
    showToast(isArchived ? "Bookmark restored" : "Bookmark archived");
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast("URL copied to clipboard!");
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const openEditModal = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBookmark(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header
        showArchived={showArchived}
        onToggleArchived={() => setShowArchived(!showArchived)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar
          search={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onAddClick={() => setIsModalOpen(true)}
        />

        <TagFilter
          tags={tags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onClearAll={() => setSelectedTags([])}
        />

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : bookmarks.length === 0 ? (
          <EmptyState
            showArchived={showArchived}
            onAddClick={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="grid gap-4">
            {bookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onVisit={visitBookmark}
                onEdit={openEditModal}
                onDelete={handleDeleteBookmark}
                onTogglePin={handleTogglePin}
                onToggleArchive={handleToggleArchive}
                onCopyUrl={handleCopyUrl}
              />
            ))}
          </div>
        )}
      </main>

      <BookmarkModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingBookmark ? handleUpdateBookmark : handleAddBookmark}
        bookmark={editingBookmark}
        tags={tags}
        onCreateTag={createTag}
      />

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
