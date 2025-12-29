import { Header } from '@/components/Header';
import { ProjectCard } from '@/components/ProjectCard';
import { mockProjects, mockIssues } from '@/lib/mock-data';

export default function ProjectsPage() {
  return (
    <>
      <Header title="Projects" />
      
      <div className="p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {mockProjects.length} project{mockProjects.length !== 1 ? 's' : ''}
          </p>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <span>+</span>
            New Project
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockProjects.map(project => {
            const projectIssues = mockIssues.filter(i => i.projectId === project.id);
            const openIssues = projectIssues.filter(i => i.status !== 'closed').length;
            
            return (
              <ProjectCard
                key={project.id}
                project={project}
                issueCount={projectIssues.length}
                openIssueCount={openIssues}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
