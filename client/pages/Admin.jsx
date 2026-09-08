import { useState, useEffect } from 'react';
import { getAllUsers, deleteJobPosting } from '../src/api/adminApi';
import { getAllJobPostings } from '../src/api/jobPostingApi';

function Admin() {
  const [users, setUsers] = useState([]);
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const [usersRes, postingsRes] = await Promise.all([getAllUsers(), getAllJobPostings()]);
    setUsers(usersRes.data);
    setPostings(postingsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeletePosting = async (id) => {
    if (!window.confirm('Delete this job posting?')) return;
    await deleteJobPosting(id);
    setPostings((prev) => prev.filter((p) => p._id !== id));
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading admin data...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Users ({users.length})</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {users.map((u) => (
              <div key={u._id} className="flex justify-between items-center border-b pb-2 text-sm">
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-gray-500">{u.email}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Job Postings ({postings.length})</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {postings.map((p) => (
              <div key={p._id} className="flex justify-between items-center border-b pb-2 text-sm">
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-gray-500">{p.company}</p>
                </div>
                <button
                  onClick={() => handleDeletePosting(p._id)}
                  className="text-red-600 hover:underline text-xs"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;