import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import FloatingChatbot from './components/FloatingChatbot';
import Home from './pages/Home';
import QuickScan from './pages/QuickScan';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Timeline from './pages/Timeline';
import Medicines from './pages/Medicines';
import DoctorPortal from './pages/DoctorPortal';
import AdminPortal from './pages/AdminPortal';
import SettingsPage from './pages/SettingsPage';

// Protected Route wrapper with role check
function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-teal-600 font-semibold text-sm">
        Loading Health Copilot...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to default home for their role
    if (currentUser.role === 'admin') return <Navigate to="/admin" replace />;
    if (currentUser.role === 'doctor') return <Navigate to="/doctor" replace />;
    return <Navigate to="/timeline" replace />;
  }

  return children;
}

export default function App() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quick-scan" element={<QuickScan />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Protected Patient Routes */}
          <Route
            path="/timeline"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Timeline />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medicines"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Medicines />
              </ProtectedRoute>
            }
          />

          {/* Protected Doctor Routes */}
          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorPortal />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPortal />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Floating records-grounded chatbot for patients or visitors */}
      <FloatingChatbot />
    </div>
  );
}
