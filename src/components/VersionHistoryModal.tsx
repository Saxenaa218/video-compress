"use client";

import { DocumentVersion } from "@/lib/types";
import { X, Clock, RotateCcw } from "lucide-react";

interface VersionHistoryModalProps {
  versions: DocumentVersion[];
  onClose: () => void;
  onRestoreVersion: (version: DocumentVersion) => void;
}

export default function VersionHistoryModal({
  versions,
  onClose,
  onRestoreVersion,
}: VersionHistoryModalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock size={20} />
            Version History
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {versions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No version history available.
            </p>
          ) : (
            <ul className="space-y-3">
              {versions.map((version, index) => (
                <li
                  key={version.id}
                  className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        Version {version.version}
                      </span>
                      {index === 0 && (
                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(version.createdAt)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                      {version.content.substring(0, 150)}
                      {version.content.length > 150 && "..."}
                    </p>
                  </div>
                  {index !== 0 && (
                    <button
                      onClick={() => onRestoreVersion(version)}
                      className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600 px-3 py-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/20"
                    >
                      <RotateCcw size={14} />
                      Restore
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
