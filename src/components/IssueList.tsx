'use client';

import { useState } from 'react';
import type { Issue, IssueStatus, IssuePriority, IssueType } from '@/types';
import { IssueCard } from './IssueCard';

interface IssueListProps {
  issues: Issue[];
  title?: string;
  showFilters?: boolean;
}

export function IssueList({ issues, title = 'Issues', showFilters = true }: IssueListProps) {
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<IssuePriority | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<IssueType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIssues = issues.filter((issue) => {
    if (statusFilter !== 'all' && issue.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && issue.priority !== priorityFilter) return false;
    if (typeFilter !== 'all' && issue.type !== typeFilter) return false;
    if (searchQuery && !issue.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500">
          {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''}
        </span>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="text"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as IssueStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as IssuePriority | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priority</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as IssueType | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="bug">Bug</option>
            <option value="feature">Feature</option>
            <option value="task">Task</option>
            <option value="improvement">Improvement</option>
          </select>
        </div>
      )}

      <div className="space-y-3">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No issues found</p>
          </div>
        )}
      </div>
    </div>
  );
}
