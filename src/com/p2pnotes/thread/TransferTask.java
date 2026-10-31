package com.p2pnotes.thread;

import com.p2pnotes.model.BaseNote;
import com.p2pnotes.io.FileManager;
import com.p2pnotes.util.AppConstants;

/**
 * Represents a file transfer (download/upload) task that runs in its own
 * thread.
 *
 * Demonstrates:
 * - Multithreading: implements Runnable interface
 * - Thread execution with progress tracking
 * - Synchronized access to shared static counter
 * - Thread.sleep() for simulating network latency
 * - Final keyword (final fields)
 */
public class TransferTask implements Runnable {

    // Shared counter across all transfer threads (requires synchronization)
    private static int activeTransfers = 0;
    private static int completedTransfers = 0;
    private static final Object LOCK = new Object();

    private final String taskId;
    private final BaseNote note;
    private final String downloaderUsername;
    private final FileManager fileManager;
    private boolean completed;
    private boolean success;

    public TransferTask(String taskId, BaseNote note, String downloaderUsername, FileManager fileManager) {
        this.taskId = taskId;
        this.note = note;
        this.downloaderUsername = downloaderUsername;
        this.fileManager = fileManager;
        this.completed = false;
        this.success = false;
    }

    @Override
    public void run() {
        synchronized (LOCK) {
            activeTransfers++;
        }

        String threadName = Thread.currentThread().getName();
        System.out.println("[Transfer " + taskId + "] Started on thread: " + threadName);
        System.out.println("[Transfer " + taskId + "] Downloading: " + note.getTitle());

        // Simulate file transfer with progress
        int totalSteps = 5;
        for (int step = 1; step <= totalSteps; step++) {
            int percent = (step * 100) / totalSteps;
            System.out.println("[Transfer " + taskId + "] Progress: " + percent + "% ...");
            try {
                Thread.sleep(300); // Simulate network latency
            } catch (InterruptedException e) {
                System.out.println("[Transfer " + taskId + "] Transfer interrupted!");
                Thread.currentThread().interrupt();
                markComplete(false);
                return;
            }
        }

        // Save the note content to a file
        String filename = downloaderUsername + "_" + note.getNoteId() + ".txt";
        boolean saved = fileManager.saveNoteToFile(note, filename);

        if (saved) {
            synchronized (LOCK) {
                AppConstants.incrementDownloads();
            }
            System.out.println("[Transfer " + taskId + "] Download complete! Saved as: " + filename);
            markComplete(true);
        } else {
            System.out.println("[Transfer " + taskId + "] Download failed - file save error.");
            markComplete(false);
        }
    }

    private void markComplete(boolean success) {
        this.success = success;
        this.completed = true;
        synchronized (LOCK) {
            activeTransfers--;
            completedTransfers++;
        }
    }

    // Getters
    public String getTaskId() {
        return taskId;
    }

    public boolean isCompleted() {
        return completed;
    }

    public boolean isSuccess() {
        return success;
    }

    // Static synchronized methods for shared counter access
    public static synchronized int getActiveTransfers() {
        return activeTransfers;
    }

    public static synchronized int getCompletedTransfers() {
        return completedTransfers;
    }

    public static synchronized void resetCounters() {
        activeTransfers = 0;
        completedTransfers = 0;
    }
}
