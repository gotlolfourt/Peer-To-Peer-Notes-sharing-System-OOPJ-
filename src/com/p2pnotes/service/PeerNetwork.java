package com.p2pnotes.service;

import com.p2pnotes.model.BaseNote;
import com.p2pnotes.model.LectureNote;
import com.p2pnotes.model.SummaryCheatSheet;
import com.p2pnotes.model.User;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.Vector;

/**
 * Service simulating the Peer-to-Peer Network Directory and Shared Registry.
 * 
 * Demonstrates:
 * - HashMap (java.util.HashMap) for key-value peer lookups (Module 05, Experiment 5)
 * - Vector (java.util.Vector) for synchronized collection of public network notes (Module 05, Experiment 5)
 * - Vector Iterator (java.util.Iterator) for traversing elements (Module 05, Experiment 5)
 * - HashSet (java.util.HashSet) for unique department tracking (Module 05, Experiment 5)
 * - Static initialization concepts (Module 02, Experiment 2)
 * - String methods: toLowerCase(), contains(), trim(), equalsIgnoreCase() (Module 05, Experiment 1)
 * - Formatted printing (System.out.printf) (Module 01, Experiment 1)
 */
public class PeerNetwork {
    // Map of username -> User object (Key-Value pairs)
    private Map<String, User> peers;

    // Synchronized Vector containing all currently active notes shared across the P2P network
    private Vector<BaseNote> publicNoteRegistry;

    // Set of distinct college departments active in the network
    private Set<String> activeDepartments;

    // Supported categories array (1D array from Module 01/05)
    public static final String[] SUPPORTED_DEPARTMENTS = {"CSE", "AIML", "ECE", "MECHANICAL", "GENERAL"};

    public PeerNetwork() {
        this.peers = new HashMap<String, User>();
        this.publicNoteRegistry = new Vector<BaseNote>();
        this.activeDepartments = new HashSet<String>();
        initializeSampleNetwork();
    }

    /**
     * Initializes simulated peers and starter notes.
     * Demonstrates: OOP object creation, arrays, polymorphism, collection population.
     */
    private void initializeSampleNetwork() {
        // Peer 1: Alice (CSE)
        User alice = new User("alice_cse", "pass123", "Alice DSouza", "CSE");
        LectureNote javaOopNote = new LectureNote(
            "Java OOP Principles & Inheritance",
            alice.getFullName(),
            "CSE",
            "PCC12CE07",
            "Dr. Sharma",
            4,
            "1. Encapsulation wraps data and methods.\n" +
            "2. Inheritance allows subclasses to reuse superclass methods using 'extends'.\n" +
            "3. Overriding modifies behavior using @Override.\n" +
            "4. Super calls parent constructors and methods."
        );
        alice.addSharedNote(javaOopNote);
        registerPeer(alice);
        this.publicNoteRegistry.add(javaOopNote);

        // Peer 2: Bob (AIML)
        User bob = new User("bob_aiml", "pass123", "Bob Fernandes", "AIML");
        String[] mlFormulas = {
            "Euclidean Distance = sqrt(sum((x_i - y_i)^2))",
            "Sigmoid(z) = 1 / (1 + e^(-z))",
            "Accuracy = (TP + TN) / (TP + TN + FP + FN)"
        };
        SummaryCheatSheet mlCheatSheet = new SummaryCheatSheet(
            "Machine Learning Quick Exam Formulas",
            bob.getFullName(),
            "AIML",
            "Semester 4 End-Sem",
            mlFormulas,
            "Supervised learning has labeled data; Unsupervised has unlabelled clusters; Overfitting is reduced via regularization"
        );
        bob.addSharedNote(mlCheatSheet);
        registerPeer(bob);
        this.publicNoteRegistry.add(mlCheatSheet);

        // Peer 3: Charlie (ECE)
        User charlie = new User("charlie_ece", "pass123", "Charlie Pinto", "ECE");
        LectureNote dsdNote = new LectureNote(
            "Digital Electronics & Logic Gates",
            charlie.getFullName(),
            "ECE",
            "ECC301",
            "Prof. Rao",
            2,
            "AND gate gives 1 if all inputs are 1. OR gate gives 1 if any input is 1. De Morgan's Law: (A.B)' = A' + B'."
        );
        charlie.addSharedNote(dsdNote);
        registerPeer(charlie);
        this.publicNoteRegistry.add(dsdNote);
    }

