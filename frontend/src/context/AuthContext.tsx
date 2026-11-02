import React, { createContext, useContext, useState, useEffect } from 'react';
import { PeerProfile, BaseNoteItem } from '../types';
import { MOCK_PEERS, MOCK_NOTES } from '../services/mockData';

interface AuthContextType {
  currentUser: PeerProfile | null;
  isAuthenticated: boolean;
  login: (username: string, role?: 'STUDENT' | 'FACULTY') => boolean;
  logout: () => void;
  myDownloadedNotes: BaseNoteItem[];
  mySharedNotes: BaseNoteItem[];
  downloadNote: (note: BaseNoteItem) => void;
  addSharedNote: (note: BaseNoteItem) => void;
  removeSharedNote: (noteId: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Alice as active peer for immediate rich interactive experience
  const [currentUser, setCurrentUser] = useState<PeerProfile | null>(MOCK_PEERS[0]);
  const [myDownloadedNotes, setMyDownloadedNotes] = useState<BaseNoteItem[]>([MOCK_NOTES[1], MOCK_NOTES[2]]);
  const [mySharedNotes, setMySharedNotes] = useState<BaseNoteItem[]>([MOCK_NOTES[0], MOCK_NOTES[4]]);

  useEffect(() => {
    // Sync shared notes when user changes
    if (currentUser) {
      const authored = MOCK_NOTES.filter(
        (n) => n.authorUsername.toLowerCase() === currentUser.username.toLowerCase()
      );
      setMySharedNotes(authored);
    }
  }, [currentUser]);

  const login = (username: string, _role?: 'STUDENT' | 'FACULTY'): boolean => {
    const found = MOCK_PEERS.find((p) => p.username.toLowerCase() === username.toLowerCase().trim());
    if (found) {
      setCurrentUser(found);
      return true;
    }
    // Create new student session if not found in mock list
    const newSession: PeerProfile = {
      username: username.toLowerCase().trim(),
      fullName: username.charAt(0).toUpperCase() + username.slice(1),
      department: 'CSE',
      role: _role || 'STUDENT',
      reputationScore: _role === 'FACULTY' ? 50 : 15,
      sharedNotesCount: 0,
      downloadedNotesCount: 0,
      avatarSeed: username,
      status: 'online',
      bio: 'P2P Network Explorer & Knowledge Contributor',
    };
    setCurrentUser(newSession);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const downloadNote = (note: BaseNoteItem) => {
    if (!myDownloadedNotes.some((n) => n.id === note.id)) {
      setMyDownloadedNotes((prev) => [note, ...prev]);
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          downloadedNotesCount: currentUser.downloadedNotesCount + 1,
          reputationScore: currentUser.reputationScore + 1,
        });
      }
    }
  };

  const addSharedNote = (note: BaseNoteItem) => {
    setMySharedNotes((prev) => [note, ...prev]);
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        sharedNotesCount: currentUser.sharedNotesCount + 1,
        reputationScore: currentUser.reputationScore + 5, // Reward for contribution
      });
    }
  };

  const removeSharedNote = (noteId: number) => {
    setMySharedNotes((prev) => prev.filter((n) => n.id !== noteId));
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        sharedNotesCount: Math.max(0, currentUser.sharedNotesCount - 1),
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        myDownloadedNotes,
        mySharedNotes,
        downloadNote,
        addSharedNote,
        removeSharedNote,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
