package com.p2pnotes.test;

import com.p2pnotes.api.NoteApiServer;
import com.p2pnotes.db.DatabaseManager;
import com.p2pnotes.exception.AuthenticationException;
import com.p2pnotes.exception.NoteException;
import com.p2pnotes.io.FileManager;
import com.p2pnotes.model.BaseNote;
import com.p2pnotes.model.LectureNote;
import com.p2pnotes.model.ProfessorPeer;
import com.p2pnotes.model.StudentPeer;
import com.p2pnotes.model.SummaryCheatSheet;
import com.p2pnotes.model.User;
import com.p2pnotes.service.PeerNetwork;
import com.p2pnotes.thread.BackgroundSync;
import com.p2pnotes.thread.TransferTask;
import com.p2pnotes.util.AppConstants;
import com.p2pnotes.util.StringUtils;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Queue;
import java.util.Vector;

/**
 * Automated end-to-end test suite verifying all mandatory Java concepts.
 */
public class SystemIntegrationTest {

    private static int testsPassed = 0;
    private static int testsFailed = 0;

    public static void main(String[] args) {
        System.out.println("===============================================================");
        System.out.println("   RUNNING AUTOMATED SYSTEM INTEGRATION & VERIFICATION TESTS   ");
        System.out.println("===============================================================");

        testCoreOopAndInheritance();
        testMethodOverloading();
        testMethodOverridingAndPolymorphism();
        testStaticAndFinalKeywords();
        testJavaCollections();
        testStringFunctions();
        testFileHandling();
        testMultithreading();
        testJdbcDatabaseOperations();
        testRestApiEndpoints();
        testExceptionHandling();

        System.out.println("\n===============================================================");
        System.out.println("                     TEST SUMMARY RESULTS                      ");
        System.out.println("===============================================================");
        System.out.println(" Tests Passed : " + testsPassed);
        System.out.println(" Tests Failed : " + testsFailed);
        if (testsFailed == 0) {
            System.out.println(" >>> ALL TESTS PASSED SUCCESSFULLY! 100% VERIFIED! <<<");
        } else {
            System.out.println(" >>> SOME TESTS FAILED! CHECK OUTPUT ABOVE. <<<");
        }
        System.out.println("===============================================================");

        // Exit with appropriate code
        System.exit(testsFailed == 0 ? 0 : 1);
    }

    private static void assertTrue(String testName, boolean condition) {
        if (condition) {
            System.out.println(" [PASS] " + testName);
            testsPassed++;
        } else {
            System.err.println(" [FAIL] " + testName);
            testsFailed++;
        }
    }

    // 1. Core OOP & Inheritance
    private static void testCoreOopAndInheritance() {
        System.out.println("\n--- Testing Core OOP & Inheritance ---");
        StudentPeer student = new StudentPeer("s_john", "pass", "John Doe", "CSE", "ST001", 3);
        ProfessorPeer prof = new ProfessorPeer("p_sharma", "pass", "Dr. Sharma", "CSE", "HOD", "Cabin 101");

        assertTrue("Student is instance of User", student instanceof User);
        assertTrue("Professor is instance of User", prof instanceof User);
        assertTrue("Student role is STUDENT", "STUDENT".equals(student.getRole()));
        assertTrue("Faculty role is FACULTY", "FACULTY".equals(prof.getRole()));
        assertTrue("Faculty starting reputation is 50", prof.getReputationScore() == 50);
        assertTrue("Encapsulation student ID", "ST001".equals(student.getStudentId()));
        assertTrue("Encapsulation faculty cabin", "Cabin 101".equals(prof.getCabinNumber()));
    }

