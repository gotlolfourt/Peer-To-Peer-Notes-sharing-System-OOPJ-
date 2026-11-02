import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Department, NoteType } from '../types';
import confetti from 'canvas-confetti';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  GraduationCap, 
  Check, 
  AlertCircle, 
  Plus, 
  Trash2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const UploadPage: React.FC = () => {
  const { currentUser, addSharedNote } = useAuth();
  const navigate = useNavigate();

  const [noteType, setNoteType] = useState<NoteType>('LECTURE_NOTE');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState<Department>('CSE');
  const [tagsInput, setTagsInput] = useState('');
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Lecture Note fields
  const [courseCode, setCourseCode] = useState('');
  const [professorName, setProfessorName] = useState('');
  const [lectureNumber, setLectureNumber] = useState(1);
  const [content, setContent] = useState('');

  // Cheat Sheet fields
  const [examTarget, setExamTarget] = useState('');
  const [formulas, setFormulas] = useState<string[]>(['']);
  const [keyPointsSummary, setKeyPointsSummary] = useState('');

  // Upload progress & state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileDetails({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      });
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileDetails({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      });
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
    }
  };

  const addFormulaField = () => {
    setFormulas([...formulas, '']);
  };

  const updateFormula = (index: number, val: string) => {
    const updated = [...formulas];
    updated[index] = val;
    setFormulas(updated);
  };

  const removeFormula = (index: number) => {
    setFormulas(formulas.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Please provide a title for the note.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    // Simulate animated upload progression
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 150);

    const processedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title: title.trim(),
      author: currentUser?.fullName || 'Anonymous Peer',
      authorUsername: currentUser?.username || 'anonymous',
      department,
      noteType,
      fileSize: fileDetails ? fileDetails.size : '1.8 MB',
      tags: processedTags.length > 0 ? processedTags : [department, noteType === 'LECTURE_NOTE' ? 'Lecture' : 'Formulas'],
      content,
      courseCode,
      professorName,
      lectureNumber,
      examTarget,
      keyFormulas: formulas.filter((f) => f.trim().length > 0),
      keyPointsSummary,
    };

    setTimeout(async () => {
      clearInterval(interval);
      setUploadProgress(100);

      const created = await api.uploadNote(payload);
      addSharedNote(created);

      setIsUploading(false);
      setUploadSuccess(true);

      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D5F36A', '#A5B89B', '#F1EFE5'],
      });
    }, 900);
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-10 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime/10 border border-lime/30 text-lime badge-mono font-semibold">
          <UploadCloud className="w-4 h-4" />
          <span>CONTRIBUTE TO THE KNOWLEDGE MESH</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-ivory tracking-tight">
          SHARE YOUR <br />
          <span className="font-serif italic font-normal text-lime">lecture notes or cheat-sheet.</span>
        </h1>
        <p className="text-sm text-ivory-muted max-w-xl mx-auto leading-relaxed">
          Help peers across your campus excel. Every shared note automatically awards you reputation points and integrates into the P2P search registry.
        </p>
      </div>

      {uploadSuccess ? (
        /* Success State */
        <div className="p-10 rounded-3xl bg-ink-charcoal border border-lime/40 text-center space-y-6 shadow-glow-lime/20 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-lime text-ink flex items-center justify-center mx-auto font-bold shadow-glow-lime">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <div className="space-y-2">
            <span className="badge-mono text-lime font-bold">TRANSACTION VERIFIED</span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-ivory">
              Note Published Successfully!
            </h2>
            <p className="text-xs text-ivory-muted max-w-md mx-auto">
              Your note <strong>"{title}"</strong> has been broadcast to the P2P network. You have been awarded <span className="text-lime font-bold">+5 Reputation Points</span>!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setUploadSuccess(false);
                setTitle('');
                setContent('');
                setFileDetails(null);
              }}
              className="btn-secondary w-full sm:w-auto px-6 py-3 rounded-full text-xs font-heading font-medium"
            >
              Upload Another Note
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary w-full sm:w-auto px-6 py-3 rounded-full text-xs font-heading font-bold shadow-glow-lime"
            >
              View in My Dashboard
            </button>
          </div>
        </div>
      ) : (
        /* Upload Form */
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Note Type Selector Tabs */}
          <div className="p-2 rounded-2xl bg-ink-charcoal border border-sage-border/60 grid grid-cols-2 gap-2 shadow-card-dark">
            <button
              type="button"
              onClick={() => setNoteType('LECTURE_NOTE')}
              className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-heading font-semibold flex items-center justify-center gap-2 transition-all ${
                noteType === 'LECTURE_NOTE'
                  ? 'bg-lime text-ink shadow-glow-lime/30'
                  : 'text-ivory-muted hover:text-ivory hover:bg-ink-surface'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Classroom Lecture Note</span>
            </button>

            <button
              type="button"
              onClick={() => setNoteType('CHEAT_SHEET')}
              className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-heading font-semibold flex items-center justify-center gap-2 transition-all ${
                noteType === 'CHEAT_SHEET'
                  ? 'bg-lime text-ink shadow-glow-lime/30'
                  : 'text-ivory-muted hover:text-ivory hover:bg-ink-surface'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Revision / Cheat-Sheet</span>
            </button>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 ${
              isDragging
                ? 'border-lime bg-lime/5 scale-[1.01]'
                : fileDetails
                ? 'border-lime/60 bg-ink-charcoal/80'
                : 'border-sage-border bg-ink-charcoal/40 hover:border-sage'
            }`}
          >
            <input
              type="file"
              id="file-upload"
              onChange={handleFileSelect}
              accept=".pdf,.txt,.docx,.md,.java"
              className="hidden"
            />

            <label htmlFor="file-upload" className="cursor-pointer space-y-3 block">
              <div className="w-14 h-14 rounded-2xl bg-ink-surface border border-sage-border text-lime flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <UploadCloud className="w-7 h-7" />
              </div>

              {fileDetails ? (
                <div>
                  <span className="badge-mono text-lime font-bold block mb-1">FILE ATTACHED</span>
                  <div className="font-heading font-bold text-base text-ivory">{fileDetails.name}</div>
                  <div className="font-mono text-xs text-ivory-dim">{fileDetails.size} • Click to replace</div>
                </div>
              ) : (
                <div>
                  <div className="font-heading font-bold text-base text-ivory">
                    Drag and drop your note document here
                  </div>
                  <div className="text-xs text-ivory-muted mt-1">
                    Supports PDF, TXT, DOCX, MD, or Java source files (up to 10 MB)
                  </div>
                </div>
              )}
            </label>
          </div>

          {/* General Metadata Section */}
          <div className="rounded-2xl bg-ink-charcoal border border-sage-border/60 p-6 sm:p-8 space-y-6 shadow-card-dark">
            <h3 className="badge-mono text-lime font-semibold">1. GENERAL METADATA</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Title */}
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-mono text-ivory-muted">NOTE TITLE *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Java OOP Principles & Polymorphism"
                  className="w-full px-4 py-3 rounded-xl bg-ink-surface border border-sage-border focus:border-lime focus:outline-none text-xs sm:text-sm text-ivory font-mono"
                  required
                />
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-ivory-muted">DEPARTMENT *</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as Department)}
                  className="w-full px-4 py-3 rounded-xl bg-ink-surface border border-sage-border focus:border-lime focus:outline-none text-xs sm:text-sm text-ivory font-mono cursor-pointer"
                >
                  <option value="CSE">CSE</option>
                  <option value="AIML">AIML</option>
                  <option value="ECE">ECE</option>
                  <option value="MECHANICAL">MECHANICAL</option>
                  <option value="GENERAL">GENERAL</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-ivory-muted">TAGS (Comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Java, OOP, Polymorphism, ExamRevision"
                className="w-full px-4 py-3 rounded-xl bg-ink-surface border border-sage-border focus:border-lime focus:outline-none text-xs sm:text-sm text-ivory font-mono"
              />
            </div>
          </div>

          {/* Dynamic Section: Lecture Note Specific */}
          {noteType === 'LECTURE_NOTE' && (
            <div className="rounded-2xl bg-ink-charcoal border border-sage-border/60 p-6 sm:p-8 space-y-6 shadow-card-dark animate-fadeIn">
              <h3 className="badge-mono text-lime font-semibold flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                <span>2. LECTURE NOTE ATTRIBUTES</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-ivory-muted">COURSE CODE</label>
                  <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="e.g. PCC12CE07"
                    className="w-full px-4 py-3 rounded-xl bg-ink-surface border border-sage-border focus:border-lime focus:outline-none text-xs sm:text-sm text-ivory font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-ivory-muted">PROFESSOR NAME</label>
                  <input
                    type="text"
                    value={professorName}
                    onChange={(e) => setProfessorName(e.target.value)}
                    placeholder="e.g. Dr. Sharma"
                    className="w-full px-4 py-3 rounded-xl bg-ink-surface border border-sage-border focus:border-lime focus:outline-none text-xs sm:text-sm text-ivory font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-ivory-muted">LECTURE NUMBER</label>
                  <input
                    type="number"
                    value={lectureNumber}
                    min="1"
                    onChange={(e) => setLectureNumber(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 rounded-xl bg-ink-surface border border-sage-border focus:border-lime focus:outline-none text-xs sm:text-sm text-ivory font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-ivory-muted">NOTES BODY CONTENT / SUMMARY</label>
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste lecture content, key definitions, sample code, or topics covered..."
                  className="w-full px-4 py-3 rounded-xl bg-ink-surface border border-sage-border focus:border-lime focus:outline-none text-xs sm:text-sm text-ivory font-mono resize-y"
                />
              </div>
            </div>
          )}

          {/* Dynamic Section: Cheat Sheet Specific */}
          {noteType === 'CHEAT_SHEET' && (
            <div className="rounded-2xl bg-ink-charcoal border border-sage-border/60 p-6 sm:p-8 space-y-6 shadow-card-dark animate-fadeIn">
              <h3 className="badge-mono text-lime font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>2. REVISION CHEAT-SHEET ATTRIBUTES</span>
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-mono text-ivory-muted">TARGET EXAM</label>
                <input
                  type="text"
                  value={examTarget}
                  onChange={(e) => setExamTarget(e.target.value)}
                  placeholder="e.g. Semester 4 End-Sem / Mid-Term 2"
                  className="w-full px-4 py-3 rounded-xl bg-ink-surface border border-sage-border focus:border-lime focus:outline-none text-xs sm:text-sm text-ivory font-mono"
                />
              </div>

              {/* Formula List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-ivory-muted">KEY FORMULAS</label>
                  <button
                    type="button"
                    onClick={addFormulaField}
                    className="text-xs font-mono text-lime hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Formula</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formulas.map((formula, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formula}
                        onChange={(e) => updateFormula(idx, e.target.value)}
                        placeholder={`Formula #${idx + 1}: e.g. Accuracy = (TP + TN) / Total`}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-ink-surface border border-sage-border focus:border-lime focus:outline-none text-xs text-ivory font-mono"
                      />
                      {formulas.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFormula(idx)}
                          className="p-2.5 rounded-xl bg-ink-elevated text-ivory-dim hover:text-red-400 border border-sage-border"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Points */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-ivory-muted">HIGH-YIELD SUMMARY BULLETS (Semicolon separated)</label>
                <textarea
                  rows={4}
                  value={keyPointsSummary}
                  onChange={(e) => setKeyPointsSummary(e.target.value)}
                  placeholder="Supervised learning has labeled data; Unsupervised has unlabelled clusters; Overfitting is penalized via L1/L2 regularization..."
                  className="w-full px-4 py-3 rounded-xl bg-ink-surface border border-sage-border focus:border-lime focus:outline-none text-xs text-ivory font-mono"
                />
              </div>
            </div>
          )}

          {/* Error Message Display */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Upload Progress Bar if active */}
          {isUploading && (
            <div className="space-y-2 animate-fadeIn">
              <div className="flex justify-between text-xs font-mono text-ivory-dim">
                <span>Transmitting note payload to peer network...</span>
                <span className="text-lime">{uploadProgress}%</span>
              </div>
              <div className="h-2 w-full bg-ink-surface rounded-full overflow-hidden border border-sage-border/50">
                <div
                  className="h-full bg-lime transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/explore')}
              className="px-6 py-3 rounded-full text-xs font-heading font-medium text-ivory hover:text-lime"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="btn-primary px-8 py-3.5 rounded-full text-xs font-heading font-bold flex items-center gap-2 shadow-glow-lime"
            >
              <UploadCloud className="w-4 h-4 text-ink" />
              <span>{isUploading ? 'Publishing Note...' : 'Publish to P2P Network'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
