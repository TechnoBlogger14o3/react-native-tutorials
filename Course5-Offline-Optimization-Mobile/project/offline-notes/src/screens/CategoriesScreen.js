import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNotes } from '../context/NotesContext';

const CategoriesScreen = () => {
  const { categories, getNotesByCategory, getNoteStats } = useNotes();
  const noteStats = getNoteStats();

  const renderCategoryItem = (category) => {
    const notesInCategory = getNotesByCategory(category);
    
    return (
      <TouchableOpacity key={category} style={styles.categoryCard}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>{category}</Text>
          <Text style={styles.categoryCount}>{notesInCategory.length} notes</Text>
        </View>
        <Text style={styles.categoryDescription}>
          {notesInCategory.length > 0 
            ? `Latest: ${notesInCategory[0]?.title || 'Untitled'}`
            : 'No notes yet'
          }
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
        <Text style={styles.headerSubtitle}>
          {noteStats.categoriesCount} categories • {noteStats.totalNotes} total notes
        </Text>
      </View>

      <View style={styles.categoriesList}>
        {categories.map(renderCategoryItem)}
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
  categoriesList: {
    padding: 15,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryCount: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default CategoriesScreen;
