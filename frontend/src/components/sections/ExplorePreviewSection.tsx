import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_NOTES } from '../../services/mockData';
import { BaseNoteItem } from '../../types';
import { NoteCard } from '../common/NoteCard';
import { Compass, ArrowRight, Filter, Sparkles, BookOpen } from 'lucide-react';

interface ExplorePreviewProps {
  onPreviewNote: (note: BaseNoteItem) => void;
}

export const ExplorePreviewSection: React.FC<ExplorePreviewProps> = ({ onPreviewNote }) => {
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'LECTURE_NOTE' | 'CHEAT_SHEET'>('ALL');

  const departments = ['ALL', 'CSE', 'AIML', 'ECE', 'MECHANICAL', 'GENERAL'];

  const filteredNotes = MOCK_NOTES.filter((note) => {
    const matchDept = selectedDept === 'ALL' || note.department === selectedDept;
    const matchType = typeFilter === 'ALL' || note.noteType === typeFilter;
    return matchDept && matchType;
  });

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-sage-border/40">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <span className="badge-mono text-lime font-semibold block mb-2">CURATED PEER REGISTRY</span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-ivory tracking-tight">
            EXPLORE VERIFIED <br />
            <span className="font-serif italic font-normal text-lime">academic notes.</span>
          </h2>
        </div>

        {/* Note Type Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-ink-charcoal border border-sage-border rounded-xl self-start md:self-auto">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-heading transition-all ${
              typeFilter === 'ALL' ? 'bg-lime text-ink font-semibold' : 'text-ivory-muted hover:text-ivory'
            }`}
          >
            All Notes
          </button>
          <button
            onClick={() => setTypeFilter('LECTURE_NOTE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-heading transition-all ${
              typeFilter === 'LECTURE_NOTE' ? 'bg-lime text-ink font-semibold' : 'text-ivory-muted hover:text-ivory'
            }`}
          >
            Lectures Only
          </button>
          <button
            onClick={() => setTypeFilter('CHEAT_SHEET')}
            className={`px-3 py-1.5 rounded-lg text-xs font-heading transition-all ${
              typeFilter === 'CHEAT_SHEET' ? 'bg-lime text-ink font-semibold' : 'text-ivory-muted hover:text-ivory'
            }`}
          >
            Cheat Sheets
          </button>
        </div>
      </div>

      {/* Department Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-4 py-2 rounded-full text-xs font-heading font-medium tracking-wide transition-all whitespace-nowrap ${
              selectedDept === dept
                ? 'bg-ink-surface text-lime border border-lime shadow-glow-lime/20'
                : 'bg-ink-charcoal text-ivory-muted border border-sage-border hover:border-sage'
            }`}
          >
            {dept === 'ALL' ? 'All Departments' : dept}
          </button>
        ))}
      </div>

      {/* Note Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.slice(0, 6).map((note) => (
          <NoteCard key={note.id} note={note} onPreview={onPreviewNote} />
        ))}
      </div>

      {/* View All CTA */}
      <div className="mt-12 text-center">
        <Link
          to="/explore"
          className="btn-secondary inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-heading"
        >
          <span>Open Full Interactive Notes Library ({MOCK_NOTES.length} total notes)</span>
          <ArrowRight className="w-4 h-4 text-lime" />
        </Link>
      </div>
    </section>
  );
};
