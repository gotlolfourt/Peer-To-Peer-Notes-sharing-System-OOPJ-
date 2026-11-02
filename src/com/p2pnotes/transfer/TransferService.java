package com.p2pnotes.transfer;

import com.p2pnotes.model.BaseNote;

/**
 * Interface defining note transfer operations in the P2P system.
 * 
 * Demonstrates:
 * - Interface definition
 * - Decoupling transfer orchestration from underlying transport/thread mechanisms
 */
public interface TransferService {
    /**
     * Initiates an asynchronous file transfer task.
     */
    void initiateTransfer(BaseNote note, String downloaderUsername);

    /**
     * Returns the number of currently active transfers.
     */
    int getActiveTransferCount();

    /**
     * Returns the total completed transfer count.
     */
    int getCompletedTransferCount();
}