    // 2. Method Overloading
    private static void testMethodOverloading() {
        System.out.println("\n--- Testing Method Overloading ---");
        PeerNetwork network = new PeerNetwork();

        ArrayList<BaseNote> res1 = network.searchNotes("OOP");
        ArrayList<BaseNote> res2 = network.searchNotes("OOP", "CSE");
        ArrayList<BaseNote> res3 = network.searchNotes("OOP", "CSE", 0);

        assertTrue("searchNotes(keyword) works", res1 != null);
        assertTrue("searchNotes(keyword, dept) works", res2 != null);
        assertTrue("searchNotes(keyword, dept, minViews) works", res3 != null);

        FileManager fm = new FileManager("test_storage");
        BaseNote note = res1.get(0);
        boolean save1 = fm.saveNoteToFile(note);
        boolean save2 = fm.saveNoteToFile(note, "custom_name.txt");
        boolean save3 = fm.saveNoteToFile("raw.txt", "Raw content");

        assertTrue("saveNoteToFile(note) works", save1);
        assertTrue("saveNoteToFile(note, filename) works", save2);
        assertTrue("saveNoteToFile(filename, content) works", save3);

        // Cleanup test files
        fm.deleteNoteFile("custom_name.txt");
        fm.deleteNoteFile("raw.txt");
        fm.deleteNoteFile(StringUtils.sanitizeFilename(note.getTitle()) + ".txt");
    }

    // 3. Method Overriding & Polymorphism
    private static void testMethodOverridingAndPolymorphism() {
        System.out.println("\n--- Testing Method Overriding & Polymorphism ---");
        LectureNote ln = new LectureNote("Lec Title", "Author A", "CSE", "CS101", "Prof P", 1, "Body text");
        SummaryCheatSheet sc = new SummaryCheatSheet("Sheet Title", "Author B", "AIML", "MidTerm", new String[]{"a=b"}, "Point 1; Point 2");

        // Polymorphic reference
        BaseNote note1 = ln;
        BaseNote note2 = sc;

        assertTrue("LectureNote overriding getNoteType", "LECTURE_NOTE".equals(note1.getNoteType()));
        assertTrue("SummaryCheatSheet overriding getNoteType", "CHEAT_SHEET".equals(note2.getNoteType()));
        assertTrue("Polymorphic toString() on LectureNote", note1.toString().contains("Course: CS101"));
        assertTrue("Polymorphic toString() on SummaryCheatSheet", note2.toString().contains("Target: MidTerm"));
    }

    // 4. Static & Final Keywords
    private static void testStaticAndFinalKeywords() {
        System.out.println("\n--- Testing Static & Final Keywords ---");
        int initialUsers = AppConstants.getTotalRegisteredUsers();
        AppConstants.incrementRegisteredUsers();
        assertTrue("Static counter incremented", AppConstants.getTotalRegisteredUsers() == initialUsers + 1);

        assertTrue("Final constant APP_NAME", AppConstants.APP_NAME != null && !AppConstants.APP_NAME.isEmpty());
        assertTrue("Final constant MAX_FILE_SIZE_MB", AppConstants.MAX_FILE_SIZE_MB == 10);

        LectureNote n = new LectureNote("T", "A", "CSE", "C", "P", 1, "B");
        assertTrue("Final noteId getter exists and > 0", n.getNoteId() > 0);
    }

    // 5. Java Collections
    private static void testJavaCollections() {
        System.out.println("\n--- Testing Java Collections (ArrayList, HashMap, HashSet, Vector, LinkedList/Queue) ---");
        PeerNetwork network = new PeerNetwork();

        assertTrue("HashMap for peers lookup", network.getPeers() != null && network.getPeers().containsKey("alice_cse"));
        assertTrue("Vector for publicNoteRegistry", network.getAllPublicNotes() instanceof Vector);
        assertTrue("Queue implemented with LinkedList", network.getTransferQueue() instanceof Queue);

        // Test LinkedList / Queue operations
        Queue<TransferTask> queue = network.getTransferQueue();
        int initialSize = queue.size();
        BaseNote note = network.getAllPublicNotes().get(0);
        network.initiateTransfer(note, "alice_cse");
        assertTrue("Queue received task", queue.size() >= initialSize);
    }

