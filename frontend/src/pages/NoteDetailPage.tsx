import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { BaseNoteItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { NoteCard } from '../components/common/NoteCard';
import confetti from 'canvas-confetti';
import { 
  Download, 
  ArrowLeft, 
  Share2, 
  GraduationCap, 
  Sparkles, 
  Star, 
  Check, 
  FileText, 
  Eye, 
  Clock, 
  Award,
  ChevronRight
} from 'lucide-react';

export const NoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<BaseNoteItem | null>(null);
  const [relatedNotes, setRelatedNotes] = useState<BaseNoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { downloadNote, myDownloadedNotes } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      loadNoteDetail(parseInt(id));
    }
  }, [id]);

  const loadNoteDetail = async (noteId: number) => {
    setLoading(true);
    const item = await api.getNoteById(noteId);
    setNote(item);

    // Fetch related notes in the same department
    if (item) {
      const all = await api.getNotes();
      const related = all.notes
        .filter((n) => n.id !== item.id && n.department === item.department)
        .slice(0, 3);
      setRelatedNotes(related);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="pt-36 pb-20 px-4 max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-ink-charcoal rounded-xl w-3/4" />
        <div className="h-64 bg-ink-charcoal rounded-2xl" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="pt-36 pb-20 px-4 text-center max-w-md mx-auto space-y-4">
        <h2 className="font-heading font-bold text-2xl text-ivory">Note Not Found</h2>
        <p className="text-xs text-ivory-muted">The requested note ID does not exist in the peer registry.</p>
        <Link to="/explore" className="btn-primary inline-block px-6 py-2.5 rounded-full text-xs font-semibold">
          Back to Directory
        </Link>
      </div>
    );
  }

  const isLecture = note.noteType === 'LECTURE_NOTE';
  const isDownloaded = myDownloadedNotes.some((n) => n.id === note.id);

  const handleDownloadFile = () => {
    downloadNote(note);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D5F36A', '#A5B89B', '#F1EFE5'],
    });

    const fullText = `=== SHARENOTE P2P NETWORK EXPORT ===
Title: ${note.title}
Author: ${note.author} (@${note.authorUsername})
Department: ${note.department}
Type: ${note.noteType}
Rating: ${note.rating}/5.0
Uploaded: ${note.uploadedAt}

${isLecture ? `Course Code: ${note.courseCode}\nInstructor: Prof. ${note.professorName}\nLecture #: ${note.lectureNumber}` : `Target Exam: ${note.examTarget}\nKey Formulas:\n${(note.keyFormulas || []).map(f => '  - ' + f).join('\n')}\nSummary Points: ${note.keyPointsSummary}`}

--- BODY CONTENT ---
${note.content || 'Content cached on peer node storage.'}
`;

    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_note.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen space-y-10">
      
      {/* Breadcrumb back navigation */}
      <div className="flex items-center gap-2 text-xs font-mono text-ivory-dim">
        <Link to="/explore" className="hover:text-lime flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Explore Notes</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-sage-border" />
        <span className="text-lime">{note.department}</span>
        <ChevronRight className="w-3 h-3 text-sage-border" />
        <span className="text-ivory truncate max-w-[200px]">{note.title}</span>
      </div>

      {/* Main Note Reader Card */}
      <div className="rounded-3xl bg-ink-charcoal border border-sage-border/60 p-6 sm:p-10 shadow-card-dark relative overflow-hidden space-y-8">
        
        {/* Top Header Tagging */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-sage-border/50">
          <div className="flex items-center gap-2">
            <span
              className={`badge-mono px-3 py-1 rounded text-[11px] font-semibold ${
                isLecture
                  ? 'bg-lime/20 text-lime border border-lime/40'
                  : 'bg-sage/20 text-sage-light border border-sage/40'
              }`}
            >
              {isLecture ? 'LECTURE NOTE' : 'CHEAT SHEET'}
            </span>
            <span className="badge-mono px-3 py-1 rounded text-[11px] bg-ink-elevated text-ivory-muted border border-sage-border/50">
              {note.department}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-ink-surface border border-sage-border hover:border-lime text-ivory-muted hover:text-lime text-xs flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-lime" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={handleDownloadFile}
              className="btn-primary px-5 py-2.5 rounded-xl text-xs font-heading font-semibold flex items-center gap-2 shadow-glow-lime/30"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloaded ? 'Download Again' : 'Download Note File'}</span>
            </button>
          </div>
        </div>

        {/* Title & Editorial Description */}
        <div className="space-y-3">
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-ivory leading-tight">
            {note.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-ivory-dim">
            <Link to={`/profile/${note.authorUsername}`} className="flex items-center gap-1.5 text-lime hover:underline">
              <span>Shared by {note.author}</span>
            </Link>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{note.accessCount} peer views</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>{note.rating.toFixed(1)} / 5.0</span>
            </span>
          </div>
        </div>

        {/* Context Specific Block */}
        {isLecture ? (
          <div className="p-5 rounded-2xl bg-ink-surface border border-sage-border/50 space-y-3">
            <h3 className="badge-mono text-lime flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>Course & Academic Instructor</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <span className="text-ivory-dim block text-[10px]">COURSE CODE</span>
                <span className="text-ivory font-bold">{note.courseCode}</span>
              </div>
              <div>
                <span className="text-ivory-dim block text-[10px]">INSTRUCTOR</span>
                <span className="text-ivory font-bold">Prof. {note.professorName}</span>
              </div>
              <div>
                <span className="text-ivory-dim block text-[10px]">LECTURE NUMBER</span>
                <span className="text-lime font-bold">Lecture #{note.lectureNumber}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-ink-surface border border-sage-border/50 space-y-4">
            <h3 className="badge-mono text-lime flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Exam Revision Target: {note.examTarget}</span>
            </h3>

            {/* Formulas */}
            {note.keyFormulas && note.keyFormulas.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-mono text-ivory-dim block">REGISTERED FORMULAS:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {note.keyFormulas.map((f, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-ink-charcoal border border-sage-border/40 font-mono text-xs text-lime-glow">
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {note.keyPointsSummary && (
              <div>
                <span className="text-xs font-mono text-ivory-dim block mb-1">HIGH-YIELD POINTS:</span>
                <div className="p-3 rounded-lg bg-ink-charcoal border border-sage-border/40 text-xs text-ivory-muted leading-relaxed">
                  {note.keyPointsSummary}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Note Body Text */}
        <div className="space-y-3">
          <h3 className="badge-mono text-ivory-dim">Full Text Document</h3>
          <div className="p-6 rounded-2xl bg-ink-950 border border-sage-border/60 font-mono text-xs sm:text-sm text-ivory-muted whitespace-pre-wrap leading-relaxed">
            {note.content || note.keyPointsSummary || 'No additional body text provided.'}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {note.tags.map((t, idx) => (
            <span key={idx} className="text-xs px-3 py-1 rounded-full bg-ink-surface text-ivory-muted border border-sage-border/40 font-mono">
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Related Notes in Same Department */}
      {relatedNotes.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-xl text-ivory">
              More in {note.department} Department
            </h3>
            <Link to={`/explore?dept=${note.department}`} className="text-xs font-mono text-lime hover:underline">
              View all {note.department} notes
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedNotes.map((rn) => (
              <NoteCard key={rn.id} note={rn} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
