# Peer-to-Peer Notes Sharing System (Java OOPJ)

A modular, enterprise-ready, console-and-REST Peer-to-Peer (P2P) Notes Sharing application developed in Java as part of the Object-Oriented Programming with Java (OOPJ) coursework.

---

## 📌 Project Overview & Problem Statement

### Problem Statement
In academic environments, students and faculty often struggle with fragmented platforms for sharing lecture notes, revision guides, and exam cheat-sheets. Centralized repositories suffer from single points of failure, lack of peer reputation tracking, and cumbersome interfaces. 

### Solution
This application simulates a decentralized **Peer-to-Peer (P2P) network** where autonomous peers (students and faculty) contribute, review, download, persist, and verify study materials with built-in reputation tracking, local disk caching, database persistence, multithreaded file transfer simulation, and an embedded REST API.

---

## 🎯 Objectives
- Demonstrate full mastery of **Core Object-Oriented Programming (OOP)**: encapsulation, inheritance, polymorphism, abstraction, and interfaces.
- Utilize standard **Java Collections Framework**: `ArrayList`, `HashMap`, `HashSet`, `Vector`, and `LinkedList` (as a `Queue`).
- Implement robust **File Handling**: buffered reading, writing, copying, deletion, and path validation.
- Implement robust **Multithreading**: concurrent file downloads with `Runnable`, background daemon maintenance with `Thread`, and synchronization.
- Implement persistent relational storage with **JDBC**: SQLite database operations using `PreparedStatement` to prevent SQL injection.
- Expose system capabilities over an embedded **REST API**: HTTP server supporting GET, POST, and DELETE endpoints with JSON responses.
- Enforce strict **Exception Handling**: custom exception hierarchies and try-with-resources.

---

## ✨ Features

1. **Decentralized Peer Network**:
   - Distinct peer roles: `StudentPeer` (with student ID and semester) and `ProfessorPeer` (with verified faculty status and cabin location).
   - Peer reputation system rewarding contributors when notes are downloaded.
2. **Polymorphic Note Hierarchy**:
   - `LectureNote`: Detailed class notes, instructor details, course codes, and lecture numbers.
   - `SummaryCheatSheet`: High-yield revision guides with formula arrays and bullet-point summaries.
3. **Advanced Search & Filtering**:
   - Overloaded search methods supporting keyword queries, department filtering, and minimum view thresholds.
4. **Concurrent Multi-threaded Transfers**:
   - Simulates realistic non-blocking file transfers with progress updates across multiple threads.
   - Background daemon thread (`BackgroundSync`) periodically reporting network statistics.
5. **Disk File Management**:
   - Automated export of notes to `.txt` files in `p2p_notes_storage/`.
   - File listing, buffered reading, backup copying, safe deletion, and filename/size validation.
6. **Relational Database Storage (JDBC + SQLite)**:
   - Full CRUD operations on `users` and `notes` tables using `PreparedStatement`.
7. **Embedded REST API Server**:
   - Built-in lightweight HTTP server on port `7070` providing JSON endpoints for external web or mobile clients.
8. **Interactive Console UI**:
   - Comprehensive menu system with input validation, graceful error recovery, and clear formatting.

---

## 🛠️ Technologies Used

| Layer | Technology |
|---|---|
| **Language** | Java SE (JDK 17 or higher; tested on JDK 27) |
| **Persistence (JDBC)** | SQLite (`sqlite-jdbc` 3.45.1.0) |
| **Logging** | SLF4J (`slf4j-api` & `slf4j-simple`) |
| **REST Server** | Java Standard Library `com.sun.net.httpserver.HttpServer` |
| **File I/O** | Java Standard `java.io` (`BufferedReader`, `BufferedWriter`, `File`) |
| **Concurrency** | Java Concurrency API (`Thread`, `Runnable`, `synchronized`) |
| **Testing** | Automated Standalone Integration Suite (`SystemIntegrationTest.java`) |

---

## 🏛️ System Architecture

