import React from 'react';
import { Link } from 'react-router-dom';
import { PeerProfile } from '../../types';
import { GraduationCap, Award, BookOpen, DownloadCloud, ArrowUpRight } from 'lucide-react';

interface PeerCardProps {
  peer: PeerProfile;
}

export const PeerCard: React.FC<PeerCardProps> = ({ peer }) => {
  const isFaculty = peer.role === 'FACULTY';

  return (
    <div className="relative rounded-2xl bg-ink-charcoal border border-sage-border/60 hover:border-lime/60 p-5 transition-all duration-300 hover:shadow-card-dark flex flex-col justify-between group">
      <div>
        {/* Top Header: Role badge & Online pulse */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`badge-mono px-2 py-0.5 rounded text-[10px] font-semibold ${
              isFaculty
                ? 'bg-lime/20 text-lime border border-lime/40'
                : 'bg-sage/20 text-sage-light border border-sage/40'
            }`}
          >
            {isFaculty ? 'OFFICIAL FACULTY' : `STUDENT • SEM ${peer.semester || 4}`}
          </span>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-ivory-dim">
            <span
              className={`w-2 h-2 rounded-full ${
                peer.status === 'online'
                  ? 'bg-lime animate-pulse'
                  : peer.status === 'idle'
                  ? 'bg-amber-400'
                  : 'bg-ivory-dim'
              }`}
            />
            <span className="capitalize">{peer.status}</span>
          </div>
        </div>

        {/* Profile Avatar & Name */}
        <div className="flex items-center gap-3.5 mb-3">
          <div className="w-12 h-12 rounded-xl bg-ink-elevated border border-sage-border flex items-center justify-center font-heading font-bold text-lg text-lime group-hover:scale-105 transition-transform">
            {peer.fullName.charAt(0)}
          </div>
          <div>
            <h4 className="font-heading font-bold text-base text-ivory group-hover:text-lime transition-colors">
              {peer.fullName}
            </h4>
            <div className="badge-mono text-xs text-ivory-muted">@{peer.username}</div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-ivory-muted line-clamp-2 mb-4 leading-relaxed">
          {peer.bio}
        </p>

        {/* Department / Academic credentials */}
        <div className="text-xs font-mono text-ivory-dim bg-ink-surface/80 p-2.5 rounded-xl border border-sage-border/40 mb-4 flex items-center justify-between">
          <span>{peer.department} Dept</span>
          {isFaculty ? (
            <span className="text-lime">{peer.designation}</span>
          ) : (
            <span>ID: {peer.studentId}</span>
          )}
        </div>
      </div>

      {/* Metrics & Profile Link */}
      <div className="pt-3 border-t border-sage-border/40 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs">
          <div title="Reputation Points" className="flex items-center gap-1 text-lime font-mono font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>+{peer.reputationScore}</span>
          </div>
          <div title="Notes Shared" className="flex items-center gap-1 text-ivory-muted font-mono text-[11px]">
            <BookOpen className="w-3 h-3" />
            <span>{peer.sharedNotesCount} shared</span>
          </div>
        </div>

        <Link
          to={`/profile/${peer.username}`}
          className="text-xs font-heading font-medium text-ivory hover:text-lime flex items-center gap-1 transition-colors"
        >
          <span>Profile</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
