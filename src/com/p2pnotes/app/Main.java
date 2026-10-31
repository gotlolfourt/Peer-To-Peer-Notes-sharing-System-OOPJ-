package com.p2pnotes.app;

import com.p2pnotes.api.NoteApiServer;
import com.p2pnotes.db.DatabaseManager;
import com.p2pnotes.exception.AuthenticationException;
import com.p2pnotes.exception.NoteException;
import com.p2pnotes.io.FileManager;
import com.p2pnotes.model.BaseNote;
import com.p2pnotes.model.LectureNote;
import com.p2pnotes.model.ProfessorPeer;
import com.p2pnotes.model.StudentPeer;
import com.p2pnotes.model.SummaryCheatSheet;
import com.p2pnotes.model.User;
import com.p2pnotes.service.PeerNetwork;
import com.p2pnotes.thread.BackgroundSync;
import com.p2pnotes.thread.TransferTask;
import com.p2pnotes.util.AppConstants;
import com.p2pnotes.util.StringUtils;

import java.io.File;
import java.util.ArrayList;
import java.util.Scanner;
import java.util.Vector;

/**
 * Main application entry point providing console UI for the Peer-to-Peer Notes Sharing System.
 * 
 * Demonstrates:
 * - Core OOP: Classes & Objects, Encapsulation, Inheritance, Polymorphism
 * - Static Variables: AppConstants counters, BaseNote idCounter, User totalUsersCreated
 * - Method Overloading: PeerNetwork.searchNotes(), FileManager.saveNoteToFile()
 * - Method Overriding: displayDetails(), displayFullContent(), exportFormattedText(), toString()
 * - Abstract Methods & Interfaces: BaseNote, Shareable, Authenticatable, TransferService
 * - Final Keyword: AppConstants, BaseNote.getNoteId(), final fields
 * - Super Keyword: child class constructors and method overrides
 * - Java Collections: ArrayList, HashMap, HashSet, Vector, LinkedList (as Queue)
 * - Strings: trim(), isEmpty(), toUpperCase(), toLowerCase(), contains(), substring(), split(), charAt(), equals(), equalsIgnoreCase()
 * - Multithreading: TransferTask (Runnable), BackgroundSync (Thread daemon), synchronized methods
 * - File Handling: FileManager (File, BufferedReader, BufferedWriter, FileWriter, FileReader, validate)
 * - JDBC: DatabaseManager (SQLite, PreparedStatement, ResultSet, CRUD operations)
 * - REST API: NoteApiServer (HttpServer on port 7070)
 * - Exception Handling: try-catch-finally, NoteException, AuthenticationException
 */
public class Main {
    private static Scanner scanner = new Scanner(System.in);
    private static PeerNetwork network = new PeerNetwork();
    private static User currentPeer = null;

    // Advanced components
    private static FileManager fileManager = network.getFileManager();
    private static DatabaseManager dbManager = DatabaseManager.getInstance();
    private static NoteApiServer apiServer = new NoteApiServer(network);
    private static BackgroundSync backgroundSyncThread = null;

    public static void main(String[] args) {
        System.out.println("===============================================================");
        System.out.println("       WELCOME TO PEER-TO-PEER (P2P) NOTES SHARING SYSTEM       ");
        System.out.println("   College Project - Object Oriented Programming with Java     ");
        System.out.println("   Version: " + AppConstants.APP_VERSION + " | System: " + AppConstants.APP_NAME);
        System.out.println("===============================================================");

        // Automatically start the background synchronization daemon thread
        startBackgroundSync();

        boolean running = true;
        while (running) {
            try {
                if (currentPeer == null) {
                    running = showAuthenticationMenu();
                } else {
                    showPeerDashboardMenu();
                }
            } catch (Exception e) {
                System.out.println("\n[System Error] An unexpected error occurred: " + e.getMessage());
                System.out.println("Returning to main menu...\n");
            }
        }

        // Cleanup on shutdown
        if (backgroundSyncThread != null) {
            backgroundSyncThread.stopSync();
        }
        if (apiServer != null && apiServer.isRunning()) {
            apiServer.stop();
        }

        System.out.println("\nThank you for using Peer-to-Peer Notes Sharing System. Goodbye!");
        scanner.close();
    }

