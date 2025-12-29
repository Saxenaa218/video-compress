'use client';

import type { Issue, IssueStatus } from '@/types';
import { getStatusColor, getStatusBorderColor, getPriorityIcon, getTypeIcon, cn } from '@/lib/utils';
import Link from 'next/link';

interface KanbanBoardProps {
  issues: Issue[];
}

const columns: { status: IssueStatus; title: string }[] = [
  { status: 'open', title: 'Open' },
  { status: 'in-progress', title: 'In Progress' },
  { status: 'review', title: 'Review' },
  { status: 'closed', title: 'Closed' }
];

export function KanbanBoard({ issues }: KanbanBoardProps) {
  const getIssuesByStatus = (status: IssueStatus) => {
    return issues.filter(issue => issue.status === status);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map(column => {
        const columnIssues = getIssuesByStatus(column.status);
        return (
          <div
            key={column.status}
            className={cn(
              'flex-shrink-0 w-72 bg-gray-50 rounded-lg border-t-4',
              getStatusBorderColor(column.status)
            )}
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{column.title}</h3>
                <span className={cn(
                  'px-2 py-0.5 text-xs font-medium rounded-full',
                  getStatusColor(column.status)
                )}>
                  {columnIssues.length}
                </span>
              </div>
            </div>

            <div className="p-3 space-y-3 min-h-96 max-h-[600px] overflow-y-auto">
              {columnIssues.map(issue => (
                <Link key={issue.id} href={`/issues/${issue.id}`}>
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-sm">{getTypeIcon(issue.type)}</span>
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {issue.title}
                      </h4>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {issue.labels.slice(0, 2).map(label => (
                        <span
                          key={label.id}
                          className="px-1.5 py-0.5 text-xs rounded"
                          style={{ backgroundColor: `${label.color}20`, color: label.color }}
                        >
                          {label.name}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {getPriorityIcon(issue.priority)} {issue.priority}
                      </span>
                      {issue.assignee && (
                        <img
                          src={issue.assignee.avatar}
                          alt={issue.assignee.name}
                          title={issue.assignee.name}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                    </div>
                  </div>
                </Link>
              ))}

              {columnIssues.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400">No issues</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
