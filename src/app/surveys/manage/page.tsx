'use client';

import { useRouter } from 'next/navigation';
import { useSurvey } from '@/context/SurveyContext';
import SurveyList from '@/components/SurveyList';
import { useEffect } from 'react';

export default function ManageSurveysPage() {
  const router = useRouter();
  const { currentUser, isLoading } = useSurvey();

  useEffect(() => {
    if (!isLoading && currentUser?.role !== 'coordinator') {
      router.push('/login');
    }
  }, [currentUser, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (currentUser?.role !== 'coordinator') {
    return null;
  }

  return (
    <div className="py-8">
      <SurveyList />
    </div>
  );
}
