package com.p2pnotes.exception;

/**
 * Custom exception for note-related errors in the P2P Notes Sharing System.
 *
 * Demonstrates:
 * - Custom Exception class (extends Exception)
 * - Inheritance in exception hierarchy
 * - Constructor overloading with super keyword
 * - Method overriding (getMessage)
 */
public class NoteException extends Exception {

    private final String errorCode;

    // Constructor with message only
    public NoteException(String message) {
        super(message);
        this.errorCode = "GENERAL";
    }

    // Constructor overloading: message + error code
    public NoteException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    // Constructor overloading: message + cause
    public NoteException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = "GENERAL";
    }

    public String getErrorCode() {
        return this.errorCode;
    }

    @Override
    public String getMessage() {
        return "[" + this.errorCode + "] " + super.getMessage();
    }
}
