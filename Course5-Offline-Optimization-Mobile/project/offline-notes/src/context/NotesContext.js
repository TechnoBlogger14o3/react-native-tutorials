import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useOffline } from './OfflineContext';

// Notes Context
const NotesContext = createContext();

// Storage Keys
const STORAGE_KEYS = {
  NOTES: '@notes_data',
  CATEGORIES: '@categories_data',
  SETTINGS: '@notes_settings',
};

// Initial State
const initialState = {
  notes: [],
  categories: ['Personal', 'Work', 'Ideas', 'Shopping'],
  settings: {
    sortBy: 'updatedAt', // 'createdAt', 'updatedAt', 'title'
    sortOrder: 'desc', // 'asc', 'desc'
    defaultCategory: 'Personal',
    autoSave: true,
  },
  isLoading: true,
  searchQuery: '',
  selectedCategory: null,
};

// Notes Provider Component
export const NotesProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const { addToPendingSync, isOnline } = useOffline();

  // Load data from storage on mount
  useEffect(() => {
    loadDataFromStorage();
  }, []);

  // Load data from AsyncStorage
  const loadDataFromStorage = async () => {
    try {
      const [notesData, categoriesData, settingsData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.NOTES),
        AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES),
        AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
      ]);

      setState(prevState => ({
        ...prevState,
        notes: notesData ? JSON.parse(notesData) : [],
        categories: categoriesData ? JSON.parse(categoriesData) : prevState.categories,
        settings: settingsData ? JSON.parse(settingsData) : prevState.settings,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error loading data from storage:', error);
      setState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  // Save data to AsyncStorage
  const saveDataToStorage = async (dataType, data) => {
    try {
      const key = STORAGE_KEYS[dataType.toUpperCase()];
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${dataType} to storage:`, error);
    }
  };

  // Create a new note
  const createNote = useCallback(async (noteData) => {
    const newNote = {
      id: Date.now().toString(),
      title: noteData.title || 'Untitled Note',
      content: noteData.content || '',
      category: noteData.category || state.settings.defaultCategory,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: noteData.tags || [],
    };

    setState(prevState => ({
      ...prevState,
      notes: [newNote, ...prevState.notes],
    }));

    // Save to storage
    await saveDataToStorage('NOTES', [newNote, ...state.notes]);

    // Add to pending sync if offline
    if (!isOnline) {
      await addToPendingSync('create', newNote);
    }

    return newNote;
  }, [state.notes, state.settings.defaultCategory, isOnline, addToPendingSync]);

  // Update an existing note
  const updateNote = useCallback(async (noteId, updates) => {
    const updatedNote = {
      ...updates,
      id: noteId,
      updatedAt: new Date().toISOString(),
    };

    setState(prevState => ({
      ...prevState,
      notes: prevState.notes.map(note =>
        note.id === noteId ? { ...note, ...updatedNote } : note
      ),
    }));

    // Save to storage
    const updatedNotes = state.notes.map(note =>
      note.id === noteId ? { ...note, ...updatedNote } : note
    );
    await saveDataToStorage('NOTES', updatedNotes);

    // Add to pending sync if offline
    if (!isOnline) {
      await addToPendingSync('update', updatedNote);
    }
  }, [state.notes, isOnline, addToPendingSync]);

  // Delete a note
  const deleteNote = useCallback(async (noteId) => {
    setState(prevState => ({
      ...prevState,
      notes: prevState.notes.filter(note => note.id !== noteId),
    }));

    // Save to storage
    const updatedNotes = state.notes.filter(note => note.id !== noteId);
    await saveDataToStorage('NOTES', updatedNotes);

    // Add to pending sync if offline
    if (!isOnline) {
      await addToPendingSync('delete', { id: noteId });
    }
  }, [state.notes, isOnline, addToPendingSync]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (noteId) => {
    const note = state.notes.find(n => n.id === noteId);
    if (note) {
      await updateNote(noteId, { isFavorite: !note.isFavorite });
    }
  }, [state.notes, updateNote]);

  // Add a new category
  const addCategory = useCallback(async (categoryName) => {
    if (!state.categories.includes(categoryName)) {
      const newCategories = [...state.categories, categoryName];
      setState(prevState => ({
        ...prevState,
        categories: newCategories,
      }));
      await saveDataToStorage('CATEGORIES', newCategories);
    }
  }, [state.categories]);

  // Update settings
  const updateSettings = useCallback(async (newSettings) => {
    const updatedSettings = { ...state.settings, ...newSettings };
    setState(prevState => ({
      ...prevState,
      settings: updatedSettings,
    }));
    await saveDataToStorage('SETTINGS', updatedSettings);
  }, [state.settings]);

  // Set search query
  const setSearchQuery = useCallback((query) => {
    setState(prevState => ({ ...prevState, searchQuery: query }));
  }, []);

  // Set selected category
  const setSelectedCategory = useCallback((category) => {
    setState(prevState => ({ ...prevState, selectedCategory: category }));
  }, []);

  // Get filtered and sorted notes
  const getFilteredNotes = useCallback(() => {
    let filteredNotes = state.notes;

    // Filter by search query
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      filteredNotes = filteredNotes.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (state.selectedCategory) {
      filteredNotes = filteredNotes.filter(note =>
        note.category === state.selectedCategory
      );
    }

    // Sort notes
    filteredNotes.sort((a, b) => {
      const aValue = a[state.settings.sortBy];
      const bValue = b[state.settings.sortBy];
      
      if (state.settings.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filteredNotes;
  }, [state.notes, state.searchQuery, state.selectedCategory, state.settings]);

  // Get notes by category
  const getNotesByCategory = useCallback((category) => {
    return state.notes.filter(note => note.category === category);
  }, [state.notes]);

  // Get favorite notes
  const getFavoriteNotes = useCallback(() => {
    return state.notes.filter(note => note.isFavorite);
  }, [state.notes]);

  // Get note statistics
  const getNoteStats = useCallback(() => {
    const totalNotes = state.notes.length;
    const favoriteNotes = state.notes.filter(note => note.isFavorite).length;
    const categoriesCount = state.categories.length;
    const totalWords = state.notes.reduce((sum, note) => {
      return sum + (note.content.split(' ').length || 0);
    }, 0);

    return {
      totalNotes,
      favoriteNotes,
      categoriesCount,
      totalWords,
    };
  }, [state.notes, state.categories]);

  const contextValue = {
    // State
    notes: state.notes,
    categories: state.categories,
    settings: state.settings,
    isLoading: state.isLoading,
    searchQuery: state.searchQuery,
    selectedCategory: state.selectedCategory,

    // Actions
    createNote,
    updateNote,
    deleteNote,
    toggleFavorite,
    addCategory,
    updateSettings,
    setSearchQuery,
    setSelectedCategory,

    // Getters
    getFilteredNotes,
    getNotesByCategory,
    getFavoriteNotes,
    getNoteStats,
  };

  return (
    <NotesContext.Provider value={contextValue}>
      {children}
    </NotesContext.Provider>
  );
};

// Custom Hook to use Notes Context
export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export default NotesContext;
