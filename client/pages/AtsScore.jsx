import { useState } from 'react';
import { getAtsScore } from '../src/api/atsApi';

function ScoreBar({ label, score, maxScore }) {
  const percentage = Math.round((score / maxScore) * 100);
  const color = percentage >= 70 ? 'bg-green-500' : percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700">{label}</span>
        <span className="font-medium">{score}/{maxScore}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function AtsScore() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAtsScore();
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not calculate ATS score.');
    } finally {
      setLoading(false);
    }
  };

  const overallColor = (score) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">ATS Resume Score</h1>

      {!result && (
        <div className="bg-white p-6 rounded-lg shadow max-w-md">
          <p className="text-sm text-gray-600 mb-4">
            Check how well your resume may perform against automated resume screening systems.
          </p>
          <button
            onClick={handleCheck}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Analyzing your resume...' : 'Check My ATS Score'}
          </button>
          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center mb-4">
              <p className={`text-5xl font-bold ${overallColor(result.finalScore)}`}>{result.finalScore}</p>
              <p className="text-sm text-gray-500">out of 100</p>
            </div>
            <ScoreBar label="Contact Info" score={result.breakdown.contactInfo.score} maxScore={10} />
            <ScoreBar label="Section Structure" score={result.breakdown.sections.score} maxScore={15} />
            <ScoreBar label="Education" score={result.breakdown.education.score} maxScore={15} />
            <ScoreBar label="Formatting" score={result.breakdown.formatting.score} maxScore={10} />
            <ScoreBar label="Experience Quality" score={result.breakdown.experienceQuality.score} maxScore={25} />
            <ScoreBar label="Skills Coverage" score={result.breakdown.skillsMatch.score} maxScore={25} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Suggestions to Improve</h2>
            {result.suggestions.length === 0 ? (
              <p className="text-sm text-green-600">No major issues found — nice work!</p>
            ) : (
              <ul className="space-y-2">
                {result.suggestions.map((suggestion, index) => (
                  <li key={`${suggestion}-${index}`} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-yellow-500">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}

            {result.breakdown.experienceQuality.weakPhrasesFound.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">Weak phrases found:</p>
                <div className="flex flex-wrap gap-1">
                  {result.breakdown.experienceQuality.weakPhrasesFound.map((phrase, index) => (
                    <span key={`${phrase}-${index}`} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                      &quot;{phrase}&quot;
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleCheck}
              disabled={loading}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              {loading ? 'Re-analyzing...' : 'Re-check score'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AtsScore;