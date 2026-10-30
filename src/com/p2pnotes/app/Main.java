package com.p2pnotes.app;

import com.p2pnotes.model.BaseNote;
import com.p2pnotes.model.LectureNote;
import com.p2pnotes.model.SummaryCheatSheet;
import com.p2pnotes.model.User;
import com.p2pnotes.service.PeerNetwork;

import java.util.ArrayList;
import java.util.Scanner;
import java.util.Vector;

/**
 * Main application entry point providing console UI for the Peer-to-Peer Notes Sharing System.
 * 
 * Demonstrates:
 * - Scanner input (nextLine()) (Module 01, Experiment 1)
 * - Control structures: while loop, switch-case, if-else if-else (Module 01, Experiment 1)
 * - 1D Arrays and iteration (Module 01 & Module 05)
 * - String operations: trim(), isEmpty(), toUpperCase(), substring(), charAt() (Module 05, Experiment 1)
 * - Safe numeric parsing with Integer.parseInt() without unstudied exception syntax (Module 05, Experiment 1)
 */
public class Main {
    private static Scanner scanner = new Scanner(System.in);
    private static PeerNetwork network = new PeerNetwork();
    private static User currentPeer = null;

    public static void main(String[] args) {
        System.out.println("===============================================================");
        System.out.println("       WELCOME TO PEER-TO-PEER (P2P) NOTES SHARING SYSTEM       ");
        System.out.println("   College Project - Object Oriented Programming with Java     ");
        System.out.println("===============================================================");

        boolean running = true;
        while (running) {
            if (currentPeer == null) {
                running = showAuthenticationMenu();
            } else {
                showPeerDashboardMenu();
            }
        }

        System.out.println("\nThank you for using Peer-to-Peer Notes Sharing System. Goodbye!");
        scanner.close();
    }

