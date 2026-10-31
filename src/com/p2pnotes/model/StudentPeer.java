package com.p2pnotes.model;

/**
 * Specialized subclass representing a student peer in the P2P network.
 * 
 * Demonstrates:
 * - Inheritance (extends User)
 * - super keyword: calling parent constructor super(...)
 * - super keyword: calling parent method super.displayProfile()
 * - Method Overriding with @Override annotation
 * - Specialized fields (studentId, semester)
 * - Polymorphism in action
 */
public class StudentPeer extends User {
    private String studentId;
    private int semester;

    public StudentPeer(String username, String password, String fullName, String department,
                       String studentId, int semester) {
        super(username, password, fullName, department); // Call parent User constructor
        this.studentId = studentId;
        this.semester = semester;
    }

    public String getStudentId() {
        return this.studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public int getSemester() {
        return this.semester;
    }

    public void setSemester(int semester) {
        this.semester = semester;
    }

    @Override
    public String getRole() {
        return "STUDENT";
    }

    @Override
    public void displayProfile() {
        super.displayProfile(); // Call parent displayProfile()
        System.out.println("Student ID       : " + this.studentId);
        System.out.println("Semester         : Semester " + this.semester);
        System.out.println("------------------------------------------------\n");
    }

    @Override
    public String toString() {
        return super.toString() + " | Sem: " + this.semester + " | ID: " + this.studentId;
    }
}
