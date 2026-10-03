import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AppHeaderProps {
  /** Optional right-hand actions (e.g. an "Add Customer" button). */
  children?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const initials =
    (user?.name || 'U')
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'U';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900 truncate">
            Mini Customer Management App
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {children}

          {user && (
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-[11px] font-semibold flex items-center justify-center">
                {initials}
              </div>
              <div className="leading-tight">
                <div className="text-xs font-semibold text-slate-900">{user.name}</div>
                <div className="text-[11px] text-slate-500">{user.email}</div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
