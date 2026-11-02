import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NoteCard } from '../components/common/NoteCard';
import { NotePreviewModal } from '../components/modals/NotePreviewModal';
import { BaseNoteItem } from '../types';
import { 
  User, 
  Award, 
  BookOpen, 
  DownloadCloud, 
  Plus, 
  Trash2, 
  Layers, 
  Activity, 
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { currentUser, mySharedNotes, myDownloadedNotes, removeSharedNote } = useAuth();
  const [activeTab, setActiveTab] = useState<'shared' | 'downloaded' | 'transfers'>('shared');
  const [selectedNote, setSelectedNote] = useState<BaseNoteItem | null>(null);
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="pt-36 pb-20 px-4 text-center max-w-md mx-auto space-y-4">
        <h2 className="font-heading font-bold text-2xl text-ivory">Please Sign In</h2>
        <p className="text-xs text-ivory-muted">You need an active peer session to view your local dashboard.</p>
        <Link to="/login" className="btn-primary inline-block px-6 py-2.5 rounded-full text-xs font-heading font-semibold">
          Go to Login
        </Link>
      </div>
    );
  }

  const isFaculty = currentUser.role === 'FACULTY';

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      
      {/* Peer Profile Banner */}
      <div className="rounded-3xl bg-ink-charcoal border border-sage-border/60 p-6 sm:p-10 mb-10 shadow-card-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-lime/10 blur-3xl pointer-events-none rounded-full" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* Identity */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-ink-elevated border border-lime text-lime font-heading font-bold text-2xl sm:text-3xl flex items-center justify-center shadow-glow-lime/20">
              {currentUser.fullName.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`badge-mono px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                    isFaculty ? 'bg-lime/20 text-lime border border-lime/40' : 'bg-sage/20 text-sage-light border border-sage/40'
                  }`}
                >
                  {isFaculty ? 'FACULTY INSTRUCTOR' : `STUDENT • SEM ${currentUser.semester || 4}`}
                </span>
                <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                <span className="text-[11px] font-mono text-ivory-dim">PEER NODE ONLINE</span>
              </div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-ivory">
                {currentUser.fullName}
              </h1>
              <div className="text-xs font-mono text-ivory-muted">
                @{currentUser.username} • Department of {currentUser.department}
              </div>
            </div>
          </div>

          {/* Metrics summary */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-ink-surface border border-sage-border/60 text-center min-w-[100px]">
              <span className="text-[10px] font-mono text-ivory-dim block">REPUTATION</span>
              <span className="font-mono font-bold text-lg text-lime">+{currentUser.reputationScore}</span>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-ink-surface border border-sage-border/60 text-center min-w-[100px]">
              <span className="text-[10px] font-mono text-ivory-dim block">SHARED</span>
              <span className="font-mono font-bold text-lg text-ivory">{mySharedNotes.length}</span>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-ink-surface border border-sage-border/60 text-center min-w-[100px]">
              <span className="text-[10px] font-mono text-ivory-dim block">DOWNLOADED</span>
              <span className="font-mono font-bold text-lg text-ivory">{myDownloadedNotes.length}</span>
            </div>
          </div>
        </div>

        {/* Academic credentials strip */}
        <div className="mt-8 pt-6 border-t border-sage-border/40 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-ivory-dim">
          <div className="flex items-center gap-4">
            {isFaculty ? (
              <>
                <span>Designation: <strong className="text-ivory">{currentUser.designation}</strong></span>
                <span>•</span>
                <span>Location: <strong className="text-ivory">{currentUser.cabinNumber}</strong></span>
              </>
            ) : (
              <>
                <span>USN / Student ID: <strong className="text-ivory">{currentUser.studentId}</strong></span>
                <span>•</span>
                <span>Semester: <strong className="text-ivory">{currentUser.semester}</strong></span>
              </>
            )}
          </div>

          <Link
            to="/upload"
            className="btn-primary px-4 py-2 rounded-full text-xs font-heading font-semibold flex items-center gap-1.5 shadow-glow-lime/20"
          >
            <Plus className="w-3.5 h-3.5 text-ink" />
            <span>Upload New Note</span>
          </Link>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-sage-border/50 pb-4 mb-8">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('shared')}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all ${
              activeTab === 'shared'
                ? 'bg-lime text-ink shadow-glow-lime/20'
                : 'text-ivory-muted hover:text-ivory bg-ink-charcoal'
            }`}
          >
            Notes Shared By Me ({mySharedNotes.length})
          </button>

          <button
            onClick={() => setActiveTab('downloaded')}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all ${
              activeTab === 'downloaded'
                ? 'bg-lime text-ink shadow-glow-lime/20'
                : 'text-ivory-muted hover:text-ivory bg-ink-charcoal'
            }`}
          >
            Downloaded Peer Notes ({myDownloadedNotes.length})
          </button>

          <button
            onClick={() => setActiveTab('transfers')}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'transfers'
                ? 'bg-lime text-ink shadow-glow-lime/20'
                : 'text-ivory-muted hover:text-ivory bg-ink-charcoal'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-lime" />
            <span>Worker Thread Monitor</span>
          </button>
        </div>
      </div>

      {/* Tab: Shared Notes */}
      {activeTab === 'shared' && (
        <div>
          {mySharedNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mySharedNotes.map((note) => (
                <div key={note.id} className="relative group">
                  <NoteCard note={note} onPreview={(n) => setSelectedNote(n)} />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Remove "${note.title}" from your shared repository?`)) {
                        removeSharedNote(note.id);
                      }
                    }}
                    title="Remove from shared pool"
                    className="absolute top-4 right-4 p-2 rounded-lg bg-ink-charcoal/90 text-ivory-dim hover:text-red-400 border border-sage-border/60 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-ink-charcoal border border-sage-border/40 space-y-3">
              <BookOpen className="w-8 h-8 text-lime mx-auto" />
              <h3 className="font-heading font-bold text-base text-ivory">No Notes Shared Yet</h3>
              <p className="text-xs text-ivory-muted max-w-sm mx-auto">
                Share your lecture summaries or cheat-sheets to earn reputation and help peers.
              </p>
              <Link to="/upload" className="btn-primary inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold">
                <Plus className="w-3.5 h-3.5" />
                <span>Upload First Note</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab: Downloaded Notes */}
      {activeTab === 'downloaded' && (
        <div>
          {myDownloadedNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myDownloadedNotes.map((note) => (
                <NoteCard key={note.id} note={note} onPreview={(n) => setSelectedNote(n)} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-ink-charcoal border border-sage-border/40 space-y-3">
              <DownloadCloud className="w-8 h-8 text-lime mx-auto" />
              <h3 className="font-heading font-bold text-base text-ivory">No Downloaded Notes</h3>
              <p className="text-xs text-ivory-muted max-w-sm mx-auto">
                Explore notes from other student peers and professors to build your local study cache.
              </p>
              <Link to="/explore" className="btn-secondary inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold">
                <span>Browse Notes Registry</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab: Thread Monitor (Simulated Multi-threaded Transfer Tasks) */}
      {activeTab === 'transfers' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-ink-charcoal border border-sage-border/60 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-sage-border/40">
            <div>
              <span className="badge-mono text-lime font-semibold">CONCURRENCY TELEMETRY</span>
              <h3 className="font-heading font-bold text-lg text-ivory">Background Worker Thread Pool</h3>
            </div>
            <div className="badge-mono px-3 py-1 bg-ink-surface text-emerald-400 border border-emerald-500/30 rounded-full">
              ● 2 Active Transfer Threads
            </div>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Task 1 */}
            <div className="p-4 rounded-xl bg-ink-surface border border-sage-border/40 space-y-2">
              <div className="flex justify-between items-center text-ivory">
                <span className="text-lime font-bold">TransferThread-TX-1 (Worker Runnable)</span>
                <span className="text-emerald-400">100% COMPLETE</span>
              </div>
              <p className="text-[11px] text-ivory-dim">Downloading: Java OOP Principles &amp; Inheritance &rarr; alice_cse_101.txt</p>
              <div className="h-1.5 w-full bg-ink-elevated rounded-full overflow-hidden">
                <div className="h-full bg-lime w-full" />
              </div>
            </div>

            {/* Task 2 */}
            <div className="p-4 rounded-xl bg-ink-surface border border-sage-border/40 space-y-2">
              <div className="flex justify-between items-center text-ivory">
                <span className="text-lime font-bold">TransferThread-TX-2 (Worker Runnable)</span>
                <span className="text-lime-glow">STREAMING: 78%</span>
              </div>
              <p className="text-[11px] text-ivory-dim">Downloading: Machine Learning Formulas &rarr; bob_aiml_102.txt</p>
              <div className="h-1.5 w-full bg-ink-elevated rounded-full overflow-hidden">
                <div className="h-full bg-lime w-[78%] transition-all duration-300" />
              </div>
            </div>

            {/* Background Sync Thread */}
            <div className="p-4 rounded-xl bg-ink-surface border border-sage-border/40 flex items-center justify-between">
              <div>
                <span className="text-ivory font-bold block">P2P-BackgroundSync (Daemon Thread)</span>
                <span className="text-[11px] text-ivory-dim">Interval: 30000ms • Reporting network snapshot telemetry</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-ink-elevated text-lime border border-sage-border text-[10px]">
                DAEMON ALIVE
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Note Detailed Preview Modal */}
      <NotePreviewModal note={selectedNote} onClose={() => setSelectedNote(null)} />
    </div>
  );
};
