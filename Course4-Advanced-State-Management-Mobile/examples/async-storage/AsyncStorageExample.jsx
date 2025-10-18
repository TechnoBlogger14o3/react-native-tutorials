import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom hook for AsyncStorage
function useAsyncStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        const item = await AsyncStorage.getItem(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error(`Error reading AsyncStorage key "${key}":`, error);
        Alert.alert('Error', 'Failed to load saved data');
      } finally {
        setLoading(false);
      }
    };

    loadStoredValue();
  }, [key]);

  const setValue = async (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting AsyncStorage key "${key}":`, error);
      Alert.alert('Error', 'Failed to save data');
    }
  };

  return [storedValue, setValue, loading];
}

// User Preferences Component
function UserPreferences() {
  const [theme, setTheme] = useAsyncStorage('theme', 'light');
  const [language, setLanguage] = useAsyncStorage('language', 'en');
  const [notifications, setNotifications] = useAsyncStorage('notifications', true);
  const [fontSize, setFontSize] = useAsyncStorage('fontSize', 'medium');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading preferences...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ User Preferences</Text>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.settingGroup}>
          <Text style={styles.settingLabel}>Theme:</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.themeButton, theme === 'light' && styles.activeButton]}
              onPress={() => setTheme('light')}
            >
              <Text style={[styles.buttonText, theme === 'light' && styles.activeButtonText]}>
                ☀️ Light
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.themeButton, theme === 'dark' && styles.activeButton]}
              onPress={() => setTheme('dark')}
            >
              <Text style={[styles.buttonText, theme === 'dark' && styles.activeButtonText]}>
                🌙 Dark
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingGroup}>
          <Text style={styles.settingLabel}>Language:</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.languageButton, language === 'en' && styles.activeButton]}
              onPress={() => setLanguage('en')}
            >
              <Text style={[styles.buttonText, language === 'en' && styles.activeButtonText]}>
                🇺🇸 English
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.languageButton, language === 'es' && styles.activeButton]}
              onPress={() => setLanguage('es')}
            >
              <Text style={[styles.buttonText, language === 'es' && styles.activeButtonText]}>
                🇪🇸 Spanish
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.languageButton, language === 'fr' && styles.activeButton]}
              onPress={() => setLanguage('fr')}
            >
              <Text style={[styles.buttonText, language === 'fr' && styles.activeButtonText]}>
                🇫🇷 French
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingGroup}>
          <Text style={styles.settingLabel}>Font Size:</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.fontButton, fontSize === 'small' && styles.activeButton]}
              onPress={() => setFontSize('small')}
            >
              <Text style={[styles.buttonText, fontSize === 'small' && styles.activeButtonText]}>
                Small
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.fontButton, fontSize === 'medium' && styles.activeButton]}
              onPress={() => setFontSize('medium')}
            >
              <Text style={[styles.buttonText, fontSize === 'medium' && styles.activeButtonText]}>
                Medium
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.fontButton, fontSize === 'large' && styles.activeButton]}
              onPress={() => setFontSize('large')}
            >
              <Text style={[styles.buttonText, fontSize === 'large' && styles.activeButtonText]}>
                Large
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingGroup}>
          <Text style={styles.settingLabel}>Push Notifications:</Text>
          <View style={styles.switchContainer}>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={notifications ? '#f5dd4b' : '#f4f3f4'}
            />
            <Text style={styles.switchLabel}>
              {notifications ? 'Enabled' : 'Disabled'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Notes App Component
function NotesApp() {
  const [notes, setNotes] = useAsyncStorage('notes', []);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);

  const addNote = async () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        text: newNote.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedNotes = [...notes, note];
      setNotes(updatedNotes);
      setNewNote('');
      Alert.alert('Success', 'Note added successfully!');
    }
  };

  const editNote = (note) => {
    setEditingNote(note);
    setNewNote(note.text);
  };

  const updateNote = async () => {
    if (newNote.trim() && editingNote) {
      const updatedNotes = notes.map(note =>
        note.id === editingNote.id
          ? { ...note, text: newNote.trim(), updatedAt: new Date().toISOString() }
          : note
      );
      
      setNotes(updatedNotes);
      setNewNote('');
      setEditingNote(null);
      Alert.alert('Success', 'Note updated successfully!');
    }
  };

  const deleteNote = (noteId) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedNotes = notes.filter(note => note.id !== noteId);
            setNotes(updatedNotes);
            Alert.alert('Deleted', 'Note deleted successfully');
          }
        }
      ]
    );
  };

  const clearAllNotes = () => {
    Alert.alert(
      'Clear All Notes',
      'Are you sure you want to delete all notes?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setNotes([]);
            Alert.alert('Cleared', 'All notes deleted');
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading notes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Notes App</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newNote}
          onChangeText={setNewNote}
          placeholder={editingNote ? "Edit note..." : "Add a new note..."}
          placeholderTextColor="#999"
          multiline
        />
        
        <View style={styles.buttonContainer}>
          {editingNote ? (
            <>
              <TouchableOpacity style={styles.updateButton} onPress={updateNote}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => {
                  setEditingNote(null);
                  setNewNote('');
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.addButton} onPress={addNote}>
              <Text style={styles.buttonText}>Add Note</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.notesHeader}>
        <Text style={styles.notesCount}>Notes ({notes.length})</Text>
        {notes.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearAllNotes}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.notesContainer}>
        {notes.length === 0 ? (
          <View style={styles.emptyNotes}>
            <Text style={styles.emptyNotesText}>No notes yet</Text>
            <Text style={styles.emptyNotesSubtext}>Add your first note above!</Text>
          </View>
        ) : (
          notes.map(note => (
            <View key={note.id} style={styles.noteItem}>
              <Text style={styles.noteText}>{note.text}</Text>
              <Text style={styles.noteDate}>
                {new Date(note.createdAt).toLocaleDateString()}
                {note.updatedAt !== note.createdAt && ' (edited)'}
              </Text>
              
              <View style={styles.noteActions}>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => editNote(note)}
                >
                  <Text style={styles.actionButtonText}>✏️ Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => deleteNote(note.id)}
                >
                  <Text style={styles.actionButtonText}>🗑️ Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

// Storage Manager Component
function StorageManager() {
  const [storageInfo, setStorageInfo] = useState({
    totalKeys: 0,
    totalSize: 0,
    keys: []
  });

  const getStorageInfo = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;
      
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        totalSize += value ? value.length : 0;
      }
      
      setStorageInfo({
        totalKeys: keys.length,
        totalSize: totalSize,
        keys: keys
      });
    } catch (error) {
      console.error('Error getting storage info:', error);
      Alert.alert('Error', 'Failed to get storage information');
    }
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all stored data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setStorageInfo({ totalKeys: 0, totalSize: 0, keys: [] });
              Alert.alert('Success', 'All data cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          }
        }
      ]
    );
  };

  const clearSpecificKey = (key) => {
    Alert.alert(
      'Delete Key',
      `Delete "${key}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(key);
              getStorageInfo(); // Refresh info
              Alert.alert('Success', 'Key deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete key');
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    getStorageInfo();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💾 Storage Manager</Text>
      
      <View style={styles.storageInfo}>
        <Text style={styles.infoTitle}>Storage Information</Text>
        <Text style={styles.infoText}>Total Keys: {storageInfo.totalKeys}</Text>
        <Text style={styles.infoText}>Total Size: {storageInfo.totalSize} bytes</Text>
        
        <TouchableOpacity style={styles.refreshButton} onPress={getStorageInfo}>
          <Text style={styles.buttonText}>🔄 Refresh</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.clearAllButton} onPress={clearAllData}>
          <Text style={styles.buttonText}>🗑️ Clear All Data</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.keysContainer}>
        <Text style={styles.keysTitle}>Stored Keys:</Text>
        {storageInfo.keys.length === 0 ? (
          <Text style={styles.noKeysText}>No stored keys</Text>
        ) : (
          storageInfo.keys.map(key => (
            <View key={key} style={styles.keyItem}>
              <Text style={styles.keyText}>{key}</Text>
              <TouchableOpacity 
                style={styles.deleteKeyButton}
                onPress={() => clearSpecificKey(key)}
              >
                <Text style={styles.deleteKeyButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

// Main component that demonstrates all examples
function AsyncStorageExample() {
  const [currentExample, setCurrentExample] = useState('preferences');

  const renderExample = () => {
    switch (currentExample) {
      case 'preferences':
        return <UserPreferences />;
      case 'notes':
        return <NotesApp />;
      case 'storage':
        return <StorageManager />;
      default:
        return <UserPreferences />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💾 AsyncStorage Examples</Text>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, currentExample === 'preferences' && styles.activeTab]}
          onPress={() => setCurrentExample('preferences')}
        >
          <Text style={[styles.tabText, currentExample === 'preferences' && styles.activeTabText]}>
            Preferences
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, currentExample === 'notes' && styles.activeTab]}
          onPress={() => setCurrentExample('notes')}
        >
          <Text style={[styles.tabText, currentExample === 'notes' && styles.activeTabText]}>
            Notes
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, currentExample === 'storage' && styles.activeTab]}
          onPress={() => setCurrentExample('storage')}
        >
          <Text style={[styles.tabText, currentExample === 'storage' && styles.activeTabText]}>
            Manager
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {renderExample()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#007bff',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  settingGroup: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  themeButton: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  languageButton: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  fontButton: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeButtonText: {
    color: 'white',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  inputContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  notesCount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  clearButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  notesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  noteItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noteText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  noteDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  editButton: {
    backgroundColor: '#ffc107',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyNotes: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyNotesText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  emptyNotesSubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  storageInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  refreshButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  clearAllButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  keysContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  keysTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  keyItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  keyText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  deleteKeyButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteKeyButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  noKeysText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AsyncStorageExample;
