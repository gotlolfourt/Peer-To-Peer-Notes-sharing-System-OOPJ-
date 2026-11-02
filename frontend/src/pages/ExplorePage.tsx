import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BaseNoteItem } from '../types';
import { NoteCard } from '../components/common/NoteCard';
import { NotePreviewModal } from '../components/modals/NotePreviewModal';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Compass, 
  SlidersHorizontal, 
  ArrowUpDown, 
  X,
  FileQuestion
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [notes, setNotes] = useState<BaseNoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedType, setSelectedType] = useState<'ALL' | 'LECTURE_NOTE' | 'CHEAT_SHEET'>('ALL');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'rating'>('popular');
  const [selectedNote, setSelectedNote] = useState<BaseNoteItem | null>(null);

  const departments = ['ALL', 'CSE', 'AIML', 'ECE', 'MECHANICAL', 'GENERAL'];

  useEffect(() => {
    window.scrollTo(0, 0);
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    const res = await api.getNotes();
    setNotes(res.notes);
    setLoading(false);
  };

  // Filter & Sort pipeline
  const filteredNotes = notes.filter((note) => {
    const matchDept = selectedDept === 'ALL' || note.department.toUpperCase() === selectedDept.toUpperCase();
    const matchType = selectedType === 'ALL' || note.noteType === selectedType;
    const cleanQ = searchQuery.toLowerCase().trim();
    const matchQuery =
      cleanQ === '' ||
      note.title.toLowerCase().includes(cleanQ) ||
      note.author.toLowerCase().includes(cleanQ) ||
      (note.courseCode && note.courseCode.toLowerCase().includes(cleanQ)) ||
      (note.professorName && note.professorName.toLowerCase().includes(cleanQ)) ||
      note.tags.some((t) => t.toLowerCase().includes(cleanQ));

    return matchDept && matchType && matchQuery;
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.accessCount - a.accessCount;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.id - a.id;
  });

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Page Header */}
      <div className="mb-10 space-y-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-lime" />
          <span className="badge-mono text-lime font-semibold">PEER KNOWLEDGE DIRECTORY</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-ivory tracking-tight">
          EXPLORE SHARED <br />
          <span className="font-serif italic font-normal text-lime">lecture notes & cheat-sheets.</span>
        </h1>
        <p className="text-sm text-ivory-muted max-w-2xl leading-relaxed">
          Access high-yield syllabus summaries, formulas, and classroom notes uploaded by verified college peers. Download straight to your local cache.
        </p>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="rounded-2xl bg-ink-charcoal border border-sage-border/60 p-4 sm:p-6 mb-8 space-y-4 shadow-card-dark">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-dim" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by title, professor, course code (e.g. PCC12CE07), or keyword..."
            className="w-full pl-11 pr-10 py-3.5 rounded-xl bg-ink-surface border border-sage-border focus:border-lime focus:outline-none text-xs sm:text-sm text-ivory placeholder-ivory-dim font-mono transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-ivory-dim hover:text-ivory"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Rows */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
          {/* Department Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-heading whitespace-nowrap transition-all ${
                  selectedDept === dept
                    ? 'bg-lime text-ink font-semibold shadow-glow-lime/20'
                    : 'bg-ink-surface text-ivory-muted hover:text-ivory border border-sage-border/40'
                }`}
              >
                {dept === 'ALL' ? 'All Depts' : dept}
              </button>
            ))}
          </div>

          {/* Type & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Type toggle */}
            <div className="flex items-center bg-ink-surface p-1 rounded-xl border border-sage-border/40 text-xs">
              <button
                onClick={() => setSelectedType('ALL')}
                className={`px-3 py-1 rounded-lg font-heading transition-all ${
                  selectedType === 'ALL' ? 'bg-ink-elevated text-lime font-bold' : 'text-ivory-muted'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedType('LECTURE_NOTE')}
                className={`px-3 py-1 rounded-lg font-heading transition-all ${
                  selectedType === 'LECTURE_NOTE' ? 'bg-ink-elevated text-lime font-bold' : 'text-ivory-muted'
                }`}
              >
                Lectures
              </button>
              <button
                onClick={() => setSelectedType('CHEAT_SHEET')}
                className={`px-3 py-1 rounded-lg font-heading transition-all ${
                  selectedType === 'CHEAT_SHEET' ? 'bg-ink-elevated text-lime font-bold' : 'text-ivory-muted'
                }`}
              >
                Cheat Sheets
              </button>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-ink-surface px-3 py-1.5 rounded-xl border border-sage-border/40 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-lime" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-ivory font-mono focus:outline-none cursor-pointer"
              >
                <option value="popular" className="bg-ink text-ivory">Most Popular (Views)</option>
                <option value="rating" className="bg-ink text-ivory">Highest Rated</option>
                <option value="recent" className="bg-ink text-ivory">Recently Shared</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs font-mono text-ivory-dim mb-6">
        <span>Showing {filteredNotes.length} matching academic notes</span>
        {searchQuery && (
          <span>Filtering for: <strong className="text-lime">"{searchQuery}"</strong></span>
        )}
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-ink-charcoal/50 animate-pulse border border-sage-border/30" />
          ))}
        </div>
      ) : filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} onPreview={(n) => setSelectedNote(n)} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-16 rounded-3xl bg-ink-charcoal border border-sage-border/50 text-center max-w-md mx-auto my-12 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-ink-surface border border-sage-border text-lime flex items-center justify-center mx-auto">
            <FileQuestion className="w-7 h-7" />
          </div>
          <h3 className="font-heading font-bold text-lg text-ivory">No Notes Found</h3>
          <p className="text-xs text-ivory-muted leading-relaxed">
            We couldn't find any shared notes matching your search or filters. Try adjusting your search keyword or clear filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDept('ALL');
              setSelectedType('ALL');
            }}
            className="btn-secondary px-5 py-2 rounded-full text-xs font-heading font-medium"
          >
            Reset Search Filters
          </button>
        </div>
      )}

      {/* Note Detailed Preview Modal */}
      <NotePreviewModal note={selectedNote} onClose={() => setSelectedNote(null)} />
    </div>
  );
};
