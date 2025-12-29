'use client';

import { Survey } from '@/types/survey';

interface SurveyResultsViewProps {
  survey: Survey;
}

export default function SurveyResultsView({ survey }: SurveyResultsViewProps) {
  // Calculate results
  const getResults = () => {
    const results: Record<string, Record<string, number>> = {};
    
    // Initialize results structure
    survey.questions.forEach(q => {
      results[q.id] = {};
      q.options.forEach(o => {
        results[q.id][o.id] = 0;
      });
    });

    // Count responses
    survey.responses.forEach(response => {
      Object.entries(response.answers).forEach(([questionId, optionId]) => {
        if (results[questionId] && results[questionId][optionId] !== undefined) {
          results[questionId][optionId]++;
        }
      });
    });

    return results;
  };

  const results = getResults();
  const totalResponses = survey.responses.length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{survey.title}</h1>
      <p className="text-gray-500 mb-8">
        Total Responses: {totalResponses} • Status: {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
      </p>

      {totalResponses === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-8 rounded-lg text-center">
          <p className="text-lg">No responses yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {survey.questions.map((question, qIndex) => (
            <div key={question.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">
                {qIndex + 1}. {question.text}
              </h3>
              
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2 text-left">Option</th>
                    <th className="border border-gray-300 px-4 py-2 text-center w-32">Responses</th>
                    <th className="border border-gray-300 px-4 py-2 text-center w-32">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {question.options.map((option) => {
                    const count = results[question.id][option.id];
                    const percentage = totalResponses > 0 ? ((count / totalResponses) * 100).toFixed(1) : '0.0';
                    
                    return (
                      <tr key={option.id} className="hover:bg-gray-100">
                        <td className="border border-gray-300 px-4 py-2">{option.text}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{count}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
