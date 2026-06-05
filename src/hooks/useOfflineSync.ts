// ============================================================
// useOfflineSync — Online/offline detection + sync orchestration
// ============================================================
import { useState, useEffect, useCallback, useRef } from "react";
import { surveyDb } from "../db/dexie";
import { syncPendingSurveys } from "../db/syncQueue";

interface OfflineSyncState {
  isOnline: boolean;
  pendingCount: number;
  isSyncing: boolean;
  syncProgress: { done: number; total: number } | null;
  lastSyncAt: number | null;
  lastError: string | null;
}

export function useOfflineSync() {
  const [state, setState] = useState<OfflineSyncState>({
    isOnline: navigator.onLine,
    pendingCount: 0,
    isSyncing: false,
    syncProgress: null,
    lastSyncAt: null,
    lastError: null,
  });

  const isSyncingRef = useRef(false);

  // ------------------------------------------------------------------
  // Refresh the pending count from IndexedDB
  // ------------------------------------------------------------------
  const refreshPendingCount = useCallback(async () => {
    const count = await surveyDb.surveys
      .where("synced")
      .equals(0)
      .count();
    setState((s) => ({ ...s, pendingCount: count }));
  }, []);

  // ------------------------------------------------------------------
  // Core sync function
  // ------------------------------------------------------------------
  const sync = useCallback(async () => {
    if (isSyncingRef.current || !navigator.onLine) return;

    isSyncingRef.current = true;
    setState((s) => ({ ...s, isSyncing: true, lastError: null, syncProgress: null }));

    try {
      await syncPendingSurveys((done, total) => {
        setState((s) => ({ ...s, syncProgress: { done, total } }));
      });
      setState((s) => ({
        ...s,
        lastSyncAt: Date.now(),
        lastError: null,
      }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setState((s) => ({ ...s, lastError: msg }));
    } finally {
      isSyncingRef.current = false;
      setState((s) => ({ ...s, isSyncing: false, syncProgress: null }));
      await refreshPendingCount();
    }
  }, [refreshPendingCount]);

  // ------------------------------------------------------------------
  // Online / Offline event listeners
  // ------------------------------------------------------------------
  useEffect(() => {
    const handleOnline = () => {
      setState((s) => ({ ...s, isOnline: true }));
      // Auto-sync when coming back online
      sync();
    };
    const handleOffline = () => {
      setState((s) => ({ ...s, isOnline: false }));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Poll pending count every 30 seconds
    const interval = setInterval(refreshPendingCount, 30_000);

    // Initial count
    refreshPendingCount();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, [sync, refreshPendingCount]);

  return { ...state, sync, refreshPendingCount };
}
