import React, { createContext, useContext, useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Offline Context
const OfflineContext = createContext();

// Storage Keys
const STORAGE_KEYS = {
  PENDING_SYNC: '@pending_sync',
  LAST_SYNC: '@last_sync',
  OFFLINE_DATA: '@offline_data',
};

// Offline Provider Component
export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [pendingSync, setPendingSync] = useState([]);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [syncInProgress, setSyncInProgress] = useState(false);

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(state => {
      const wasOffline = !isOnline;
      const isNowOnline = state.isConnected && state.isInternetReachable;
      
      setIsOnline(isNowOnline);
      setIsConnecting(state.isConnected && !state.isInternetReachable);

      // If we just came back online, trigger sync
      if (wasOffline && isNowOnline) {
        handleReconnection();
      }
    });

    // Load initial state
    loadOfflineState();

    return () => {
      unsubscribe();
    };
  }, []);

  // Load offline state from storage
  const loadOfflineState = async () => {
    try {
      const [pendingData, lastSync] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PENDING_SYNC),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC),
      ]);

      if (pendingData) {
        setPendingSync(JSON.parse(pendingData));
      }

      if (lastSync) {
        setLastSyncTime(new Date(lastSync));
      }
    } catch (error) {
      console.error('Error loading offline state:', error);
    }
  };

  // Save offline state to storage
  const saveOfflineState = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(pendingSync)),
        AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, lastSyncTime?.toISOString() || ''),
      ]);
    } catch (error) {
      console.error('Error saving offline state:', error);
    }
  };

  // Handle reconnection
  const handleReconnection = async () => {
    if (pendingSync.length > 0) {
      await syncPendingChanges();
    }
  };

  // Add item to pending sync
  const addToPendingSync = async (action, data) => {
    const syncItem = {
      id: Date.now() + Math.random(),
      action, // 'create', 'update', 'delete'
      data,
      timestamp: new Date().toISOString(),
    };

    const newPendingSync = [...pendingSync, syncItem];
    setPendingSync(newPendingSync);

    // Save to storage
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(newPendingSync));
    } catch (error) {
      console.error('Error saving pending sync:', error);
    }
  };

  // Sync pending changes
  const syncPendingChanges = async () => {
    if (syncInProgress || pendingSync.length === 0) return;

    setSyncInProgress(true);

    try {
      // Simulate API calls for each pending item
      for (const item of pendingSync) {
        await simulateApiCall(item);
      }

      // Clear pending sync after successful sync
      setPendingSync([]);
      setLastSyncTime(new Date());
      
      // Save updated state
      await saveOfflineState();

      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Sync failed:', error);
      // In a real app, you might want to retry or handle partial failures
    } finally {
      setSyncInProgress(false);
    }
  };

  // Simulate API call (replace with actual API calls)
  const simulateApiCall = async (item) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Syncing ${item.action}:`, item.data);
        resolve();
      }, 1000); // Simulate network delay
    });
  };

  // Manual sync trigger
  const triggerSync = async () => {
    if (isOnline && !syncInProgress) {
      await syncPendingChanges();
    }
  };

  // Clear all pending sync
  const clearPendingSync = async () => {
    setPendingSync([]);
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.PENDING_SYNC);
    } catch (error) {
      console.error('Error clearing pending sync:', error);
    }
  };

  // Get sync status
  const getSyncStatus = () => {
    if (syncInProgress) return 'syncing';
    if (!isOnline) return 'offline';
    if (pendingSync.length > 0) return 'pending';
    return 'synced';
  };

  // Get connection status text
  const getConnectionStatus = () => {
    if (isConnecting) return 'Connecting...';
    if (!isOnline) return 'Offline';
    return 'Online';
  };

  const contextValue = {
    // State
    isOnline,
    isConnecting,
    pendingSync,
    lastSyncTime,
    syncInProgress,
    
    // Actions
    addToPendingSync,
    triggerSync,
    clearPendingSync,
    
    // Helpers
    getSyncStatus,
    getConnectionStatus,
  };

  return (
    <OfflineContext.Provider value={contextValue}>
      {children}
    </OfflineContext.Provider>
  );
};

// Custom Hook to use Offline Context
export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

export default OfflineContext;
