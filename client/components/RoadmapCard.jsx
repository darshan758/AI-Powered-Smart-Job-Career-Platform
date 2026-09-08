import { useState, useEffect } from 'react';
import { generateRoadmap, getMyRoadmaps, toggleRoadmapItem } from '../src/api/roadmapApi';

function RoadmapCard({ selectedRoleId }) {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadExistingRoadmap = async () => {
    const res = await getMyRoadmaps();
    // Find a roadmap matching the currently selected role, if one already exists
    const existing = res.data.find((r) => r._id); // we'll refine matching below
    if (existing) setRoadmap(existing);
  };

  useEffect(() => {
    const loadRoadmap = async () => {
      await loadExistingRoadmap();
    };

    loadRoadmap();
  }, []);

  const handleGenerate = async () => {
    if (!selectedRoleId) return;
    setLoading(true);
    setError('');
    try {
      const res = await generateRoadmap(selectedRoleId);
      setRoadmap(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not generate roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (itemId) => {
    const res = await toggleRoadmapItem(roadmap._id, itemId);
    // Update just that one item locally, so the UI feels instant
    setRoadmap((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item._id === itemId ? { ...item, completed: res.data.item.completed } : item
      ),
    }));
  };

  const priorityColor = { high: 'bg-red-100 text-red-700', medium: 'bg-yellow-100 text-yellow-700', low: 'bg-gray-100 text-gray-700' };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-3">Learning Roadmap</h2>

      {!roadmap && (
        <>
          <button
            onClick={handleGenerate}
            disabled={!selectedRoleId || loading}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Generating with AI...' : 'Generate Roadmap'}
          </button>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </>
      )}

      {roadmap && roadmap.items?.length > 0 && (
        <ul className="space-y-2">
          {roadmap.items.map((item) => (
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
    </div>
  );
}

export default RoadmapCard;