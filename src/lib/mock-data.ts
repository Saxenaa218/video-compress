// Mock Data Store for Issue Tracking System

import type { Issue, Project, User, Label, Milestone, Notification, CustomField } from '@/types';

// Sample Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane'
  },
  {
    id: 'user-3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob'
  },
  {
    id: 'user-4',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'viewer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice'
  }
];

// Sample Labels
export const mockLabels: Label[] = [
  { id: 'label-1', name: 'bug', color: '#dc2626', description: 'Something isn\'t working' },
  { id: 'label-2', name: 'enhancement', color: '#2563eb', description: 'New feature or request' },
  { id: 'label-3', name: 'documentation', color: '#059669', description: 'Improvements or additions to documentation' },
  { id: 'label-4', name: 'good first issue', color: '#7c3aed', description: 'Good for newcomers' },
  { id: 'label-5', name: 'help wanted', color: '#ea580c', description: 'Extra attention is needed' },
  { id: 'label-6', name: 'urgent', color: '#be123c', description: 'Requires immediate attention' },
  { id: 'label-7', name: 'frontend', color: '#0891b2', description: 'Frontend related' },
  { id: 'label-8', name: 'backend', color: '#4f46e5', description: 'Backend related' }
];

// Sample Custom Fields
export const mockCustomFields: CustomField[] = [
  { id: 'field-1', name: 'Sprint', type: 'select', options: ['Sprint 1', 'Sprint 2', 'Sprint 3'], required: false },
  { id: 'field-2', name: 'Story Points', type: 'number', required: false },
  { id: 'field-3', name: 'Environment', type: 'multiselect', options: ['Development', 'Staging', 'Production'], required: false }
];

// Sample Projects
export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Issue Tracker',
    description: 'A comprehensive issue tracking system for managing software development tasks',
    key: 'IT',
    owner: mockUsers[0],
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    labels: mockLabels,
    customFields: mockCustomFields,
    repositoryUrl: 'https://github.com/example/issue-tracker',
    repositoryProvider: 'github',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-20')
  },
  {
    id: 'proj-2',
    name: 'Mobile App',
    description: 'Cross-platform mobile application for iOS and Android',
    key: 'MA',
    owner: mockUsers[1],
    members: [mockUsers[1], mockUsers[2], mockUsers[3]],
    labels: mockLabels.slice(0, 5),
    customFields: mockCustomFields.slice(0, 2),
    repositoryUrl: 'https://gitlab.com/example/mobile-app',
    repositoryProvider: 'gitlab',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-12-18')
  }
];

// Sample Milestones
export const mockMilestones: Milestone[] = [
  {
    id: 'milestone-1',
    title: 'v1.0.0 Release',
    description: 'First stable release of the issue tracker',
    projectId: 'proj-1',
    dueDate: new Date('2025-02-01'),
    progress: 65,
    status: 'active'
  },
  {
    id: 'milestone-2',
    title: 'v1.1.0 - Integration Features',
    description: 'Add GitHub and GitLab integration',
    projectId: 'proj-1',
    dueDate: new Date('2025-04-01'),
    progress: 20,
    status: 'active'
  },
  {
    id: 'milestone-3',
    title: 'Beta Release',
    description: 'Mobile app beta release for testing',
    projectId: 'proj-2',
    dueDate: new Date('2025-03-01'),
    progress: 45,
    status: 'active'
  }
];

