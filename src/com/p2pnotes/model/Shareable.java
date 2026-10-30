package com.p2pnotes.model;

/**
 * Interface representing any shareable educational resource in the P2P network.
 * Demonstrates:
 * - Interface definition (Module 03, Experiment 3)
 * - Abstraction
 * - Contract method signatures without body
 */
public interface Shareable {
    String getShareableTitle();
    void displayDetails();
    String exportFormattedText();
}
