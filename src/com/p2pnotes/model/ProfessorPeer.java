package com.p2pnotes.model;

/**
 * Specialized subclass representing a faculty / professor peer in the P2P network.
 * 
 * Demonstrates:
 * - Inheritance (extends User)
 * - super keyword: calling parent constructor super(...)
 * - super keyword: calling parent method super.displayProfile()
 * - Method Overriding with @Override
 * - Specialized fields (designation, cabinNumber)
 * - Higher starting reputation bonus for professors
 */
public class ProfessorPeer extends User {
    private String designation;
    private String cabinNumber;

    public ProfessorPeer(String username, String password, String fullName, String department,
                         String designation, String cabinNumber) {
        super(username, password, fullName, department); // Call parent constructor
        this.designation = designation;
        this.cabinNumber = cabinNumber;
        this.setReputationScore(50); // Faculty starts with higher verified reputation
    }

    public String getDesignation() {
        return this.designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getCabinNumber() {
        return this.cabinNumber;
    }

    public void setCabinNumber(String cabinNumber) {
        this.cabinNumber = cabinNumber;
    }

    @Override
    public String getRole() {
        return "FACULTY";
    }

    @Override
    public void displayProfile() {
        super.displayProfile(); // Call parent displayProfile()
        System.out.println("Designation      : " + this.designation);
        System.out.println("Faculty Cabin    : " + this.cabinNumber);
        System.out.println("Verified Status  : [Official Course Instructor]");
        System.out.println("------------------------------------------------\n");
    }

    @Override
    public String toString() {
        return super.toString() + " | Title: " + this.designation + " | Cabin: " + this.cabinNumber;
    }
}

