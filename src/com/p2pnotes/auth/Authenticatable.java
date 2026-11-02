package com.p2pnotes.auth;

/**
 * Interface defining authentication and identity behavior for users/peers.
 * 
 * Demonstrates:
 * - Interface definition (Module 03, Experiment 3)
 * - Contract method signatures without implementation bodies
 * - Loose coupling between authentication services and user models
 */
public interface Authenticatable {
    /**
     * Verifies if the provided password matches the credential.
     */
    boolean verifyPassword(String inputPassword);

    /**
     * Returns the unique username of the entity.
     */
    String getUsername();

    /**
     * Returns the role/type of the authenticated entity (e.g., STUDENT, PROFESSOR, ADMIN).
     */
    String getRole();
}

