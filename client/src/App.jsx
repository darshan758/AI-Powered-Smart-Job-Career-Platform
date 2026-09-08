import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

// We'll build these page components in the next steps
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';

import Jobs from '../pages/Jobs';

import Navbar from '../components/Navbar';

import Chat from '../pages/Chat';

import Admin from '../pages/Admin';
import AdminRoute from '../components/AdminRoute';
import Analytics from '../pages/Analytics';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
  path="/jobs"
  element={
    <ProtectedRoute>
      <Jobs />
    </ProtectedRoute>
  }
/>
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <AdminRoute>
                <Analytics />
              </AdminRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;