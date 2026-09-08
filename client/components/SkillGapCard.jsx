import { useState, useEffect } from 'react';
import { getAllJobRoles, getSkillGap } from '../src/api/jobRoleApi';

function SkillGapCard({ onRoleSelected }) {
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [skillGap, setSkillGap] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllJobRoles().then((res) => setRoles(res.data));
  }, []);

  const handleRoleChange = async (e) => {
    const roleId = e.target.value;
    setSelectedRoleId(roleId);
    setSkillGap(null);
    if (!roleId) return;

    setLoading(true);
    try {
      const res = await getSkillGap(roleId);
      setSkillGap(res.data);
      const selectedRole = roles.find((role) => role._id === roleId);
      onRoleSelected(selectedRole);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-3">Skill Gap Analysis</h2>

      <select
        value={selectedRoleId}
        onChange={handleRoleChange}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm"
      >
        <option value="">Select a target role...</option>
        {roles.map((role) => (
          <option key={role._id} value={role._id}>
            {role.title}
          </option>
        ))}
      </select>

      {loading && <p className="text-sm text-gray-500">Calculating...</p>}

      {skillGap && (
        <div>
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Match Score</span>
              <span className="font-semibold">{skillGap.matchPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${skillGap.matchPercentage}%` }}
              />
            </div>
          </div>

          <div className="mb-3">
            <p className="text-sm font-medium text-green-700 mb-1">
              ✓ Matched Skills ({skillGap.matchedRequired.length})
            </p>
            <div className="flex flex-wrap gap-1">
              {skillGap.matchedRequired.map((s) => (
                <span key={s} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-red-700 mb-1">
              ✗ Missing Skills ({skillGap.missingRequired.length})
            </p>
            <div className="flex flex-wrap gap-1">
              {skillGap.missingRequired.map((s) => (
                <span key={s} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillGapCard;