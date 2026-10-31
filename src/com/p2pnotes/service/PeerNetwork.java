package com.p2pnotes.service;

import com.p2pnotes.io.FileManager;
import com.p2pnotes.model.BaseNote;
import com.p2pnotes.model.LectureNote;
import com.p2pnotes.model.ProfessorPeer;
import com.p2pnotes.model.StudentPeer;
import com.p2pnotes.model.SummaryCheatSheet;
import com.p2pnotes.model.User;
import com.p2pnotes.thread.TransferTask;
import com.p2pnotes.transfer.TransferService;
import com.p2pnotes.util.AppConstants;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;
import java.util.Set;
import java.util.Vector;

/**
 * Service simulating the Peer-to-Peer Network Directory and Shared Registry.
 * 
 * Demonstrates:
 * - Implementing Interfaces (implements TransferService)
 * - Java Collections:
 *     - HashMap (peers lookup)
 *     - Vector (thread-safe public note registry)
 *     - HashSet (active departments set)
 *     - LinkedList as Queue (java.util.Queue and java.util.LinkedList for transfer tasks and requests)
 * - Method Overloading:
 *     - searchNotes(keyword)
 *     - searchNotes(keyword, departmentFilter)
 *     - searchNotes(keyword, departmentFilter, minViews)
 * - Multithreading & Synchronization (synchronized methods for thread-safe downloads)
 * - Polymorphism (managing User, StudentPeer, ProfessorPeer, LectureNote, SummaryCheatSheet)
 */
public class PeerNetwork implements TransferService {
    // Map of username -> User object (Key-Value pairs)
    private Map<String, User> peers;

    // Synchronized Vector containing all currently active notes shared across the P2P network
    private Vector<BaseNote> publicNoteRegistry;

    // Set of distinct college departments active in the network
    private Set<String> activeDepartments;

    // Queue implemented with LinkedList for managing queued background transfer requests
    private Queue<TransferTask> transferQueue;

    // Queue for network broadcast announcements
    private Queue<String> broadcastQueue;

    // FileManager reference for note transfers
    private FileManager fileManager;

    // Supported categories array (1D array)
    public static final String[] SUPPORTED_DEPARTMENTS = {"CSE", "AIML", "ECE", "MECHANICAL", "GENERAL"};

    public PeerNetwork() {
        this.peers = new HashMap<String, User>();
        this.publicNoteRegistry = new Vector<BaseNote>();
        this.activeDepartments = new HashSet<String>();
        this.transferQueue = new LinkedList<TransferTask>();
        this.broadcastQueue = new LinkedList<String>();
        this.fileManager = new FileManager();
        initializeSampleNetwork();
    }

    /**
     * Initializes simulated peers and starter notes.
     * Demonstrates: OOP object creation, inheritance (StudentPeer, ProfessorPeer), polymorphism.
     */
    private void initializeSampleNetwork() {
        // Peer 1: Alice (CSE) - StudentPeer
        StudentPeer alice = new StudentPeer("alice_cse", "pass123", "Alice DSouza", "CSE", "21CS042", 4);
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
        AppConstants.incrementNotesShared();

        // Peer 2: Bob (AIML) - StudentPeer
        StudentPeer bob = new StudentPeer("bob_aiml", "pass123", "Bob Fernandes", "AIML", "21AI015", 4);
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
        AppConstants.incrementNotesShared();

        // Peer 3: Dr. Charlie (ECE) - ProfessorPeer demonstrating specialized faculty subclass
        ProfessorPeer charlie = new ProfessorPeer("charlie_ece", "pass123", "Dr. Charlie Pinto", "ECE", "Associate Professor", "Cabin E-204");
        LectureNote dsdNote = new LectureNote(
            "Digital Electronics & Logic Gates",
            charlie.getFullName(),
            "ECE",
            "ECC301",
            "Dr. Charlie Pinto",
            2,
            "AND gate gives 1 if all inputs are 1. OR gate gives 1 if any input is 1. De Morgan's Law: (A.B)' = A' + B'."
        );
        charlie.addSharedNote(dsdNote);
        registerPeer(charlie);
        this.publicNoteRegistry.add(dsdNote);
        AppConstants.incrementNotesShared();

        // Broadcast initial greeting
        broadcastQueue.offer("P2P Network initialized with " + peers.size() + " starter peers and " + publicNoteRegistry.size() + " public notes.");
    }

