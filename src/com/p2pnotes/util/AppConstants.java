package com.p2pnotes.util;

/**
 * Application-wide constants and shared counters for the P2P Notes Sharing
 * System.
 *
 * Demonstrates:
 * - Static Variables: Shared counters accessible across the application
 * - Final Keyword: Immutable constants (final variables, final class)
 * - Private constructor: Utility class pattern
 */
public final class AppConstants {

    // ── Final Constants ──────────────────────────────────────────────────
    public static final String APP_NAME = "Peer-to-Peer Notes Sharing System";
    public static final String APP_VERSION = "2.0";
    public static final int MAX_FILE_SIZE_MB = 10;
    public static final int MAX_FILENAME_LENGTH = 100;
    public static final String NOTES_DIRECTORY = "p2p_notes_storage";
    public static final String DB_DIRECTORY = "p2p_data";
    public static final String DB_FILENAME = "p2pnotes.db";
    public static final int API_PORT = 7070;

    public static final String[] ALLOWED_FILE_EXTENSIONS = { ".txt", ".pdf", ".md", ".java", ".docx" };

    // ── Static Variables (shared counters) ───────────────────────────────
    private static int totalRegisteredUsers = 0;
    private static int totalNotesShared = 0;
    private static int totalDownloads = 0;

    // Private constructor — prevents instantiation of utility class
    private AppConstants() {
        // Utility class: no instances allowed
    }

    // ── Static counter methods ───────────────────────────────────────────
    public static synchronized void incrementRegisteredUsers() {
        totalRegisteredUsers++;
    }

    public static synchronized void incrementNotesShared() {
        totalNotesShared++;
    }

    public static synchronized void incrementDownloads() {
        totalDownloads++;
    }

    public static int getTotalRegisteredUsers() {
        return totalRegisteredUsers;
    }

    public static int getTotalNotesShared() {
        return totalNotesShared;
    }

    public static int getTotalDownloads() {
        return totalDownloads;
    }

    public static void setTotalRegisteredUsers(int count) {
        totalRegisteredUsers = count;
    }

    public static void setTotalNotesShared(int count) {
        totalNotesShared = count;
    }

    public static void setTotalDownloads(int count) {
        totalDownloads = count;
    }

    /**
     * Returns a formatted summary of all global application statistics.
     */
    public static String getGlobalStats() {
        return APP_NAME + " v" + APP_VERSION + "\n" +
                "  Total Registered Users : " + totalRegisteredUsers + "\n" +
                "  Total Notes Shared     : " + totalNotesShared + "\n" +
                "  Total Downloads        : " + totalDownloads;
    }
}
