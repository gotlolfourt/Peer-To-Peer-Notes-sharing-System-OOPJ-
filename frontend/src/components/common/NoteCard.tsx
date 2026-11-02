import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BaseNoteItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';
import { 
  Download, 
  FileText, 
  Bookmark, 
  Sparkles, 
  Star, 
  Eye, 
  Check, 
  Share2, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';

interface NoteCardProps {
  note: BaseNoteItem;
  onPreview?: (note: BaseNoteItem) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onPreview }) => {
  const { downloadNote, myDownloadedNotes } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const isDownloaded = myDownloadedNotes.some((n) => n.id === note.id);
  const isLecture = note.noteType === 'LECTURE_NOTE';

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloading(true);

    setTimeout(() => {
      downloadNote(note);
      setDownloading(false);
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#D5F36A', '#A5B89B', '#F1EFE5'],
      });
    }, 700);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/notes/${note.id}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <div
      onClick={() => onPreview && onPreview(note)}
      className="group relative rounded-2xl bg-ink-charcoal/90 border border-sage-border/60 hover:border-lime/70 transition-all duration-300 hover:shadow-card-dark flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Top accent line based on note type */}
      <div
        className={`h-1.5 w-full ${
          isLecture
            ? 'bg-gradient-to-r from-lime to-lime-muted'
            : 'bg-gradient-to-r from-sage to-sage-light'
        }`}
      />

      <div className="p-5 flex-1 flex flex-col">
        {/* Header Tags */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span
              className={`badge-mono px-2 py-0.5 rounded text-[10px] font-semibold ${
                isLecture
                  ? 'bg-lime/15 text-lime border border-lime/30'
                  : 'bg-sage/15 text-sage-light border border-sage/30'
              }`}
            >
              {isLecture ? 'LECTURE NOTE' : 'CHEAT SHEET'}
            </span>
            <span className="badge-mono px-2 py-0.5 rounded text-[10px] bg-ink-elevated text-ivory-muted border border-sage-border/40">
              {note.department}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-amber-300 font-mono">
            <Star className="w-3.5 h-3.5 fill-amber-300" />
            <span>{note.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Note Title */}
        <h3 className="font-heading font-bold text-lg text-ivory group-hover:text-lime transition-colors line-clamp-2 mb-2 leading-snug">
          {note.title}
        </h3>

        {/* Sub-details (course code or exam target) */}
        <div className="text-xs font-mono text-ivory-dim mb-4 flex items-center gap-2">
          {isLecture ? (
            <>
              <GraduationCap className="w-3.5 h-3.5 text-sage" />
              <span>{note.courseCode || 'General'}</span>
              <span>•</span>
              <span>Prof. {note.professorName || 'Faculty'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-lime" />
              <span>Target: {note.examTarget || 'Semester Exams'}</span>
              <span>•</span>
              <span>{note.keyFormulas?.length || 4} Key Formulas</span>
            </>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
          {note.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2 py-0.5 rounded-full bg-ink-surface text-ivory-muted border border-sage-border/30"
            >
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full text-ivory-dim">
              +{note.tags.length - 3}
            </span>
          )}
        </div>

        {/* Author & Metrics footer */}
        <div className="pt-3 border-t border-sage-border/40 flex items-center justify-between text-xs text-ivory-dim">
          <Link
            to={`/profile/${note.authorUsername}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 hover:text-lime transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-ink-elevated border border-sage-border flex items-center justify-center text-[10px] font-bold text-ivory">
              {note.author.charAt(0)}
            </div>
            <span className="truncate max-w-[110px]">{note.author}</span>
          </Link>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-ivory-dim" />
              <span>{note.accessCount}</span>
            </span>
            <span>{note.fileSize}</span>
          </div>
        </div>
      </div>

      {/* Card Action Bar */}
      <div className="px-5 py-3 bg-ink-surface/90 border-t border-sage-border/50 flex items-center justify-between gap-2">
        <Link
          to={`/notes/${note.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-xs font-heading font-medium text-ivory-muted hover:text-lime flex items-center gap-1 transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3 h-3" />
        </Link>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyLink}
            title="Share Note Link"
            className="p-1.5 rounded-lg bg-ink-charcoal border border-sage-border hover:border-lime text-ivory-dim hover:text-lime transition-colors"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-lime" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className={`px-3 py-1.5 rounded-lg text-xs font-heading font-medium flex items-center gap-1.5 transition-all ${
              isDownloaded
                ? 'bg-ink-elevated text-lime border border-lime/40'
                : 'bg-lime text-ink hover:bg-lime-glow font-semibold shadow-glow-lime/20'
            }`}
          >
            {downloading ? (
              <span className="w-3.5 h-3.5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
            ) : isDownloaded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Downloaded</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
