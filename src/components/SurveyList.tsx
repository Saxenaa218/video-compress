'use client';

import { useSurvey } from '@/context/SurveyContext';
import { Survey } from '@/types/survey';

export default function SurveyList() {
  const { surveys, currentUser, updateSurveyStatus, getOpenSurveys, getClosedSurveys, getDraftSurveys } = useSurvey();

  const draftSurveys = getDraftSurveys();
  const openSurveys = getOpenSurveys();
  const closedSurveys = getClosedSurveys();

  const handleOpen = (surveyId: string) => {
    updateSurveyStatus(surveyId, 'open');
  };

  const handleClose = (surveyId: string) => {
    updateSurveyStatus(surveyId, 'closed');
  };

  const SurveyCard = ({ survey, showActions = false }: { survey: Survey; showActions?: boolean }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{survey.title}</h3>
          <p className="text-gray-500 text-sm">
            {survey.questions.length} question{survey.questions.length !== 1 ? 's' : ''} • 
            {survey.responses.length} response{survey.responses.length !== 1 ? 's' : ''}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Created: {new Date(survey.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          survey.status === 'open' ? 'bg-green-100 text-green-800' :
          survey.status === 'closed' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
        </span>
      </div>
      
      {showActions && currentUser?.role === 'coordinator' && (
        <div className="mt-4 flex gap-2">
          {survey.status === 'draft' && (
            <button
              onClick={() => handleOpen(survey.id)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors text-sm"
            >
              Open Survey
            </button>
          )}
          {survey.status === 'open' && (
            <button
              onClick={() => handleClose(survey.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors text-sm"
            >
              Close Survey
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Manage Surveys</h1>

      {surveys.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No surveys created yet.</p>
          {currentUser?.role === 'coordinator' && (
            <a href="/surveys/create" className="text-blue-600 hover:underline mt-2 inline-block">
              Create your first survey
            </a>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {draftSurveys.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 text-yellow-700">Draft Surveys</h2>
              <div className="space-y-3">
                {draftSurveys.map(survey => (
                  <SurveyCard key={survey.id} survey={survey} showActions={true} />
                ))}
              </div>
            </section>
          )}

          {openSurveys.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 text-green-700">Open Surveys</h2>
              <div className="space-y-3">
                {openSurveys.map(survey => (
                  <SurveyCard key={survey.id} survey={survey} showActions={true} />
                ))}
              </div>
            </section>
          )}

          {closedSurveys.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 text-red-700">Closed Surveys</h2>
              <div className="space-y-3">
                {closedSurveys.map(survey => (
                  <SurveyCard key={survey.id} survey={survey} showActions={false} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