    // Top-level Authentication / Guest Menu
    private static boolean showAuthenticationMenu() {
        System.out.println("\n------------- MAIN MENU -------------");
        System.out.println("1. Login as Existing Peer");
        System.out.println("2. Register as New Peer (Student / Faculty)");
        System.out.println("3. View Network Statistics & Public Peers");
        System.out.println("4. System & Server Controls (REST API / Database / Threads)");
        System.out.println("5. Exit Application");
        System.out.print("Enter your choice (1-5): ");

        int choice = readIntChoice();
        switch (choice) {
            case 1:
                handleLogin();
                break;
            case 2:
                handleRegistration();
                break;
            case 3:
                network.displayNetworkStatus();
                displayRegisteredPeers();
                break;
            case 4:
                showSystemControlsMenu();
                break;
            case 5:
                return false;
            default:
                System.out.println("Invalid selection! Please enter a number between 1 and 5.");
        }
        return true;
    }

    // Dashboard for an authenticated Peer
    private static void showPeerDashboardMenu() {
        System.out.println("\n================ PEER DASHBOARD ================");
        System.out.println("Logged in as : " + currentPeer.getFullName() + " (@" + currentPeer.getUsername() + ")");
        System.out.println("Role         : " + currentPeer.getRole() + " | Dept: " + currentPeer.getDepartment());
        System.out.println("Reputation   : " + currentPeer.getReputationScore() + " pts");
        System.out.println("------------------------------------------------");
        System.out.println("1. Browse All Available Notes on P2P Network");
        System.out.println("2. Search Notes by Keyword or Department");
        System.out.println("3. Share / Upload a New Note");
        System.out.println("4. View & Read Note Full Content (Polymorphic Display)");
        System.out.println("5. Download a Note to My Local Collection (Sync / Multithreaded)");
        System.out.println("6. View My Local Notes (Shared & Downloaded)");
        System.out.println("7. Remove a Note from My Shared Collection");
        System.out.println("8. View My Peer Profile & Reputation");
        System.out.println("9. Advanced Tools (Multithreading, File I/O, JDBC, REST API)");
        System.out.println("10. Logout");
        System.out.print("Enter your choice (1-10): ");

        int choice = readIntChoice();
        switch (choice) {
            case 1:
                browseAllNotes();
                break;
            case 2:
                searchNotesMenu();
                break;
            case 3:
                uploadNoteMenu();
                break;
            case 4:
                readNoteContent();
                break;
            case 5:
                downloadNoteMenu();
                break;
            case 6:
                viewMyLocalNotes();
                break;
            case 7:
                removeSharedNote();
                break;
            case 8:
                currentPeer.displayProfile();
                break;
            case 9:
                showAdvancedToolsMenu();
                break;
            case 10:
                System.out.println("Logging out from peer session @" + currentPeer.getUsername() + "...");
                currentPeer = null;
                break;
            default:
                System.out.println("Invalid selection! Please enter a number between 1 and 10.");
        }
    }

    // ================= AUTHENTICATION HANDLERS =================

    private static void handleLogin() {
        System.out.println("\n--- Peer Login ---");
        System.out.print("Enter Username: ");
        String username = scanner.nextLine().trim();
        System.out.print("Enter Password: ");
        String password = scanner.nextLine().trim();

        try {
            if (StringUtils.isNullOrEmpty(username) || StringUtils.isNullOrEmpty(password)) {
                throw new AuthenticationException("Username and password cannot be empty", username);
            }

            User user = network.authenticate(username, password);
            if (user != null) {
                currentPeer = user;
                System.out.println(">>> Login Successful! Welcome back, " + currentPeer.getFullName() + "!");
                System.out.println(">>> User Role: " + currentPeer.getRole() + " (" + currentPeer.getClass().getSimpleName() + ")");
            } else {
                throw new AuthenticationException("Invalid username or password credentials", username);
            }
        } catch (AuthenticationException e) {
            System.out.println(">>> Error: " + e.getMessage());
        }
    }

