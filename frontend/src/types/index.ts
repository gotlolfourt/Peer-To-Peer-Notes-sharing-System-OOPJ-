export type NoteType = 'LECTURE_NOTE' | 'CHEAT_SHEET';
export type Department = 'CSE' | 'AIML' | 'ECE' | 'MECHANICAL' | 'GENERAL';
export type UserRole = 'STUDENT' | 'FACULTY';

export interface BaseNoteItem {
  id: number;
  title: string;
  author: string;
  authorUsername: string;
  department: Department;
  noteType: NoteType;
  accessCount: number;
  rating: number;
  uploadedAt: string;
  fileSize: string;
  tags: string[];
  content?: string;
  // Lecture Note specific
  courseCode?: string;
  professorName?: string;
  lectureNumber?: number;
  // Cheat Sheet specific
  examTarget?: string;
  keyFormulas?: string[];
  keyPointsSummary?: string;
}

export interface PeerProfile {
  username: string;
  fullName: string;
  department: Department;
  role: UserRole;
  reputationScore: number;
  sharedNotesCount: number;
  downloadedNotesCount: number;
  avatarSeed: string;
  status: 'online' | 'idle' | 'offline';
  bio: string;
  // Specialized Student fields
  studentId?: string;
  semester?: number;
  // Specialized Faculty fields
  designation?: string;
  cabinNumber?: string;
}

export interface NetworkStats {
  totalNotesShared: number;
  activePeers: number;
  totalDownloads: number;
  subjectsCovered: number;
  activeTransfersNow: number;
}

export interface TransferRequest {
  id: string;
  noteId: number;
  noteTitle: string;
  downloaderUsername: string;
  progress: number;
  status: 'queued' | 'transferring' | 'completed' | 'failed';
  startedAt: string;
}
