"use client";

import { Bookmark } from "@/types";
import Image from "next/image";
import { useState } from "react";

interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string, isPinned: boolean) => void;
  onToggleArchive: (id: string, isArchived: boolean) => void;
  onVisit: (id: string, url: string) => void;
}

export function BookmarkCard({
  bookmark,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleArchive,
  onVisit,
}: BookmarkCardProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(bookmark.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVisit = () => {
    onVisit(bookmark.id, bookmark.url);
    window.open(bookmark.url, "_blank", "noopener,noreferrer");
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="group relative bg-card-bg border border-card-border rounded-lg p-4 hover:shadow-lg transition-all duration-200">
      {bookmark.isPinned && (
        <div className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
          📌 Pinned
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Favicon */}
        <div className="flex-shrink-0 w-8 h-8 bg-card-border rounded-md flex items-center justify-center overflow-hidden">
          {bookmark.favicon ? (
            <Image
              src={bookmark.favicon}
              alt=""
              width={24}
              height={24}
              className="object-contain"
              unoptimized
            />
          ) : (
            <span className="text-lg">🔗</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            onClick={handleVisit}
            className="font-semibold text-foreground hover:text-primary cursor-pointer truncate"
            title={bookmark.title}
          >
            {bookmark.title}
          </h3>

          <a
            href={bookmark.url}
            onClick={(e) => {
              e.preventDefault();
              handleVisit();
            }}
            className="text-sm text-muted hover:text-primary truncate block"
            title={bookmark.url}
          >
            {new URL(bookmark.url).hostname}
          </a>

          {bookmark.description && (
            <p className="text-sm text-muted mt-1 line-clamp-2">
              {bookmark.description}
            </p>
          )}

          {/* Tags */}
          {bookmark.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {bookmark.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: tag.color + "20", color: tag.color }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted">
            <span title="View count">👁 {bookmark.viewCount}</span>
            <span title="Last visited">🕐 {formatDate(bookmark.lastVisited)}</span>
            <span title="Date added">📅 {formatDate(bookmark.createdAt)}</span>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-card-border rounded-md transition-colors"
            aria-label="Bookmark actions"
          >
            ⋮
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-48 bg-card-bg border border-card-border rounded-lg shadow-lg z-20 py-1">
                <button
                  onClick={() => {
                    handleCopyUrl();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-card-border text-sm flex items-center gap-2"
                >
                  {copied ? "✓ Copied!" : "📋 Copy URL"}
                </button>
                <button
                  onClick={() => {
                    onEdit(bookmark);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-card-border text-sm flex items-center gap-2"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => {
                    onTogglePin(bookmark.id, !bookmark.isPinned);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-card-border text-sm flex items-center gap-2"
                >
                  {bookmark.isPinned ? "📍 Unpin" : "📌 Pin"}
                </button>
                <button
                  onClick={() => {
                    onToggleArchive(bookmark.id, !bookmark.isArchived);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-card-border text-sm flex items-center gap-2"
                >
                  {bookmark.isArchived ? "📤 Unarchive" : "📥 Archive"}
                </button>
                <hr className="my-1 border-card-border" />
                <button
                  onClick={() => {
                    onDelete(bookmark.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-danger/10 text-danger text-sm flex items-center gap-2"
                >
                  🗑️ Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
