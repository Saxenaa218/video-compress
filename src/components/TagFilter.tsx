"use client";

import { Tag } from "@/types";

interface TagFilterProps {
  tags: Tag[];
  selectedTags: string[];
  onToggleTag: (tagId: string) => void;
  onClearTags: () => void;
}

export function TagFilter({
  tags,
  selectedTags,
  onToggleTag,
  onClearTags,
}: TagFilterProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted">Filter by tags:</span>
        {selectedTags.length > 0 && (
          <button
            onClick={onClearTags}
            className="text-xs text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag.id);
          return (
            <button
              key={tag.id}
              onClick={() => onToggleTag(tag.id)}
              className={`text-sm px-3 py-1 rounded-full border transition-all ${
                isSelected
                  ? "border-transparent shadow-sm"
                  : "border-card-border bg-card-bg hover:bg-card-border"
              }`}
              style={
                isSelected
                  ? { backgroundColor: tag.color, color: "white" }
                  : {}
              }
            >
              {tag.name}
              {isSelected && " ✓"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