    // Register a new peer in the network (synchronized for thread safety)
    public synchronized boolean registerPeer(User user) {
        if (user == null || user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            return false;
        }
        String key = user.getUsername().trim().toLowerCase();
        if (this.peers.containsKey(key)) {
            return false; // Username already exists
        }
        this.peers.put(key, user);
        this.activeDepartments.add(user.getDepartment().toUpperCase());
        AppConstants.incrementRegisteredUsers();
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

    // Publish a note to the network registry (synchronized)
    public synchronized void publishNote(User peer, BaseNote note) {
        peer.addSharedNote(note);
        this.publicNoteRegistry.add(note);
        this.activeDepartments.add(note.getDepartment().toUpperCase());
        AppConstants.incrementNotesShared();
        broadcastQueue.offer("New Note Shared: '" + note.getTitle() + "' by " + peer.getFullName());
    }

    // Remove a note from the network registry (synchronized)
    public synchronized boolean unpublishNote(User peer, int noteId) {
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

    // ================= METHOD OVERLOADING FOR SEARCH =================

    /**
     * Method Overloading Variant 1: Search notes by keyword across all departments.
     */
    public ArrayList<BaseNote> searchNotes(String keyword) {
        return searchNotes(keyword, "ALL");
    }

    /**
     * Method Overloading Variant 2: Search notes by keyword AND department filter.
     * Uses Vector Iterator to sequentially access elements.
     */
    public ArrayList<BaseNote> searchNotes(String keyword, String departmentFilter) {
        return searchNotes(keyword, departmentFilter, 0);
    }

    /**
     * Method Overloading Variant 3: Search notes by keyword, department filter, AND minimum views.
     */
    public ArrayList<BaseNote> searchNotes(String keyword, String departmentFilter, int minViews) {
        ArrayList<BaseNote> results = new ArrayList<BaseNote>();
        String cleanKeyword = (keyword != null) ? keyword.trim().toLowerCase() : "";
        String cleanDept = (departmentFilter != null) ? departmentFilter.trim() : "";

        // Using Vector Iterator to sequentially access elements
        Iterator<BaseNote> it = this.publicNoteRegistry.iterator();
        while (it.hasNext()) {
            BaseNote note = it.next();
            if (note.getAccessCount() < minViews) {
                continue;
            }

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

    // ================= DOWNLOAD AND TRANSFER OPERATIONS =================

    /**
     * Synchronous download of a note to a peer's local collection.
     * Synchronized method prevents race conditions on download counters and author reputation.
     */
    public synchronized boolean downloadNoteToPeer(User downloader, int noteId) {
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
            AppConstants.incrementDownloads();
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

    /**
     * Implementation of TransferService interface:
     * Enqueues and initiates an asynchronous multi-threaded file transfer.
     */
    @Override
    public void initiateTransfer(BaseNote note, String downloaderUsername) {
        String taskId = "TX-" + (transferQueue.size() + 1);
        TransferTask task = new TransferTask(taskId, note, downloaderUsername, this.fileManager);
        this.transferQueue.offer(task); // Enqueue in Queue (LinkedList)

        // Launch in a separate thread
        Thread transferThread = new Thread(task, "TransferThread-" + taskId);
        transferThread.start();
    }

    @Override
    public int getActiveTransferCount() {
        return TransferTask.getActiveTransfers();
    }

    @Override
    public int getCompletedTransferCount() {
        return TransferTask.getCompletedTransfers();
    }

    public Queue<TransferTask> getTransferQueue() {
        return this.transferQueue;
    }

    public Queue<String> getBroadcastQueue() {
        return this.broadcastQueue;
    }

    // Display summary of network status
    public void displayNetworkStatus() {
        System.out.println("\n============= P2P NETWORK OVERVIEW =============");
        System.out.printf("Active Registered Peers : %d\n", this.peers.size());
        System.out.printf("Public Notes in Network : %d\n", this.publicNoteRegistry.size());
        System.out.printf("Total Global Downloads  : %d\n", AppConstants.getTotalDownloads());
        System.out.printf("Active Transfers Now    : %d\n", TransferTask.getActiveTransfers());
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

    public FileManager getFileManager() {
        return this.fileManager;
    }
}
