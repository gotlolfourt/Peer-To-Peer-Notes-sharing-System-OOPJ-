import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Department, UserRole } from '../types';
import { Layers, ArrowRight, UserPlus, GraduationCap, ShieldCheck, Check } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState<Department>('CSE');

  // Student specific
  const [studentId, setStudentId] = useState('');
  const [semester, setSemester] = useState(4);

  // Faculty specific
  const [designation, setDesignation] = useState('Assistant Professor');
  const [cabinNumber, setCabinNumber] = useState('Cabin CS-201');

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!username.trim() || !fullName.trim() || !password) {
      setStatusMsg({ type: 'error', text: 'Please fill in all mandatory fields.' });
      return;
    }

    setLoading(true);

    const res = await api.registerUser({
      username: username.trim().toLowerCase(),
      fullName: fullName.trim(),
      department,
      role,
      password,
    });

    setLoading(false);

    if (res.success) {
      setStatusMsg({ type: 'success', text: res.message });
      login(username.trim().toLowerCase(), role);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } else {
      setStatusMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto min-h-screen flex flex-col justify-center">
      <div className="rounded-3xl bg-ink-charcoal border border-sage-border/60 p-8 sm:p-10 shadow-card-dark relative overflow-hidden">
        
        {/* Brand */}
        <div className="text-center mb-8 space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-ink-surface border border-sage-border text-lime flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-6 h-6" />
          </div>
          <span className="badge-mono text-lime font-bold">JOIN DECENTRALIZED NETWORK</span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-ivory tracking-tight">
            Create Peer Node Identity
          </h1>
          <p className="text-xs text-ivory-muted">
            Register as an autonomous student or faculty peer.
          </p>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-ink-surface border border-sage-border mb-6">
          <button
            type="button"
            onClick={() => setRole('STUDENT')}
            className={`py-2.5 rounded-xl text-xs font-heading font-semibold flex items-center justify-center gap-2 transition-all ${
              role === 'STUDENT'
                ? 'bg-lime text-ink shadow-glow-lime/20 font-bold'
                : 'text-ivory-muted hover:text-ivory'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Peer (+10 Rep)</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('FACULTY')}
            className={`py-2.5 rounded-xl text-xs font-heading font-semibold flex items-center justify-center gap-2 transition-all ${
              role === 'FACULTY'
                ? 'bg-lime text-ink shadow-glow-lime/20 font-bold'
                : 'text-ivory-muted hover:text-ivory'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Faculty Member (+50 Rep)</span>
          </button>
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          {/* Full Name & Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-ivory-muted">FULL NAME *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alice DSouza"
                className="w-full px-4 py-2.5 rounded-xl bg-ink-surface border border-sage-border focus:border-lime focus:outline-none text-xs text-ivory font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-ivory-muted">CHOOSE USERNAME *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="e.g. alice_cse"
                className="w-full px-4 py-2.5 rounded-xl bg-ink-surface border border-sage-border focus:border-lime focus:outline-none text-xs text-ivory font-mono"
                required
              />
            </div>
          </div>

          {/* Department & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-ivory-muted">DEPARTMENT *</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full px-4 py-2.5 rounded-xl bg-ink-surface border border-sage-border focus:border-lime focus:outline-none text-xs text-ivory font-mono cursor-pointer"
              >
                <option value="CSE">Computer Science (CSE)</option>
                <option value="AIML">AI & Machine Learning (AIML)</option>
                <option value="ECE">Electronics (ECE)</option>
                <option value="MECHANICAL">Mechanical Engineering</option>
                <option value="GENERAL">General Engineering</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-ivory-muted">PASSWORD *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a password"
                className="w-full px-4 py-2.5 rounded-xl bg-ink-surface border border-sage-border focus:border-lime focus:outline-none text-xs text-ivory font-mono"
                required
              />
            </div>
          </div>

          {/* Specialized Fields: Student vs Faculty */}
          {role === 'STUDENT' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-ink-surface/70 border border-sage-border/50">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-ivory-muted">STUDENT USN / ID</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. 21CS042"
                  className="w-full px-4 py-2.5 rounded-xl bg-ink-charcoal border border-sage-border focus:border-lime focus:outline-none text-xs text-ivory font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-ivory-muted">SEMESTER (1-8)</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2.5 rounded-xl bg-ink-charcoal border border-sage-border focus:border-lime focus:outline-none text-xs text-ivory font-mono cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-ink-surface/70 border border-sage-border/50">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-ivory-muted">FACULTY DESIGNATION</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Associate Professor"
                  className="w-full px-4 py-2.5 rounded-xl bg-ink-charcoal border border-sage-border focus:border-lime focus:outline-none text-xs text-ivory font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-ivory-muted">FACULTY CABIN</label>
                <input
                  type="text"
                  value={cabinNumber}
                  onChange={(e) => setCabinNumber(e.target.value)}
                  placeholder="e.g. Cabin E-204"
                  className="w-full px-4 py-2.5 rounded-xl bg-ink-charcoal border border-sage-border focus:border-lime focus:outline-none text-xs text-ivory font-mono"
                />
              </div>
            </div>
          )}

          {statusMsg && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                statusMsg.type === 'error'
                  ? 'bg-red-950/40 border border-red-500/40 text-red-300'
                  : 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
              }`}
            >
              <span>{statusMsg.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 rounded-xl text-xs font-heading font-bold shadow-glow-lime mt-2 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Registering Peer Node...' : 'Register Peer Identity'}</span>
            <ArrowRight className="w-4 h-4 text-ink" />
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-sage-border/40 text-xs text-ivory-dim">
          Already registered?{' '}
          <Link to="/login" className="text-lime hover:underline font-semibold">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