```text
PeerToPeerNotesSharing/
├── lib/                               # Bundled JDBC and logging libraries
│   ├── sqlite-jdbc-3.45.1.0.jar
│   ├── slf4j-api-2.0.12.jar
│   └── slf4j-simple-2.0.12.jar
├── p2p_data/                          # SQLite persistent database directory
├── p2p_notes_storage/                 # Local filesystem note storage
├── src/
│   └── com/p2pnotes/
│       ├── api/                       # REST API Layer
│       │   └── NoteApiServer.java
│       ├── app/                       # Application Entry Point & CLI
│       │   └── Main.java
│       ├── auth/                      # Authentication Contracts
│       │   └── Authenticatable.java
│       ├── db/                        # JDBC SQLite Persistence Layer
│       │   └── DatabaseManager.java
│       ├── exception/                 # Custom Exception Hierarchy
│       │   ├── NoteException.java
│       │   └── AuthenticationException.java
│       ├── io/                        # File Handling Layer
│       │   └── FileManager.java
│       ├── model/                     # Core Domain Models
│       │   ├── BaseNote.java          (Abstract Base Class)
│       │   ├── LectureNote.java       (Subclass of BaseNote)
│       │   ├── ProfessorPeer.java     (Subclass of User)
│       │   ├── Shareable.java         (Interface)
│       │   ├── StudentPeer.java       (Subclass of User)
│       │   ├── SummaryCheatSheet.java (Subclass of BaseNote)
│       │   └── User.java              (Base User & Authenticatable)
│       ├── service/                   # Business Logic & Peer Directory
│       │   └── PeerNetwork.java
│       ├── thread/                    # Concurrency & Worker Threads
│       │   ├── BackgroundSync.java    (Daemon Thread)
│       │   └── TransferTask.java      (Runnable Task)
│       ├── transfer/                  # Transfer Service Contract
│       │   └── TransferService.java
│       └── util/                      # Constants & String Helpers
│           ├── AppConstants.java
│           └── StringUtils.java
├── test/
│   └── com/p2pnotes/test/
│       └── SystemIntegrationTest.java # 65 Automated Integration Tests
├── .gitignore
├── JAVA_CONCEPTS_DOCUMENTATION.md     # Detailed Java Concepts Mapping & Viva Guide
└── README.md
```

---

## 🗄️ Database Design (JDBC SQLite)

### 1. `users` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `username` | `TEXT` | `PRIMARY KEY` | Lowercase unique username |
| `password` | `TEXT` | `NOT NULL` | Encrypted/hashed credential |
| `full_name` | `TEXT` | `NOT NULL` | Peer's full name |
| `department`| `TEXT` | `NOT NULL` | College department (CSE, AIML, etc.) |
| `reputation_score` | `INTEGER` | `DEFAULT 10` | Reputation points earned |

### 2. `notes` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `note_id` | `INTEGER` | `PRIMARY KEY` | Auto-incrementing unique Note ID |
| `title` | `TEXT` | `NOT NULL` | Title of the note |
| `author` | `TEXT` | `NOT NULL` | Author name |
| `department` | `TEXT` | `NOT NULL` | Department category |
| `note_type` | `TEXT` | `NOT NULL` | `LECTURE` or `CHEATSHEET` |
| `content` | `TEXT` | | Lecture body content |
| `course_code` | `TEXT` | | Course code (e.g. PCC12CE07) |
| `professor_name`| `TEXT` | | Instructor name |
| `lecture_number`| `INTEGER` | | Lecture index |
| `exam_target` | `TEXT` | | Targeted examination |
| `key_formulas`| `TEXT` | | Semicolon-delimited formula strings |
| `key_points_summary` | `TEXT` | | Semicolon-delimited summary bullets |
| `access_count` | `INTEGER`| `DEFAULT 0` | View and access counter |
| `owner_username` | `TEXT` | `FOREIGN KEY` | References `users(username)` |

---

## 🌐 REST API Endpoints

The embedded HTTP server runs on **`http://localhost:7070`**:

| Method | Endpoint | Query / Body Params | Description |
|---|---|---|---|
| `POST` | `/api/users/register` | `{"username":"...","password":"...","fullName":"...","department":"..."}` | Register a new peer |
| `POST` | `/api/users/login` | `{"username":"...","password":"..."}` | Authenticate peer credentials |
| `GET` | `/api/notes` | _None_ | Retrieve all public notes (JSON) |
| `POST` | `/api/notes` | `{"title":"...","author":"...","username":"...","content":"..."}` | Publish a new note |
| `GET` | `/api/notes/search` | `?keyword=oop&dept=CSE` | Search notes by keyword & department |
| `GET` | `/api/notes/download` | `?id=101` | Download note text content |
| `DELETE` | `/api/notes` | `?id=101&username=alice_cse` | Delete/unpublish a note |
| `GET` | `/api/stats` | _None_ | Get network-wide live statistics |

---

## 📚 Java Concepts Implemented

A comprehensive breakdown is documented in **[`JAVA_CONCEPTS_DOCUMENTATION.md`](file:///c:/Users/leita/OneDrive/Desktop/PeerToPeerNotesSharing/JAVA_CONCEPTS_DOCUMENTATION.md)**:

1. **Classes and Objects**: Modular domain objects (`User`, `LectureNote`, `SummaryCheatSheet`, `FileManager`, `DatabaseManager`, `NoteApiServer`).
2. **Static Variables**: Shared counters (`AppConstants.totalDownloads`, `BaseNote.idCounter`, `TransferTask.activeTransfers`).
3. **Private Variables & Encapsulation**: Private fields accessed strictly through validated getters/setters.
4. **Inheritance**: Two distinct hierarchies (`StudentPeer` & `ProfessorPeer` extending `User`; `LectureNote` & `SummaryCheatSheet` extending `BaseNote`).
5. **Method Overloading**: `searchNotes(...)` and `saveNoteToFile(...)` with multiple parameter signatures.
6. **Method Overriding**: Polymorphic overrides of `displayDetails()`, `displayFullContent()`, `exportFormattedText()`, and `toString()`.
7. **Abstract Methods**: `BaseNote.displayFullContent()` and `BaseNote.getNoteType()`.
8. **Interfaces**: `Shareable`, `Authenticatable`, and `TransferService`.
9. **Final Keyword**: `final class AppConstants`, `final int noteId`, and `final` accessor methods.
10. **Super Keyword**: `super(...)` constructor calls and `super.displayDetails()` parent delegations.
11. **Java Collections**: `ArrayList`, `HashMap`, `HashSet`, `Vector`, and `LinkedList` (as a `Queue`).
12. **Strings & Functions**: `trim()`, `isEmpty()`, `toLowerCase()`, `toUpperCase()`, `contains()`, `substring()`, `split()`, `equals()`, `equalsIgnoreCase()`.
13. **Multithreading**: `TransferTask` (`Runnable`), `BackgroundSync` (`Thread` daemon), synchronized blocks.
14. **File Handling**: `File`, `BufferedReader`, `BufferedWriter`, `FileWriter`, `FileReader`, try-with-resources.
15. **JDBC Connectivity**: SQLite database operations with `PreparedStatement` and `ResultSet`.
16. **REST API**: Embedded HTTP server with JSON request/response handlers.
17. **Exception Handling**: Custom `NoteException` and `AuthenticationException` hierarchies with `try-catch-finally`.

---

## 🚀 Installation & Execution Instructions

### Prerequisites
- Java Development Kit (JDK 17 or higher)
- Windows / macOS / Linux terminal

### 1. Compile the Project
Open a terminal in the project root folder:
```bash
# Windows PowerShell / CMD
javac -cp ".;lib/*" -d bin -sourcepath src (Get-ChildItem -Path src -Filter *.java -Recurse | Select-Object -ExpandProperty FullName)

# Linux / macOS Bash
javac -cp ".:lib/*" -d bin -sourcepath src $(find src -name "*.java")
```

### 2. Run the Interactive Console Application
```bash
# Windows
java -cp "bin;lib/*" com.p2pnotes.app.Main

# Linux / macOS
java -cp "bin:lib/*" com.p2pnotes.app.Main
```

### 3. Pre-Seeded Demonstration Accounts
| Username | Password | Full Name | Role | Department |
|---|---|---|---|---|
| `alice_cse` | `pass123` | Alice DSouza | Student (Sem 4) | CSE |
| `bob_aiml` | `pass123` | Bob Fernandes | Student (Sem 4) | AIML |
| `charlie_ece`| `pass123` | Dr. Charlie Pinto | Faculty (Assoc. Prof) | ECE |

---

## 🧪 Testing Details & Verification

The project includes an automated test suite containing **65 comprehensive integration tests** covering all 17 mandatory concepts.

### Run Automated Tests:
```bash
# Compile and execute the test runner
javac -cp ".;bin;lib/*" -d bin test/com/p2pnotes/test/SystemIntegrationTest.java
java -cp "bin;lib/*" com.p2pnotes.test.SystemIntegrationTest
```

### Test Suite Output:
```text
===============================================================
   RUNNING AUTOMATED SYSTEM INTEGRATION & VERIFICATION TESTS   
===============================================================
--- Testing Core OOP & Inheritance ---
 [PASS] Student is instance of User
 [PASS] Professor is instance of User
 [PASS] Student role is STUDENT
 [PASS] Faculty role is FACULTY
 [PASS] Faculty starting reputation is 50
 [PASS] Encapsulation student ID
 [PASS] Encapsulation faculty cabin
--- Testing Method Overloading ---
 [PASS] searchNotes(keyword) works
 [PASS] searchNotes(keyword, dept) works
 [PASS] searchNotes(keyword, dept, minViews) works
 [PASS] saveNoteToFile(note) works
 [PASS] saveNoteToFile(note, filename) works
 [PASS] saveNoteToFile(filename, content) works
--- Testing Method Overriding & Polymorphism ---
 [PASS] LectureNote overriding getNoteType
 [PASS] SummaryCheatSheet overriding getNoteType
 [PASS] Polymorphic toString() on LectureNote
 [PASS] Polymorphic toString() on SummaryCheatSheet
--- Testing Static & Final Keywords ---
 [PASS] Static counter incremented
 [PASS] Final constant APP_NAME
 [PASS] Final constant MAX_FILE_SIZE_MB
 [PASS] Final noteId getter exists and > 0
--- Testing Java Collections ---
 [PASS] HashMap for peers lookup
 [PASS] Vector for publicNoteRegistry
 [PASS] Queue implemented with LinkedList
 [PASS] Queue received task
--- Testing String Functions ---
 [PASS] trim(), toLowerCase(), toUpperCase(), contains(), substring(), split(), equals(), equalsIgnoreCase(), isEmpty()
--- Testing File Handling ---
 [PASS] File written to disk, read back, copied, listed, deleted, validated
--- Testing Multithreading ---
 [PASS] Transfer task completed on thread
 [PASS] Transfer task successful
 [PASS] BackgroundSync is daemon thread and alive
--- Testing JDBC Database Operations ---
 [PASS] JDBC INSERT User, SELECT User, UPDATE User, INSERT Note, SELECT Note LIKE, DELETE Note, DELETE User
--- Testing REST API Endpoints ---
 [PASS] REST GET /api/stats
 [PASS] REST GET /api/notes
 [PASS] REST GET /api/notes/search
 [PASS] REST POST /api/users/register
 [PASS] REST POST /api/users/login
 [PASS] REST GET /api/notes/download
--- Testing Custom Exceptions & Handling ---
 [PASS] Custom NoteException caught with error code
 [PASS] Custom AuthenticationException caught
===============================================================
 Tests Passed : 65 | Tests Failed : 0
 >>> ALL TESTS PASSED SUCCESSFULLY! 100% VERIFIED! <<<
===============================================================
```

---

## 👤 Author
- GitHub: [@gotlolfourt](https://github.com/gotlolfourt)
- Repository: [Peer-To-Peer-Notes-sharing-System-OOPJ-](https://github.com/gotlolfourt/Peer-To-Peer-Notes-sharing-System-OOPJ-)