    // Register a new peer in the network
    public boolean registerPeer(User user) {
        if (user == null || user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            return false;
        }
        String key = user.getUsername().trim().toLowerCase();
        if (this.peers.containsKey(key)) {
            return false; // Username already exists
        }
        this.peers.put(key, user);
        this.activeDepartments.add(user.getDepartment().toUpperCase());
        return true;
    }

    // Authenticate a peer
    public User authenticate(String username, String password) {
        if (username == null || password == null) {
            return null;
        }
        String key = username.trim().toLowerCase();
        if (!this.peers.containsKey(key)) {
            return null;
        }
        User user = this.peers.get(key);
        if (user.verifyPassword(password)) {
            return user;
        }
        return null;
    }

    // Publish a note to the network registry
    public void publishNote(User peer, BaseNote note) {
        peer.addSharedNote(note);
        this.publicNoteRegistry.add(note);
        this.activeDepartments.add(note.getDepartment().toUpperCase());
    }

    // Remove a note from the network registry
    public boolean unpublishNote(User peer, int noteId) {
        boolean removedFromUser = peer.removeSharedNote(noteId);
        if (removedFromUser) {
            // Remove from public registry using Vector remove
            for (int i = 0; i < this.publicNoteRegistry.size(); i++) {
                if (this.publicNoteRegistry.get(i).getNoteId() == noteId) {
                    this.publicNoteRegistry.remove(i);
                    break;
                }
            }
            return true;
        }
        return false;
    }

    // Retrieve note by ID
    public BaseNote findNoteById(int noteId) {
        for (int i = 0; i < this.publicNoteRegistry.size(); i++) {
            BaseNote note = this.publicNoteRegistry.get(i);
            if (note.getNoteId() == noteId) {
                return note;
            }
        }
        return null;
    }

    // Search notes using String manipulation (toLowerCase, contains, equalsIgnoreCase)
    public ArrayList<BaseNote> searchNotes(String keyword, String departmentFilter) {
        ArrayList<BaseNote> results = new ArrayList<BaseNote>();
        String cleanKeyword = (keyword != null) ? keyword.trim().toLowerCase() : "";
        String cleanDept = (departmentFilter != null) ? departmentFilter.trim() : "";

        // Using Vector Iterator to sequentially access elements
        Iterator<BaseNote> it = this.publicNoteRegistry.iterator();
        while (it.hasNext()) {
            BaseNote note = it.next();
            boolean matchesDept = cleanDept.isEmpty() || cleanDept.equalsIgnoreCase("ALL") 
                                  || note.getDepartment().equalsIgnoreCase(cleanDept);
            
            boolean matchesQuery = cleanKeyword.isEmpty()
                || note.getTitle().toLowerCase().contains(cleanKeyword)
                || note.getAuthor().toLowerCase().contains(cleanKeyword);

            if (matchesDept && matchesQuery) {
                results.add(note);
            }
        }
        return results;
    }

    // Download note: peer receives copy, author gets reputation points
    public boolean downloadNoteToPeer(User downloader, int noteId) {
        BaseNote note = findNoteById(noteId);
        if (note == null) {
            return false;
        }
        // Cannot download own note
        if (note.getAuthor().equalsIgnoreCase(downloader.getFullName())) {
            System.out.println("-> Notice: You are the author of this note; it is already in your shared collection.");
            return false;
        }

        boolean added = downloader.saveDownloadedNote(note);
        if (added) {
            note.incrementAccess();
            // Reward author
            for (User authorPeer : this.peers.values()) {
                if (authorPeer.getFullName().equalsIgnoreCase(note.getAuthor())) {
                    authorPeer.addReputation(2);
                    break;
                }
            }
            return true;
        }
        return false;
    }

    // Display summary of network status
    public void displayNetworkStatus() {
        System.out.println("\n============= P2P NETWORK OVERVIEW =============");
        System.out.printf("Active Registered Peers : %d\n", this.peers.size());
        System.out.printf("Public Notes in Network : %d\n", this.publicNoteRegistry.size());
        System.out.print("Departments Represented : ");
        for (String dept : this.activeDepartments) {
            System.out.print("[" + dept + "] ");
        }
        System.out.println("\n================================================\n");
    }

    public Vector<BaseNote> getAllPublicNotes() {
        return this.publicNoteRegistry;
    }

    public Map<String, User> getPeers() {
        return this.peers;
    }
}
