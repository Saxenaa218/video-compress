export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  _count?: {
    bookmarks: number;
  };
}

export interface BookmarkTag {
  bookmarkId: string;
  tagId: string;
  tag: Tag;
}

export interface Bookmark {
  id: string;
  title: string;
  description: string | null;
  url: string;
  favicon: string | null;
  isPinned: boolean;
  isArchived: boolean;
  viewCount: number;
  lastVisited: string | null;
  createdAt: string;
  updatedAt: string;
  tags: BookmarkTag[];
}

export interface BookmarkFormData {
  title: string;
  description: string;
  url: string;
  tags: string[];
}

export type SortOption = "createdAt" | "lastVisited" | "viewCount";
