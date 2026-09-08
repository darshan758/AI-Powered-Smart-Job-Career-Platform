import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../src/context/useAuth';

function Navbar() {
  const { user, logoutUser } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const linkClass = (path) =>
    `px-3 py-2 rounded text-sm font-medium ${
      location.pathname === path ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
    }`;

  return (
    <nav className="bg-white shadow px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
        <Link to="/jobs" className={linkClass('/jobs')}>Jobs</Link>
        <Link to="/chat" className={linkClass('/chat')}>Chat</Link>
        <Link to="/ats" className={linkClass('/ats')}>ATS Score</Link>
        {user.role === 'admin' && (
          <>
            <Link to="/admin" className={linkClass('/admin')}>Admin</Link>
            <Link to="/analytics" className={linkClass('/analytics')}>Analytics</Link>
          </>
        )}
      </div>
      <button onClick={logoutUser} className="text-sm text-red-600 hover:underline">
        Logout
      </button>
    </nav>
  );
}

export default Navbar;