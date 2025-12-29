'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSurvey } from '@/context/SurveyContext';
import SurveyResultsView from '@/components/SurveyResultsView';

export default function SurveyResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { getSurveyById, isLoading } = useSurvey();
  
  const surveyId = params.id as string;
  const survey = getSurveyById(surveyId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Survey Not Found</h2>
          <p className="mb-6">The survey you are looking for does not exist.</p>
          <button
            onClick={() => router.push('/surveys/results')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  if (survey.status !== 'closed') {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Results Not Available</h2>
          <p className="mb-6">Results are only available for closed surveys. This survey is currently {survey.status}.</p>
          <button
            onClick={() => router.push('/surveys/results')}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            View Closed Surveys
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <SurveyResultsView survey={survey} />
    </div>
  );
}
