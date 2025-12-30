"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MarkdownPreview from "@/components/MarkdownPreview";
import VersionHistoryModal from "@/components/VersionHistoryModal";
import { Document, DocumentVersion } from "@/lib/types";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// Dynamically import the editor to avoid SSR issues
const MarkdownEditor = dynamic(() => import("@/components/MarkdownEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-500">Loading editor...</p>
    </div>
  ),
});

const DEFAULT_CONTENT = `# Welcome to Markdown Editor

This is a **powerful** markdown editor with live preview.

## Features

- ✨ Live preview
- 📁 Document management
- 💾 Auto-save
- 📜 Version history
- 📤 Export to HTML/PDF

## Getting Started

Start typing in the editor on the left to see your formatted content on the right.

### Markdown Examples

#### Code Blocks

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

#### Lists

1. First item
2. Second item
3. Third item

- Bullet point
- Another point

#### Blockquotes

> This is a blockquote.
> It can span multiple lines.

#### Tables

| Feature | Status |
|---------|--------|
| Editor | ✅ |
| Preview | ✅ |
| Export | ✅ |

Happy writing! 🚀
`;

export default function MarkdownEditorPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showVersions, setShowVersions] = useState(false);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [isFullPreview, setIsFullPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const hasUnsavedChanges = content !== originalContent;

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/documents");
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
        if (data.length > 0 && !selectedDocument) {
          selectDocument(data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectDocument = (doc: Document) => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm(
        "You have unsaved changes. Do you want to discard them?"
      );
      if (!confirm) return;
    }
    setSelectedDocument(doc);
    setContent(doc.content);
    setOriginalContent(doc.content);
    setIsSidebarOpen(false);
  };

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  const handleSave = async (createVersion = true) => {
    if (!selectedDocument || !hasUnsavedChanges) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/documents/${selectedDocument.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          createVersion,
        }),
      });

      if (response.ok) {
        const updatedDoc = await response.json();
        setSelectedDocument(updatedDoc);
        setOriginalContent(content);
        setDocuments((prev) =>
          prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d))
        );
      }
    } catch (error) {
      console.error("Error saving document:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRename = async (name: string) => {
    if (!selectedDocument) return;

    try {
      const response = await fetch(`/api/documents/${selectedDocument.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        const updatedDoc = await response.json();
        setSelectedDocument(updatedDoc);
        setDocuments((prev) =>
          prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d))
        );
      }
    } catch (error) {
      console.error("Error renaming document:", error);
    }
  };

  const handleCreateDocument = async () => {
    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Untitled Document",
          content: DEFAULT_CONTENT,
        }),
      });

      if (response.ok) {
        const newDoc = await response.json();
        setDocuments((prev) => [newDoc, ...prev]);
        selectDocument(newDoc);
      }
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  const handleDeleteDocument = async (id?: string) => {
    const docId = id || selectedDocument?.id;
    if (!docId) return;

    try {
      const response = await fetch(`/api/documents/${docId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== docId));
        if (selectedDocument?.id === docId) {
          const remainingDocs = documents.filter((d) => d.id !== docId);
          if (remainingDocs.length > 0) {
            selectDocument(remainingDocs[0]);
          } else {
            setSelectedDocument(null);
            setContent("");
            setOriginalContent("");
          }
        }
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleExportHtml = async () => {
    if (!selectedDocument) return;

    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          format: "html",
          documentName: selectedDocument.name,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([data.html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${selectedDocument.name}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error exporting HTML:", error);
    }
  };

  const handleExportPdf = async () => {
    if (!selectedDocument || !previewRef.current) return;

    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${selectedDocument.name}.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };

  const handleShowVersions = async () => {
    if (!selectedDocument) return;

    try {
      const response = await fetch(
        `/api/documents/${selectedDocument.id}/versions`
      );
      if (response.ok) {
        const data = await response.json();
        setVersions(data);
        setShowVersions(true);
      }
    } catch (error) {
      console.error("Error fetching versions:", error);
    }
  };

  const handleRestoreVersion = async (version: DocumentVersion) => {
    if (!selectedDocument) return;

    setContent(version.content);
    setShowVersions(false);
    // Auto-save restored content
    try {
      const response = await fetch(`/api/documents/${selectedDocument.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: version.content,
          createVersion: true,
        }),
      });

      if (response.ok) {
        const updatedDoc = await response.json();
        setSelectedDocument(updatedDoc);
        setOriginalContent(version.content);
        setDocuments((prev) =>
          prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d))
        );
      }
    } catch (error) {
      console.error("Error restoring version:", error);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      // Ctrl/Cmd + P to toggle preview
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        setIsPreviewMode((prev) => !prev);
      }
      // Escape to exit full preview
      if (e.key === "Escape" && isFullPreview) {
        setIsFullPreview(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasUnsavedChanges, isFullPreview]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        documents={documents}
        selectedDocument={selectedDocument}
        onSelectDocument={selectDocument}
        onCreateDocument={handleCreateDocument}
        onDeleteDocument={handleDeleteDocument}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          document={selectedDocument}
          onSave={handleSave}
          onRename={handleRename}
          onDelete={() => handleDeleteDocument()}
          onExportHtml={handleExportHtml}
          onExportPdf={handleExportPdf}
          onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onShowVersions={handleShowVersions}
          isPreviewMode={isPreviewMode}
          isSaving={isSaving}
          hasUnsavedChanges={hasUnsavedChanges}
        />

        {selectedDocument ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Editor pane */}
            {!isPreviewMode && (
              <div className="flex-1 border-r border-gray-300 flex flex-col min-w-0">
                <div className="bg-gray-200 px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Markdown
                </div>
                <div className="flex-1 overflow-hidden">
                  <MarkdownEditor content={content} onChange={handleContentChange} />
                </div>
              </div>
            )}

            {/* Preview pane */}
            <div
              className={`${
                isPreviewMode ? "flex-1" : "flex-1"
              } flex flex-col min-w-0`}
            >
              <div className="bg-gray-200 px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center justify-between">
                <span>Preview</span>
                <button
                  onClick={() => setIsFullPreview(!isFullPreview)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  {isFullPreview ? "Exit Full Screen" : "Full Screen"}
                </button>
              </div>
              <div
                ref={previewRef}
                className={`flex-1 overflow-hidden ${
                  isFullPreview ? "fixed inset-0 z-50 bg-white pt-10" : ""
                }`}
              >
                {isFullPreview && (
                  <button
                    onClick={() => setIsFullPreview(false)}
                    className="fixed top-2 right-4 z-50 px-3 py-1 bg-gray-800 text-white rounded text-sm"
                  >
                    Exit Full Screen (Esc)
                  </button>
                )}
                <MarkdownPreview content={content} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Welcome to Markdown Editor
              </h2>
              <p className="text-gray-500 mb-6">
                Create a new document or select an existing one to get started.
              </p>
              <button
                onClick={handleCreateDocument}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded transition-colors"
              >
                Create New Document
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Version history modal */}
      {showVersions && (
        <VersionHistoryModal
          versions={versions}
          onClose={() => setShowVersions(false)}
          onRestoreVersion={handleRestoreVersion}
        />
      )}
    </div>
  );
}
