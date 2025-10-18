import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useNotes } from '../context/NotesContext';
import { useOffline } from '../context/OfflineContext';

const SettingsScreen = () => {
  const { 
    settings, 
    updateSettings, 
    getNoteStats, 
    clearPendingSync 
  } = useNotes();
  const { 
    isOnline, 
    getSyncStatus, 
    getConnectionStatus, 
    triggerSync,
    pendingSync 
  } = useOffline();
  
  const noteStats = getNoteStats();

  const handleSortByChange = (sortBy) => {
    updateSettings({ sortBy });
  };

  const handleSortOrderChange = (sortOrder) => {
    updateSettings({ sortOrder });
  };

  const handleAutoSaveToggle = (autoSave) => {
    updateSettings({ autoSave });
  };

  const handleManualSync = () => {
    if (isOnline) {
      triggerSync();
    } else {
      Alert.alert('Offline', 'You need to be online to sync.');
    }
  };

  const handleClearSync = () => {
    Alert.alert(
      'Clear Sync Data',
      'Are you sure you want to clear all pending sync data?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearPendingSync },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Export functionality would be implemented here.');
  };

  const handleImportData = () => {
    Alert.alert('Import Data', 'Import functionality would be implemented here.');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your notes app preferences</Text>
      </View>

      {/* App Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Statistics</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{noteStats.totalNotes}</Text>
            <Text style={styles.statLabel}>Total Notes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{noteStats.favoriteNotes}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{noteStats.totalWords}</Text>
            <Text style={styles.statLabel}>Words</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{noteStats.categoriesCount}</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
        </View>
      </View>

      {/* Display Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Display Settings</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Sort By</Text>
          <View style={styles.optionContainer}>
            {['createdAt', 'updatedAt', 'title'].map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  settings.sortBy === option && styles.optionButtonActive
                ]}
                onPress={() => handleSortByChange(option)}
              >
                <Text style={[
                  styles.optionButtonText,
                  settings.sortBy === option && styles.optionButtonTextActive
                ]}>
                  {option === 'createdAt' ? 'Created Date' : 
                   option === 'updatedAt' ? 'Modified Date' : 'Title'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Sort Order</Text>
          <View style={styles.optionContainer}>
            {['asc', 'desc'].map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  settings.sortOrder === option && styles.optionButtonActive
                ]}
                onPress={() => handleSortOrderChange(option)}
              >
                <Text style={[
                  styles.optionButtonText,
                  settings.sortOrder === option && styles.optionButtonTextActive
                ]}>
                  {option === 'asc' ? 'Ascending' : 'Descending'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Sync Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sync & Storage</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Auto Save</Text>
          <Switch
            value={settings.autoSave}
            onValueChange={handleAutoSaveToggle}
          />
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Connection Status:</Text>
          <Text style={[
            styles.statusValue,
            { color: isOnline ? '#4CAF50' : '#F44336' }
          ]}>
            {getConnectionStatus()}
          </Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Sync Status:</Text>
          <Text style={styles.statusValue}>{getSyncStatus()}</Text>
        </View>

        {pendingSync.length > 0 && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Pending Sync:</Text>
            <Text style={styles.statusValue}>{pendingSync.length} items</Text>
          </View>
        )}

        <TouchableOpacity style={styles.actionButton} onPress={handleManualSync}>
          <Text style={styles.actionButtonText}>Manual Sync</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleClearSync}>
          <Text style={styles.actionButtonText}>Clear Sync Data</Text>
        </TouchableOpacity>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
          <Text style={styles.actionButtonText}>Export Notes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleImportData}>
          <Text style={styles.actionButtonText}>Import Notes</Text>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Information</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Version: 1.0.0</Text>
          <Text style={styles.infoText}>React Native Notes App</Text>
          <Text style={styles.infoText}>Course 5 Project</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  settingItem: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    fontWeight: '500',
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  optionButtonActive: {
    backgroundColor: '#007AFF',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  optionButtonTextActive: {
    color: '#fff',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusLabel: {
    fontSize: 16,
    color: '#333',
  },
  statusValue: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  infoContainer: {
    paddingVertical: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

export default SettingsScreen;