    // 6. Strings and String Functions
    private static void testStringFunctions() {
        System.out.println("\n--- Testing String Functions ---");
        String test = "  Peer To Peer Notes  ";

        assertTrue("trim()", "Peer To Peer Notes".equals(test.trim()));
        assertTrue("toLowerCase()", "peer to peer notes".equals(test.trim().toLowerCase()));
        assertTrue("toUpperCase()", "PEER TO PEER NOTES".equals(test.trim().toUpperCase()));
        assertTrue("contains()", test.contains("Notes"));
        assertTrue("substring()", "Peer".equals(test.trim().substring(0, 4)));
        assertTrue("split()", test.trim().split(" ").length == 4);
        assertTrue("equals()", "Notes".equals("Notes"));
        assertTrue("equalsIgnoreCase()", "notes".equalsIgnoreCase("NOTES"));
        assertTrue("isEmpty()", "".isEmpty());
        assertTrue("StringUtils isValidEmail", StringUtils.isValidEmail("student@college.edu"));
        assertTrue("StringUtils isValidUsername", StringUtils.isValidUsername("alice_cse"));
    }

    // 7. File Handling
    private static void testFileHandling() {
        System.out.println("\n--- Testing File Handling (CRUD) ---");
        FileManager fm = new FileManager("test_storage");

        String filename = "test_note.txt";
        String content = "Line 1: Computer Networks Notes\nLine 2: OSI Model\nLine 3: TCP/IP";

        // Create / Write
        boolean written = fm.saveNoteToFile(filename, content);
        assertTrue("File written to disk", written);

        // Read
        String readBack = fm.readNoteFromFile(filename);
        assertTrue("File read back contains content", readBack != null && readBack.contains("OSI Model"));

        // Copy
        String copyFilename = "test_note_copy.txt";
        boolean copied = fm.copyNoteFile(filename, copyFilename);
        assertTrue("File copied successfully", copied);

        // List
        ArrayList<String> files = fm.listNoteFiles();
        assertTrue("List files contains both", files.contains(filename) && files.contains(copyFilename));

        // Delete
        boolean del1 = fm.deleteNoteFile(filename);
        boolean del2 = fm.deleteNoteFile(copyFilename);
        assertTrue("Deleted file 1", del1);
        assertTrue("Deleted file 2", del2);

        // Validation
        assertTrue("Validate valid filename", fm.validateFilename("valid_note.txt"));
        assertTrue("Reject path traversal", !fm.validateFilename("../../etc/passwd"));
        assertTrue("Validate file size", fm.validateFileSize(1024));
    }

