package com.p2pnotes.thread;

import com.p2pnotes.util.AppConstants;

/**
 * Background daemon thread that periodically logs network statistics.
 *
 * Demonstrates:
 * - Multithreading: extends Thread class (alternative to Runnable)
 * - Daemon thread (runs in background, does not prevent JVM exit)
 * - Thread lifecycle: start, sleep, interrupt
 * - Synchronized access to shared AppConstants counters
 * - Final keyword for interval constant
 */
public class BackgroundSync extends Thread {

    private static final int SYNC_INTERVAL_MS = 30000; // 30 seconds
    private volatile boolean running;

    /**
     * Constructor: sets this thread as a daemon thread with a descriptive name.
     */
    public BackgroundSync() {
        super("P2P-BackgroundSync");
        this.setDaemon(true); // Daemon thread: won't prevent JVM from exiting
        this.running = true;
    }

    @Override
    public void run() {
        System.out.println("[BackgroundSync] Background sync thread started (daemon).");
        while (running && !Thread.currentThread().isInterrupted()) {
            try {
                Thread.sleep(SYNC_INTERVAL_MS);
            } catch (InterruptedException e) {
                System.out.println("[BackgroundSync] Sync thread interrupted, stopping.");
                Thread.currentThread().interrupt();
                break;
            }

            // Log periodic stats
            System.out.println("\n[BackgroundSync] --- Periodic Network Snapshot ---");
            System.out.println("[BackgroundSync] Registered Users: " + AppConstants.getTotalRegisteredUsers());
            System.out.println("[BackgroundSync] Notes Shared    : " + AppConstants.getTotalNotesShared());
            System.out.println("[BackgroundSync] Total Downloads : " + AppConstants.getTotalDownloads());
            System.out.println("[BackgroundSync] Active Transfers: " + TransferTask.getActiveTransfers());
            System.out.println("[BackgroundSync] ---------------------------------\n");
        }
        System.out.println("[BackgroundSync] Background sync thread stopped.");
    }

    /**
     * Gracefully stops the background sync thread.
     */
    public void stopSync() {
        this.running = false;
        this.interrupt();
    }
}
