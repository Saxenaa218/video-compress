import { Header } from '@/components/Header';
import { StatsCard } from '@/components/StatsCard';
import { IssueList } from '@/components/IssueList';
import { MilestoneList } from '@/components/MilestoneCard';
import { mockIssues, mockMilestones, mockProjects } from '@/lib/mock-data';
import Link from 'next/link';

export default function Dashboard() {
  const openIssues = mockIssues.filter(i => i.status === 'open').length;
  const inProgressIssues = mockIssues.filter(i => i.status === 'in-progress').length;
  const reviewIssues = mockIssues.filter(i => i.status === 'review').length;
  const closedIssues = mockIssues.filter(i => i.status === 'closed').length;
  
  const recentIssues = [...mockIssues]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const activeMilestones = mockMilestones.filter(m => m.status === 'active');

  return (
    <>
      <Header title="Dashboard" />
      
      <div className="p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Open Issues"
            value={openIssues}
            icon="📋"
            color="blue"
            trend={{ value: 12, isPositive: false }}
          />
          <StatsCard
            title="In Progress"
            value={inProgressIssues}
            icon="🔄"
            color="yellow"
          />
          <StatsCard
            title="In Review"
            value={reviewIssues}
            icon="👀"
            color="purple"
          />
          <StatsCard
            title="Closed This Week"
            value={closedIssues}
            icon="✅"
            color="green"
            trend={{ value: 25, isPositive: true }}
          />
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Link 
            href="/issues/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>+</span>
            New Issue
          </Link>
          <Link 
            href="/issues"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            View All Issues
          </Link>
          <Link 
            href="/projects"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            View Projects
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Issues */}
          <div className="lg:col-span-2">
            <IssueList 
              issues={recentIssues} 
              title="Recent Activity" 
              showFilters={false}
            />
          </div>

          {/* Milestones */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Active Milestones</h2>
            <MilestoneList milestones={activeMilestones} />
          </div>
        </div>

        {/* Projects Overview */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Projects Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockProjects.map(project => {
              const projectIssues = mockIssues.filter(i => i.projectId === project.id);
              const openCount = projectIssues.filter(i => i.status !== 'closed').length;
              
              return (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📁</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{project.name}</h3>
                        <span className="text-sm text-gray-500 font-mono">{project.key}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{projectIssues.length} total issues</span>
                      <span className="text-blue-600">{openCount} open</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
