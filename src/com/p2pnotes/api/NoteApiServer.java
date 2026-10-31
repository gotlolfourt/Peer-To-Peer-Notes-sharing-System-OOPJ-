package com.p2pnotes.api;

import com.p2pnotes.model.BaseNote;
import com.p2pnotes.model.LectureNote;
import com.p2pnotes.model.User;
import com.p2pnotes.service.PeerNetwork;
import com.p2pnotes.util.AppConstants;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Vector;

/**
 * Lightweight embedded REST API Server for the Peer-to-Peer Notes Sharing System.
 * Uses Java Standard Library HttpServer (com.sun.net.httpserver) for zero-dependency execution.
 * 
 * Endpoints:
 * - POST   /api/users/register   - Register a new peer
 * - POST   /api/users/login      - Authenticate an existing peer
 * - GET    /api/notes            - Retrieve all public notes
 * - POST   /api/notes            - Upload / publish a new note
 * - GET    /api/notes/search     - Search notes by keyword & department
 * - GET    /api/notes/download   - Download note content by ID
 * - DELETE /api/notes            - Delete / unpublish a note by ID
 * - GET    /api/stats            - Retrieve system & network statistics
 * 
 * Demonstrates:
 * - REST API Architecture & HTTP methods (GET, POST, DELETE)
 * - Java Collections: Map, Vector, ArrayList
 * - Multithreading: HttpServer thread pool execution
 * - Exception handling & HTTP Status Codes (200, 201, 400, 401, 404, 405)
 * - String parsing & JSON generation
 */
public class NoteApiServer {
    private HttpServer server;
    private final int port;
    private final PeerNetwork network;
    private boolean isRunning;

    public NoteApiServer(PeerNetwork network) {
        this(network, AppConstants.API_PORT);
    }

    public NoteApiServer(PeerNetwork network, int port) {
        this.network = network;
        this.port = port;
        this.isRunning = false;
    }

    /**
     * Starts the embedded REST API server.
     */
    public synchronized void start() {
        if (isRunning) {
            System.out.println("[REST API] Server is already running on port " + port);
            return;
        }

        try {
            server = HttpServer.create(new InetSocketAddress(port), 0);

            // Register REST endpoint handlers
            server.createContext("/api/users/register", new RegisterHandler());
            server.createContext("/api/users/login", new LoginHandler());
            server.createContext("/api/notes", new NotesHandler());
            server.createContext("/api/notes/search", new SearchHandler());
            server.createContext("/api/notes/download", new DownloadHandler());
            server.createContext("/api/stats", new StatsHandler());

            server.setExecutor(null); // default multithreaded executor
            server.start();
            isRunning = true;
            System.out.println("=================================================");
            System.out.println(" [REST API] Server started on http://localhost:" + port);
            System.out.println(" Endpoints available:");
            System.out.println("   POST   http://localhost:" + port + "/api/users/register");
            System.out.println("   POST   http://localhost:" + port + "/api/users/login");
            System.out.println("   GET    http://localhost:" + port + "/api/notes");
            System.out.println("   POST   http://localhost:" + port + "/api/notes");
            System.out.println("   GET    http://localhost:" + port + "/api/notes/search?keyword=oop");
            System.out.println("   GET    http://localhost:" + port + "/api/notes/download?id=101");
            System.out.println("   DELETE http://localhost:" + port + "/api/notes?id=101&username=alice_cse");
            System.out.println("   GET    http://localhost:" + port + "/api/stats");
            System.out.println("=================================================");
        } catch (IOException e) {
            System.out.println("[REST API] Failed to start server: " + e.getMessage());
        }
    }

    /**
     * Stops the REST API server.
     */
    public synchronized void stop() {
        if (server != null && isRunning) {
            server.stop(0);
            isRunning = false;
            System.out.println("[REST API] Server stopped successfully.");
        }
    }

    public boolean isRunning() {
        return isRunning;
    }

    public int getPort() {
        return port;
    }

    // ─── ENDPOINT HANDLERS ──────────────────────────────────────────

