import Link from 'next/link';
import type { Issue } from '@/types';
import {
  getStatusColor,
  getPriorityColor,
  getPriorityIcon,
  getTypeIcon,
  formatRelativeTime,
  cn
} from '@/lib/utils';

interface IssueCardProps {
  issue: Issue;
  showProject?: boolean;
}

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <Link href={`/issues/${issue.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">
                {getTypeIcon(issue.type)}
              </span>
              <h3 className="font-medium text-gray-900 truncate">
                {issue.title}
              </h3>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {issue.description}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getStatusColor(issue.status))}>
                {issue.status.replace('-', ' ')}
              </span>
              <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getPriorityColor(issue.priority))}>
                {getPriorityIcon(issue.priority)} {issue.priority}
              </span>
              {issue.labels.slice(0, 2).map((label) => (
                <span
                  key={label.id}
                  className="px-2 py-1 text-xs font-medium rounded-full"
                  style={{ backgroundColor: `${label.color}20`, color: label.color }}
                >
                  {label.name}
                </span>
              ))}
              {issue.labels.length > 2 && (
                <span className="text-xs text-gray-500">+{issue.labels.length - 2}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            {issue.assignee && (
              <img
                src={issue.assignee.avatar}
                alt={issue.assignee.name}
                title={issue.assignee.name}
                className="w-8 h-8 rounded-full bg-gray-200"
              />
            )}
            <span className="text-xs text-gray-500">
              {formatRelativeTime(issue.updatedAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
