import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNotes } from '../context/NotesContext';
import { useOffline } from '../context/OfflineContext';

const NotesListScreen = ({ navigation }) => {
  const {
    getFilteredNotes,
    getNoteStats,
    setSearchQuery,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    deleteNote,
    toggleFavorite,
  } = useNotes();
  
  const { isOnline, getSyncStatus, getConnectionStatus } = useOffline();
  const [refreshing, setRefreshing] = useState(false);

  // Memoized filtered notes for performance
  const filteredNotes = useMemo(() => getFilteredNotes(), [getFilteredNotes]);
  const noteStats = useMemo(() => getNoteStats(), [getNoteStats]);

  // Handle note press
  const handleNotePress = useCallback((note) => {
    navigation.navigate('NoteEditor', { note });
  }, [navigation]);

  // Handle delete note
  const handleDeleteNote = useCallback((noteId, noteTitle) => {
    Alert.alert(
      'Delete Note',
      `Are you sure you want to delete "${noteTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteNote(noteId)
        },
      ]
    );
  }, [deleteNote]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  // Render note item
  const renderNoteItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.noteCard}
      onPress={() => handleNotePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Text style={styles.favoriteIcon}>
            {item.isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.noteContent} numberOfLines={3}>
        {item.content}
      </Text>
      
      <View style={styles.noteFooter}>
        <View style={styles.noteMeta}>
          <Text style={styles.noteCategory}>{item.category}</Text>
          <Text style={styles.noteDate}>
            {new Date(item.updatedAt).toLocaleDateString()}
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteNote(item.id, item.title)}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  ), [handleNotePress, toggleFavorite, handleDeleteNote]);

  // Render header
  const renderHeader = useCallback(() => (
    <View style={styles.header}>
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {noteStats.totalNotes} notes • {noteStats.favoriteNotes} favorites
        </Text>
        <Text style={styles.statsText}>
          {noteStats.totalWords} words total
        </Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>
      
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            !selectedCategory && styles.categoryButtonActive
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[
            styles.categoryButtonText,
            !selectedCategory && styles.categoryButtonTextActive
          ]}>
            All
          </Text>
        </TouchableOpacity>
        
        {['Personal', 'Work', 'Ideas', 'Shopping'].map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === category && styles.categoryButtonTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Status: {getConnectionStatus()}
        </Text>
        <Text style={styles.statusText}>
          Sync: {getSyncStatus()}
        </Text>
      </View>
    </View>
  ), [
    noteStats,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    getConnectionStatus,
    getSyncStatus,
  ]);

  // Render empty state
  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📝</Text>
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No notes found' : 'No notes yet'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery 
          ? 'Try adjusting your search terms'
          : 'Create your first note to get started!'
        }
      </Text>
    </View>
  ), [searchQuery]);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredNotes}
        renderItem={renderNoteItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        getItemLayout={(data, index) => ({
          length: 120,
          offset: 120 * index,
          index,
        })}
      />
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NoteEditor', { note: null })}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    paddingBottom: 100,
  },
  header: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statsContainer: {
    marginBottom: 15,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: 12,
    color: '#999',
  },
  noteCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 5,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  favoriteButton: {
    padding: 5,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  noteContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteMeta: {
    flex: 1,
  },
  noteCategory: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
    marginBottom: 2,
  },
  noteDate: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NotesListScreen;
