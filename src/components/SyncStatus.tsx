// ============================================================
// SyncStatus — Online indicator + pending badge + manual sync
// ============================================================
import React from "react";
import { useOfflineSync } from "../hooks/useOfflineSync";

export const SyncStatus: React.FC = () => {
  const {
    isOnline,
    pendingCount,
    isSyncing,
    syncProgress,
    lastSyncAt,
    lastError,
    sync,
  } = useOfflineSync();

  const lastSyncFormatted = lastSyncAt
    ? new Date(lastSyncAt).toLocaleTimeString()
    : null;

  return (
    <div className="sync-status">
      {/* Online/Offline dot */}
      <span
        className={`sync-status__dot ${isOnline ? "sync-status__dot--online" : "sync-status__dot--offline"}`}
        title={isOnline ? "Online" : "Offline"}
      />
      <span className="sync-status__label">
        {isOnline ? "Online" : "Offline"}
      </span>

      {/* Pending count badge */}
      {pendingCount > 0 && (
        <span className="sync-status__badge" title={`${pendingCount} unsynced records`}>
          {pendingCount}
        </span>
      )}

      {/* Sync progress */}
      {isSyncing && syncProgress && (
        <span className="sync-status__progress">
          Syncing {syncProgress.done}/{syncProgress.total}…
        </span>
      )}
      {isSyncing && !syncProgress && (
        <span className="sync-status__progress">Syncing…</span>
      )}

      {/* Last sync */}
      {lastSyncFormatted && !isSyncing && (
        <span className="sync-status__last">✓ {lastSyncFormatted}</span>
      )}

      {/* Error */}
      {lastError && (
        <span className="sync-status__error" title={lastError}>⚠ Sync error</span>
      )}

      {/* Manual sync button */}
      {isOnline && pendingCount > 0 && !isSyncing && (
        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={sync}
          id="sync-now-btn"
        >
          Sync Now
        </button>
      )}
    </div>
  );
};
