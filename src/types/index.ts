// Issue Tracking System Types

export type IssueStatus = 'open' | 'in-progress' | 'review' | 'closed';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';
export type IssueType = 'bug' | 'feature' | 'task' | 'improvement';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'developer' | 'viewer';
}

export interface Label {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect';
  options?: string[];
  required: boolean;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  type: IssueType;
  projectId: string;
  assignee?: User;
  reporter: User;
  labels: Label[];
  customFields: Record<string, string | number | string[]>;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  milestoneId?: string;
  linkedIssues?: string[];
  gitBranch?: string;
  gitCommits?: string[];
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  dueDate?: Date;
  progress: number;
  status: 'active' | 'completed' | 'archived';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  key: string;
  owner: User;
  members: User[];
  labels: Label[];
  customFields: CustomField[];
  repositoryUrl?: string;
  repositoryProvider?: 'github' | 'gitlab';
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'issue_assigned' | 'issue_updated' | 'mention' | 'comment' | 'milestone_due';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  issueId?: string;
  projectId?: string;
}

export interface IntegrationConfig {
  id: string;
  provider: 'github' | 'gitlab';
  repositoryUrl: string;
  accessToken?: string;
  webhookSecret?: string;
  enabled: boolean;
}
