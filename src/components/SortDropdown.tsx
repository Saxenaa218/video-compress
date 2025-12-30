"use client";

import { SortOption } from "@/types";
import { useState } from "react";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "recently-added", label: "Recently Added" },
  { value: "recently-visited", label: "Recently Visited" },
  { value: "most-visited", label: "Most Visited" },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentLabel = sortOptions.find((opt) => opt.value === value)?.label;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-card-bg border border-card-border rounded-lg hover:bg-card-border transition-colors text-sm"
      >
        <span className="text-muted">Sort:</span>
        <span className="font-medium">{currentLabel}</span>
        <span className="text-muted">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 w-48 bg-card-bg border border-card-border rounded-lg shadow-lg z-20 py-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-card-border text-sm ${
                  value === option.value ? "text-primary font-medium" : ""
                }`}
              >
                {option.label}
                {value === option.value && " ✓"}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