    private static void handleRegistration() {
        System.out.println("\n--- Peer Registration ---");
        System.out.println("Select Account Type:");
        System.out.println("  1. Student Peer");
        System.out.println("  2. Faculty / Professor Peer");
        System.out.print("Enter choice (1-2): ");
        int typeChoice = readIntChoice();

        System.out.print("Choose Username: ");
        String username = scanner.nextLine().trim();
        if (!StringUtils.isValidUsername(username)) {
            System.out.println(">>> Error: Username must be 3-20 alphanumeric characters (letters, numbers, underscore).");
            return;
        }

        System.out.print("Choose Password: ");
        String password = scanner.nextLine().trim();
        if (password.length() < 4) {
            System.out.println(">>> Error: Password must be at least 4 characters long.");
            return;
        }

        System.out.print("Enter Full Name: ");
        String fullName = scanner.nextLine().trim();
        if (StringUtils.isNullOrEmpty(fullName)) {
            System.out.println(">>> Error: Full Name cannot be blank.");
            return;
        }

        System.out.println("Select Department:");
        for (int i = 0; i < PeerNetwork.SUPPORTED_DEPARTMENTS.length; i++) {
            System.out.println("  " + (i + 1) + ". " + PeerNetwork.SUPPORTED_DEPARTMENTS[i]);
        }
        System.out.print("Enter department choice (1-" + PeerNetwork.SUPPORTED_DEPARTMENTS.length + "): ");
        int deptIndex = readIntChoice() - 1;
        String department = "GENERAL";
        if (deptIndex >= 0 && deptIndex < PeerNetwork.SUPPORTED_DEPARTMENTS.length) {
            department = PeerNetwork.SUPPORTED_DEPARTMENTS[deptIndex];
        }

        User newPeer;
        if (typeChoice == 2) {
            System.out.print("Enter Faculty Designation (e.g., Assistant Professor): ");
            String designation = scanner.nextLine().trim();
            System.out.print("Enter Faculty Cabin Number (e.g., Cabin CS-302): ");
            String cabin = scanner.nextLine().trim();
            newPeer = new ProfessorPeer(username, password, fullName, department, designation, cabin);
        } else {
            System.out.print("Enter Student ID (e.g., 22CS089): ");
            String studentId = scanner.nextLine().trim();
            System.out.print("Enter Semester Number (1-8): ");
            int sem = readIntChoice();
            newPeer = new StudentPeer(username, password, fullName, department, studentId, sem > 0 ? sem : 1);
        }

        boolean registered = network.registerPeer(newPeer);
        if (registered) {
            System.out.println(">>> Registration successful! Created " + newPeer.getClass().getSimpleName() + " for @" + username);
            // Also optionally persist to database
            if (dbManager.isAvailable()) {
                dbManager.saveUser(newPeer);
            }
        } else {
            System.out.println(">>> Registration failed: Username @" + username + " is already taken!");
        }
    }

    private static void displayRegisteredPeers() {
        System.out.println("List of Connected Peers in Network:");
        int idx = 1;
        for (User u : network.getPeers().values()) {
            System.out.printf("  %d. [%s] %s (@%s) - Dept: %s | Shared: %d | Rep: %d\n",
                    idx++, u.getRole(), u.getFullName(), u.getUsername(), u.getDepartment(),
                    u.getSharedNotes().size(), u.getReputationScore());
        }
    }

    // ================= NOTE BROWSING & SEARCH =================

    private static void browseAllNotes() {
        Vector<BaseNote> notes = network.getAllPublicNotes();
        System.out.println("\n--- Available Notes on P2P Network (" + notes.size() + " total) ---");
        if (notes.isEmpty()) {
            System.out.println("No notes are currently published on the network.");
            return;
        }
        printNotesTable(notes);
    }

