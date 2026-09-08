import { useState } from 'react';
import { useAuth } from '../src/context/useAuth';
import ResumeUpload from '../components/ResumeUpload';
import SkillGapCard from '../components/SkillGapCard';
import RoadmapCard from '../components/RoadmapCard';

function Dashboard() {
  const { user, logoutUser } = useAuth();
  const [resumeAnalyzed, setResumeAnalyzed] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        <button
          onClick={logoutUser}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResumeUpload onAnalyzed={() => setResumeAnalyzed(true)} />

        {resumeAnalyzed && <SkillGapCard onRoleSelected={setSelectedRole} />}

        {selectedRole && (
          <RoadmapCard roleId={selectedRole._id} roleTitle={selectedRole.title} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;