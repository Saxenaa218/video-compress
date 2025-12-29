'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { IssueList } from '@/components/IssueList';
import { KanbanBoard } from '@/components/KanbanBoard';
import { MilestoneList } from '@/components/MilestoneCard';
import { getProjectById, getIssuesByProject, getMilestonesByProject } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

type ViewMode = 'list' | 'kanban';
type Tab = 'issues' | 'milestones' | 'settings';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeTab, setActiveTab] = useState<Tab>('issues');
  
  const project = getProjectById(id);
  const issues = getIssuesByProject(id);
  const milestones = getMilestonesByProject(id);
  
  if (!project) {
    return (
      <>
        <Header title="Project Not Found" />
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Project not found</p>
            <Link href="/projects" className="text-blue-600 hover:underline">
              Back to Projects
            </Link>
          </div>
        </div>
      </>
    );
  }

  const openIssues = issues.filter(i => i.status === 'open').length;
  const inProgressIssues = issues.filter(i => i.status === 'in-progress').length;
  const closedIssues = issues.filter(i => i.status === 'closed').length;

  return (
    <>
      <Header title={project.name} />
      
      <div className="p-6 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/projects" className="hover:text-gray-700">Projects</Link>
          <span>/</span>
          <span className="text-gray-900">{project.name}</span>
        </nav>

        {/* Project Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <span className="text-4xl">📁</span>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                  <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {project.key}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{project.description}</p>
                
                {/* Repository Integration */}
                {project.repositoryUrl && (
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-lg">
                      {project.repositoryProvider === 'github' ? '🐙' : '🦊'}
                    </span>
                    <a 
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {project.repositoryUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link
                href={`/issues/new?project=${project.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>+</span>
                New Issue
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{issues.length}</p>
              <p className="text-sm text-gray-500">Total Issues</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{openIssues}</p>
              <p className="text-sm text-gray-500">Open</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{inProgressIssues}</p>
              <p className="text-sm text-gray-500">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{closedIssues}</p>
              <p className="text-sm text-gray-500">Closed</p>
            </div>
          </div>

          {/* Team Members */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Team Members</h3>
            <div className="flex items-center gap-2">
              {project.members.map(member => (
                <div key={member.id} className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-gray-700">{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-4">
            {[
              { id: 'issues' as Tab, label: 'Issues', count: issues.length },
              { id: 'milestones' as Tab, label: 'Milestones', count: milestones.length },
              { id: 'settings' as Tab, label: 'Settings' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'issues' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 w-fit">
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

            {viewMode === 'list' ? (
              <IssueList issues={issues} title="Project Issues" />
            ) : (
              <KanbanBoard issues={issues} />
            )}
          </div>
        )}

        {activeTab === 'milestones' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Milestones</h2>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <span>+</span>
                New Milestone
              </button>
            </div>
            <MilestoneList milestones={milestones} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    defaultValue={project.name}
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Key
                  </label>
                  <input
                    type="text"
                    defaultValue={project.key}
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    defaultValue={project.description}
                    rows={3}
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Labels</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.labels.map(label => (
                  <span
                    key={label.id}
                    className="px-3 py-1 text-sm font-medium rounded-full"
                    style={{ backgroundColor: `${label.color}20`, color: label.color }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
              <button className="text-sm text-blue-600 hover:underline">
                + Add new label
              </button>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Fields</h3>
              <div className="space-y-2 mb-4">
                {project.customFields.map(field => (
                  <div key={field.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">{field.name}</span>
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                      {field.type}
                    </span>
                    {field.required && (
                      <span className="text-xs text-red-600">Required</span>
                    )}
                  </div>
                ))}
              </div>
              <button className="text-sm text-blue-600 hover:underline">
                + Add custom field
              </button>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Repository Integration</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Repository Provider
                  </label>
                  <select
                    defaultValue={project.repositoryProvider || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select provider</option>
                    <option value="github">GitHub</option>
                    <option value="gitlab">GitLab</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Repository URL
                  </label>
                  <input
                    type="url"
                    defaultValue={project.repositoryUrl || ''}
                    placeholder="https://github.com/owner/repo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                  Connect Repository
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
