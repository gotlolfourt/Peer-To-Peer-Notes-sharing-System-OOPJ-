import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layers, ArrowRight, UserCheck, Key, Shield, GraduationCap } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('alice_cse');
  const [password, setPassword] = useState('pass123');
  const [userRole, setUserRole] = useState<'STUDENT' | 'FACULTY'>('STUDENT');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username cannot be empty.');
      return;
    }

    const success = login(username, userRole);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Login failed. Please verify credentials.');
    }
  };

  const handleQuickLogin = (uname: string, role: 'STUDENT' | 'FACULTY') => {
    setUsername(uname);
    setUserRole(role);
    login(uname, role);
    navigate('/dashboard');
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto min-h-screen flex flex-col justify-center">
      <div className="rounded-3xl bg-ink-charcoal border border-sage-border/60 p-8 sm:p-10 shadow-card-dark relative overflow-hidden">
        
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-lime/10 blur-3xl pointer-events-none rounded-full" />

        {/* Brand & Heading */}
        <div className="text-center mb-8 space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-ink-surface border border-sage-border text-lime flex items-center justify-center mx-auto mb-4">
            <Layers className="w-6 h-6" />
          </div>
          <span className="badge-mono text-lime font-bold">PEER AUTHENTICATION</span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-ivory tracking-tight">
            Sign In to SHARENOTE
          </h1>
          <p className="text-xs text-ivory-muted">
            Access your shared notes registry, reputation score, and local downloads.
          </p>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-ink-surface border border-sage-border mb-6 text-xs">
          <button
            type="button"
            onClick={() => setUserRole('STUDENT')}
            className={`py-2 rounded-lg font-heading font-semibold transition-all ${
              userRole === 'STUDENT' ? 'bg-lime text-ink shadow-glow-lime/20' : 'text-ivory-muted hover:text-ivory'
            }`}
          >
            Student Peer
          </button>
          <button
            type="button"
            onClick={() => setUserRole('FACULTY')}
            className={`py-2 rounded-lg font-heading font-semibold transition-all ${
              userRole === 'FACULTY' ? 'bg-lime text-ink shadow-glow-lime/20' : 'text-ivory-muted hover:text-ivory'
            }`}
          >
            Faculty Member
          </button>
        </div>

        {/* Quick Demo Peer Selector */}
        <div className="mb-6 p-3 rounded-xl bg-ink-surface/80 border border-sage-border/40 space-y-2">
          <span className="text-[10px] font-mono text-ivory-dim block">ONE-CLICK DEMO ACCOUNTS:</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('alice_cse', 'STUDENT')}
              className="px-2.5 py-1 rounded bg-ink-charcoal hover:bg-lime hover:text-ink text-[11px] font-mono border border-sage-border/40 text-ivory transition-colors"
            >
              @alice_cse (Student)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('bob_aiml', 'STUDENT')}
              className="px-2.5 py-1 rounded bg-ink-charcoal hover:bg-lime hover:text-ink text-[11px] font-mono border border-sage-border/40 text-ivory transition-colors"
            >
              @bob_aiml (Student)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('charlie_ece', 'FACULTY')}
              className="px-2.5 py-1 rounded bg-ink-charcoal hover:bg-lime hover:text-ink text-[11px] font-mono border border-sage-border/40 text-ivory transition-colors"
            >
              @charlie_ece (Faculty)
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-ivory-muted">USERNAME</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. alice_cse"
              className="w-full px-4 py-3 rounded-xl bg-ink-surface border border-sage-border focus:border-lime focus:outline-none text-xs sm:text-sm text-ivory font-mono"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-ivory-muted">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your peer password"
              className="w-full px-4 py-3 rounded-xl bg-ink-surface border border-sage-border focus:border-lime focus:outline-none text-xs sm:text-sm text-ivory font-mono"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full py-3.5 rounded-xl text-xs font-heading font-bold shadow-glow-lime mt-2 flex items-center justify-center gap-2"
          >
            <span>Log In to Peer Session</span>
            <ArrowRight className="w-4 h-4 text-ink" />
          </button>
        </form>

        {/* Footer links */}
        <div className="text-center mt-6 pt-6 border-t border-sage-border/40 text-xs text-ivory-dim">
          Don't have a peer account?{' '}
          <Link to="/register" className="text-lime hover:underline font-semibold">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
