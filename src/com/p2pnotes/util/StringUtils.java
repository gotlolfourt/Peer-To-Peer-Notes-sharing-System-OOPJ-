package com.p2pnotes.util;

/**
 * Utility class for common String operations used across the application.
 *
 * Demonstrates:
 * - String Functions: equals, equalsIgnoreCase, contains, substring, split,
 * trim, toLowerCase, toUpperCase, isEmpty, startsWith, endsWith, replace,
 * indexOf, length, charAt, valueOf
 * - Static methods in a utility class
 * - Final class (cannot be extended)
 */
public final class StringUtils {

    private StringUtils() {
        // Utility class
    }

    /**
     * Checks if a string is null or empty (after trimming).
     * Uses: trim(), isEmpty()
     */
    public static boolean isNullOrEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    /**
     * Capitalizes the first letter of each word.
     * Uses: split(), substring(), toUpperCase(), toLowerCase(), charAt(), length()
     */
    public static String capitalizeWords(String input) {
        if (isNullOrEmpty(input)) {
            return input;
        }
        String[] words = input.trim().split("\\s+");
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < words.length; i++) {
            if (words[i].length() > 0) {
                result.append(Character.toUpperCase(words[i].charAt(0)));
                if (words[i].length() > 1) {
                    result.append(words[i].substring(1).toLowerCase());
                }
                if (i < words.length - 1) {
                    result.append(" ");
                }
            }
        }
        return result.toString();
    }

    /**
     * Validates an email address using basic string checks.
     * Uses: contains(), indexOf(), lastIndexOf(), substring(), length()
     */
    public static boolean isValidEmail(String email) {
        if (isNullOrEmpty(email)) {
            return false;
        }
        String trimmed = email.trim();
        int atIndex = trimmed.indexOf('@');
        int lastDot = trimmed.lastIndexOf('.');
        return atIndex > 0 && lastDot > atIndex + 1 && lastDot < trimmed.length() - 1
                && !trimmed.contains(" ");
    }

    /**
     * Validates a username: only letters, digits, underscores; length 3-20.
     * Uses: length(), charAt()
     */
    public static boolean isValidUsername(String username) {
        if (isNullOrEmpty(username)) {
            return false;
        }
        String trimmed = username.trim();
        if (trimmed.length() < 3 || trimmed.length() > 20) {
            return false;
        }
        for (int i = 0; i < trimmed.length(); i++) {
            char c = trimmed.charAt(i);
            if (!Character.isLetterOrDigit(c) && c != '_') {
                return false;
            }
        }
        return true;
    }

    /**
     * Sanitizes a filename by removing unsafe characters.
     * Uses: replace(), toLowerCase(), trim()
     */
    public static String sanitizeFilename(String filename) {
        if (isNullOrEmpty(filename)) {
            return "unnamed";
        }
        return filename.trim()
                .replace(" ", "_")
                .replace("/", "_")
                .replace("\\", "_")
                .replace("..", "_")
                .replace(":", "_")
                .toLowerCase();
    }

    /**
     * Extracts the file extension from a filename.
     * Uses: lastIndexOf(), substring(), toLowerCase()
     */
    public static String getFileExtension(String filename) {
        if (isNullOrEmpty(filename)) {
            return "";
        }
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < filename.length() - 1) {
            return filename.substring(dotIndex).toLowerCase();
        }
        return "";
    }

    /**
     * Truncates a string to a maximum length, appending "..." if truncated.
     * Uses: length(), substring()
     */
    public static String truncate(String text, int maxLength) {
        if (isNullOrEmpty(text) || text.length() <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength - 3) + "...";
    }

    /**
     * Checks if a string contains a keyword (case-insensitive).
     * Uses: toLowerCase(), contains()
     */
    public static boolean containsIgnoreCase(String source, String keyword) {
        if (source == null || keyword == null) {
            return false;
        }
        return source.toLowerCase().contains(keyword.toLowerCase());
    }

    /**
     * Masks a password for display (shows only first and last char).
     * Uses: charAt(), length(), substring()
     */
    public static String maskPassword(String password) {
        if (isNullOrEmpty(password) || password.length() <= 2) {
            return "***";
        }
        StringBuilder masked = new StringBuilder();
        masked.append(password.charAt(0));
        for (int i = 1; i < password.length() - 1; i++) {
            masked.append('*');
        }
        masked.append(password.charAt(password.length() - 1));
        return masked.toString();
    }

    /**
     * Generates a simple unique ID using timestamp and a counter.
     * Uses: valueOf(), substring()
     */
    public static String generateId(String prefix) {
        long timestamp = System.currentTimeMillis();
        String tsStr = String.valueOf(timestamp);
        String shortTs = tsStr.substring(tsStr.length() - 8);
        return prefix + "_" + shortTs;
    }
}
