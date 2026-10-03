import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { emailRegex } from '../utils/validation';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) return setError('Please enter your name');
    if (!emailRegex.test(email.trim())) return setError('Please enter a valid email address');
    if (password.length < 6) return setError('Password must be at least 6 characters long');
    if (password !== confirmPassword) return setError('Passwords do not match');

    setSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      setError((err as Error).message || 'Could not create your account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
            <Users className="w-5 h-5" />
          </div>
          <h1 className="mt-3 text-lg font-bold tracking-tight text-slate-900">Create your account</h1>
          <p className="text-sm text-slate-500">Start managing your customers in seconds</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4"
        >
          {error && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ali Khan"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 focus:bg-white rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 focus:bg-white rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 focus:bg-white rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Confirm password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 focus:bg-white rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>

          <p className="text-center text-xs text-slate-500 pt-1">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-slate-900 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
