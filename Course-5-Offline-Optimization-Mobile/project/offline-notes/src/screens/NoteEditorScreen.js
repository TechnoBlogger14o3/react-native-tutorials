import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNotes } from '../context/NotesContext';
import { useOffline } from '../context/OfflineContext';

const NoteEditorScreen = ({ route, navigation }) => {
  const { note: existingNote } = route.params;
  const { createNote, updateNote, categories } = useNotes();
  const { isOnline, addToPendingSync } = useOffline();
  
  const [title, setTitle] = useState(existingNote?.title || '');
  const [content, setContent] = useState(existingNote?.content || '');
  const [category, setCategory] = useState(existingNote?.category || 'Personal');
  const [isFavorite, setIsFavorite] = useState(existingNote?.isFavorite || false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = !!existingNote;

  // Track changes
  useEffect(() => {
    if (isEditing) {
      const hasTitleChanged = title !== existingNote.title;
      const hasContentChanged = content !== existingNote.content;
      const hasCategoryChanged = category !== existingNote.category;
      const hasFavoriteChanged = isFavorite !== existingNote.isFavorite;
      
      setHasChanges(hasTitleChanged || hasContentChanged || hasCategoryChanged || hasFavoriteChanged);
    } else {
      setHasChanges(title.trim() !== '' || content.trim() !== '');
    }
  }, [title, content, category, isFavorite, existingNote, isEditing]);

  // Auto-save functionality
  useEffect(() => {
    if (hasChanges && !isSaving) {
      const autoSaveTimer = setTimeout(() => {
        handleSave();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(autoSaveTimer);
    }
  }, [hasChanges, isSaving]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    
    try {
      if (isEditing) {
        await updateNote(existingNote.id, {
          title: title.trim() || 'Untitled Note',
          content: content.trim(),
          category,
          isFavorite,
        });
      } else {
        await createNote({
          title: title.trim() || 'Untitled Note',
          content: content.trim(),
          category,
          isFavorite,
        });
      }
      
      setHasChanges(false);
      
      if (!isOnline) {
        Alert.alert(
          'Saved Offline',
          'Your note has been saved locally and will sync when you\'re back online.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [hasChanges, isEditing, existingNote, title, content, category, isFavorite, updateNote, createNote, isOnline]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to save them?',
        [
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
          { text: 'Save', onPress: () => handleSave().then(() => navigation.goBack()) },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } else {
      navigation.goBack();
    }
  }, [hasChanges, handleSave, navigation]);

  // Handle category change
  const handleCategoryChange = useCallback((newCategory) => {
    setCategory(newCategory);
  }, []);

  // Handle favorite toggle
  const handleFavoriteToggle = useCallback(() => {
    setIsFavorite(prev => !prev);
  }, []);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.headerRight}>
          {hasChanges && (
            <Text style={styles.saveIndicator}>
              {isSaving ? 'Saving...' : 'Unsaved'}
            </Text>
          )}
          
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoriteToggle}
          >
            <Text style={styles.favoriteIcon}>
              {isFavorite ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Note title..."
            placeholderTextColor="#999"
            multiline={false}
          />
        </View>

        <View style={styles.categoryContainer}>
          <Text style={styles.categoryLabel}>Category:</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.categoryButtonActive
                ]}
                onPress={() => handleCategoryChange(cat)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  category === cat && styles.categoryButtonTextActive
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.contentContainer}>
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            placeholder="Start writing your note..."
            placeholderTextColor="#999"
            multiline={true}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            Words: {content.split(' ').filter(word => word.trim() !== '').length}
          </Text>
          <Text style={styles.statsText}>
            Characters: {content.length}
          </Text>
          <Text style={styles.statsText}>
            Status: {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            !hasChanges && styles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={!hasChanges || isSaving}
        >
          <Text style={[
            styles.saveButtonText,
            !hasChanges && styles.saveButtonTextDisabled
          ]}>
            {isSaving ? 'Saving...' : 'Save Note'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveIndicator: {
    fontSize: 12,
    color: '#ff6b6b',
    marginRight: 10,
    fontWeight: '500',
  },
  favoriteButton: {
    padding: 5,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  titleContainer: {
    marginBottom: 20,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
    marginBottom: 20,
  },
  contentInput: {
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 300,
    textAlignVertical: 'top',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  statsText: {
    fontSize: 12,
    color: '#666',
  },
  footer: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: '#999',
  },
});

export default NoteEditorScreen;
