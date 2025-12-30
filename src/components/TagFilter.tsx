"use client";

import { Tag } from "@/types";

interface TagFilterProps {
  tags: Tag[];
  selectedTags: string[];
  onTagToggle: (tagId: string) => void;
  onClearAll: () => void;
}

export function TagFilter({
  tags,
  selectedTags,
  onTagToggle,
  onClearAll,
}: TagFilterProps) {
  if (tags.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Filter by tags
        </h3>
        {selectedTags.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-indigo-500 hover:text-indigo-600 dark:text-indigo-400"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onTagToggle(tag.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedTags.includes(tag.id)
                ? "ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-gray-900"
                : "hover:opacity-80"
            }`}
            style={{
              backgroundColor: tag.color + "20",
              color: tag.color,
              borderColor: tag.color,
            }}
          >
            {tag.name}
            {tag._count && (
              <span className="ml-1 opacity-60">({tag._count.bookmarks})</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
