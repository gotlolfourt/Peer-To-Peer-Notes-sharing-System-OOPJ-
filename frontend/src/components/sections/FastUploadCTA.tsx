import React from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, ArrowUpRight, Sparkles, BookOpen } from 'lucide-react';

export const FastUploadCTA: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl bg-gradient-to-br from-ink-charcoal via-ink-surface to-ink-elevated border border-lime/40 p-8 sm:p-14 overflow-hidden shadow-glow-lime/20 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Glow shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-lime/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-2xl space-y-4 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime/15 border border-lime/30 text-[11px] font-mono text-lime font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INSTANT CAMPUS REPUTATION</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-ivory tracking-tight leading-tight">
            Got clean lecture notes or formula sheets? <br />
            <span className="font-serif italic font-normal text-lime">Share them with the campus.</span>
          </h2>

          <p className="text-sm text-ivory-muted leading-relaxed">
            Drag and drop your notes in seconds. Tag your course code, add key formulas, and help hundreds of peers pass their upcoming semester exams.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto z-10">
          <Link
            to="/upload"
            className="btn-primary w-full sm:w-auto px-8 py-4 rounded-full text-xs font-heading font-bold flex items-center justify-center gap-2 shadow-glow-lime whitespace-nowrap"
          >
            <UploadCloud className="w-4 h-4 text-ink" />
            <span>Open Note Upload Studio</span>
            <ArrowUpRight className="w-4 h-4 text-ink" />
          </Link>
        </div>
      </div>
    </section>
  );
};
