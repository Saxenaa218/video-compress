import type { Milestone } from '@/types';
import { formatDate, cn } from '@/lib/utils';

interface MilestoneCardProps {
  milestone: Milestone;
}

export function MilestoneCard({ milestone }: MilestoneCardProps) {
  const statusColors = {
    active: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-gray-900">{milestone.title}</h4>
          {milestone.description && (
            <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
          )}
        </div>
        <span className={cn('px-2 py-1 text-xs font-medium rounded-full', statusColors[milestone.status])}>
          {milestone.status}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium text-gray-900">{milestone.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={cn(
              'h-2 rounded-full transition-all',
              milestone.progress >= 100 ? 'bg-green-500' : 'bg-blue-500'
            )}
            style={{ width: `${Math.min(milestone.progress, 100)}%` }}
          />
        </div>
        {milestone.dueDate && (
          <p className="text-xs text-gray-500">
            Due: {formatDate(milestone.dueDate)}
          </p>
        )}
      </div>
    </div>
  );
}

interface MilestoneListProps {
  milestones: Milestone[];
}

export function MilestoneList({ milestones }: MilestoneListProps) {
  if (milestones.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No milestones yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {milestones.map((milestone) => (
        <MilestoneCard key={milestone.id} milestone={milestone} />
      ))}
    </div>
  );
}
