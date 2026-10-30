package com.p2pnotes.model;

/**
 * Abstract base class representing common attributes and behaviors of all educational notes.
 * Demonstrates:
 * - Abstract class and abstract method (Module 03, Experiment 3)
 * - Implementing an Interface (implements Shareable)
 * - Encapsulation (private fields, getters, setters) (Module 02, Experiment 2)
 * - Static class variable (auto-incrementing note ID counter) (Module 02, Experiment 2)
 * - Constructor overloading and "this" keyword (Module 02, Experiment 2)
 * - "final" keyword for immutable note ID (Module 03, Experiment 3)
 */
public abstract class BaseNote implements Shareable {
    // Static class variable to generate unique IDs across all notes
    private static int idCounter = 100;

    // Final variable: Once assigned in constructor, noteId cannot be modified
    private final int noteId;
    private String title;
    private String author;
    private String department;
    private int accessCount;

    // Default constructor (Demonstrates Constructor Overloading)
    public BaseNote() {
        this("Untitled Note", "Anonymous", "GENERAL");
    }

    // Parameterized constructor
    public BaseNote(String title, String author, String department) {
        this.noteId = ++idCounter;
        this.title = title;
        this.author = author;
        this.department = department;
        this.accessCount = 0;
    }

    // Accessor (getter) methods
    public int getNoteId() {
        return this.noteId;
    }

    public String getTitle() {
        return this.title;
    }

    public String getAuthor() {
        return this.author;
    }

    public String getDepartment() {
        return this.department;
    }

    public int getAccessCount() {
        return this.accessCount;
    }

    // Mutator (setter) methods
    public void setTitle(String title) {
        if (title != null && !title.trim().isEmpty()) {
            this.title = title.trim();
        }
    }

    public void setDepartment(String department) {
        if (department != null && !department.trim().isEmpty()) {
            this.department = department.trim();
        }
    }

    public void incrementAccess() {
        this.accessCount++;
    }

    // Implementation of Shareable interface method
    @Override
    public String getShareableTitle() {
        return "[" + this.department + "] " + this.title;
    }

    // Concrete method common to all note types
    @Override
    public void displayDetails() {
        System.out.println("Note ID      : #" + this.noteId);
        System.out.println("Title        : " + this.title);
        System.out.println("Author       : " + this.author);
        System.out.println("Department   : " + this.department);
        System.out.println("Access Count : " + this.accessCount);
    }

    // Abstract method: Every specific note type must define how its full body is displayed
    public abstract void displayFullContent();
}