    private static void searchNotesMenu() {
        System.out.println("\n--- Search P2P Notes ---");
        System.out.print("Enter search keyword (or press Enter to match all): ");
        String query = scanner.nextLine().trim();

        System.out.println("Filter by Department:");
        System.out.println("  0. ALL DEPARTMENTS");
        for (int i = 0; i < PeerNetwork.SUPPORTED_DEPARTMENTS.length; i++) {
            System.out.println("  " + (i + 1) + ". " + PeerNetwork.SUPPORTED_DEPARTMENTS[i]);
        }
        System.out.print("Enter choice (0-" + PeerNetwork.SUPPORTED_DEPARTMENTS.length + "): ");
        int dChoice = readIntChoice();
        String deptFilter = "ALL";
        if (dChoice > 0 && dChoice <= PeerNetwork.SUPPORTED_DEPARTMENTS.length) {
            deptFilter = PeerNetwork.SUPPORTED_DEPARTMENTS[dChoice - 1];
        }

        System.out.print("Filter by Minimum Views (0 for no filter): ");
        int minViews = readIntChoice();
        if (minViews < 0) {
            minViews = 0;
        }

        // Demonstrates Method Overloading on searchNotes()
        ArrayList<BaseNote> results;
        if (minViews > 0) {
            results = network.searchNotes(query, deptFilter, minViews);
        } else if (!"ALL".equalsIgnoreCase(deptFilter)) {
            results = network.searchNotes(query, deptFilter);
        } else {
            results = network.searchNotes(query);
        }

        System.out.println("\nSearch Results (" + results.size() + " matches found):");
        if (results.isEmpty()) {
            System.out.println("No notes matched your search criteria.");
        } else {
            printNotesList(results);
        }
    }

    // ================= NOTE UPLOAD & DISPLAY =================

    private static void uploadNoteMenu() {
        System.out.println("\n--- Share / Upload a New Note ---");
        System.out.println("Select Note Type:");
        System.out.println("  1. Lecture Note (Classroom details, prof, lecture number)");
        System.out.println("  2. Revision Cheat-Sheet (Key formulas, summary bullet points)");
        System.out.print("Enter choice (1-2): ");
        int typeChoice = readIntChoice();

        System.out.print("Enter Note Title: ");
        String title = scanner.nextLine().trim();
        if (StringUtils.isNullOrEmpty(title)) {
            System.out.println("Title cannot be blank!");
            return;
        }

        String department = currentPeer.getDepartment();

        try {
            BaseNote note;
            if (typeChoice == 1) {
                System.out.print("Enter Course Code (e.g. PCC12CE07): ");
                String courseCode = scanner.nextLine().trim();
                System.out.print("Enter Professor Name: ");
                String prof = scanner.nextLine().trim();
                System.out.print("Enter Lecture Number: ");
                int lecNum = readIntChoice();
                System.out.print("Enter Note Content: ");
                String content = scanner.nextLine().trim();

                note = new LectureNote(title, currentPeer.getFullName(), department,
                        courseCode, prof, lecNum > 0 ? lecNum : 1, content);
            } else if (typeChoice == 2) {
                System.out.print("Enter Target Exam (e.g. Mid-Term 1 / End-Sem): ");
                String exam = scanner.nextLine().trim();

                System.out.print("How many key formulas do you want to add? ");
                int formulaCount = readIntChoice();
                if (formulaCount < 0) {
                    formulaCount = 0;
                }
                String[] formulas = new String[formulaCount];
                for (int i = 0; i < formulas.length; i++) {
                    System.out.print("  Formula #" + (i + 1) + ": ");
                    formulas[i] = scanner.nextLine().trim();
                }

                System.out.print("Enter Key Points Summary (separate points with semicolon ';'): ");
                String summaryPoints = scanner.nextLine().trim();

                note = new SummaryCheatSheet(title, currentPeer.getFullName(), department,
                        exam, formulas, summaryPoints);
            } else {
                System.out.println("Invalid note type selected.");
                return;
            }

            network.publishNote(currentPeer, note);
            System.out.println(">>> " + note.getNoteType() + " shared successfully! Generated Note ID: #" + note.getNoteId());
            System.out.println(">>> +5 Reputation points awarded to peer @" + currentPeer.getUsername());

            // Save to disk using FileManager
            fileManager.saveNoteToFile(note);

            // Save to database if available
            if (dbManager.isAvailable()) {
                dbManager.saveNote(note, currentPeer.getUsername());
            }

        } catch (Exception e) {
            System.out.println(">>> Error uploading note: " + e.getMessage());
        }
    }