// Sample Issues
export const mockIssues: Issue[] = [
  {
    id: 'issue-1',
    title: 'Implement user authentication',
    description: 'Add login/logout functionality with OAuth support for GitHub and Google',
    status: 'in-progress',
    priority: 'high',
    type: 'feature',
    projectId: 'proj-1',
    assignee: mockUsers[1],
    reporter: mockUsers[0],
    labels: [mockLabels[1], mockLabels[6]],
    customFields: { 'field-1': 'Sprint 1', 'field-2': 8 },
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-20'),
    dueDate: new Date('2025-01-15'),
    milestoneId: 'milestone-1',
    gitBranch: 'feature/auth'
  },
  {
    id: 'issue-2',
    title: 'Fix pagination bug on issue list',
    description: 'When navigating to page 2, the page shows duplicate issues from page 1',
    status: 'open',
    priority: 'medium',
    type: 'bug',
    projectId: 'proj-1',
    assignee: mockUsers[2],
    reporter: mockUsers[1],
    labels: [mockLabels[0], mockLabels[6]],
    customFields: { 'field-1': 'Sprint 2', 'field-2': 3 },
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
    milestoneId: 'milestone-1'
  },
  {
    id: 'issue-3',
    title: 'Add dark mode support',
    description: 'Implement dark mode theme toggle with system preference detection',
    status: 'open',
    priority: 'low',
    type: 'improvement',
    projectId: 'proj-1',
    reporter: mockUsers[3],
    labels: [mockLabels[1], mockLabels[6]],
    customFields: { 'field-2': 5 },
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10')
  },
  {
    id: 'issue-4',
    title: 'Create API documentation',
    description: 'Write comprehensive API documentation using OpenAPI/Swagger',
    status: 'review',
    priority: 'medium',
    type: 'task',
    projectId: 'proj-1',
    assignee: mockUsers[0],
    reporter: mockUsers[0],
    labels: [mockLabels[2]],
    customFields: { 'field-1': 'Sprint 1', 'field-2': 5 },
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-19'),
    milestoneId: 'milestone-1'
  },
  {
    id: 'issue-5',
    title: 'GitHub webhook integration',
    description: 'Set up webhooks to automatically update issues from GitHub commits and PRs',
    status: 'open',
    priority: 'high',
    type: 'feature',
    projectId: 'proj-1',
    reporter: mockUsers[0],
    labels: [mockLabels[1], mockLabels[7]],
    customFields: { 'field-1': 'Sprint 3', 'field-2': 13 },
    createdAt: new Date('2024-12-18'),
    updatedAt: new Date('2024-12-18'),
    milestoneId: 'milestone-2'
  },
  {
    id: 'issue-6',
    title: 'Performance optimization for large issue lists',
    description: 'Implement virtual scrolling and lazy loading for projects with 1000+ issues',
    status: 'closed',
    priority: 'high',
    type: 'improvement',
    projectId: 'proj-1',
    assignee: mockUsers[1],
    reporter: mockUsers[2],
    labels: [mockLabels[7]],
    customFields: { 'field-1': 'Sprint 1', 'field-2': 8 },
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-12-12'),
    milestoneId: 'milestone-1'
  },
  {
    id: 'issue-7',
    title: 'Mobile app login screen not responsive',
    description: 'Login screen elements overlap on smaller devices (< 375px width)',
    status: 'open',
    priority: 'critical',
    type: 'bug',
    projectId: 'proj-2',
    assignee: mockUsers[2],
    reporter: mockUsers[1],
    labels: [mockLabels[0], mockLabels[5]],
    customFields: {},
    createdAt: new Date('2024-12-19'),
    updatedAt: new Date('2024-12-19'),
    milestoneId: 'milestone-3'
  },
  {
    id: 'issue-8',
    title: 'Add push notifications',
    description: 'Implement push notifications for issue updates and mentions',
    status: 'in-progress',
    priority: 'medium',
    type: 'feature',
    projectId: 'proj-2',
    assignee: mockUsers[1],
    reporter: mockUsers[1],
    labels: [mockLabels[1]],
    customFields: {},
    createdAt: new Date('2024-12-12'),
    updatedAt: new Date('2024-12-18'),
    milestoneId: 'milestone-3'
  }
];

// Sample Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'issue_assigned',
    title: 'Issue Assigned',
    message: 'You have been assigned to "Create API documentation"',
    read: false,
    createdAt: new Date('2024-12-19T10:30:00'),
    issueId: 'issue-4',
    projectId: 'proj-1'
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'comment',
    title: 'New Comment',
    message: 'Jane Smith commented on "Implement user authentication"',
    read: true,
    createdAt: new Date('2024-12-18T15:45:00'),
    issueId: 'issue-1',
    projectId: 'proj-1'
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    type: 'milestone_due',
    title: 'Milestone Due Soon',
    message: 'v1.0.0 Release is due in 45 days',
    read: false,
    createdAt: new Date('2024-12-17T09:00:00'),
    projectId: 'proj-1'
  }
];

// Helper functions to filter data
export function getIssuesByProject(projectId: string): Issue[] {
  return mockIssues.filter(issue => issue.projectId === projectId);
}

export function getIssuesByStatus(status: Issue['status']): Issue[] {
  return mockIssues.filter(issue => issue.status === status);
}

export function getMilestonesByProject(projectId: string): Milestone[] {
  return mockMilestones.filter(m => m.projectId === projectId);
}

export function getIssueById(id: string): Issue | undefined {
  return mockIssues.find(issue => issue.id === id);
}

export function getProjectById(id: string): Project | undefined {
  return mockProjects.find(project => project.id === id);
}

export function getUserById(id: string): User | undefined {
  return mockUsers.find(user => user.id === id);
}
