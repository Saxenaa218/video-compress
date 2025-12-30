"use client";

import { useState } from "react";
import { Document } from "@/lib/types";
import {
  Save,
  Download,
  FileDown,
  Eye,
  Edit,
  Trash2,
  Menu,
  History,
} from "lucide-react";

interface HeaderProps {
  document: Document | null;
  onSave: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
  onExportHtml: () => void;
  onExportPdf: () => void;
  onTogglePreview: () => void;
  onToggleSidebar: () => void;
  onShowVersions: () => void;
  isPreviewMode: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
}

export default function Header({
  document,
  onSave,
  onRename,
  onDelete,
  onExportHtml,
  onExportPdf,
  onTogglePreview,
  onToggleSidebar,
  onShowVersions,
  isPreviewMode,
  isSaving,
  hasUnsavedChanges,
}: HeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleStartEdit = () => {
    if (document) {
      setEditName(document.name);
      setIsEditing(true);
    }
  };

  const handleSaveName = () => {
    if (editName.trim()) {
      onRename(editName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveName();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete();
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <header className="bg-gray-800 text-white h-14 flex items-center justify-between px-4 border-b border-gray-700">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 hover:bg-gray-700 rounded"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        {document && (
          <div className="flex items-center gap-2">
            <FileDown size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Document Name</p>
              {isEditing ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={handleSaveName}
                  onKeyDown={handleKeyDown}
                  className="bg-gray-700 text-white text-sm px-2 py-0.5 rounded outline-none focus:ring-2 focus:ring-orange-500"
                  autoFocus
                />
              ) : (
                <p
                  className="text-sm cursor-pointer hover:text-orange-400"
                  onClick={handleStartEdit}
                >
                  {document.name}
                  {hasUnsavedChanges && (
                    <span className="ml-2 text-orange-400">•</span>
                  )}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {document && (
          <>
            {/* Version history button */}
            <button
              onClick={onShowVersions}
              className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
              title="Version history"
            >
              <History size={18} />
            </button>

            {/* Delete button */}
            <button
              onClick={handleDelete}
              className={`p-2 rounded transition-colors ${
                confirmDelete
                  ? "bg-red-500 text-white"
                  : "hover:bg-gray-700 text-gray-400 hover:text-white"
              }`}
              title={confirmDelete ? "Click again to confirm" : "Delete document"}
            >
              <Trash2 size={18} />
            </button>

            {/* Export menu */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
                title="Export"
              >
                <Download size={18} />
              </button>
              {showExportMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowExportMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 bg-gray-700 rounded shadow-lg z-20 min-w-[150px]">
                    <button
                      onClick={() => {
                        onExportHtml();
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-600 text-sm"
                    >
                      Export as HTML
                    </button>
                    <button
                      onClick={() => {
                        onExportPdf();
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-600 text-sm"
                    >
                      Export as PDF
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Toggle preview/edit */}
            <button
              onClick={onTogglePreview}
              className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
              title={isPreviewMode ? "Edit mode" : "Preview mode"}
            >
              {isPreviewMode ? <Edit size={18} /> : <Eye size={18} />}
            </button>

            {/* Save button */}
            <button
              onClick={onSave}
              disabled={isSaving || !hasUnsavedChanges}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                hasUnsavedChanges
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Save size={16} />
              {isSaving ? "Saving..." : "Save"}
            </button>
          </>
        )}
      </div>
    </header>
  );
}
