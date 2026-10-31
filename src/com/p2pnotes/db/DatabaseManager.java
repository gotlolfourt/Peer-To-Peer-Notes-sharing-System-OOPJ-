package com.p2pnotes.db;

import com.p2pnotes.model.BaseNote;
import com.p2pnotes.model.LectureNote;
import com.p2pnotes.model.SummaryCheatSheet;
import com.p2pnotes.model.User;
import com.p2pnotes.util.AppConstants;

import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

/**
 * Manages SQLite database operations for persistent storage of users and notes.
 *
 * Demonstrates:
 * - JDBC: Connection, DriverManager, PreparedStatement, ResultSet, Statement
 * - SQL CRUD operations (Create, Read, Update, Delete)
 * - Try-with-resources for auto-closing database resources
 * - Exception handling with try-catch-finally
 * - PreparedStatement to prevent SQL injection
 * - Final keyword for DB URL constant
 * - Method Overloading: getInstance(), searchNotes()
 * - Private constructor pattern (Singleton pattern)
 */
public class DatabaseManager {

    private final String dbUrl;
    private static DatabaseManager instance;
    private static boolean driverLoaded = false;

    // Static block to initialize JDBC driver
    static {
        try {
            Class.forName("org.sqlite.JDBC");
            driverLoaded = true;
            System.out.println("[DatabaseManager] SQLite JDBC Driver loaded successfully.");
        } catch (Throwable t) {
            driverLoaded = false;
            System.out.println("[DatabaseManager] Notice: SQLite JDBC driver not on classpath: " + t.getMessage() + ". Database operations will operate in fallback mode.");
        }
    }

    /**
     * Private constructor: initializes the database URL and creates tables.
     */
    private DatabaseManager(String dbDirectory) {
        File dir = new File(dbDirectory);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        this.dbUrl = "jdbc:sqlite:" + dbDirectory + File.separator + AppConstants.DB_FILENAME;
        if (driverLoaded) {
            initializeTables();
        }
    }

    /**
     * Method Overloading Variant 1: Gets the singleton DatabaseManager instance using default directory.
     */
    public static synchronized DatabaseManager getInstance() {
        return getInstance(AppConstants.DB_DIRECTORY);
    }

    /**
     * Method Overloading Variant 2: Gets the singleton DatabaseManager instance with custom directory.
     */
    public static synchronized DatabaseManager getInstance(String dbDirectory) {
        if (instance == null) {
            instance = new DatabaseManager(dbDirectory);
        }
        return instance;
    }

    /**
     * Checks if the JDBC database driver is ready.
     */
    public boolean isAvailable() {
        return driverLoaded;
    }

    /**
     * Establishes a JDBC connection to the SQLite database.
     */
    public Connection getConnection() throws SQLException {
        if (!driverLoaded) {
            throw new SQLException("SQLite JDBC Driver not loaded.");
        }
        return DriverManager.getConnection(dbUrl);
    }

