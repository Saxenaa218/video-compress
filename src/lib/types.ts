export interface DocumentVersion {
  id: string;
  content: string;
  documentId: string;
  version: number;
  createdAt: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  documents?: Document[];
  children?: Folder[];
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  content: string;
  folderId: string | null;
  folder?: Folder | null;
  versions?: DocumentVersion[];
  createdAt: string;
  updatedAt: string;
}
