# Peer-to-Peer Notes Sharing System (Java OOPJ & 3D Web Frontend)

A modular, enterprise-ready Peer-to-Peer (P2P) Notes Sharing platform featuring a **Core Java OOP backend** (with SQLite JDBC, concurrency, and an embedded REST server) and an **award-winning, futuristic 3D editorial web frontend (SHARENOTE)**.

> **"Knowledge is better when it is shared."**

---

## 📌 Project Overview & Problem Statement

### Problem Statement
In academic environments, students and faculty often struggle with fragmented platforms for sharing lecture notes, revision guides, and exam cheat-sheets. Centralized repositories suffer from single points of failure, lack of peer reputation tracking, and cumbersome interfaces. 

### Solution
This application combines:
1. **Decentralized Java P2P Core**: Autonomous peers (students and faculty) contribute, review, download, persist, and verify study materials with built-in reputation tracking, local disk caching, SQLite database persistence, multithreaded file transfer simulation, and an embedded REST API.
2. **Award-Winning 3D Editorial Frontend**: A dark, futuristic, Awwwards-inspired web experience with deep ink backgrounds (`#101211`), acid-lime accents (`#D5F36A`), Swiss typography, interactive Three.js 3D knowledge ecosystems, and live peer network visualizations.

---

## 🎨 Creative Direction & Visual Identity (Frontend)

- **Design Philosophy**: High-end digital product design inspired by modern Swiss typography, experimental WebGL interactions, and editorial publications.
- **Color Palette**:
  - Background: Deep ink black (`#101211`)
  - Surface & Cards: Warm charcoal (`#191D19` / `#151816`)
  - Primary Accent: Acid lime (`#D5F36A`)
  - Secondary Accent: Muted sage (`#A5B89B`)
  - Text: Warm ivory (`#F1EFE5`)
  - Secondary Text: Muted grey (`#969B91`)
  - Borders: Subtle olive grey (`#343A32`)
- **Typography**:
  - Headings: `Space Grotesk`
  - Body: `Manrope`
  - Editorial Accents: `Instrument Serif` (italic)
  - Technical Badges: `IBM Plex Mono`

---

## 🌟 Key Features

### 1. 3D & Web Frontend (SHARENOTE)
- **3D Knowledge Ecosystem (Hero)**: Interactive Three.js scene featuring floating 3D academic document cards, layered paper sheets, an inner glowing sphere, an outer wireframe knowledge icosahedron, orbiting rings, dynamic ray lines, and mouse-parallax inertia damping.
- **3D Live Knowledge Mesh (Network Topology)**: Full-width interactive 3D node network visualizing peers (Alice, Bob, Dr. Charlie) and data packets streaming between nodes. Hovering over any node dynamically opens a 3D raycast tooltip showing live credentials and shared note metrics.
- **Explore Notes Studio (`/explore`)**:
  - Real-time search by keyword, title, professor, course code, or tags.
  - Department filtering (CSE, AIML, ECE, Mechanical, General).
  - Note-type filter (Lecture Notes vs Exam Cheat Sheets).
  - Sorting by views (popularity), ratings, and recent uploads.
- **Upload Note Studio (`/upload`)**:
  - Drag-and-drop file upload zone with file-size detection and validation.
  - Specialized forms for **Lecture Notes** (course code, professor, lecture number) vs **Cheat Sheets** (target exam, dynamic formula list, summary points).
  - Animated progress bar and confetti celebration upon publishing.
- **Peer Authentication (`/login` & `/register`)**:
  - Single-click quick login for demo peers (`@alice_cse`, `@bob_aiml`, `@charlie_ece`).
  - Registration with Student vs Faculty specialization (Student USN / semester vs Faculty designation / cabin).
- **Personal Peer Dashboard (`/dashboard`)**:
  - Academic credentials banner, reputation points counter (`+145 pts`), and activity metrics.
  - Tabbed library: Notes Shared by Me, Downloaded Notes, and **Background Worker Thread Pool Monitor**.
- **Deep Note Reader (`/notes/:id`)**:
  - Full-text document reader, course instructor context, formulas list, and one-click `.txt` file export.
- **Peer Profile View (`/profile/:id`)**:
  - Peer academic credentials, badges, reputation score, and published notes list.

### 2. Core Java OOP Backend
- **Core OOP Principles**: Encapsulation, Polymorphism, Abstraction, and Interfaces (`Shareable`, `Authenticatable`, `TransferService`).
- **Inheritance Trees**:
  - Notes: `BaseNote` &rarr; `LectureNote` & `SummaryCheatSheet`.
  - Peers: `User` &rarr; `StudentPeer` & `ProfessorPeer`.
- **Collections Framework**: `ArrayList`, `HashMap`, `HashSet`, `Vector`, and `LinkedList` (as a `Queue`).
- **Concurrency & Threads**:
  - `TransferTask` (`Runnable`): Non-blocking concurrent file downloads with progress tracking and synchronized counters.
  - `BackgroundSync` (`Thread` daemon): Periodic network snapshot telemetry.
- **File Handling**: `FileManager` handling file creation, buffered reading, writing, copying, deletion, and path-traversal validation.
- **Relational Persistence (JDBC + SQLite)**: Full parameterized CRUD on `users` and `notes` tables using `PreparedStatement`.
- **Embedded REST API**: Lightweight HTTP server (`com.sun.net.httpserver.HttpServer`) running on port `7070`.

---