    private static void readNoteContent() {
        System.out.print("\nEnter Note ID to read: ");
        int id = readIntChoice();
        BaseNote note = network.findNoteById(id);
        if (note != null) {
            // Polymorphic method call (invokes LectureNote or SummaryCheatSheet displayFullContent)
            note.displayFullContent();
        } else {
            System.out.println(">>> Note with ID #" + id + " not found on the network.");
        }
    }

    // ================= DOWNLOAD MENU (SYNC & MULTITHREADED) =================

    private static void downloadNoteMenu() {
        System.out.println("\n--- Download Note ---");
        System.out.println("1. Instant Download (Synchronous)");
        System.out.println("2. Asynchronous Multi-threaded Download (Simulates Network Transfer with Thread)");
        System.out.print("Enter mode (1-2): ");
        int mode = readIntChoice();

        System.out.print("Enter Note ID to download: ");
        int id = readIntChoice();
        BaseNote note = network.findNoteById(id);
        if (note == null) {
            System.out.println(">>> Note with ID #" + id + " not found.");
            return;
        }

        if (mode == 2) {
            // Multithreaded transfer via TransferService interface
            System.out.println(">>> Queuing asynchronous multi-threaded download for: " + note.getTitle());
            network.initiateTransfer(note, currentPeer.getUsername());
            network.downloadNoteToPeer(currentPeer, id);
        } else {
            // Synchronous download
            boolean success = network.downloadNoteToPeer(currentPeer, id);
            if (success) {
                fileManager.saveNoteToFile(note, currentPeer.getUsername() + "_" + note.getNoteId() + ".txt");
                System.out.println(">>> Note #" + id + " downloaded successfully to your local library and saved to disk!");
            } else {
                System.out.println(">>> Download failed. Either note does not exist, or you already own it.");
            }
        }
    }

    private static void viewMyLocalNotes() {
        System.out.println("\n================= MY LOCAL LIBRARY =================");
        System.out.println("[A] NOTES SHARED BY ME (" + currentPeer.getSharedNotes().size() + "):");
        if (currentPeer.getSharedNotes().isEmpty()) {
            System.out.println("  You have not shared any notes yet.");
        } else {
            printNotesList(currentPeer.getSharedNotes());
        }

        System.out.println("\n[B] NOTES DOWNLOADED FROM OTHER PEERS (" + currentPeer.getDownloadedNotes().size() + "):");
        if (currentPeer.getDownloadedNotes().isEmpty()) {
            System.out.println("  You have not downloaded any notes yet.");
        } else {
            printNotesList(currentPeer.getDownloadedNotes());
        }
        System.out.println("====================================================\n");
    }

    private static void removeSharedNote() {
        System.out.print("\nEnter Note ID of the note you want to remove: ");
        int id = readIntChoice();
        boolean removed = network.unpublishNote(currentPeer, id);
        if (removed) {
            if (dbManager.isAvailable()) {
                dbManager.deleteNote(id);
            }
            System.out.println(">>> Note #" + id + " has been successfully removed from network and your shared list.");
        } else {
            System.out.println(">>> Note #" + id + " could not be removed. Ensure it belongs to your shared list.");
        }
    }

    // ================= ADVANCED TOOLS & DEMOS =================

    private static void showAdvancedToolsMenu() {
        System.out.println("\n========== ADVANCED SYSTEM & CONCEPTS MENU ==========");
        System.out.println("1. Demonstrate Multi-threaded Concurrent Transfers (Multiple Threads)");
        System.out.println("2. File Handling Manager (List, Read, Copy, Delete stored notes)");
        System.out.println("3. JDBC SQLite Database Manager (Sync & View DB Records)");
        System.out.println("4. REST API Server Management (Start / Stop API on port 7070)");
        System.out.println("5. Background Sync Daemon Thread Controls");
        System.out.println("6. Back to Peer Dashboard");
        System.out.print("Enter choice (1-6): ");

        int choice = readIntChoice();
        switch (choice) {
            case 1:
                demonstrateMultithreading();
                break;
            case 2:
                fileHandlingMenu();
                break;
            case 3:
                databaseManagerMenu();
                break;
            case 4:
                restApiServerMenu();
                break;
            case 5:
                backgroundSyncMenu();
                break;
            case 6:
                return;
            default:
                System.out.println("Invalid selection!");
        }
    }

