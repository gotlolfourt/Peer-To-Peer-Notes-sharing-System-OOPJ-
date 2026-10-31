package com.p2pnotes.exception;

/**
 * Exception for authentication failures (login, registration).
 *
 * Demonstrates:
 * - Inheritance in exception hierarchy (extends NoteException)
 * - Super keyword to call parent constructor
 * - Method overriding
 */
public class AuthenticationException extends NoteException {

    private final String attemptedUsername;

    public AuthenticationException(String message, String attemptedUsername) {
        super(message, "AUTH_FAILED");
        this.attemptedUsername = attemptedUsername;
    }

    public String getAttemptedUsername() {
        return this.attemptedUsername;
    }

    @Override
    public String getMessage() {
        return super.getMessage() + " (user: " + this.attemptedUsername + ")";
    }
}
