import { BaseNoteItem, PeerProfile, NetworkStats } from '../types';
import { MOCK_NOTES, MOCK_PEERS, MOCK_STATS } from './mockData';

const API_BASE_URL = 'http://localhost:7070/api';

class ApiService {
  private isLiveBackend: boolean | null = null;
  private localNotes: BaseNoteItem[] = [...MOCK_NOTES];
  private localPeers: PeerProfile[] = [...MOCK_PEERS];

  /**
   * Probes whether the Java REST API server is responding on http://localhost:7070
   */
  async checkBackendHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${API_BASE_URL}/stats`, { signal: controller.signal });
      clearTimeout(timeoutId);
      this.isLiveBackend = res.ok;
      return res.ok;
    } catch {
      this.isLiveBackend = false;
      return false;
    }
  }

  isLive(): boolean {
    return this.isLiveBackend === true;
  }

  /**
   * Fetches all public notes
   */
  async getNotes(): Promise<{ notes: BaseNoteItem[]; source: 'live_backend' | 'mock_network' }> {
    try {
      const res = await fetch(`${API_BASE_URL}/notes`);
      if (res.ok) {
        const data = await res.json();
        this.isLiveBackend = true;
        // Transform backend response if needed
        const liveNotes: BaseNoteItem[] = (data.notes || []).map((n: any) => ({
          id: n.noteId,
          title: n.title,
          author: n.author,
          authorUsername: n.author.toLowerCase().replace(/\s+/g, '_'),
          department: n.department || 'GENERAL',
          noteType: n.type === 'CHEATSHEET' ? 'CHEAT_SHEET' : 'LECTURE_NOTE',
          accessCount: n.views || 0,
          rating: 4.8,
          uploadedAt: 'Synced from Java P2P Registry',
          fileSize: '1.5 MB',
          tags: [n.department || 'General', n.type || 'Notes'],
          content: 'Content verified on P2P Network Registry.',
        }));
        return { notes: liveNotes.length > 0 ? liveNotes : this.localNotes, source: 'live_backend' };
      }
    } catch {
      // Backend not running; fallback to mock network
    }
    this.isLiveBackend = false;
    return { notes: this.localNotes, source: 'mock_network' };
  }

  /**
   * Search notes by keyword and department
   */
  async searchNotes(keyword: string, department: string = 'ALL'): Promise<BaseNoteItem[]> {
    try {
      const url = `${API_BASE_URL}/notes/search?keyword=${encodeURIComponent(keyword)}&dept=${encodeURIComponent(department)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return (data.notes || []).map((n: any) => ({
          id: n.noteId,
          title: n.title,
          author: n.author,
          authorUsername: n.author.toLowerCase().replace(/\s+/g, '_'),
          department: n.department,
          noteType: n.type === 'CHEATSHEET' ? 'CHEAT_SHEET' : 'LECTURE_NOTE',
          accessCount: n.views,
          rating: 4.9,
          uploadedAt: 'Just now',
          fileSize: '2.0 MB',
          tags: [n.department],
        }));
      }
    } catch {
      // Fallback local filter
    }

    const cleanKw = keyword.toLowerCase().trim();
    const cleanDept = department.trim().toUpperCase();

    return this.localNotes.filter((note) => {
      const matchDept = cleanDept === 'ALL' || cleanDept === '' || note.department.toUpperCase() === cleanDept;
      const matchQuery =
        cleanKw === '' ||
        note.title.toLowerCase().includes(cleanKw) ||
        note.author.toLowerCase().includes(cleanKw) ||
        note.tags.some((t) => t.toLowerCase().includes(cleanKw));
      return matchDept && matchQuery;
    });
  }

  /**
   * Retrieve note by ID
   */
  async getNoteById(id: number): Promise<BaseNoteItem | null> {
    const found = this.localNotes.find((n) => n.id === id);
    if (found) return found;

    try {
      const res = await fetch(`${API_BASE_URL}/notes/download?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        return {
          id: data.noteId,
          title: `Note #${data.noteId}`,
          author: 'P2P Contributor',
          authorUsername: 'p2p_peer',
          department: 'GENERAL',
          noteType: 'LECTURE_NOTE',
          accessCount: 1,
          rating: 4.8,
          uploadedAt: 'Live P2P Stream',
          fileSize: '1.2 MB',
          tags: ['P2P'],
          content: data.content,
        };
      }
    } catch {
      // Offline
    }
    return null;
  }

  /**
   * Upload / publish a new note
   */
  async uploadNote(newNote: Omit<BaseNoteItem, 'id' | 'accessCount' | 'rating' | 'uploadedAt'>): Promise<BaseNoteItem> {
    const created: BaseNoteItem = {
      ...newNote,
      id: Math.floor(Math.random() * 9000) + 1000,
      accessCount: 0,
      rating: 5.0,
      uploadedAt: 'Just now',
    };

    try {
      const res = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: created.title,
          author: created.author,
          department: created.department,
          username: created.authorUsername,
          content: created.content || 'Uploaded note content.',
          courseCode: created.courseCode,
          professorName: created.professorName,
        }),
      });
      if (res.ok) {
        this.isLiveBackend = true;
      }
    } catch {
      // Keep local
    }

    this.localNotes.unshift(created);
    return created;
  }

  /**
   * Delete / unpublish a note
   */
  async deleteNote(id: number, username: string): Promise<boolean> {
    this.localNotes = this.localNotes.filter((n) => n.id !== id);
    try {
      await fetch(`${API_BASE_URL}/notes?id=${id}&username=${encodeURIComponent(username)}`, {
        method: 'DELETE',
      });
    } catch {
      // Local removal completed
    }
    return true;
  }

  /**
   * Get network stats
   */
  async getStats(): Promise<NetworkStats> {
    try {
      const res = await fetch(`${API_BASE_URL}/stats`);
      if (res.ok) {
        const data = await res.json();
        return {
          totalNotesShared: data.notesShared || this.localNotes.length,
          activePeers: data.registeredUsers || MOCK_STATS.activePeers,
          totalDownloads: data.totalDownloads || MOCK_STATS.totalDownloads,
          subjectsCovered: 18,
          activeTransfersNow: data.activeTransfers || 0,
        };
      }
    } catch {
      // Fallback
    }
    return {
      ...MOCK_STATS,
      totalNotesShared: this.localNotes.length,
    };
  }

  /**
   * Get peer profile by username
   */
  async getPeer(username: string): Promise<PeerProfile | null> {
    return this.localPeers.find((p) => p.username.toLowerCase() === username.toLowerCase()) || null;
  }

  /**
   * Get all peers
   */
  async getAllPeers(): Promise<PeerProfile[]> {
    return this.localPeers;
  }

  /**
   * Register a new user
   */
  async registerUser(userData: {
    username: string;
    fullName: string;
    department: string;
    role: 'STUDENT' | 'FACULTY';
    password?: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        return { success: true, message: 'User registered successfully on Java P2P Network!' };
      }
    } catch {
      // Fallback local register
    }

    const exists = this.localPeers.some((p) => p.username.toLowerCase() === userData.username.toLowerCase());
    if (exists) {
      return { success: false, message: 'Username is already taken!' };
    }

    const newPeer: PeerProfile = {
      username: userData.username,
      fullName: userData.fullName,
      department: (userData.department as any) || 'GENERAL',
      role: userData.role,
      reputationScore: userData.role === 'FACULTY' ? 50 : 10,
      sharedNotesCount: 0,
      downloadedNotesCount: 0,
      avatarSeed: userData.username,
      status: 'online',
      bio: `${userData.role} member in ${userData.department} department.`,
    };

    this.localPeers.push(newPeer);
    return { success: true, message: 'Registration complete (Local P2P Peer Created)!' };
  }
}

export const api = new ApiService();