    private static void showSystemControlsMenu() {
        System.out.println("\n========== SYSTEM & SERVER CONTROLS ==========");
        System.out.println("1. Start Embedded REST API Server (Port " + AppConstants.API_PORT + ")");
        System.out.println("2. Stop Embedded REST API Server");
        System.out.println("3. View Database Status & Statistics");
        System.out.println("4. View Global Application Constants & Counters");
        System.out.println("5. Return to Main Menu");
        System.out.print("Enter choice (1-5): ");

        int choice = readIntChoice();
        switch (choice) {
            case 1:
                apiServer.start();
                break;
            case 2:
                apiServer.stop();
                break;
            case 3:
                System.out.println("\nDatabase Available: " + dbManager.isAvailable());
                System.out.println("Database URL: " + dbManager.getDbUrl());
                System.out.println("Users in DB: " + dbManager.getUserCount());
                System.out.println("Notes in DB: " + dbManager.getNoteCount());
                break;
            case 4:
                System.out.println("\n" + AppConstants.getGlobalStats());
                break;
            case 5:
                return;
            default:
                System.out.println("Invalid choice!");
        }
    }

    /**
     * Demonstrates MULTITHREADING:
     * Launches multiple concurrent threads transferring different notes simultaneously,
     * demonstrating Runnable, Thread, progress logging, and Thread.join() for synchronization.
     */
    private static void demonstrateMultithreading() {
        System.out.println("\n--- MULTITHREADING DEMO: Concurrent File Transfers ---");
        Vector<BaseNote> publicNotes = network.getAllPublicNotes();
        if (publicNotes.isEmpty()) {
            System.out.println("No notes available in network to transfer.");
            return;
        }

        int count = Math.min(3, publicNotes.size());
        System.out.println("Launching " + count + " concurrent transfer threads simultaneously...");

        Thread[] threads = new Thread[count];
        TransferTask[] tasks = new TransferTask[count];

        for (int i = 0; i < count; i++) {
            BaseNote n = publicNotes.get(i);
            tasks[i] = new TransferTask("DEMO-TX-" + (i + 1), n, currentPeer.getUsername(), fileManager);
            threads[i] = new Thread(tasks[i], "WorkerThread-" + (i + 1));
            threads[i].start(); // Start thread execution
        }

        // Wait for all threads to finish using join()
        System.out.println("Main thread waiting for all concurrent worker threads to complete (Thread.join())...");
        for (int i = 0; i < count; i++) {
            try {
                threads[i].join();
            } catch (InterruptedException e) {
                System.out.println("Thread joining interrupted: " + e.getMessage());
            }
        }

        System.out.println(">>> All " + count + " concurrent transfer threads completed successfully!");
        System.out.println(">>> Active Transfers: " + TransferTask.getActiveTransfers());
        System.out.println(">>> Total Completed Transfers: " + TransferTask.getCompletedTransfers());
    }

