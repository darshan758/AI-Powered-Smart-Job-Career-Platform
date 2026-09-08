import { useState, useEffect } from 'react';
import { getAllJobPostings } from '../src/api/jobPostingApi';
import { getMatchScore } from '../src/api/matchApi';

function Jobs() {
  const [postings, setPostings] = useState([]);
  const [scores, setScores] = useState({}); // { jobId: matchData }
  const [loadingScores, setLoadingScores] = useState({}); // { jobId: bool }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllJobPostings()
      .then((res) => setPostings(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleCheckMatch = async (jobId) => {
    setLoadingScores((prev) => ({ ...prev, [jobId]: true }));
    try {
      const res = await getMatchScore(jobId);
      setScores((prev) => ({ ...prev, [jobId]: res.data }));
    } catch (err) {
      setScores((prev) => ({
        ...prev,
        [jobId]: { error: err.response?.data?.message || 'Could not calculate match' },
      }));
    } finally {
      setLoadingScores((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const scoreColor = (score) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading jobs...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Job Listings</h1>

      {postings.length === 0 && (
        <p className="text-gray-500">No job postings available yet.</p>
      )}

      <div className="space-y-4">
        {postings.map((job) => {
          const matchData = scores[job._id];

          return (
            <div key={job._id} className="bg-white p-5 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                  <p className="text-sm text-gray-600">
                    {job.company} {job.location && `· ${job.location}`}
                  </p>
                  {job.experienceLevel && (
                    <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                      {job.experienceLevel}
                    </span>
                  )}
                </div>

                {!matchData && (
                  <button
                    onClick={() => handleCheckMatch(job._id)}
                    disabled={loadingScores[job._id]}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
                  >
                    {loadingScores[job._id] ? 'Calculating...' : 'Check My Match'}
                  </button>
                )}
              </div>

              {matchData && !matchData.error && (
                <div className="mt-4 border-t pt-3">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-2xl font-bold ${scoreColor(matchData.finalScore)}`}>
                      {matchData.finalScore}%
                    </span>
                    <span className="text-sm text-gray-500">match</span>
                  </div>

                  <div className="text-xs text-gray-500 mb-2">
                    Skill overlap: {matchData.breakdown.skillOverlapScore}% · Semantic fit:{' '}
                    {matchData.breakdown.semanticSimilarityScore}%
                  </div>

                  {matchData.missingSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {matchData.missingSkills.map((s) => (
                        <span
                          key={s}
                          className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded"
                        >
                          Missing: {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {matchData?.error && (
                <p className="text-red-600 text-sm mt-3">{matchData.error}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Jobs;