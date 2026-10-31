package com.p2pnotes.model;

import com.p2pnotes.auth.Authenticatable;
import java.util.ArrayList;

/**
 * Represents a Peer (Student/User) in the Peer-to-Peer Notes Sharing System.
 * In a P2P architecture, each user is an independent peer holding both shared
 * and locally downloaded notes.
 * 
 * Demonstrates:
 * - Implementing Interfaces (implements Authenticatable)
 * - Encapsulation (private fields, getters, setters)
 * - Static variables (tracked user count)
 * - Method Overloading (searchNotes by keyword, and by keyword + department)
 * - Method Overriding (toString)
 * - ArrayList (java.util.ArrayList) for dynamic collections
 * - Static nested class (PeerStats)
 * - String comparison (equals, equalsIgnoreCase)
 */
public class User implements Authenticatable {
    // Static variable to track total instances of User created
    private static int totalUsersCreated = 0;

    // Private fields enforcing encapsulation
    private String username;
    private String password;
    private String fullName;
    private String department;
    private int reputationScore;

    // ArrayLists representing this peer's local storage:
    private ArrayList<BaseNote> sharedNotes;     // Notes this peer shares with network
    private ArrayList<BaseNote> downloadedNotes; // Notes this peer has copied from other peers

    // Static nested class demonstrating inner class concept
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

        public int getSharedCount() {
            return sharedCount;
        }

        public int getDownloadedCount() {
            return downloadedCount;
        }

        public int getTotalViewsReceived() {
            return totalViewsReceived;
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
        totalUsersCreated++;
    }

    // Static method accessing static variable
    public static int getTotalUsersCreated() {
        return totalUsersCreated;
    }

    // Getters and Setters
    @Override
    public String getUsername() {
        return this.username;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        if (password != null && !password.trim().isEmpty()) {
            this.password = password.trim();
        }
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

    public void setReputationScore(int reputationScore) {
        this.reputationScore = reputationScore;
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

    // Implementation of Authenticatable interface method
    @Override
    public boolean verifyPassword(String inputPassword) {
        if (inputPassword == null) {
            return false;
        }
        return this.password.equals(inputPassword);
    }

    @Override
    public String getRole() {
        return "STUDENT_PEER";
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

    // Method Overloading Variant 1: search local notes by keyword
    public ArrayList<BaseNote> searchMyNotes(String keyword) {
        ArrayList<BaseNote> matches = new ArrayList<>();
        if (keyword == null || keyword.trim().isEmpty()) {
            matches.addAll(this.sharedNotes);
            matches.addAll(this.downloadedNotes);
            return matches;
        }
        String cleanKeyword = keyword.trim().toLowerCase();
        for (BaseNote n : this.sharedNotes) {
            if (n.getTitle().toLowerCase().contains(cleanKeyword) || n.getAuthor().toLowerCase().contains(cleanKeyword)) {
                matches.add(n);
            }
        }
        for (BaseNote n : this.downloadedNotes) {
            if (n.getTitle().toLowerCase().contains(cleanKeyword) || n.getAuthor().toLowerCase().contains(cleanKeyword)) {
                matches.add(n);
            }
        }
        return matches;
    }

    // Method Overloading Variant 2: search local notes by keyword AND department
    public ArrayList<BaseNote> searchMyNotes(String keyword, String department) {
        ArrayList<BaseNote> matches = new ArrayList<>();
        ArrayList<BaseNote> keywordMatches = searchMyNotes(keyword);
        if (department == null || department.trim().isEmpty() || department.equalsIgnoreCase("ALL")) {
            return keywordMatches;
        }
        for (BaseNote n : keywordMatches) {
            if (n.getDepartment().equalsIgnoreCase(department.trim())) {
                matches.add(n);
            }
        }
        return matches;
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
        System.out.println("Role             : " + getRole());
        System.out.println("Username         : @" + this.username);
        System.out.println("Full Name        : " + this.fullName);
        System.out.println("Department       : " + this.department);
        System.out.println("Reputation Pts   : " + this.reputationScore);
        PeerStats stats = calculateStats();
        stats.printSummary();
        System.out.println("------------------------------------------------\n");
    }

    // Method Overriding: toString() from Object class
    @Override
    public String toString() {
        return String.format("[%s] %s (@%s) | Dept: %s | Rep: %d",
                getRole(), this.fullName, this.username, this.department, this.reputationScore);
    }
}