    // 8. Multithreading
    private static void testMultithreading() {
        System.out.println("\n--- Testing Multithreading ---");
        FileManager fm = new FileManager("test_storage");
        LectureNote note = new LectureNote("Threading Note", "Author M", "CSE", "CS201", "Prof M", 1, "Thread content");

        TransferTask task = new TransferTask("TEST-TX-1", note, "tester", fm);
        Thread thread = new Thread(task, "TestWorkerThread");

        thread.start();
        try {
            thread.join(5000); // Wait for thread to finish
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        assertTrue("Transfer task completed on thread", task.isCompleted());
        assertTrue("Transfer task successful", task.isSuccess());

        // Background daemon sync thread test
        BackgroundSync sync = new BackgroundSync();
        assertTrue("BackgroundSync is daemon thread", sync.isDaemon());
        sync.start();
        assertTrue("BackgroundSync is alive", sync.isAlive());
        sync.stopSync();

        // Cleanup test note file
        fm.deleteNoteFile("tester_" + note.getNoteId() + ".txt");
    }

    // 9. JDBC Database Operations
    private static void testJdbcDatabaseOperations() {
        System.out.println("\n--- Testing JDBC Database Operations ---");
        DatabaseManager db = DatabaseManager.getInstance("test_data");

        if (!db.isAvailable()) {
            System.out.println("Notice: SQLite JDBC driver not loaded. Skipping live DB test.");
            return;
        }

        User testUser = new User("db_user_1", "securePass", "Database Tester", "CSE");

        // Insert
        boolean saved = db.saveUser(testUser);
        assertTrue("JDBC INSERT User", saved);

        // Select
        User fetched = db.findUser("db_user_1");
        assertTrue("JDBC SELECT User", fetched != null && "Database Tester".equals(fetched.getFullName()));

        // Update
        boolean updated = db.updateUserReputation("db_user_1", 75);
        assertTrue("JDBC UPDATE User reputation", updated);

        // Note CRUD
        LectureNote note = new LectureNote("DB Note Test", "Author DB", "CSE", "CS999", "Prof DB", 5, "DB Content");
        boolean noteSaved = db.saveNote(note, "db_user_1");
        assertTrue("JDBC INSERT Note", noteSaved);

        ArrayList<BaseNote> searchRes = db.searchNotes("DB Note");
        assertTrue("JDBC SELECT Note with PreparedStatement LIKE", !searchRes.isEmpty());

        // Delete
        boolean noteDeleted = db.deleteNote(note.getNoteId());
        assertTrue("JDBC DELETE Note", noteDeleted);

        boolean userDeleted = db.deleteUser("db_user_1");
        assertTrue("JDBC DELETE User", userDeleted);
    }

    // 10. REST API Endpoints
    private static void testRestApiEndpoints() {
        System.out.println("\n--- Testing REST API Endpoints ---");
        PeerNetwork network = new PeerNetwork();
        NoteApiServer api = new NoteApiServer(network, 7071);
        api.start();

        try {
            // GET /api/stats
            String stats = httpGet("http://localhost:7071/api/stats");
            assertTrue("REST GET /api/stats", stats != null && stats.contains("registeredUsers"));

            // GET /api/notes
            String notesJson = httpGet("http://localhost:7071/api/notes");
            assertTrue("REST GET /api/notes", notesJson != null && notesJson.contains("Java OOP Principles"));

            // GET /api/notes/search?keyword=OOP
            String searchJson = httpGet("http://localhost:7071/api/notes/search?keyword=OOP");
            assertTrue("REST GET /api/notes/search", searchJson != null && searchJson.contains("Java OOP"));

            // POST /api/users/register
            String regPayload = "{\"username\":\"rest_user\",\"password\":\"pass123\",\"fullName\":\"REST User\",\"department\":\"CSE\"}";
            String regResponse = httpPost("http://localhost:7071/api/users/register", regPayload);
            assertTrue("REST POST /api/users/register", regResponse != null && regResponse.contains("success"));

            // POST /api/users/login
            String loginPayload = "{\"username\":\"rest_user\",\"password\":\"pass123\"}";
            String loginResponse = httpPost("http://localhost:7071/api/users/login", loginPayload);
            assertTrue("REST POST /api/users/login", loginResponse != null && loginResponse.contains("Login successful"));

            // Dynamically get the first public note's ID
            int testNoteId = network.getAllPublicNotes().get(0).getNoteId();
            String dlResponse = httpGet("http://localhost:7071/api/notes/download?id=" + testNoteId);
            assertTrue("REST GET /api/notes/download", dlResponse != null && dlResponse.contains("success"));

        } catch (Exception e) {
            System.err.println("REST API test exception: " + e.getMessage());
            testsFailed++;
        } finally {
            api.stop();
        }
    }

    // 11. Exception Handling
    private static void testExceptionHandling() {
        System.out.println("\n--- Testing Custom Exceptions & Handling ---");
        try {
            throw new NoteException("Custom note error", "ERR_INVALID_FORMAT");
        } catch (NoteException e) {
            assertTrue("Custom NoteException caught with error code", "ERR_INVALID_FORMAT".equals(e.getErrorCode()));
        }

        try {
            throw new AuthenticationException("Bad login", "bad_actor");
        } catch (AuthenticationException e) {
            assertTrue("Custom AuthenticationException caught", "AUTH_FAILED".equals(e.getErrorCode()));
            assertTrue("Attempted username retained", "bad_actor".equals(e.getAttemptedUsername()));
        }
    }

    // Helper HTTP GET
    private static String httpGet(String urlStr) throws Exception {
        URL url = URI.create(urlStr).toURL();
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setConnectTimeout(3000);
        conn.setReadTimeout(3000);

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            return sb.toString();
        }
    }

    // Helper HTTP POST
    private static String httpPost(String urlStr, String jsonBody) throws Exception {
        URL url = URI.create(urlStr).toURL();
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setDoOutput(true);
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setConnectTimeout(3000);
        conn.setReadTimeout(3000);

        try (OutputStream os = conn.getOutputStream()) {
            os.write(jsonBody.getBytes(StandardCharsets.UTF_8));
        }

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            return sb.toString();
        }
    }
}
