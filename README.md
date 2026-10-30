# Peer-to-Peer Notes Sharing System (OOPJ)

A console-based Peer-to-Peer (P2P) Notes Sharing application developed in Java as part of the Object Oriented Programming with Java (OOPJ) coursework.

---

## 📌 Project Overview
The Peer-to-Peer Notes Sharing System simulates a decentralized network where college peers can share, review, download, and manage study materials such as lecture notes and summary cheat sheets.

### Key Features
- **User / Peer Management**: Peer registration, authentication, reputation tracking, and download statistics.
- **Note Categorization & Sharing**:
  - `LectureNote`: Detailed class notes, topic coverage, and professor references.
  - `SummaryCheatSheet`: Quick revision guides and formulas.
- **P2P Network Simulation**: Search, download, request, and verify notes shared by peers.
- **Console Interface**: Interactive menu-driven console UI.

---

## 🛠️ Concepts Demonstrated (OOP with Java)
- **Object-Oriented Design**: Encapsulation, Inheritance, Polymorphism, Abstraction, and Interfaces.
- **Data Structures**: Collections framework (`ArrayList`, `Vector`, etc.), arrays, and custom models.
- **Input & Control Flow**: Robust input processing and safe numeric parsing.

---

## 📂 Project Structure
```text
PeerToPeerNotesSharing/
├── src/
│   └── com/
│       └── p2pnotes/
│           ├── app/
│           │   └── Main.java              # Application entry point and Console UI
│           ├── model/
│           │   ├── BaseNote.java          # Abstract base class for notes
│           │   ├── LectureNote.java       # Concrete model for lecture notes
│           │   ├── Shareable.java         # Interface for shareable resources
│           │   ├── SummaryCheatSheet.java # Quick revision summary note model
│           │   └── User.java              # Peer model with reputation & stats
│           └── service/
│               └── PeerNetwork.java       # Network management and peer interactions
├── .gitignore
└── README.md
```

---

## 🚀 How to Run

### Prerequisites
- Java Development Kit (JDK 8 or higher)

### Compile
Open a terminal in the project root directory and run:
```bash
javac -d bin -sourcepath src src/com/p2pnotes/app/Main.java
```

### Run
```bash
java -cp bin com.p2pnotes.app.Main
```

---

## 👤 Author
- GitHub: [@gotlolfourt](https://github.com/gotlolfourt)
