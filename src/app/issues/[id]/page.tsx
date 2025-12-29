'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { getIssueById, getProjectById, mockMilestones } from '@/lib/mock-data';
import { getStatusColor, getPriorityColor, getPriorityIcon, getTypeIcon, getTypeColor, formatDate, formatRelativeTime, cn } from '@/lib/utils';

export default function IssueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const issue = getIssueById(id);
  
  if (!issue) {
    return (
      <>
        <Header title="Issue Not Found" />
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Issue not found</p>
            <Link href="/issues" className="text-blue-600 hover:underline">
              Back to Issues
            </Link>
          </div>
        </div>
      </>
    );
  }

  const project = getProjectById(issue.projectId);
  const milestone = issue.milestoneId 
    ? mockMilestones.find(m => m.id === issue.milestoneId)
    : null;

  return (
    <>
      <Header title={`${project?.key || 'PROJ'}-${issue.id.split('-')[1]}`} />
      
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/issues" className="hover:text-gray-700">Issues</Link>
            <span>/</span>
            <span className="text-gray-900">{issue.title}</span>
          </nav>

          {/* Issue Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <span className={cn('text-2xl', getTypeColor(issue.type))}>
                {getTypeIcon(issue.type)}
              </span>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {issue.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={cn('px-3 py-1 text-sm font-medium rounded-full', getStatusColor(issue.status))}>
                    {issue.status.replace('-', ' ')}
                  </span>
                  <span className={cn('px-3 py-1 text-sm font-medium rounded-full', getPriorityColor(issue.priority))}>
                    {getPriorityIcon(issue.priority)} {issue.priority}
                  </span>
                  <span className="text-sm text-gray-500">
                    Opened {formatRelativeTime(issue.createdAt)} by {issue.reporter.name}
                  </span>
                </div>
              </div>
              <button
                onClick={() => router.push(`/issues/${issue.id}/edit`)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                <div className="prose prose-sm max-w-none text-gray-700">
                  {issue.description || <p className="text-gray-400 italic">No description provided</p>}
                </div>
              </div>

              {/* Activity */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={issue.reporter.avatar}
                      alt={issue.reporter.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <p className="text-sm">
                        <span className="font-medium text-gray-900">{issue.reporter.name}</span>
                        <span className="text-gray-500"> created this issue</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(issue.createdAt)}
                      </p>
                    </div>
                  </div>

                  {issue.assignee && (
                    <div className="flex items-start gap-3">
                      <img
                        src={issue.assignee.avatar}
                        alt={issue.assignee.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 bg-gray-50 rounded-lg p-3">
                        <p className="text-sm">
                          <span className="font-medium text-gray-900">{issue.assignee.name}</span>
                          <span className="text-gray-500"> was assigned</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Comment input */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <textarea
                      placeholder="Add a comment..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Details */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-gray-500">Assignee</dt>
                    <dd className="mt-1">
                      {issue.assignee ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={issue.assignee.avatar}
                            alt={issue.assignee.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {issue.assignee.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Unassigned</span>
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-gray-500">Project</dt>
                    <dd className="mt-1">
                      <Link 
                        href={`/projects/${project?.id}`}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        {project?.name}
                      </Link>
                    </dd>
                  </div>

                  {milestone && (
                    <div>
                      <dt className="text-sm text-gray-500">Milestone</dt>
                      <dd className="mt-1">
                        <span className="text-sm font-medium text-gray-900">
                          {milestone.title}
                        </span>
                      </dd>
                    </div>
                  )}

                  {issue.dueDate && (
                    <div>
                      <dt className="text-sm text-gray-500">Due Date</dt>
                      <dd className="mt-1 text-sm font-medium text-gray-900">
                        {formatDate(issue.dueDate)}
                      </dd>
                    </div>
                  )}

                  <div>
                    <dt className="text-sm text-gray-500">Type</dt>
                    <dd className="mt-1 flex items-center gap-1 text-sm">
                      <span>{getTypeIcon(issue.type)}</span>
                      <span className="capitalize">{issue.type}</span>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Labels */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Labels</h2>
                {issue.labels.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {issue.labels.map(label => (
                      <span
                        key={label.id}
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{ backgroundColor: `${label.color}20`, color: label.color }}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No labels</p>
                )}
              </div>

              {/* Git Integration */}
              {(issue.gitBranch || issue.gitCommits) && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Git Integration</h2>
                  {issue.gitBranch && (
                    <div className="mb-3">
                      <dt className="text-sm text-gray-500 mb-1">Branch</dt>
                      <dd className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {issue.gitBranch}
                      </dd>
                    </div>
                  )}
                  {issue.gitCommits && issue.gitCommits.length > 0 && (
                    <div>
                      <dt className="text-sm text-gray-500 mb-1">Commits</dt>
                      <dd className="space-y-1">
                        {issue.gitCommits.map((commit, i) => (
                          <div key={i} className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {commit}
                          </div>
                        ))}
                      </dd>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
