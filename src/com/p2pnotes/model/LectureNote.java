package com.p2pnotes.model;

/**
 * Concrete subclass representing detailed classroom lecture notes.
 * Demonstrates:
 * - Inheritance (extends BaseNote)
 * - "super" keyword to invoke parent constructor and parent method
 * - Method Overriding with @Override annotation
 * - String manipulation and case conversion
 * - StringBuilder for mutable string construction
 */
public class LectureNote extends BaseNote {
    private String courseCode;
    private String professorName;
    private int lectureNumber;
    private String content;

    // Parameterized constructor invoking parent constructor using super(...)
    public LectureNote(String title, String author, String department, 
                       String courseCode, String professorName, int lectureNumber, String content) {
        super(title, author, department); // Parent constructor call
        this.courseCode = courseCode;
        this.professorName = professorName;
        this.lectureNumber = lectureNumber;
        this.content = content;
    }

    public String getCourseCode() {
        return this.courseCode;
    }

    public String getProfessorName() {
        return this.professorName;
    }

    public int getLectureNumber() {
        return this.lectureNumber;
    }

    public String getContent() {
        return this.content;
    }

    @Override
    public String getNoteType() {
        return "LECTURE_NOTE";
    }

    // Overriding parent displayDetails to add lecture-specific attributes
    @Override
    public void displayDetails() {
        super.displayDetails(); // Call parent class displayDetails
        System.out.println("Course Code  : " + this.courseCode);
        System.out.println("Professor    : " + this.professorName);
        System.out.println("Lecture No.  : " + this.lectureNumber);
    }

    // Concrete implementation of abstract method from BaseNote
    @Override
    public void displayFullContent() {
        incrementAccess();
        System.out.println("\n==================================================");
        System.out.println(" LECTURE NOTE: " + getTitle().toUpperCase());
        System.out.println(" Course: " + this.courseCode + " | Lecture #" + this.lectureNumber);
        System.out.println(" Instructor: Prof. " + this.professorName);
        System.out.println(" Contributor: " + getAuthor() + " (" + getDepartment() + ")");
        System.out.println("--------------------------------------------------");
        System.out.println("CONTENT:\n" + this.content);
        System.out.println("==================================================\n");
    }

    // Implementing export method from Shareable using StringBuilder
    @Override
    public String exportFormattedText() {
        StringBuilder sb = new StringBuilder();
        sb.append("=== ").append(getTitle()).append(" ===\n");
        sb.append("Course Code : ").append(this.courseCode).append("\n");
        sb.append("Lecture No. : ").append(this.lectureNumber).append("\n");
        sb.append("Notes Body  :\n").append(this.content).append("\n");
        return sb.toString();
    }

    @Override
    public String toString() {
        return super.toString() + String.format(" [Course: %s, Lec #%d]", this.courseCode, this.lectureNumber);
    }
}
