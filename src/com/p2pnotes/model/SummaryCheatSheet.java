package com.p2pnotes.model;

/**
 * Concrete subclass representing revision cheat-sheets with formula arrays and key points.
 * Demonstrates:
 * - Inheritance (extends BaseNote)
 * - 1D Arrays of Strings (formulas)
 * - Array iteration (enhanced for loop)
 * - String split and trim methods
 * - StringBuilder for performance-conscious string building
 * - Method Overriding (getNoteType, toString)
 */
public class SummaryCheatSheet extends BaseNote {
    private String examTarget;
    private String[] keyFormulas; // Demonstrates 1D array of strings
    private String keyPointsSummary;

    public SummaryCheatSheet(String title, String author, String department, 
                             String examTarget, String[] keyFormulas, String keyPointsSummary) {
        super(title, author, department);
        this.examTarget = examTarget;
        this.keyFormulas = keyFormulas;
        this.keyPointsSummary = keyPointsSummary;
    }

    public String getExamTarget() {
        return this.examTarget;
    }

    public String[] getKeyFormulas() {
        return this.keyFormulas;
    }

    public String getKeyPointsSummary() {
        return this.keyPointsSummary;
    }

    @Override
    public String getNoteType() {
        return "CHEAT_SHEET";
    }

    @Override
    public void displayDetails() {
        super.displayDetails();
        System.out.println("Target Exam  : " + this.examTarget);
        int formulaCount = (this.keyFormulas != null) ? this.keyFormulas.length : 0;
        System.out.println("Formula Count: " + formulaCount);
    }

    @Override
    public void displayFullContent() {
        incrementAccess();
        System.out.println("\n==================================================");
        System.out.println(" CHEAT-SHEET: " + getTitle().toUpperCase());
        System.out.println(" Target Exam : " + this.examTarget);
        System.out.println(" Contributor : " + getAuthor() + " (" + getDepartment() + ")");
        System.out.println("--------------------------------------------------");
        System.out.println("KEY FORMULAS / QUICK RULES:");
        if (this.keyFormulas != null && this.keyFormulas.length > 0) {
            for (int i = 0; i < this.keyFormulas.length; i++) {
                System.out.println("  " + (i + 1) + ". " + this.keyFormulas[i]);
            }
        } else {
            System.out.println("  (No formulas registered)");
        }
        System.out.println("--------------------------------------------------");
        System.out.println("HIGH-YIELD SUMMARY POINTS:");
        // Using String split method to extract bullet points separated by semicolon
        String[] points = this.keyPointsSummary.split(";");
        for (String point : points) {
            String trimmedPoint = point.trim();
            if (!trimmedPoint.isEmpty()) {
                System.out.println("  * " + trimmedPoint);
            }
        }
        System.out.println("==================================================\n");
    }

    @Override
    public String exportFormattedText() {
        StringBuilder sb = new StringBuilder();
        sb.append("=== QUICK CHEAT SHEET: ").append(getTitle()).append(" ===\n");
        sb.append("Target Exam : ").append(this.examTarget).append("\n");
        sb.append("Key Formulas:\n");
        if (this.keyFormulas != null) {
            for (String f : this.keyFormulas) {
                sb.append("  - ").append(f).append("\n");
            }
        }
        sb.append("Points Summary:\n").append(this.keyPointsSummary).append("\n");
        return sb.toString();
    }

    @Override
    public String toString() {
        int count = (this.keyFormulas != null) ? this.keyFormulas.length : 0;
        return super.toString() + String.format(" [Target: %s, Formulas: %d]", this.examTarget, count);
    }
}