    /**
     * Handler for POST /api/users/register
     */
    private class RegisterHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed. Use POST.\"}");
                return;
            }

            Map<String, String> body = parseRequestBody(exchange);
            String username = body.get("username");
            String password = body.get("password");
            String fullName = body.get("fullName");
            String department = body.get("department");

            if (username == null || password == null || fullName == null) {
                sendResponse(exchange, 400, "{\"error\":\"Missing required fields: username, password, fullName\"}");
                return;
            }

            User user = new User(username, password, fullName, department != null ? department : "GENERAL");
            boolean created = network.registerPeer(user);

            if (created) {
                sendResponse(exchange, 201, String.format(
                    "{\"status\":\"success\",\"message\":\"User registered\",\"username\":\"%s\"}", username));
            } else {
                sendResponse(exchange, 400, "{\"error\":\"Username already taken\"}");
            }
        }
    }

    /**
     * Handler for POST /api/users/login
     */
    private class LoginHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed. Use POST.\"}");
                return;
            }

            Map<String, String> body = parseRequestBody(exchange);
            String username = body.get("username");
            String password = body.get("password");

            if (username == null || password == null) {
                sendResponse(exchange, 400, "{\"error\":\"Provide username and password\"}");
                return;
            }

            User authenticated = network.authenticate(username, password);
            if (authenticated != null) {
                sendResponse(exchange, 200, String.format(
                    "{\"status\":\"success\",\"message\":\"Login successful\",\"username\":\"%s\",\"fullName\":\"%s\",\"department\":\"%s\",\"reputation\":%d}",
                    authenticated.getUsername(), authenticated.getFullName(), authenticated.getDepartment(), authenticated.getReputationScore()));
            } else {
                sendResponse(exchange, 401, "{\"error\":\"Invalid username or password\"}");
            }
        }
    }

    /**
     * Handler for GET /api/notes and POST /api/notes and DELETE /api/notes
     */
    private class NotesHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod().toUpperCase();

            switch (method) {
                case "GET":
                    Vector<BaseNote> notes = network.getAllPublicNotes();
                    sendResponse(exchange, 200, formatNotesJson(new ArrayList<>(notes)));
                    break;

                case "POST":
                    Map<String, String> body = parseRequestBody(exchange);
                    String title = body.get("title");
                    String author = body.get("author");
                    String dept = body.get("department");
                    String username = body.get("username");
                    String content = body.get("content");

                    if (title == null || author == null || username == null) {
                        sendResponse(exchange, 400, "{\"error\":\"title, author, and username are required\"}");
                        return;
                    }

                    User owner = network.getPeers().get(username.toLowerCase());
                    if (owner == null) {
                        sendResponse(exchange, 404, "{\"error\":\"Owner peer not found with username: " + username + "\"}");
                        return;
                    }

                    LectureNote newNote = new LectureNote(
                        title, author, dept != null ? dept : owner.getDepartment(),
                        body.getOrDefault("courseCode", "GEN101"),
                        body.getOrDefault("professorName", "Staff"),
                        1,
                        content != null ? content : "No body text provided."
                    );
                    network.publishNote(owner, newNote);
                    sendResponse(exchange, 201, String.format(
                        "{\"status\":\"success\",\"message\":\"Note published\",\"noteId\":%d,\"title\":\"%s\"}",
                        newNote.getNoteId(), newNote.getTitle()));
                    break;

                case "DELETE":
                    Map<String, String> params = parseQueryParams(exchange.getRequestURI().getQuery());
                    String idStr = params.get("id");
                    String ownerUser = params.get("username");

                    if (idStr == null || ownerUser == null) {
                        sendResponse(exchange, 400, "{\"error\":\"Query params 'id' and 'username' are required\"}");
                        return;
                    }

                    try {
                        int noteId = Integer.parseInt(idStr);
                        User u = network.getPeers().get(ownerUser.toLowerCase());
                        if (u == null) {
                            sendResponse(exchange, 404, "{\"error\":\"User not found\"}");
                            return;
                        }
                        boolean removed = network.unpublishNote(u, noteId);
                        if (removed) {
                            sendResponse(exchange, 200, "{\"status\":\"success\",\"message\":\"Note deleted\"}");
                        } else {
                            sendResponse(exchange, 404, "{\"error\":\"Note not found in user shared notes\"}");
                        }
                    } catch (NumberFormatException e) {
                        sendResponse(exchange, 400, "{\"error\":\"Invalid numeric note ID\"}");
                    }
                    break;

                default:
                    sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
            }
        }
    }

    /**
     * Handler for GET /api/notes/search?keyword=...&dept=...
     */
    private class SearchHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Use GET for search\"}");
                return;
            }

            Map<String, String> params = parseQueryParams(exchange.getRequestURI().getQuery());
            String keyword = params.getOrDefault("keyword", "");
            String dept = params.getOrDefault("dept", "ALL");

            ArrayList<BaseNote> results = network.searchNotes(keyword, dept);
            sendResponse(exchange, 200, formatNotesJson(results));
        }
    }

    /**
     * Handler for GET /api/notes/download?id=...
     */
    private class DownloadHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Use GET for download\"}");
                return;
            }

            Map<String, String> params = parseQueryParams(exchange.getRequestURI().getQuery());
            String idStr = params.get("id");
            if (idStr == null) {
                sendResponse(exchange, 400, "{\"error\":\"Query param 'id' required\"}");
                return;
            }

            try {
                int noteId = Integer.parseInt(idStr);
                BaseNote note = network.findNoteById(noteId);
                if (note != null) {
                    note.incrementAccess();
                    AppConstants.incrementDownloads();
                    String export = note.exportFormattedText();
                    sendResponse(exchange, 200, "{\"status\":\"success\",\"noteId\":" + noteId + ",\"content\":\"" +
                        escapeJson(export) + "\"}");
                } else {
                    sendResponse(exchange, 404, "{\"error\":\"Note not found\"}");
                }
            } catch (NumberFormatException e) {
                sendResponse(exchange, 400, "{\"error\":\"Invalid note ID\"}");
            }
        }
    }

    /**
     * Handler for GET /api/stats
     */
    private class StatsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Use GET for stats\"}");
                return;
            }

            String json = String.format(
                "{\"application\":\"%s\",\"version\":\"%s\",\"registeredUsers\":%d,\"notesShared\":%d,\"totalDownloads\":%d,\"activeTransfers\":%d}",
                AppConstants.APP_NAME, AppConstants.APP_VERSION,
                network.getPeers().size(), network.getAllPublicNotes().size(),
                AppConstants.getTotalDownloads(), network.getActiveTransferCount());

            sendResponse(exchange, 200, json);
        }
    }

    // ─── UTILITY HELPERS ───────────────────────────────────────────

    private void sendResponse(HttpExchange exchange, int statusCode, String responseText) throws IOException {
        byte[] bytes = responseText.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private Map<String, String> parseQueryParams(String query) {
        Map<String, String> params = new HashMap<>();
        if (query == null || query.trim().isEmpty()) {
            return params;
        }
        String[] pairs = query.split("&");
        for (String pair : pairs) {
            String[] kv = pair.split("=", 2);
            if (kv.length == 2) {
                params.put(kv[0].trim(), kv[1].trim());
            } else if (kv.length == 1) {
                params.put(kv[0].trim(), "");
            }
        }
        return params;
    }

    private Map<String, String> parseRequestBody(HttpExchange exchange) throws IOException {
        Map<String, String> map = new HashMap<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            String raw = sb.toString().trim();
            if (raw.startsWith("{") && raw.endsWith("}")) {
                // Simple JSON parser for flat key-values: {"key":"value", ...}
                raw = raw.substring(1, raw.length() - 1);
                String[] tokens = raw.split(",");
                for (String token : tokens) {
                    String[] kv = token.split(":", 2);
                    if (kv.length == 2) {
                        String key = kv[0].trim().replace("\"", "");
                        String val = kv[1].trim().replace("\"", "");
                        map.put(key, val);
                    }
                }
            } else if (raw.contains("=")) {
                // Form encoded
                return parseQueryParams(raw);
            }
        }
        return map;
    }

    private String formatNotesJson(ArrayList<BaseNote> notes) {
        StringBuilder sb = new StringBuilder();
        sb.append("{\"count\":").append(notes.size()).append(",\"notes\":[");
        for (int i = 0; i < notes.size(); i++) {
            BaseNote n = notes.get(i);
            sb.append("{")
              .append("\"noteId\":").append(n.getNoteId()).append(",")
              .append("\"title\":\"").append(escapeJson(n.getTitle())).append("\",")
              .append("\"author\":\"").append(escapeJson(n.getAuthor())).append("\",")
              .append("\"department\":\"").append(escapeJson(n.getDepartment())).append("\",")
              .append("\"type\":\"").append(n.getNoteType()).append("\",")
              .append("\"views\":").append(n.getAccessCount())
              .append("}");
            if (i < notes.size() - 1) {
                sb.append(",");
            }
        }
        sb.append("]}");
        return sb.toString();
    }

    private String escapeJson(String text) {
        if (text == null) {
            return "";
        }
        return text.replace("\\", "\\\\")
                   .replace("\"", "\\\"")
                   .replace("\n", "\\n")
                   .replace("\r", "");
    }
}
