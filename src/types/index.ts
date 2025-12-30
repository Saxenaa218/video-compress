export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface Bookmark {
  id: string;
  title: string;
  description: string | null;
  url: string;
  favicon: string | null;
  viewCount: number;
  lastVisited: Date | null;
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  isArchived: boolean;
  tags: Tag[];
}

export interface BookmarkFormData {
  title: string;
  description?: string;
  url: string;
  tagIds: string[];
}

export type SortOption = "recently-added" | "recently-visited" | "most-visited";
