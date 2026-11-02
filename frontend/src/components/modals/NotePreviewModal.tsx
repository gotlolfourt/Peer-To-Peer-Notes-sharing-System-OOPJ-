import React from 'react';
import { BaseNoteItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';
import { 
  X, 
  Download, 
  Share2, 
  Star, 
  GraduationCap, 
  Sparkles, 
  FileText, 
  Copy, 
  Check, 
  Eye, 
  Calendar 
} from 'lucide-react';

interface NotePreviewModalProps {
  note: BaseNoteItem | null;
  onClose: () => void;
}

export const NotePreviewModal: React.FC<NotePreviewModalProps> = ({ note, onClose }) => {
  const { downloadNote, myDownloadedNotes } = useAuth();
  const [copied, setCopied] = React.useState(false);

  if (!note) return null;

  const isDownloaded = myDownloadedNotes.some((n) => n.id === note.id);
  const isLecture = note.noteType === 'LECTURE_NOTE';

  const handleDownloadFile = () => {
    downloadNote(note);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D5F36A', '#A5B89B', '#F1EFE5'],
    });

    // Generate downloadable text blob
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

  const handleCopyContent = () => {
    navigator.clipboard.writeText(note.content || note.keyPointsSummary || note.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-ink-charcoal border border-sage-border rounded-2xl shadow-glow-lime-lg flex flex-col overflow-hidden text-ivory"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-sage-border/60 flex items-start justify-between bg-ink-surface/90">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`badge-mono px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                  isLecture ? 'bg-lime/20 text-lime border border-lime/40' : 'bg-sage/20 text-sage-light border border-sage/40'
                }`}
              >
                {isLecture ? 'LECTURE NOTE' : 'CHEAT SHEET'}
              </span>
              <span className="badge-mono px-2 py-0.5 rounded text-[10px] bg-ink-elevated text-ivory-muted border border-sage-border/40">
                {note.department}
              </span>
              <span className="text-xs font-mono text-amber-300 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                {note.rating.toFixed(1)}
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-ivory">
              {note.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-ink-elevated border border-sage-border hover:border-lime text-ivory-dim hover:text-ivory transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-ink-surface border border-sage-border/50">
              <span className="text-[10px] font-mono text-ivory-dim block">CONTRIBUTOR</span>
              <span className="font-heading font-semibold text-ivory truncate block">{note.author}</span>
            </div>
            <div className="p-3 rounded-xl bg-ink-surface border border-sage-border/50">
              <span className="text-[10px] font-mono text-ivory-dim block">FILE SIZE</span>
              <span className="font-mono text-lime block">{note.fileSize}</span>
            </div>
            <div className="p-3 rounded-xl bg-ink-surface border border-sage-border/50">
              <span className="text-[10px] font-mono text-ivory-dim block">GLOBAL VIEWS</span>
              <span className="font-mono text-ivory block">{note.accessCount} reads</span>
            </div>
            <div className="p-3 rounded-xl bg-ink-surface border border-sage-border/50">
              <span className="text-[10px] font-mono text-ivory-dim block">ADDED</span>
              <span className="font-mono text-ivory-muted block">{note.uploadedAt}</span>
            </div>
          </div>

          {/* Type specific specs */}
          {isLecture ? (
            <div className="p-4 rounded-xl bg-ink-surface/70 border border-sage-border/50 space-y-2">
              <h4 className="badge-mono text-lime flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                <span>Classroom Lecture Context</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-ivory-muted">
                <div>Course Code: <span className="text-ivory">{note.courseCode}</span></div>
                <div>Professor: <span className="text-ivory">{note.professorName}</span></div>
                <div>Lecture Session: <span className="text-ivory">#{note.lectureNumber}</span></div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-ink-surface/70 border border-sage-border/50 space-y-3">
              <h4 className="badge-mono text-lime flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Target: {note.examTarget}</span>
              </h4>
              <div>
                <span className="text-xs font-mono text-ivory-dim block mb-1">KEY FORMULAS REGISTERED:</span>
                <div className="space-y-1.5">
                  {note.keyFormulas?.map((formula, idx) => (
                    <div key={idx} className="font-mono text-xs bg-ink-charcoal px-3 py-1.5 rounded border border-sage-border/40 text-lime-glow">
                      {formula}
                    </div>
                  ))}
                </div>
              </div>
              {note.keyPointsSummary && (
                <div>
                  <span className="text-xs font-mono text-ivory-dim block mb-1">HIGH-YIELD POINTS SUMMARY:</span>
                  <p className="text-xs text-ivory-muted leading-relaxed bg-ink-charcoal p-3 rounded border border-sage-border/40">
                    {note.keyPointsSummary}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Full Note Body Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="badge-mono text-ivory-dim">Full Text Preview</span>
              <button
                onClick={handleCopyContent}
                className="text-xs font-mono text-lime hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-lime" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
            <div className="p-4 rounded-xl bg-ink-950 border border-sage-border/60 font-mono text-xs text-ivory-muted whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
              {note.content || note.keyPointsSummary || 'No additional body text registered.'}
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 bg-ink-surface border-t border-sage-border/60 flex items-center justify-between">
          <div className="text-xs font-mono text-ivory-dim">
            Status: <span className="text-emerald-400">P2P Verified Note</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-heading font-medium text-ivory hover:text-lime"
            >
              Close
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
      </div>
    </div>
  );
};
