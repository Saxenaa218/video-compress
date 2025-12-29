'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { IssueList } from '@/components/IssueList';
import { KanbanBoard } from '@/components/KanbanBoard';
import { mockIssues } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

type ViewMode = 'list' | 'kanban';

export default function IssuesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  return (
    <>
      <Header title="Issues" />
      
      <div className="p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              📋 List
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                viewMode === 'kanban'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              📊 Kanban
            </button>
          </div>

          <Link
            href="/issues/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>+</span>
            New Issue
          </Link>
        </div>

        {/* Issues View */}
        {viewMode === 'list' ? (
          <IssueList issues={mockIssues} title="All Issues" />
        ) : (
          <KanbanBoard issues={mockIssues} />
        )}
      </div>
    </>
  );
}