    /**
     * Demonstrates FILE HANDLING:
     * Creation, reading, writing, copying, deleting, validation using FileManager.
     */
    private static void fileHandlingMenu() {
        System.out.println("\n--- FILE HANDLING OPERATIONS ---");
        System.out.println("Storage Directory: " + fileManager.getStorageDirectory());
        System.out.println("1. List All Saved Note Files on Disk");
        System.out.println("2. Read and Display File Content from Disk");
        System.out.println("3. Make a Backup Copy of a Note File");
        System.out.println("4. Delete a Note File from Disk");
        System.out.println("5. Return");
        System.out.print("Enter choice (1-5): ");

        int choice = readIntChoice();
        switch (choice) {
            case 1:
                ArrayList<String> files = fileManager.listNoteFiles();
                System.out.println("Files in storage (" + files.size() + " total):");
                for (int i = 0; i < files.size(); i++) {
                    System.out.println("  " + (i + 1) + ". " + files.get(i));
                }
                break;
            case 2:
                System.out.print("Enter filename to read: ");
                String fname = scanner.nextLine().trim();
                String content = fileManager.readNoteFromFile(fname);
                if (content != null) {
                    System.out.println("\n--- Content of " + fname + " ---\n" + content);
                }
                break;
            case 3:
                System.out.print("Enter source filename: ");
                String src = scanner.nextLine().trim();
                System.out.print("Enter destination filename: ");
                String dest = scanner.nextLine().trim();
                fileManager.copyNoteFile(src, dest);
                break;
            case 4:
                System.out.print("Enter filename to delete: ");
                String del = scanner.nextLine().trim();
                fileManager.deleteNoteFile(del);
                break;
            case 5:
                return;
            default:
                System.out.println("Invalid choice!");
        }
    }

    /**
     * Demonstrates JDBC DATABASE OPERATIONS:
     * PreparedStatement, ResultSet, CRUD operations with SQLite.
     */
    private static void databaseManagerMenu() {
        System.out.println("\n--- JDBC DATABASE OPERATIONS ---");
        System.out.println("JDBC Driver Loaded: " + dbManager.isAvailable());
        System.out.println("Database URL: " + dbManager.getDbUrl());

        if (!dbManager.isAvailable()) {
            System.out.println("SQLite JDBC driver not available. Run with lib/sqlite-jdbc.jar in classpath to enable.");
            return;
        }

        System.out.println("1. Sync All Current Network Notes & Peers to Database");
        System.out.println("2. View All Notes Stored in Database (SELECT query via JDBC)");
        System.out.println("3. View All Users Stored in Database (SELECT query via JDBC)");
        System.out.println("4. Search Notes in Database (PreparedStatement LIKE query)");
        System.out.println("5. Return");
        System.out.print("Enter choice (1-5): ");

        int choice = readIntChoice();
        switch (choice) {
            case 1:
                int userSaved = 0;
                for (User u : network.getPeers().values()) {
                    if (dbManager.saveUser(u)) userSaved++;
                }
                int notesSaved = 0;
                for (BaseNote n : network.getAllPublicNotes()) {
                    if (dbManager.saveNote(n, currentPeer.getUsername())) notesSaved++;
                }
                System.out.println(">>> Sync Complete: " + userSaved + " users and " + notesSaved + " notes synced to database.");
                break;
            case 2:
                ArrayList<BaseNote> dbNotes = dbManager.getAllNotes();
                System.out.println("Notes stored in Database (" + dbNotes.size() + "):");
                printNotesList(dbNotes);
                break;
            case 3:
                ArrayList<User> dbUsers = dbManager.getAllUsers();
                System.out.println("Users stored in Database (" + dbUsers.size() + "):");
                for (User u : dbUsers) {
                    System.out.println("  - " + u.toString());
                }
                break;
            case 4:
                System.out.print("Enter search keyword for DB query: ");
                String kw = scanner.nextLine().trim();
                ArrayList<BaseNote> found = dbManager.searchNotes(kw);
                System.out.println("DB Query Results (" + found.size() + "):");
                printNotesList(found);
                break;
            case 5:
                return;
            default:
                System.out.println("Invalid choice!");
        }
    }

