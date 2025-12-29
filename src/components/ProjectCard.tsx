import Link from 'next/link';
import type { Project } from '@/types';
import { formatDate } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  issueCount: number;
  openIssueCount: number;
}

export function ProjectCard({ project, issueCount, openIssueCount }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📁</span>
              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
            </div>
            <span className="text-sm text-gray-500 font-mono">{project.key}</span>
          </div>
          {project.repositoryProvider && (
            <span className="text-2xl">
              {project.repositoryProvider === 'github' ? '🐙' : '🦊'}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex -space-x-2">
            {project.members.slice(0, 4).map((member) => (
              <img
                key={member.id}
                src={member.avatar}
                alt={member.name}
                title={member.name}
                className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"
              />
            ))}
            {project.members.length > 4 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                +{project.members.length - 4}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              <span className="font-medium text-gray-900">{issueCount}</span> issues
            </span>
            <span className="text-gray-600">
              <span className="font-medium text-blue-600">{openIssueCount}</span> open
            </span>
          </div>
          <span className="text-gray-400">
            Updated {formatDate(project.updatedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
