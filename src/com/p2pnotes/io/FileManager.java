package com.p2pnotes.io;

import com.p2pnotes.model.BaseNote;
import com.p2pnotes.util.AppConstants;
import com.p2pnotes.util.StringUtils;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;

/**
 * Handles file I/O operations for saving, reading, copying, and deleting note files.
 *
 * Demonstrates:
 * - File Handling: File, FileReader, FileWriter, BufferedReader, BufferedWriter
 * - Try-with-resources for automatic resource management
 * - Exception handling (try-catch-finally)
 * - Method Overloading (saveNoteToFile with different parameters)
 * - String manipulation for filenames
 * - Final keyword (final directory path)
 */
public class FileManager {

    private final String storageDirectory;

    /**
     * Default constructor: uses the default notes directory.
     */
    public FileManager() {
        this(AppConstants.NOTES_DIRECTORY);
    }

    /**
     * Constructor overloading: accepts a custom storage directory.
     */
    public FileManager(String directory) {
        this.storageDirectory = directory;
        initializeDirectory();
    }

    /**
     * Creates the storage directory if it does not exist.
     */
    private void initializeDirectory() {
        File dir = new File(this.storageDirectory);
        if (!dir.exists()) {
            boolean created = dir.mkdirs();
            if (created) {
                System.out.println("[FileManager] Storage directory created: " + dir.getAbsolutePath());
            }
        }
    }

    /**
     * Saves a note to a file using its formatted export text.
     * Method Overloading variant 1: auto-generates filename from note title.
     *
     * Uses: try-with-resources, BufferedWriter, File
     */
    public boolean saveNoteToFile(BaseNote note) {
        String filename = StringUtils.sanitizeFilename(note.getTitle()) + ".txt";
        return saveNoteToFile(note, filename);
    }

    /**
     * Saves a note to a file with a specified filename.
     * Method Overloading variant 2: accepts explicit filename.
     *
     * Uses: try-with-resources, BufferedWriter, FileWriter
     */
    public boolean saveNoteToFile(BaseNote note, String filename) {
        String content = note.exportFormattedText();
        return saveNoteToFile(filename, content);
    }

    /**
     * Saves raw text content to a file.
     * Method Overloading variant 3: accepts raw string content.
     *
     * Uses: try-with-resources, BufferedWriter, FileWriter
     */
    public boolean saveNoteToFile(String filename, String content) {
        if (StringUtils.isNullOrEmpty(filename) || StringUtils.isNullOrEmpty(content)) {
            System.out.println("[FileManager] Error: filename or content cannot be empty.");
            return false;
        }

        if (!validateFilename(filename)) {
            System.out.println("[FileManager] Error: Invalid filename '" + filename + "'.");
            return false;
        }

        File file = new File(this.storageDirectory, filename);
        // try-with-resources: writer is automatically closed
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            writer.write(content);
            writer.flush();
            System.out.println("[FileManager] Note saved successfully: " + file.getAbsolutePath());
            return true;
        } catch (IOException e) {
            System.out.println("[FileManager] Error writing file: " + e.getMessage());
            return false;
        }
    }

    /**
     * Reads the content of a note file.
     *
     * Uses: try-with-resources, BufferedReader, FileReader, StringBuilder
     */
    public String readNoteFromFile(String filename) {
        File file = new File(this.storageDirectory, filename);
        if (!file.exists() || !file.isFile()) {
            System.out.println("[FileManager] File not found: " + filename);
            return null;
        }

        StringBuilder content = new StringBuilder();
        // try-with-resources: reader is automatically closed
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }
        } catch (IOException e) {
            System.out.println("[FileManager] Error reading file: " + e.getMessage());
            return null;
        }
        return content.toString();
    }

    /**
     * Copies a note file from source to destination within the storage directory.
     *
     * Uses: BufferedReader, BufferedWriter, try-with-resources
     */
    public boolean copyNoteFile(String sourceFilename, String destFilename) {
        File sourceFile = new File(this.storageDirectory, sourceFilename);
        File destFile = new File(this.storageDirectory, destFilename);

        if (!sourceFile.exists()) {
            System.out.println("[FileManager] Source file not found: " + sourceFilename);
            return false;
        }

        try (BufferedReader reader = new BufferedReader(new FileReader(sourceFile));
             BufferedWriter writer = new BufferedWriter(new FileWriter(destFile))) {
            String line;
            while ((line = reader.readLine()) != null) {
                writer.write(line);
                writer.newLine();
            }
            System.out.println("[FileManager] File copied: " + sourceFilename + " -> " + destFilename);
            return true;
        } catch (IOException e) {
            System.out.println("[FileManager] Error copying file: " + e.getMessage());
            return false;
        }
    }

    /**
     * Deletes a note file from the storage directory.
     */
    public boolean deleteNoteFile(String filename) {
        File file = new File(this.storageDirectory, filename);
        if (!file.exists()) {
            System.out.println("[FileManager] File not found: " + filename);
            return false;
        }
        boolean deleted = file.delete();
        if (deleted) {
            System.out.println("[FileManager] File deleted: " + filename);
        } else {
            System.out.println("[FileManager] Could not delete file: " + filename);
        }
        return deleted;
    }

    /**
     * Lists all note files in the storage directory.
     *
     * Uses: File.listFiles(), ArrayList
     */
    public ArrayList<String> listNoteFiles() {
        ArrayList<String> fileNames = new ArrayList<>();
        File dir = new File(this.storageDirectory);
        if (dir.exists() && dir.isDirectory()) {
            File[] files = dir.listFiles();
            if (files != null) {
                for (File f : files) {
                    if (f.isFile()) {
                        fileNames.add(f.getName());
                    }
                }
            }
        }
        return fileNames;
    }

    /**
     * Validates a filename: checks length, extension, and dangerous characters.
     *
     * Uses: String methods — length(), contains(), endsWith(), toLowerCase()
     */
    public boolean validateFilename(String filename) {
        if (StringUtils.isNullOrEmpty(filename)) {
            return false;
        }
        if (filename.length() > AppConstants.MAX_FILENAME_LENGTH) {
            return false;
        }
        // Check for path traversal attacks
        if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
            return false;
        }
        // Validate extension
        String extension = StringUtils.getFileExtension(filename);
        if (extension.isEmpty()) {
            return true; // Allow extensionless files
        }
        for (String allowed : AppConstants.ALLOWED_FILE_EXTENSIONS) {
            if (extension.equals(allowed)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Validates file size (in bytes) against the maximum allowed limit.
     */
    public boolean validateFileSize(long sizeInBytes) {
        long maxBytes = (long) AppConstants.MAX_FILE_SIZE_MB * 1024 * 1024;
        return sizeInBytes >= 0 && sizeInBytes <= maxBytes;
    }

    /**
     * Gets the full path for a note file.
     */
    public String getFilePath(String filename) {
        return new File(this.storageDirectory, filename).getAbsolutePath();
    }

    /**
     * Returns the storage directory path.
     */
    public String getStorageDirectory() {
        return this.storageDirectory;
    }
}