    // Top-level Authentication / Guest Menu
    private static boolean showAuthenticationMenu() {
        System.out.println("\n------------- MAIN MENU -------------");
        System.out.println("1. Login as Existing Peer");
        System.out.println("2. Register as New Peer");
        System.out.println("3. View Network Statistics & Public Peers");
        System.out.println("4. Exit Application");
        System.out.print("Enter your choice (1-4): ");

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
                return false;
            default:
                System.out.println("Invalid selection! Please enter a number between 1 and 4.");
        }
        return true;
    }

    // Dashboard for an authenticated Peer
    private static void showPeerDashboardMenu() {
        System.out.println("\n================ PEER DASHBOARD ================");
        System.out.println("Logged in as : " + currentPeer.getFullName() + " (@" + currentPeer.getUsername() + ")");
        System.out.println("Department   : " + currentPeer.getDepartment() + " | Reputation: " + currentPeer.getReputationScore() + " pts");
        System.out.println("------------------------------------------------");
        System.out.println("1. Browse All Available Notes on P2P Network");
        System.out.println("2. Search Notes by Keyword or Department");
        System.out.println("3. Share / Upload a New Note");
        System.out.println("4. View & Read Note Full Content");
        System.out.println("5. Download a Note to My Local Collection");
        System.out.println("6. View My Local Notes (Shared & Downloaded)");
        System.out.println("7. Remove a Note from My Shared Collection");
        System.out.println("8. View My Peer Profile & Reputation");
        System.out.println("9. Logout");
        System.out.print("Enter your choice (1-9): ");

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
                downloadNote();
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
                System.out.println("Logging out from peer session @" + currentPeer.getUsername() + "...");
                currentPeer = null;
                break;
            default:
                System.out.println("Invalid selection! Please enter a number between 1 and 9.");
        }
    }

    private static void handleLogin() {
        System.out.println("\n--- Peer Login ---");
        System.out.print("Enter Username: ");
        String username = scanner.nextLine().trim();
        System.out.print("Enter Password: ");
        String password = scanner.nextLine().trim();

        User user = network.authenticate(username, password);
        if (user != null) {
            currentPeer = user;
            System.out.println(">>> Login Successful! Welcome back, " + currentPeer.getFullName() + "!");
        } else {
            System.out.println(">>> Error: Invalid username or password! Please try again.");
        }
    }

    private static void handleRegistration() {
        System.out.println("\n--- Peer Registration ---");
        System.out.print("Choose Username: ");
        String username = scanner.nextLine().trim();
        if (username.isEmpty()) {
            System.out.println(">>> Username cannot be empty.");
            return;
        }

        System.out.print("Choose Password: ");
        String password = scanner.nextLine().trim();
        if (password.isEmpty()) {
            System.out.println(">>> Password cannot be empty.");
            return;
        }

        System.out.print("Enter Full Name: ");
        String fullName = scanner.nextLine().trim();

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

        User newPeer = new User(username, password, fullName, department);
        boolean registered = network.registerPeer(newPeer);
        if (registered) {
            System.out.println(">>> Registration successful! You can now log in with @" + username);
        } else {
            System.out.println(">>> Registration failed: Username @" + username + " is already taken!");
        }
    }

    private static void displayRegisteredPeers() {
        System.out.println("List of Connected Peers in Network:");
        int idx = 1;
        for (User u : network.getPeers().values()) {
            System.out.printf("  %d. %s (@%s) - Dept: %s | Shared Notes: %d\n",
                    idx++, u.getFullName(), u.getUsername(), u.getDepartment(), u.getSharedNotes().size());
        }
    }

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

        ArrayList<BaseNote> results = network.searchNotes(query, deptFilter);
        System.out.println("\nSearch Results (" + results.size() + " matches found):");
        if (results.isEmpty()) {
            System.out.println("No notes matched your search criteria.");
        } else {
            printNotesList(results);
        }
    }

    private static void uploadNoteMenu() {
        System.out.println("\n--- Share / Upload a New Note ---");
        System.out.println("Select Note Type:");
        System.out.println("  1. Lecture Note (Classroom details, prof, lecture number)");
        System.out.println("  2. Revision Cheat-Sheet (Key formulas, summary bullet points)");
        System.out.print("Enter choice (1-2): ");
        int typeChoice = readIntChoice();

        System.out.print("Enter Note Title: ");
        String title = scanner.nextLine().trim();
        if (title.isEmpty()) {
            System.out.println("Title cannot be blank!");
            return;
        }

        String department = currentPeer.getDepartment();

        if (typeChoice == 1) {
            System.out.print("Enter Course Code (e.g. PCC12CE07): ");
            String courseCode = scanner.nextLine().trim();
            System.out.print("Enter Professor Name: ");
            String prof = scanner.nextLine().trim();
            System.out.print("Enter Lecture Number: ");
            int lecNum = readIntChoice();
            System.out.print("Enter Note Content: ");
            String content = scanner.nextLine().trim();

            LectureNote note = new LectureNote(title, currentPeer.getFullName(), department,
                    courseCode, prof, lecNum, content);
            network.publishNote(currentPeer, note);
            System.out.println(">>> Lecture Note shared successfully! Generated Note ID: #" + note.getNoteId());
            System.out.println(">>> +5 Reputation points awarded to peer @" + currentPeer.getUsername());

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

            SummaryCheatSheet cheatSheet = new SummaryCheatSheet(title, currentPeer.getFullName(), department,
                    exam, formulas, summaryPoints);
            network.publishNote(currentPeer, cheatSheet);
            System.out.println(">>> Cheat-Sheet shared successfully! Generated Note ID: #" + cheatSheet.getNoteId());
            System.out.println(">>> +5 Reputation points awarded to peer @" + currentPeer.getUsername());
        } else {
            System.out.println("Invalid note type selected.");
        }
    }

    private static void readNoteContent() {
        System.out.print("\nEnter Note ID to read: ");
        int id = readIntChoice();
        BaseNote note = network.findNoteById(id);
        if (note != null) {
            // Polymorphic method call
            note.displayFullContent();
        } else {
            System.out.println(">>> Note with ID #" + id + " not found on the network.");
        }
    }

    private static void downloadNote() {
        System.out.print("\nEnter Note ID to download to your local library: ");
        int id = readIntChoice();
        boolean success = network.downloadNoteToPeer(currentPeer, id);
        if (success) {
            System.out.println(">>> Note #" + id + " downloaded successfully to your local library!");
        } else {
            System.out.println(">>> Download failed. Either note does not exist, or it is already in your library.");
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
            System.out.println(">>> Note #" + id + " has been successfully removed from network and your shared list.");
        } else {
            System.out.println(">>> Note #" + id + " could not be removed. Ensure it belongs to your shared list.");
        }
    }

    private static void printNotesTable(Vector<BaseNote> notes) {
        System.out.printf("%-6s | %-32s | %-16s | %-10s | %-6s\n", "ID", "Title", "Author", "Dept", "Views");
        System.out.println("----------------------------------------------------------------------------------");
        for (int i = 0; i < notes.size(); i++) {
            BaseNote n = notes.get(i);
            String displayTitle = (n.getTitle().length() > 30) ? n.getTitle().substring(0, 27) + "..." : n.getTitle();
            System.out.printf("#%-5d | %-32s | %-16s | %-10s | %-6d\n",
                    n.getNoteId(), displayTitle, n.getAuthor(), n.getDepartment(), n.getAccessCount());
        }
    }

    private static void printNotesList(ArrayList<BaseNote> notes) {
        System.out.printf("%-6s | %-32s | %-16s | %-10s | %-6s\n", "ID", "Title", "Author", "Dept", "Views");
        System.out.println("----------------------------------------------------------------------------------");
        for (BaseNote n : notes) {
            String displayTitle = (n.getTitle().length() > 30) ? n.getTitle().substring(0, 27) + "..." : n.getTitle();
            System.out.printf("#%-5d | %-32s | %-16s | %-10s | %-6d\n",
                    n.getNoteId(), displayTitle, n.getAuthor(), n.getDepartment(), n.getAccessCount());
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
        return Integer.parseInt(line);
    }
}