## 🛠️ Technologies Used

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 / 19, TypeScript, Vite |
| **Styling & Design System** | Tailwind CSS 3.4, PostCSS, Custom Design Tokens |
| **3D Graphics & Canvas** | Three.js (WebGL with PCF Soft Shadows & Fog) |
| **Icons & Effects** | Lucide React, Canvas Confetti |
| **Client Routing & State** | React Router v7, React Context API (`AuthContext`) |
| **Backend Language** | Java SE (JDK 17 or higher; verified on JDK 27) |
| **Persistence (JDBC)** | SQLite (`sqlite-jdbc` 3.45.1.0) |
| **Logging** | SLF4J (`slf4j-api` & `slf4j-simple`) |
| **REST Server** | Java Standard Library `com.sun.net.httpserver.HttpServer` |
| **Testing** | Automated Standalone Integration Suite (`SystemIntegrationTest.java`) |

---

## 🏛️ System Architecture

```text
PeerToPeerNotesSharing/
├── frontend/                          # Award-Winning 3D Web Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/
│   │   │   │   ├── KnowledgeHero3D.tsx    # 3D interactive hero ecosystem
│   │   │   │   └── NetworkMesh3D.tsx      # 3D live knowledge network mesh
│   │   │   ├── common/
│   │   │   │   ├── CustomCursor.tsx       # Desktop magnetic cursor
│   │   │   │   ├── NoteCard.tsx           # Differentiated note cards
│   │   │   │   ├── PeerCard.tsx           # Peer profile cards
│   │   │   │   └── StatCounter.tsx        # Animated metric counters
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx             # Floating glass navigation
│   │   │   │   └── Footer.tsx             # Editorial dark footer
│   │   │   ├── modals/
│   │   │   │   └── NotePreviewModal.tsx   # Detailed note reader modal
│   │   │   └── sections/
│   │   │       ├── HeroSection.tsx
│   │   │       ├── LiveNetworkSection.tsx
│   │   │       ├── ExplorePreviewSection.tsx
│   │   │       ├── HowItWorksSection.tsx
│   │   │       ├── CommunitySection.tsx
│   │   │       ├── StatsSection.tsx
│   │   │       └── FastUploadCTA.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx            # Global peer state & library
│   │   ├── pages/
│   │   │   ├── HomePage.tsx               # Landing page with 3D elements
│   │   │   ├── ExplorePage.tsx            # Search & filter directory
│   │   │   ├── UploadPage.tsx             # Drag-and-drop studio
│   │   │   ├── LoginPage.tsx              # Peer authentication
│   │   │   ├── RegisterPage.tsx           # Student / Faculty onboarding
│   │   │   ├── DashboardPage.tsx          # Personal library & thread monitor
│   │   │   ├── NoteDetailPage.tsx         # Full note view & download
│   │   │   └── ProfilePage.tsx            # Contributor profile & badges
│   │   ├── services/
│   │   │   ├── api.ts                     # REST client connecting to :7070
│   │   │   └── mockData.ts                # High-fidelity realistic fallback
│   │   ├── types/
│   │   │   └── index.ts                   # TypeScript interfaces
│   │   ├── App.tsx                        # Router & master layout
│   │   ├── index.css                      # Tailwind & typography directives
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── lib/                               # Bundled JDBC & logging libraries
├── p2p_data/                          # SQLite persistent database storage
├── p2p_notes_storage/                 # Local filesystem note storage
├── src/                               # Java Core Backend Source
│   └── com/p2pnotes/
│       ├── api/NoteApiServer.java
│       ├── app/Main.java
│       ├── auth/Authenticatable.java
│       ├── db/DatabaseManager.java
│       ├── exception/NoteException.java
│       ├── io/FileManager.java
│       ├── model/{BaseNote, LectureNote, SummaryCheatSheet, User, StudentPeer, ProfessorPeer}.java
│       ├── service/PeerNetwork.java
│       ├── thread/{TransferTask, BackgroundSync}.java
│       └── util/{AppConstants, StringUtils}.java
├── test/
│   └── com/p2pnotes/test/SystemIntegrationTest.java # 65 Automated Tests
├── JAVA_CONCEPTS_DOCUMENTATION.md     # Detailed Java Concepts Table & Viva Guide
└── README.md
```

---

## 🌐 REST API Endpoints (Java Backend)

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

## 🚀 Installation & Execution Instructions

### 1. Run the Frontend (React + Vite + 3D)
Open a terminal in the `frontend` folder:
```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start Vite dev server
npm run dev
```
Open **`http://localhost:5173`** in your browser to experience the 3D website.

To create an optimized production build:
```bash
npm run build
```

---

### 2. Run the Java Backend (Console & REST API Server)
Open a terminal in the root directory:
```bash
# Compile Java source code
javac -cp ".;lib/*" -d bin -sourcepath src (Get-ChildItem -Path src -Filter *.java -Recurse | Select-Object -ExpandProperty FullName)

# Launch Java CLI application
java -cp "bin;lib/*" com.p2pnotes.app.Main
```
From the CLI menu, choose Option 4 &rarr; Option 1 to start the REST API Server on port 7070. The frontend will automatically detect the server and switch the status pill to **`JAVA API: ONLINE`**.

---

### 3. Run Automated Verification Tests
```bash
javac -cp ".;bin;lib/*" -d bin test/com/p2pnotes/test/SystemIntegrationTest.java
java -cp "bin;lib/*" com.p2pnotes.test.SystemIntegrationTest
```
All **65 tests** pass automatically, verifying Core OOP, Collections, Multithreading, File I/O, JDBC SQLite, and REST endpoints.

---

## 👤 Author
- GitHub: [@gotlolfourt](https://github.com/gotlolfourt)
- Repository: [Peer-To-Peer-Notes-sharing-System-OOPJ-](https://github.com/gotlolfourt/Peer-To-Peer-Notes-sharing-System-OOPJ-)
