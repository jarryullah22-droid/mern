import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FullScreenLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex items-center gap-3 text-slate-500 text-sm">
      <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
      <span>Restoring your session…</span>
    </div>
  </div>
);

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return <>{children}</>;
};
