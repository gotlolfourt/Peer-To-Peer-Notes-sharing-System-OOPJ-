# Java Concepts Documentation — Peer-to-Peer Notes Sharing System

This document provides a comprehensive mapping of every Java programming concept implemented in the **Peer-to-Peer Notes Sharing System (OOPJ)**. Every concept listed here is connected to the project's actual functional requirements.

---

## 1. Complete Java Concepts Mapping Table

| Sr. No. | Java Concept | Implemented In (File Name) | Class / Method / Variable | Exact Implementation | Purpose in Project |
|:---:|---|---|---|---|---|
| **1** | **Classes and Objects** | `src/com/p2pnotes/model/User.java`<br>`src/com/p2pnotes/model/BaseNote.java`<br>`src/com/p2pnotes/io/FileManager.java`<br>`src/com/p2pnotes/db/DatabaseManager.java`<br>`src/com/p2pnotes/api/NoteApiServer.java` | `User`, `BaseNote`, `LectureNote`, `SummaryCheatSheet`, `FileManager`, `DatabaseManager`, `NoteApiServer` | Instantiates discrete domain objects (`new User(...)`, `new LectureNote(...)`) with encapsulated states and operations. | Encapsulates distinct system components (peers, notes, storage, database, REST server) into cohesive modular entities. |
| **2** | **Static Variables** | `src/com/p2pnotes/util/AppConstants.java`<br>`src/com/p2pnotes/model/BaseNote.java`<br>`src/com/p2pnotes/model/User.java`<br>`src/com/p2pnotes/thread/TransferTask.java` | `AppConstants.totalRegisteredUsers`<br>`AppConstants.totalNotesShared`<br>`AppConstants.totalDownloads`<br>`BaseNote.idCounter`<br>`TransferTask.activeTransfers` | Shared class-level static counters accessed via `synchronized` helper methods (`incrementDownloads()`, etc.). | Maintains global network-wide metrics (total notes shared, registered peers, active transfer threads, unique auto-incrementing note IDs). |
| **3** | **Private Variables & Encapsulation** | `src/com/p2pnotes/model/User.java`<br>`src/com/p2pnotes/model/BaseNote.java`<br>`src/com/p2pnotes/model/LectureNote.java`<br>`src/com/p2pnotes/io/FileManager.java` | Private fields: `username`, `password`, `reputationScore`, `noteId`, `title`, `storageDirectory`, with public accessors and mutators | Strict data-hiding: `private String password;`, accessed only via `verifyPassword()` or getters/setters with validation. | Protects sensitive peer credentials, prevents unauthorized modification of note IDs, and enforces business validation. |
| **4** | **Inheritance** | `src/com/p2pnotes/model/StudentPeer.java`<br>`src/com/p2pnotes/model/ProfessorPeer.java`<br>`src/com/p2pnotes/model/LectureNote.java`<br>`src/com/p2pnotes/model/SummaryCheatSheet.java` | `public class StudentPeer extends User`<br>`public class ProfessorPeer extends User`<br>`public class LectureNote extends BaseNote`<br>`public class SummaryCheatSheet extends BaseNote` | Subclasses extend parent classes using the `extends` keyword, inheriting common fields/methods while adding specialized attributes. | Represents real-world hierarchical relationships (e.g., student vs professor peers, classroom lecture notes vs formula cheat-sheets). |
| **5** | **Method Overloading** | `src/com/p2pnotes/service/PeerNetwork.java`<br>`src/com/p2pnotes/model/BaseNote.java`<br>`src/com/p2pnotes/io/FileManager.java`<br>`src/com/p2pnotes/db/DatabaseManager.java` | `searchNotes(String)`<br>`searchNotes(String, String)`<br>`searchNotes(String, String, int)`<br>`saveNoteToFile(BaseNote)`<br>`saveNoteToFile(BaseNote, String)`<br>`saveNoteToFile(String, String)` | Multiple methods with identical names but differing parameter signatures in the same class. | Allows flexible searching (by keyword alone, with department filter, or with minimum view count filter) and versatile file saving. |
| **6** | **Method Overriding** | `src/com/p2pnotes/model/LectureNote.java`<br>`src/com/p2pnotes/model/SummaryCheatSheet.java`<br>`src/com/p2pnotes/model/StudentPeer.java`<br>`src/com/p2pnotes/model/ProfessorPeer.java` | `@Override displayDetails()`<br>`@Override displayFullContent()`<br>`@Override exportFormattedText()`<br>`@Override displayProfile()`<br>`@Override toString()` | Subclass provides a specialized implementation of a method declared in its superclass or interface. | Dynamically alters note display formatting, profile rendering, and string representations based on the actual runtime object type. |
| **7** | **Abstract Methods** | `src/com/p2pnotes/model/BaseNote.java` | `public abstract void displayFullContent();`<br>`public abstract String getNoteType();` | Abstract method signatures in `abstract class BaseNote` with no method body; implemented by all subclasses. | Forces every note subclass to define its own content layout and type identifier while allowing polymorphic iteration. |
| **8** | **Interfaces** | `src/com/p2pnotes/model/Shareable.java`<br>`src/com/p2pnotes/auth/Authenticatable.java`<br>`src/com/p2pnotes/transfer/TransferService.java` | `Shareable`<br>`Authenticatable`<br>`TransferService` | Declares contracts (`getShareableTitle()`, `verifyPassword()`, `initiateTransfer()`) implemented by models and services. | Achieves loose coupling and abstraction: defines standard operations for sharing, authentication, and file transfers across classes. |
| **9** | **Final Keyword** | `src/com/p2pnotes/util/AppConstants.java`<br>`src/com/p2pnotes/util/StringUtils.java`<br>`src/com/p2pnotes/model/BaseNote.java`<br>`src/com/p2pnotes/io/FileManager.java` | `public final class AppConstants`<br>`private final int noteId;`<br>`public final int getNoteId()`<br>`private final String storageDirectory;` | - `final class`: Cannot be extended.<br>- `final` variable: Immutable constant.<br>- `final` method: Cannot be overridden. | Prevents tampering with unique Note IDs, establishes immutable configuration values, and secures critical utility classes. |
| **10** | **Super Keyword** | `src/com/p2pnotes/model/StudentPeer.java`<br>`src/com/p2pnotes/model/ProfessorPeer.java`<br>`src/com/p2pnotes/model/LectureNote.java`<br>`src/com/p2pnotes/model/SummaryCheatSheet.java`<br>`src/com/p2pnotes/exception/NoteException.java` | `super(username, password, fullName, department);`<br>`super.displayProfile();`<br>`super.displayDetails();`<br>`super(message, cause);` | Calls superclass constructor (`super(...)`) and delegates to parent method implementations (`super.displayProfile()`). | Reuses parent initialization logic and base formatting routines, eliminating code duplication across inheritance trees. |
| **11** | **Java Collections (ArrayList, HashMap, HashSet, Vector, LinkedList/Queue)** | `src/com/p2pnotes/service/PeerNetwork.java`<br>`src/com/p2pnotes/model/User.java`<br>`src/com/p2pnotes/io/FileManager.java` | `Map<String, User> peers = new HashMap<>();`<br>`Vector<BaseNote> publicNoteRegistry;`<br>`Set<String> activeDepartments = new HashSet<>();`<br>`Queue<TransferTask> transferQueue = new LinkedList<>();`<br>`ArrayList<BaseNote> sharedNotes;` | - `ArrayList`: Dynamic lists for local user notes.<br>- `HashMap`: $O(1)$ username-to-peer lookups.<br>- `HashSet`: Unique department tracking.<br>- `Vector`: Thread-safe note registry.<br>- `LinkedList` as `Queue`: FIFO transfer queue. | Selects optimal data structures for each network operation: fast indexing, uniqueness enforcement, thread-safe access, and transfer task queueing. |
| **12** | **Strings and String Functions** | `src/com/p2pnotes/util/StringUtils.java`<br>`src/com/p2pnotes/service/PeerNetwork.java`<br>`src/com/p2pnotes/app/Main.java`<br>`src/com/p2pnotes/model/SummaryCheatSheet.java` | `trim()`, `isEmpty()`, `toLowerCase()`, `toUpperCase()`, `contains()`, `substring()`, `split()`, `equals()`, `equalsIgnoreCase()`, `charAt()`, `length()` | Extensive string validation, cleaning, and tokenization. For example, `split(";")` parses formulas; `contains()` filters note titles. | Sanitizes user input, validates email/username formats, parses delimited cheat-sheet notes, and performs case-insensitive note searches. |
| **13** | **Multithreading** | `src/com/p2pnotes/thread/TransferTask.java`<br>`src/com/p2pnotes/thread/BackgroundSync.java`<br>`src/com/p2pnotes/service/PeerNetwork.java` | `TransferTask implements Runnable`<br>`BackgroundSync extends Thread`<br>`synchronized (LOCK)`<br>`public synchronized boolean downloadNoteToPeer(...)` | - `TransferTask`: Asynchronous file downloads with simulated network latency via `Thread.sleep()`.<br>- `BackgroundSync`: Daemon thread logging periodic network snapshots.<br>- `synchronized`: Protects shared metrics. | Simulates non-blocking concurrent peer downloads and background periodic maintenance without freezing the console interface. |
| **14** | **File Handling** | `src/com/p2pnotes/io/FileManager.java`<br>`src/com/p2pnotes/thread/TransferTask.java` | `File`, `FileReader`, `FileWriter`, `BufferedReader`, `BufferedWriter`, `mkdirs()`, `delete()`, `listFiles()` | Persistent storage operations with `try-with-resources`. Reads, writes, copies, deletes, and validates note text files. | Persists notes as `.txt` files on disk, supports file backup copies, lists physical storage files, and validates filenames/sizes. |
| **15** | **JDBC (Database Connectivity)** | `src/com/p2pnotes/db/DatabaseManager.java` | `Connection`, `DriverManager`, `PreparedStatement`, `ResultSet`, `Statement`, `try-with-resources` | Full CRUD operations on SQLite (`p2pnotes.db`). Creates `users` and `notes` tables, runs parameterized SQL queries. | Provides relational persistence for peer accounts and shared note metadata; uses `PreparedStatement` to prevent SQL injection. |
| **16** | **REST API** | `src/com/p2pnotes/api/NoteApiServer.java` | `com.sun.net.httpserver.HttpServer`, `HttpHandler`, `HttpExchange` | Embedded lightweight REST server on port `7070` exposing endpoints for register, login, notes list, upload, search, download, delete, and stats. | Exposes core P2P services over standard HTTP with JSON payloads, enabling external web or mobile clients to interact with the system. |
| **17** | **Exception Handling** | `src/com/p2pnotes/exception/NoteException.java`<br>`src/com/p2pnotes/exception/AuthenticationException.java`<br>`src/com/p2pnotes/app/Main.java`<br>`src/com/p2pnotes/io/FileManager.java` | Custom exception hierarchy: `NoteException extends Exception`, `AuthenticationException extends NoteException`, `try-catch-finally`, `throws` | Graceful error propagation and recovery for invalid inputs, failed logins, file I/O faults, and database errors. | Prevents application crashes, provides user-friendly error messages, and cleanly separates error-handling logic from business logic. |

