'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { IssueForm } from '@/components/IssueForm';
import { mockProjects, mockUsers, mockLabels } from '@/lib/mock-data';
import type { Issue } from '@/types';

export default function NewIssuePage() {
  const router = useRouter();

  const handleSubmit = (data: Partial<Issue>) => {
    // In a real app, this would make an API call to create the issue
    console.log('Creating issue:', data);
    // Simulate success and redirect
    alert('Issue created successfully! (This is a demo - data is not persisted)');
    router.push('/issues');
  };

  const handleCancel = () => {
    router.push('/issues');
  };

  return (
    <>
      <Header title="Create New Issue" />
      
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <IssueForm
              projects={mockProjects}
              users={mockUsers}
              labels={mockLabels}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </>
  );
}
