import { useState, useEffect } from 'react';
import { generateRoadmap, getMyRoadmaps, toggleRoadmapItem } from '../src/api/roadmapApi';

function RoadmapCard({ roleId, roleTitle }) {
  const [allRoadmaps, setAllRoadmaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyRoadmaps()
      .then((res) => setAllRoadmaps(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load roadmaps.'))
      .finally(() => setLoadingList(false));
  }, []);

  const currentRoadmap = allRoadmaps.find((roadmap) => roadmap.targetRole === roleTitle);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await generateRoadmap(roleId);
      setAllRoadmaps((prev) => [
        ...prev.filter((roadmap) => roadmap.targetRole !== roleTitle),
        res.data,
      ]);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not generate roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (itemId) => {
    const res = await toggleRoadmapItem(currentRoadmap._id, itemId);
    setAllRoadmaps((prev) => prev.map((roadmap) => (
      roadmap._id === currentRoadmap._id
        ? {
            ...roadmap,
            items: roadmap.items.map((item) =>
              item._id === itemId ? { ...item, completed: res.data.item.completed } : item
            ),
          }
        : roadmap
    )));
  };

  const priorityColor = { high: 'bg-red-100 text-red-700', medium: 'bg-yellow-100 text-yellow-700', low: 'bg-gray-100 text-gray-700' };

  if (loadingList) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-sm text-gray-500">Loading roadmap...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-3">Learning Roadmap - {roleTitle}</h2>

      {!currentRoadmap && (
        <>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Generating with AI...' : 'Generate Roadmap'}
          </button>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </>
      )}

      {currentRoadmap && currentRoadmap.items?.length > 0 && (
        <ul className="space-y-2">
          {currentRoadmap.items.map((item) => (
            <li key={item._id} className="flex items-start gap-3 border-b pb-2">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleToggle(item._id)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={item.completed ? 'line-through text-gray-400' : 'font-medium'}>
                    {item.skill}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${priorityColor[item.priority]}`}>
                    {item.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{item.estimatedTime}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {currentRoadmap && currentRoadmap.items?.length === 0 && (
        <p className="text-sm text-gray-500">No skill gaps for this role - you are fully matched!</p>
      )}
    </div>
  );
}

export default RoadmapCard;