    /**
     * Demonstrates REST API SERVER:
     * Controls the embedded HTTP server.
     */
    private static void restApiServerMenu() {
        System.out.println("\n--- REST API SERVER MANAGEMENT ---");
        System.out.println("Server Status : " + (apiServer.isRunning() ? "RUNNING on port " + apiServer.getPort() : "STOPPED"));
        System.out.println("1. Start REST API Server");
        System.out.println("2. Stop REST API Server");
        System.out.println("3. Display Available Endpoints");
        System.out.println("4. Return");
        System.out.print("Enter choice (1-4): ");

        int choice = readIntChoice();
        switch (choice) {
            case 1:
                apiServer.start();
                break;
            case 2:
                apiServer.stop();
                break;
            case 3:
                System.out.println("Available REST Endpoints:");
                System.out.println("  GET    http://localhost:" + apiServer.getPort() + "/api/notes");
                System.out.println("  POST   http://localhost:" + apiServer.getPort() + "/api/notes");
                System.out.println("  GET    http://localhost:" + apiServer.getPort() + "/api/notes/search?keyword=java");
                System.out.println("  GET    http://localhost:" + apiServer.getPort() + "/api/notes/download?id=101");
                System.out.println("  DELETE http://localhost:" + apiServer.getPort() + "/api/notes?id=101&username=alice_cse");
                System.out.println("  POST   http://localhost:" + apiServer.getPort() + "/api/users/register");
                System.out.println("  POST   http://localhost:" + apiServer.getPort() + "/api/users/login");
                System.out.println("  GET    http://localhost:" + apiServer.getPort() + "/api/stats");
                break;
            case 4:
                return;
            default:
                System.out.println("Invalid choice!");
        }
    }

    private static void backgroundSyncMenu() {
        System.out.println("\n--- BACKGROUND SYNC DAEMON THREAD ---");
        boolean isAlive = backgroundSyncThread != null && backgroundSyncThread.isAlive();
        System.out.println("Daemon Thread Status: " + (isAlive ? "RUNNING (Daemon)" : "STOPPED"));
        System.out.println("1. Start Background Sync Thread");
        System.out.println("2. Stop Background Sync Thread");
        System.out.println("3. Return");
        System.out.print("Enter choice (1-3): ");

        int choice = readIntChoice();
        switch (choice) {
            case 1:
                startBackgroundSync();
                break;
            case 2:
                if (backgroundSyncThread != null) {
                    backgroundSyncThread.stopSync();
                    System.out.println("Background sync thread stopped.");
                } else {
                    System.out.println("Sync thread was not running.");
                }
                break;
            case 3:
                return;
            default:
                System.out.println("Invalid choice!");
        }
    }

    private static void startBackgroundSync() {
        if (backgroundSyncThread == null || !backgroundSyncThread.isAlive()) {
            backgroundSyncThread = new BackgroundSync();
            backgroundSyncThread.start();
        }
    }

    // ================= HELPER & FORMATTING METHODS =================

    private static void printNotesTable(Vector<BaseNote> notes) {
        System.out.printf("%-6s | %-12s | %-32s | %-18s | %-10s | %-6s\n", "ID", "Type", "Title", "Author", "Dept", "Views");
        System.out.println("---------------------------------------------------------------------------------------------------");
        for (int i = 0; i < notes.size(); i++) {
            BaseNote n = notes.get(i);
            String displayTitle = (n.getTitle().length() > 30) ? n.getTitle().substring(0, 27) + "..." : n.getTitle();
            System.out.printf("#%-5d | %-12s | %-32s | %-18s | %-10s | %-6d\n",
                    n.getNoteId(), n.getNoteType(), displayTitle, n.getAuthor(), n.getDepartment(), n.getAccessCount());
        }
    }

    private static void printNotesList(ArrayList<BaseNote> notes) {
        System.out.printf("%-6s | %-12s | %-32s | %-18s | %-10s | %-6s\n", "ID", "Type", "Title", "Author", "Dept", "Views");
        System.out.println("---------------------------------------------------------------------------------------------------");
        for (BaseNote n : notes) {
            String displayTitle = (n.getTitle().length() > 30) ? n.getTitle().substring(0, 27) + "..." : n.getTitle();
            System.out.printf("#%-5d | %-12s | %-32s | %-18s | %-10s | %-6d\n",
                    n.getNoteId(), n.getNoteType(), displayTitle, n.getAuthor(), n.getDepartment(), n.getAccessCount());
        }
    }

    // Helper method to safely read integers without crashing on empty or mismatched lines
    private static int readIntChoice() {
        String line = scanner.nextLine().trim();
        if (line.isEmpty()) {
            return -1;
        }
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c < '0' || c > '9') {
                return -1;
            }
        }
        try {
            return Integer.parseInt(line);
        } catch (NumberFormatException e) {
            return -1;
        }
    }
}
