"use client";

import { useState } from "react";
import { Document } from "@/lib/types";
import {
  FileText,
  FolderPlus,
  FilePlus,
  Trash2,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  documents: Document[];
  selectedDocument: Document | null;
  onSelectDocument: (doc: Document) => void;
  onCreateDocument: () => void;
  onDeleteDocument: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  documents,
  selectedDocument,
  onSelectDocument,
  onCreateDocument,
  onDeleteDocument,
  isOpen,
  onToggle,
}: SidebarProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      onDeleteDocument(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <h1 className="text-xl font-bold mb-4">MARKDOWN</h1>
            <h2 className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
              My Documents
            </h2>
            <button
              onClick={onCreateDocument}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded transition-colors"
            >
              <FilePlus size={16} />
              New Document
            </button>
          </div>

          {/* Document list */}
          <div className="flex-1 overflow-y-auto p-4">
            {documents.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">
                No documents yet. Create one to get started!
              </p>
            ) : (
              <ul className="space-y-2">
                {documents.map((doc) => (
                  <li
                    key={doc.id}
                    className={`group flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-800 transition-colors ${
                      selectedDocument?.id === doc.id ? "bg-gray-800" : ""
                    }`}
                    onClick={() => onSelectDocument(doc)}
                  >
                    <FileText size={16} className="text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">
                        {formatDate(doc.createdAt)}
                      </p>
                      <p className="text-sm truncate">{doc.name}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(doc.id);
                      }}
                      className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                        confirmDelete === doc.id
                          ? "bg-red-500 text-white opacity-100"
                          : "hover:bg-gray-700 text-gray-400"
                      }`}
                      title={
                        confirmDelete === doc.id
                          ? "Click again to confirm delete"
                          : "Delete document"
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
}