    /**
     * Creates the database tables if they do not exist.
     * Uses: Statement, try-with-resources
     */
    private void initializeTables() {
        String createUsersTable = "CREATE TABLE IF NOT EXISTS users ("
                + "username TEXT PRIMARY KEY, "
                + "password TEXT NOT NULL, "
                + "full_name TEXT NOT NULL, "
                + "department TEXT NOT NULL, "
                + "reputation_score INTEGER DEFAULT 10"
                + ");";

        String createNotesTable = "CREATE TABLE IF NOT EXISTS notes ("
                + "note_id INTEGER PRIMARY KEY, "
                + "title TEXT NOT NULL, "
                + "author TEXT NOT NULL, "
                + "department TEXT NOT NULL, "
                + "note_type TEXT NOT NULL, "
                + "content TEXT, "
                + "course_code TEXT, "
                + "professor_name TEXT, "
                + "lecture_number INTEGER, "
                + "exam_target TEXT, "
                + "key_formulas TEXT, "
                + "key_points_summary TEXT, "
                + "access_count INTEGER DEFAULT 0, "
                + "owner_username TEXT, "
                + "FOREIGN KEY (owner_username) REFERENCES users(username)"
                + ");";

        // try-with-resources: connection and statement auto-closed
        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement()) {
            stmt.execute(createUsersTable);
            stmt.execute(createNotesTable);
            System.out.println("[DatabaseManager] Database tables verified/initialized.");
        } catch (SQLException e) {
            System.out.println("[DatabaseManager] Error initializing tables: " + e.getMessage());
        }
    }

    // ─── USER CRUD OPERATIONS ────────────────────────────────────────

    /**
     * CREATE / INSERT: Saves a new user to the database.
     * Uses: PreparedStatement (prevents SQL injection), try-with-resources
     */
    public boolean saveUser(User user) {
        if (!isAvailable()) {
            return false;
        }
        String sql = "INSERT INTO users (username, password, full_name, department, reputation_score) "
                   + "VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, user.getUsername().toLowerCase());
            pstmt.setString(2, user.getPassword());
            pstmt.setString(3, user.getFullName());
            pstmt.setString(4, user.getDepartment());
            pstmt.setInt(5, user.getReputationScore());
            int affected = pstmt.executeUpdate();
            return affected > 0;
        } catch (SQLException e) {
            System.out.println("[DatabaseManager] Error saving user: " + e.getMessage());
            return false;
        }
    }

    /**
     * READ / SELECT: Retrieves a user by username.
     * Uses: PreparedStatement, ResultSet, try-with-resources
     */
    public User findUser(String username) {
        if (!isAvailable() || username == null) {
            return null;
        }
        String sql = "SELECT * FROM users WHERE username = ?";

        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, username.toLowerCase().trim());
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    User user = new User(
                        rs.getString("username"),
                        rs.getString("password"),
                        rs.getString("full_name"),
                        rs.getString("department")
                    );
                    user.setReputationScore(rs.getInt("reputation_score"));
                    return user;
                }
            }
        } catch (SQLException e) {
            System.out.println("[DatabaseManager] Error finding user: " + e.getMessage());
        }
        return null;
    }

    /**
     * READ ALL / SELECT: Retrieves all users from the database.
     */
    public ArrayList<User> getAllUsers() {
        ArrayList<User> users = new ArrayList<>();
        if (!isAvailable()) {
            return users;
        }
        String sql = "SELECT * FROM users";

        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                User user = new User(
                    rs.getString("username"),
                    rs.getString("password"),
                    rs.getString("full_name"),
                    rs.getString("department")
                );
                user.setReputationScore(rs.getInt("reputation_score"));
                users.add(user);
            }
        } catch (SQLException e) {
            System.out.println("[DatabaseManager] Error loading users: " + e.getMessage());
        }
        return users;
    }

    /**
     * UPDATE: Updates user reputation score.
     */
    public boolean updateUserReputation(String username, int newScore) {
        if (!isAvailable() || username == null) {
            return false;
        }
        String sql = "UPDATE users SET reputation_score = ? WHERE username = ?";

        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, newScore);
            pstmt.setString(2, username.toLowerCase().trim());
            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            System.out.println("[DatabaseManager] Error updating reputation: " + e.getMessage());
            return false;
        }
    }

    /**
     * DELETE: Removes a user from the database.
     */
    public boolean deleteUser(String username) {
        if (!isAvailable() || username == null) {
            return false;
        }
        String sql = "DELETE FROM users WHERE username = ?";

        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, username.toLowerCase().trim());
            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            System.out.println("[DatabaseManager] Error deleting user: " + e.getMessage());
            return false;
        }
    }

    // ─── NOTE CRUD OPERATIONS ────────────────────────────────────────

    /**
     * CREATE / INSERT: Saves a note to the database.
     * Uses: PreparedStatement, instanceof checks, try-with-resources
     */
    public boolean saveNote(BaseNote note, String ownerUsername) {
        if (!isAvailable() || note == null) {
            return false;
        }
        String sql = "INSERT OR REPLACE INTO notes (note_id, title, author, department, note_type, "
                   + "content, course_code, professor_name, lecture_number, "
                   + "exam_target, key_formulas, key_points_summary, access_count, owner_username) "
                   + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, note.getNoteId());
            pstmt.setString(2, note.getTitle());
            pstmt.setString(3, note.getAuthor());
            pstmt.setString(4, note.getDepartment());
            pstmt.setInt(13, note.getAccessCount());
            pstmt.setString(14, ownerUsername != null ? ownerUsername.toLowerCase() : "anonymous");

            if (note instanceof LectureNote) {
                LectureNote ln = (LectureNote) note;
                pstmt.setString(5, "LECTURE");
                pstmt.setString(6, ln.getContent());
                pstmt.setString(7, ln.getCourseCode());
                pstmt.setString(8, ln.getProfessorName());
                pstmt.setInt(9, ln.getLectureNumber());
                pstmt.setString(10, null);
                pstmt.setString(11, null);
                pstmt.setString(12, null);
            } else if (note instanceof SummaryCheatSheet) {
                SummaryCheatSheet sc = (SummaryCheatSheet) note;
                pstmt.setString(5, "CHEATSHEET");
                pstmt.setString(6, null);
                pstmt.setString(7, null);
                pstmt.setString(8, null);
                pstmt.setInt(9, 0);
                pstmt.setString(10, sc.getExamTarget());
                String[] formulas = sc.getKeyFormulas();
                StringBuilder formulaStr = new StringBuilder();
                if (formulas != null) {
                    for (int i = 0; i < formulas.length; i++) {
                        formulaStr.append(formulas[i]);
                        if (i < formulas.length - 1) {
                            formulaStr.append(";");
                        }
                    }
                }
                pstmt.setString(11, formulaStr.toString());
                pstmt.setString(12, sc.getKeyPointsSummary());
            }

            int affected = pstmt.executeUpdate();
            return affected > 0;
        } catch (SQLException e) {
            System.out.println("[DatabaseManager] Error saving note: " + e.getMessage());
            return false;
        }
    }

    /**
     * READ ALL: Retrieves all notes from the database.
     */
    public ArrayList<BaseNote> getAllNotes() {
        ArrayList<BaseNote> notes = new ArrayList<>();
        if (!isAvailable()) {
            return notes;
        }
        String sql = "SELECT * FROM notes";

        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                BaseNote note = buildNoteFromResultSet(rs);
                if (note != null) {
                    notes.add(note);
                }
            }
        } catch (SQLException e) {
            System.out.println("[DatabaseManager] Error loading notes: " + e.getMessage());
        }
        return notes;
    }

    /**
     * Method Overloading Variant 1: Search notes by keyword in title or author.
     */
    public ArrayList<BaseNote> searchNotes(String keyword) {
        return searchNotes(keyword, "ALL");
    }

    /**
     * Method Overloading Variant 2: Search notes by keyword and department.
     */
    public ArrayList<BaseNote> searchNotes(String keyword, String department) {
        ArrayList<BaseNote> results = new ArrayList<>();
        if (!isAvailable()) {
            return results;
        }

        String sql;
        boolean hasDept = department != null && !department.trim().isEmpty() && !department.equalsIgnoreCase("ALL");
        if (hasDept) {
            sql = "SELECT * FROM notes WHERE (LOWER(title) LIKE ? OR LOWER(author) LIKE ?) AND UPPER(department) = ?";
        } else {
            sql = "SELECT * FROM notes WHERE LOWER(title) LIKE ? OR LOWER(author) LIKE ?";
        }
        String likeParam = "%" + (keyword != null ? keyword.toLowerCase().trim() : "") + "%";

        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, likeParam);
            pstmt.setString(2, likeParam);
            if (hasDept) {
                pstmt.setString(3, department.toUpperCase().trim());
            }

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    BaseNote note = buildNoteFromResultSet(rs);
                    if (note != null) {
                        results.add(note);
                    }
                }
            }
        } catch (SQLException e) {
            System.out.println("[DatabaseManager] Error searching notes: " + e.getMessage());
        }
        return results;
    }

    /**
     * DELETE: Removes a note from the database by ID.
     */
    public boolean deleteNote(int noteId) {
        if (!isAvailable()) {
            return false;
        }
        String sql = "DELETE FROM notes WHERE note_id = ?";

        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, noteId);
            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            System.out.println("[DatabaseManager] Error deleting note: " + e.getMessage());
            return false;
        }
    }

    /**
     * Helper: Builds a BaseNote from a ResultSet row.
     */
    private BaseNote buildNoteFromResultSet(ResultSet rs) throws SQLException {
        String noteType = rs.getString("note_type");
        String title = rs.getString("title");
        String author = rs.getString("author");
        String department = rs.getString("department");

        if ("LECTURE".equalsIgnoreCase(noteType)) {
            return new LectureNote(
                title, author, department,
                rs.getString("course_code"),
                rs.getString("professor_name"),
                rs.getInt("lecture_number"),
                rs.getString("content")
            );
        } else if ("CHEATSHEET".equalsIgnoreCase(noteType)) {
            String formulaStr = rs.getString("key_formulas");
            String[] formulas = (formulaStr != null && !formulaStr.isEmpty())
                                ? formulaStr.split(";") : new String[0];
            return new SummaryCheatSheet(
                title, author, department,
                rs.getString("exam_target"),
                formulas,
                rs.getString("key_points_summary")
            );
        }
        return null;
    }

    public int getUserCount() {
        if (!isAvailable()) {
            return 0;
        }
        String sql = "SELECT COUNT(*) FROM users";
        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            System.out.println("[DatabaseManager] Error counting users: " + e.getMessage());
        }
        return 0;
    }

    public int getNoteCount() {
        if (!isAvailable()) {
            return 0;
        }
        String sql = "SELECT COUNT(*) FROM notes";
        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            System.out.println("[DatabaseManager] Error counting notes: " + e.getMessage());
        }
        return 0;
    }

    public String getDbUrl() {
        return this.dbUrl;
    }
}