---

## 2. Detailed Code Walkthrough for Each Concept

### Concept 1: Classes and Objects
- **Location:** [`User.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/model/User.java)
- **Implementation:**
```java
public class User implements Authenticatable {
    private String username;
    private String fullName;
    private ArrayList<BaseNote> sharedNotes;
    // ...
}
```
- **Explanation:** Each user on the P2P network is instantiated as an independent peer object possessing its own username, reputation score, and list of shared/downloaded notes.

---

### Concept 2: Static Variables
- **Location:** [`AppConstants.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/util/AppConstants.java#L23-L40), [`BaseNote.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/model/BaseNote.java#L15)
- **Implementation:**
```java
// BaseNote.java
private static int idCounter = 100;
public BaseNote(String title, String author, String department) {
    this.noteId = ++idCounter; // Automatically increments across all note instances
}

// AppConstants.java
private static int totalRegisteredUsers = 0;
private static int totalDownloads = 0;

public static synchronized void incrementDownloads() {
    totalDownloads++;
}
```
- **Explanation:** `idCounter` is shared by all `BaseNote` instances to ensure every note receives a distinct auto-incremented ID. `totalDownloads` tracks total downloads across threads.

---

### Concept 3: Private Variables & Encapsulation
- **Location:** [`User.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/model/User.java#L26-L35)
- **Implementation:**
```java
private String password;
private int reputationScore;

public boolean verifyPassword(String inputPassword) {
    if (inputPassword == null) return false;
    return this.password.equals(inputPassword);
}
```
- **Explanation:** Sensitive fields such as `password` are `private`. Code outside `User` cannot directly access or mutate credentials; authentication occurs via `verifyPassword()`.

---

### Concept 4: Inheritance
- **Location:** [`StudentPeer.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/model/StudentPeer.java), [`ProfessorPeer.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/model/ProfessorPeer.java), [`LectureNote.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/model/LectureNote.java)
- **Implementation:**
```java
public class StudentPeer extends User {
    private String studentId;
    private int semester;

    public StudentPeer(String username, String password, String fullName, String department,
                       String studentId, int semester) {
        super(username, password, fullName, department);
        this.studentId = studentId;
        this.semester = semester;
    }
}
```
- **Explanation:** `StudentPeer` and `ProfessorPeer` inherit identity, login, and note management from `User` while introducing role-specific data like student IDs and professor designations.

---

### Concept 5: Method Overloading
- **Location:** [`PeerNetwork.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/service/PeerNetwork.java#L190-L240), [`FileManager.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/io/FileManager.java#L52-L95)
- **Implementation:**
```java
// In PeerNetwork.java:
public ArrayList<BaseNote> searchNotes(String keyword) { ... }
public ArrayList<BaseNote> searchNotes(String keyword, String departmentFilter) { ... }
public ArrayList<BaseNote> searchNotes(String keyword, String departmentFilter, int minViews) { ... }

// In FileManager.java:
public boolean saveNoteToFile(BaseNote note) { ... }
public boolean saveNoteToFile(BaseNote note, String filename) { ... }
public boolean saveNoteToFile(String filename, String content) { ... }
```
- **Explanation:** Provides convenience and flexibility: callers choose the search specificity (keyword only, department-scoped, or view-threshold-filtered) using a unified method name.

---

### Concept 6: Method Overriding
- **Location:** [`LectureNote.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/model/LectureNote.java#L47-L86), [`SummaryCheatSheet.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/model/SummaryCheatSheet.java#L44-L85)
- **Implementation:**
```java
@Override
public void displayFullContent() {
    incrementAccess();
    System.out.println("LECTURE NOTE: " + getTitle().toUpperCase());
    System.out.println("Course: " + this.courseCode + " | Lecture #" + this.lectureNumber);
    System.out.println("Instructor: Prof. " + this.professorName);
    System.out.println("CONTENT:\n" + this.content);
}
```
- **Explanation:** When `note.displayFullContent()` is invoked polymorphically through a `BaseNote` reference, Java's dynamic method dispatch calls the subclass's overridden implementation.

---

### Concept 7: Abstract Methods
- **Location:** [`BaseNote.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/model/BaseNote.java#L95-L98)
- **Implementation:**
```java
public abstract class BaseNote implements Shareable {
    // Abstract methods: Subclasses must provide concrete implementation
    public abstract void displayFullContent();
    public abstract String getNoteType();
}
```
- **Explanation:** Every note type in the system (lecture notes, revision cheat-sheets) must have a way to display its full content and return its type name.

---

### Concept 8: Interfaces
- **Location:** [`Shareable.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/model/Shareable.java), [`Authenticatable.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/auth/Authenticatable.java), [`TransferService.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/transfer/TransferService.java)
- **Implementation:**
```java
public interface Authenticatable {
    boolean verifyPassword(String inputPassword);
    String getUsername();
    String getRole();
}
```
- **Explanation:** `Authenticatable` establishes an authorization contract. `User` implements this interface, allowing authentication systems to verify users without depending on specific concrete classes.

---

### Concept 9: Final Keyword
- **Location:** [`AppConstants.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/util/AppConstants.java), [`BaseNote.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/model/BaseNote.java#L18)
- **Implementation:**
```java
public final class AppConstants { // final class: cannot be extended
    public static final String APP_NAME = "Peer-to-Peer Notes Sharing System";
    public static final int MAX_FILE_SIZE_MB = 10;
}

public abstract class BaseNote {
    private final int noteId; // final variable: immutable after constructor initialization

    public final int getNoteId() { // final method: subclasses cannot override
        return this.noteId;
    }
}
```
- **Explanation:** Guarantees that Note IDs cannot be altered after assignment and ensures that constants remain tamper-proof.

---

### Concept 10: Super Keyword
- **Location:** [`LectureNote.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/model/LectureNote.java#L21), [`ProfessorPeer.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/model/ProfessorPeer.java#L20)
- **Implementation:**
```java
public LectureNote(String title, String author, String department, 
                   String courseCode, String professorName, int lectureNumber, String content) {
    super(title, author, department); // Invoking parent constructor
    this.courseCode = courseCode;
    // ...
}

@Override
public void displayDetails() {
    super.displayDetails(); // Calling parent method to print base fields
    System.out.println("Course Code  : " + this.courseCode);
}
```
- **Explanation:** `super(...)` passes base attributes to `BaseNote` or `User`, while `super.displayDetails()` executes common printing logic before child-specific attributes are displayed.

---

### Concept 11: Java Collections
- **Location:** [`PeerNetwork.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/service/PeerNetwork.java#L45-L65)
- **Implementation:**
```java
private Map<String, User> peers = new HashMap<>();             // Fast O(1) lookup by username
private Vector<BaseNote> publicNoteRegistry = new Vector<>();  // Synchronized list of notes
private Set<String> activeDepartments = new HashSet<>();       // Unique set of departments
private Queue<TransferTask> transferQueue = new LinkedList<>();// Queue for asynchronous transfers
private ArrayList<BaseNote> sharedNotes = new ArrayList<>();   // Resizable array list
```
- **Explanation:** Demonstrates choosing the appropriate collection:
  - `HashMap`: Fast lookup for registered peers by username.
  - `Vector`: Thread-safe collection for public notes shared by concurrent peers.
  - `HashSet`: Eliminates duplicate department entries.
  - `LinkedList` as `Queue`: FIFO task scheduling for queued file transfers.
  - `ArrayList`: Dynamic, indexed storage for personal note libraries.

---

### Concept 12: Strings and String Functions
- **Location:** [`StringUtils.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/util/StringUtils.java), [`SummaryCheatSheet.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/model/SummaryCheatSheet.java#L65)
- **Implementation:**
```java
// String.split() and trim():
String[] points = this.keyPointsSummary.split(";");
for (String point : points) {
    String trimmed = point.trim();
    if (!trimmed.isEmpty()) {
        System.out.println("  * " + trimmed);
    }
}

// Case-insensitive matching:
boolean match = note.getTitle().toLowerCase().contains(keyword.trim().toLowerCase());
```
- **Explanation:** All mandatory string methods (`equals`, `equalsIgnoreCase`, `contains`, `substring`, `split`, `trim`, `toLowerCase`, `toUpperCase`, `isEmpty`, `charAt`, `length`) are utilized for input validation, sanitization, formula extraction, and searching.

---

### Concept 13: Multithreading
- **Location:** [`TransferTask.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/thread/TransferTask.java), [`BackgroundSync.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/thread/BackgroundSync.java)
- **Implementation:**
```java
// TransferTask implements Runnable
public class TransferTask implements Runnable {
    private static int activeTransfers = 0;
    private static final Object LOCK = new Object();

    @Override
    public void run() {
        synchronized (LOCK) { activeTransfers++; }
        // Simulate transfer progress across 5 steps
        for (int step = 1; step <= 5; step++) {
            Thread.sleep(300);
        }
        // Save file to disk safely
        fileManager.saveNoteToFile(note, filename);
        synchronized (LOCK) { activeTransfers--; }
    }
}

// Background daemon thread extending Thread
public class BackgroundSync extends Thread {
    public BackgroundSync() {
        super("P2P-BackgroundSync");
        setDaemon(true); // Daemon thread
    }
    @Override
    public void run() {
        while (running) {
            Thread.sleep(30000);
            System.out.println("Snapshot: " + AppConstants.getGlobalStats());
        }
    }
}
```
- **Explanation:** Spawns concurrent transfer threads using `Runnable` and daemon maintenance threads using `Thread`. Thread-safe counters use synchronized blocks to prevent race conditions.

---

### Concept 14: File Handling
- **Location:** [`FileManager.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/io/FileManager.java)
- **Implementation:**
```java
// Writing note file using try-with-resources:
public boolean saveNoteToFile(String filename, String content) {
    File file = new File(this.storageDirectory, filename);
    try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
        writer.write(content);
        writer.flush();
        return true;
    } catch (IOException e) {
        return false;
    }
}

// Reading note file:
try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
    String line;
    while ((line = reader.readLine()) != null) {
        sb.append(line).append("\n");
    }
}
```
- **Explanation:** Complete file handling suite: file creation, buffered reading/writing, copying, deleting, directory scanning (`listFiles()`), filename sanitization, and path-traversal validation.

---

### Concept 15: JDBC (Database Connectivity)
- **Location:** [`DatabaseManager.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/db/DatabaseManager.java)
- **Implementation:**
```java
// PreparedStatement to prevent SQL injection:
String sql = "INSERT INTO users (username, password, full_name, department, reputation_score) VALUES (?, ?, ?, ?, ?)";
try (Connection conn = getConnection();
     PreparedStatement pstmt = conn.prepareStatement(sql)) {
    pstmt.setString(1, user.getUsername().toLowerCase());
    pstmt.setString(2, user.getPassword());
    pstmt.setString(3, user.getFullName());
    pstmt.setString(4, user.getDepartment());
    pstmt.setInt(5, user.getReputationScore());
    pstmt.executeUpdate();
}
```
- **Explanation:** Uses standard JDBC APIs (`DriverManager`, `Connection`, `PreparedStatement`, `ResultSet`, `Statement`) to persist user profiles and shared notes to an SQLite database (`p2pnotes.db`).

---

### Concept 16: REST API
- **Location:** [`NoteApiServer.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/api/NoteApiServer.java)
- **Implementation:**
```java
server = HttpServer.create(new InetSocketAddress(7070), 0);
server.createContext("/api/notes", new NotesHandler());
server.createContext("/api/users/login", new LoginHandler());
server.createContext("/api/stats", new StatsHandler());
server.start();
```
- **Explanation:** Implements a full REST server running on port `7070` with endpoints for CRUD operations and JSON responses, demonstrating web service communication in Java.

---

### Concept 17: Exception Handling
- **Location:** [`NoteException.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/exception/NoteException.java), [`AuthenticationException.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/exception/AuthenticationException.java)
- **Implementation:**
```java
public class AuthenticationException extends NoteException {
    private final String attemptedUsername;
    public AuthenticationException(String message, String attemptedUsername) {
        super(message, "AUTH_FAILED");
        this.attemptedUsername = attemptedUsername;
    }
}
```
- **Explanation:** Defines a clean custom exception hierarchy checked via `try-catch` blocks in `Main.java` and `FileManager.java`, ensuring safe recovery from invalid input and network errors.

---

## 3. OOP Concepts for Viva (Oral Exam Preparation)

### 1. What is Encapsulation and how did you use it?
> **Answer:** Encapsulation is the bundling of data and the methods that operate on that data into a single unit (class), while restricting direct access to the object's components.
> **Project Example:** In [`User.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/model/User.java), the `password` and `reputationScore` are declared `private`. Other classes cannot directly alter credentials; they must invoke validated methods like `verifyPassword()` or `addReputation()`.

### 2. What is Inheritance and what advantage does it give?
> **Answer:** Inheritance is a mechanism where a new class (subclass) derives properties and behaviors from an existing class (superclass) using the `extends` keyword, facilitating code reuse.
> **Project Example:** [`StudentPeer`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/model/StudentPeer.java) and [`ProfessorPeer`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/model/ProfessorPeer.java) both extend `User`. They inherit all core peer management functionality (passwords, department, shared note lists) without code duplication, while adding specialized fields (`studentId`, `cabinNumber`). Similarly, `LectureNote` and `SummaryCheatSheet` inherit from `BaseNote`.

### 3. What is Polymorphism and where is it demonstrated?
> **Answer:** Polymorphism allows an entity such as a variable, function, or object to take on multiple forms. At runtime, the JVM determines which method implementation to execute based on the actual object type (Dynamic Method Dispatch).
> **Project Example:** In [`Main.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/app/Main.java), when reading note content:
> ```java
> BaseNote note = network.findNoteById(id);
> note.displayFullContent(); // Polymorphic dispatch
> ```
> If `note` is a `LectureNote`, it displays professor details and lecture numbers. If it is a `SummaryCheatSheet`, it displays formulas and summary bullets. The caller treats them uniformly as `BaseNote`.

### 4. What is the difference between an Abstract Class and an Interface?
> **Answer:** An abstract class can have state (instance variables), constructors, and both abstract and concrete methods. An interface primarily defines a contract of method signatures without state (except static final constants). A class can extend only one abstract class, but can implement multiple interfaces.
> **Project Example:** `BaseNote` is an **abstract class** because it maintains shared state (`noteId`, `title`, `author`, `accessCount`) and implements common methods (`getNoteId()`, `displayDetails()`). Conversely, `Shareable` and `Authenticatable` are **interfaces** that define pure functional contracts (`getShareableTitle()`, `verifyPassword()`).

### 5. Why did you use Method Overloading and Method Overriding?
> **Answer:**
> - **Method Overloading (Compile-time polymorphism):** Multiple methods in the same class have the same name but different parameter lists. In [`PeerNetwork.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/service/PeerNetwork.java), `searchNotes(keyword)`, `searchNotes(keyword, department)`, and `searchNotes(keyword, department, minViews)` provide varying search granularities.
> - **Method Overriding (Runtime polymorphism):** A subclass provides a specialized implementation of a method defined in its superclass. `LectureNote` overrides `displayDetails()` and `toString()` to add lecture-specific details.

### 6. What is the purpose of the `super` keyword?
> **Answer:** `super` is a reference variable used to refer directly to the immediate parent class object.
> **Project Example:** In `LectureNote.java`, `super(title, author, department)` invokes the parent `BaseNote` constructor. In `super.displayDetails()`, it executes the parent's print routine before adding lecture-specific fields.

### 7. How does Multithreading work in your project?
> **Answer:** We implemented multithreading in two ways:
> 1. Implementing `Runnable` in [`TransferTask`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/thread/TransferTask.java): Spawns worker threads to simulate asynchronous file downloads with progress updates and file writing.
> 2. Extending `Thread` in [`BackgroundSync`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/thread/BackgroundSync.java): Runs as a background daemon thread periodically logging network health metrics.
> Synchronization blocks (`synchronized`) ensure that shared counters (`activeTransfers`, `totalDownloads`) are incremented atomically without race conditions.

### 8. How did you prevent SQL Injection in JDBC?
> **Answer:** By using `PreparedStatement` instead of string concatenation with `Statement`. In [`DatabaseManager.java`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/src/com/p2pnotes/db/DatabaseManager.java), queries use parameterized placeholders (`?`), e.g., `SELECT * FROM users WHERE username = ?`. The database driver pre-compiles the SQL command and treats user input strictly as literal values, completely neutralizing SQL injection attacks.

### 9. Why use Try-With-Resources for File and Database I/O?
> **Answer:** Introduced in Java 7, try-with-resources automatically closes any resource that implements `java.lang.AutoCloseable` (such as `BufferedReader`, `BufferedWriter`, `Connection`, `PreparedStatement`, `ResultSet`) at the end of the block, even if an exception occurs. This eliminates resource leaks and avoids verbose `finally` blocks.

### 10. Why did you choose SQLite and Java's built-in HttpServer?
> **Answer:** SQLite provides full relational ACID database capabilities through JDBC with zero external server installation (it stores data in a single local `.db` file). Java's built-in `com.sun.net.httpserver.HttpServer` provides lightweight, standards-compliant REST endpoints without adding heavy third-party framework dependencies, keeping the application lightweight, fast, and easy to run on any machine with a standard JDK.

