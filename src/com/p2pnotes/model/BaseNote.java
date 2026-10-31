package com.p2pnotes.model;

/**
 * Abstract base class representing common attributes and behaviors of all educational notes.
 * Demonstrates:
 * - Abstract class and abstract methods (displayFullContent, getNoteType)
 * - Implementing an Interface (implements Shareable)
 * - Encapsulation (private fields, getters, setters)
 * - Static class variable (auto-incrementing note ID counter)
 * - Constructor overloading and "this" keyword
 * - "final" keyword for immutable note ID and final getter method
 * - Method Overloading (matches keyword vs matches keyword + dept)
 * - Method Overriding (toString, displayDetails)
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

    // Final accessor method: Subclasses cannot override getNoteId(), ensuring ID integrity
    public final int getNoteId() {
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

    // Method Overloading Variant 1: Check match by search keyword
    public boolean matches(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return true;
        }
        String clean = keyword.trim().toLowerCase();
        return this.title.toLowerCase().contains(clean) || this.author.toLowerCase().contains(clean);
    }

    // Method Overloading Variant 2: Check match by keyword AND department filter
    public boolean matches(String keyword, String departmentFilter) {
        boolean keywordMatch = matches(keyword);
        if (departmentFilter == null || departmentFilter.trim().isEmpty() || departmentFilter.equalsIgnoreCase("ALL")) {
            return keywordMatch;
        }
        return keywordMatch && this.department.equalsIgnoreCase(departmentFilter.trim());
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
        System.out.println("Note Type    : " + getNoteType());
        System.out.println("Title        : " + this.title);
        System.out.println("Author       : " + this.author);
        System.out.println("Department   : " + this.department);
        System.out.println("Access Count : " + this.accessCount);
    }

    // Abstract methods: Every specific note type must define how its full body is displayed and its type label
    public abstract void displayFullContent();
    public abstract String getNoteType();

    @Override
    public String toString() {
        return String.format("#%d [%s] %s (by %s, %s) - %d views",
                this.noteId, getNoteType(), this.title, this.author, this.department, this.accessCount);
    }
}
