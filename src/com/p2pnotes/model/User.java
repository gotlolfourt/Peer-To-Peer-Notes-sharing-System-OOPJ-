package com.p2pnotes.model;

import java.util.ArrayList;

/**
 * Represents a Peer (Student/User) in the Peer-to-Peer Notes Sharing System.
 * In a P2P architecture, each user is an independent peer holding both shared
 * and locally downloaded notes.
 * 
 * Demonstrates:
 * - Encapsulation (private fields, getters, setters) (Module 02, Experiment 2)
 * - ArrayList (java.util.ArrayList) for dynamic collections (Module 05, Experiment 5)
 * - Static nested class (PeerStats) (Module 02, Experiment 2)
 * - String comparison (equals) (Module 05, Experiment 1)
 */
public class User {
    private String username;
    private String password;
    private String fullName;
    private String department;
    private int reputationScore;

    // ArrayLists representing this peer's local storage:
    private ArrayList<BaseNote> sharedNotes;     // Notes this peer shares with network
    private ArrayList<BaseNote> downloadedNotes; // Notes this peer has copied from other peers

    // Static nested class demonstrating Module 02 inner class concept
    public static class PeerStats {
        private int sharedCount;
        private int downloadedCount;
        private int totalViewsReceived;

        public PeerStats(int sharedCount, int downloadedCount, int totalViewsReceived) {
            this.sharedCount = sharedCount;
            this.downloadedCount = downloadedCount;
            this.totalViewsReceived = totalViewsReceived;
        }

        public void printSummary() {
            System.out.println("  Shared Notes Contributed : " + this.sharedCount);
            System.out.println("  Downloaded Notes Copied  : " + this.downloadedCount);
            System.out.println("  Total Note Views Earned  : " + this.totalViewsReceived);
        }
    }

    public User(String username, String password, String fullName, String department) {
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.department = department;
        this.reputationScore = 10; // Default starting reputation
        this.sharedNotes = new ArrayList<BaseNote>();
        this.downloadedNotes = new ArrayList<BaseNote>();
    }

    // Getters and Setters
    public String getUsername() {
        return this.username;
    }

    public String getFullName() {
        return this.fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getDepartment() {
        return this.department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public int getReputationScore() {
        return this.reputationScore;
    }

    public void addReputation(int points) {
        this.reputationScore += points;
    }

    public ArrayList<BaseNote> getSharedNotes() {
        return this.sharedNotes;
    }

    public ArrayList<BaseNote> getDownloadedNotes() {
        return this.downloadedNotes;
    }

    // Check credentials (exact content comparison with equals)
    public boolean verifyPassword(String inputPassword) {
        return this.password.equals(inputPassword);
    }

    // Add a note created by this peer
    public void addSharedNote(BaseNote note) {
        this.sharedNotes.add(note);
        this.reputationScore += 5; // Reward peer for contributing notes
    }

    // Remove a shared note owned by this peer
    public boolean removeSharedNote(int noteId) {
        for (int i = 0; i < this.sharedNotes.size(); i++) {
            BaseNote note = this.sharedNotes.get(i);
            if (note.getNoteId() == noteId) {
                this.sharedNotes.remove(i);
                return true;
            }
        }
        return false;
    }

    // Add downloaded note to local collection
    public boolean saveDownloadedNote(BaseNote note) {
        // Prevent duplicate download of the same note
        for (BaseNote existing : this.downloadedNotes) {
            if (existing.getNoteId() == note.getNoteId()) {
                return false;
            }
        }
        this.downloadedNotes.add(note);
        return true;
    }

    // Get statistics using the static nested class
    public PeerStats calculateStats() {
        int totalViews = 0;
        for (BaseNote note : this.sharedNotes) {
            totalViews += note.getAccessCount();
        }
        return new PeerStats(this.sharedNotes.size(), this.downloadedNotes.size(), totalViews);
    }

    public void displayProfile() {
        System.out.println("\n----------------- PEER PROFILE -----------------");
        System.out.println("Username         : @" + this.username);
        System.out.println("Full Name        : " + this.fullName);
        System.out.println("Department       : " + this.department);
        System.out.println("Reputation Pts   : " + this.reputationScore);
        PeerStats stats = calculateStats();
        stats.printSummary();
        System.out.println("------------------------------------------------\n");
    }
}
