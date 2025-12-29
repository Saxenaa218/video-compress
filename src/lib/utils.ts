// Utility functions for the Issue Tracker

import type { IssueStatus, IssuePriority, IssueType } from '@/types';

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function getStatusColor(status: IssueStatus): string {
  const colors: Record<IssueStatus, string> = {
    'open': 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'review': 'bg-purple-100 text-purple-800',
    'closed': 'bg-green-100 text-green-800'
  };
  return colors[status];
}

export function getStatusBorderColor(status: IssueStatus): string {
  const colors: Record<IssueStatus, string> = {
    'open': 'border-blue-500',
    'in-progress': 'border-yellow-500',
    'review': 'border-purple-500',
    'closed': 'border-green-500'
  };
  return colors[status];
}

export function getPriorityColor(priority: IssuePriority): string {
  const colors: Record<IssuePriority, string> = {
    'low': 'bg-gray-100 text-gray-800',
    'medium': 'bg-blue-100 text-blue-800',
    'high': 'bg-orange-100 text-orange-800',
    'critical': 'bg-red-100 text-red-800'
  };
  return colors[priority];
}

export function getPriorityIcon(priority: IssuePriority): string {
  const icons: Record<IssuePriority, string> = {
    'low': '↓',
    'medium': '→',
    'high': '↑',
    'critical': '⚠'
  };
  return icons[priority];
}

export function getTypeIcon(type: IssueType): string {
  const icons: Record<IssueType, string> = {
    'bug': '🐛',
    'feature': '✨',
    'task': '📋',
    'improvement': '💡'
  };
  return icons[type];
}

export function getTypeColor(type: IssueType): string {
  const colors: Record<IssueType, string> = {
    'bug': 'text-red-600',
    'feature': 'text-purple-600',
    'task': 'text-blue-600',
    'improvement': 'text-green-600'
  };
  return colors[type];
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
