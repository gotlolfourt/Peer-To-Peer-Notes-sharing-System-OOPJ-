import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { PeerProfile, BaseNoteItem } from '../types';
import { NoteCard } from '../components/common/NoteCard';
import { 
  Award, 
  BookOpen, 
  GraduationCap, 
  ShieldCheck, 
  ArrowLeft, 
  Share2, 
  Check, 
  MapPin, 
  Mail 
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [peer, setPeer] = useState<PeerProfile | null>(null);
  const [peerNotes, setPeerNotes] = useState<BaseNoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      loadProfile(id);
    }
  }, [id]);

  const loadProfile = async (username: string) => {
    setLoading(true);
    const p = await api.getPeer(username);
    setPeer(p);

    const all = await api.getNotes();
    const authored = all.notes.filter(
      (n) => n.authorUsername.toLowerCase() === username.toLowerCase()
    );
    setPeerNotes(authored);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="pt-36 pb-20 px-4 max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-ink-charcoal rounded-xl w-3/4" />
        <div className="h-48 bg-ink-charcoal rounded-2xl" />
      </div>
    );
  }

  if (!peer) {
    return (
      <div className="pt-36 pb-20 px-4 text-center max-w-md mx-auto space-y-4">
        <h2 className="font-heading font-bold text-2xl text-ivory">Peer Not Found</h2>
        <p className="text-xs text-ivory-muted">The requested peer profile could not be located in the P2P mesh.</p>
        <Link to="/" className="btn-primary inline-block px-6 py-2.5 rounded-full text-xs font-semibold">
          Back to Network
        </Link>
      </div>
    );
  }

  const isFaculty = peer.role === 'FACULTY';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen space-y-10">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-ivory-dim hover:text-lime transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Network</span>
      </Link>

      {/* Profile Header Card */}
      <div className="rounded-3xl bg-ink-charcoal border border-sage-border/60 p-6 sm:p-10 shadow-card-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-lime/10 blur-3xl pointer-events-none rounded-full" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-ink-elevated border border-lime text-lime font-heading font-bold text-3xl flex items-center justify-center shadow-glow-lime/20">
              {peer.fullName.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`badge-mono px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                    isFaculty ? 'bg-lime/20 text-lime border border-lime/40' : 'bg-sage/20 text-sage-light border border-sage/40'
                  }`}
                >
                  {isFaculty ? 'OFFICIAL FACULTY' : `STUDENT • SEM ${peer.semester || 4}`}
                </span>
                <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                <span className="text-[11px] font-mono text-ivory-dim uppercase">{peer.status}</span>
              </div>

              <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-ivory">
                {peer.fullName}
              </h1>

              <div className="text-xs font-mono text-ivory-muted">
                @{peer.username} • Department of {peer.department}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl bg-ink-surface border border-sage-border hover:border-lime text-xs text-ivory flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-lime" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Link Copied' : 'Share Profile'}</span>
            </button>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-6 text-sm text-ivory-muted max-w-2xl leading-relaxed">
          {peer.bio}
        </p>

        {/* Credentials Details */}
        <div className="mt-8 pt-6 border-t border-sage-border/40 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-ink-surface/80 border border-sage-border/40">
            <span className="text-ivory-dim block text-[10px]">REPUTATION SCORE</span>
            <span className="font-bold text-base text-lime">+{peer.reputationScore} pts</span>
          </div>

          <div className="p-3 rounded-xl bg-ink-surface/80 border border-sage-border/40">
            <span className="text-ivory-dim block text-[10px]">NOTES CONTRIBUTED</span>
            <span className="font-bold text-base text-ivory">{peerNotes.length} notes</span>
          </div>

          <div className="p-3 rounded-xl bg-ink-surface/80 border border-sage-border/40">
            <span className="text-ivory-dim block text-[10px]">ROLE SPEC</span>
            <span className="font-bold text-base text-ivory">
              {isFaculty ? peer.designation : `USN: ${peer.studentId}`}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-ink-surface/80 border border-sage-border/40">
            <span className="text-ivory-dim block text-[10px]">CAMPUS NODE</span>
            <span className="font-bold text-base text-ivory">
              {isFaculty ? peer.cabinNumber : `Semester ${peer.semester}`}
            </span>
          </div>
        </div>
      </div>

      {/* Notes Published by this Peer */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-extrabold text-2xl text-ivory tracking-tight">
            Notes Published by {peer.fullName} ({peerNotes.length})
          </h2>
        </div>

        {peerNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {peerNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-ink-charcoal border border-sage-border/40 text-xs text-ivory-muted">
            This peer has not shared any public notes yet.
          </div>
        )}
      </div>
    </div>
  );
};
