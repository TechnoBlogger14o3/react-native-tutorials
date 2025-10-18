import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  Platform,
  NetInfo,
} from 'react-native';

// Note: NetInfo is deprecated in newer versions, but this demonstrates the concept
// In newer versions, you would use @react-native-community/netinfo

// Offline Support Hook
function useOfflineSupport() {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineData, setOfflineData] = useState([]);
  const [syncQueue, setSyncQueue] = useState([]);

  useEffect(() => {
    // Simulate network state monitoring
    const checkNetworkStatus = () => {
      // In a real app, you would use NetInfo or @react-native-community/netinfo
      const online = Math.random() > 0.3; // Simulate 70% online time
      setIsOnline(online);
      
      if (online && syncQueue.length > 0) {
        syncOfflineData();
      }
    };

    const interval = setInterval(checkNetworkStatus, 5000);
    return () => clearInterval(interval);
  }, [syncQueue]);

  const syncOfflineData = async () => {
    try {
      // Simulate API sync
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Process sync queue
      const syncedData = [...offlineData, ...syncQueue];
      setOfflineData(syncedData);
      setSyncQueue([]);
      
      Alert.alert('Sync Complete', `${syncQueue.length} items synced`);
    } catch (error) {
      Alert.alert('Sync Failed', 'Failed to sync offline data');
    }
  };

  const addOfflineItem = (item) => {
    if (isOnline) {
      // Add directly to data
      setOfflineData(prev => [...prev, item]);
    } else {
      // Add to sync queue
      setSyncQueue(prev => [...prev, { ...item, offline: true, timestamp: Date.now() }]);
      Alert.alert('Offline Mode', 'Item saved locally and will sync when online');
    }
  };

  return {
    isOnline,
    offlineData,
    syncQueue,
    addOfflineItem,
    syncOfflineData
  };
}

// Offline Notes Component
function OfflineNotes() {
  const { isOnline, offlineData, syncQueue, addOfflineItem } = useOfflineSupport();
  const [newNote, setNewNote] = useState('');

  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        text: newNote.trim(),
        createdAt: new Date().toISOString(),
        isOffline: !isOnline
      };
      
      addOfflineItem(note);
      setNewNote('');
    }
  };

  const allNotes = [...offlineData, ...syncQueue];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📝 Offline Notes</Text>
        <View style={[styles.statusIndicator, { backgroundColor: isOnline ? '#28a745' : '#dc3545' }]}>
          <Text style={styles.statusText}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newNote}
          onChangeText={setNewNote}
          placeholder="Add a note..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity style={styles.addButton} onPress={addNote}>
          <Text style={styles.addButtonText}>Add Note</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Total Notes: {allNotes.length} | 
          Synced: {offlineData.length} | 
          Pending: {syncQueue.length}
        </Text>
      </View>

      <FlatList
        data={allNotes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.noteItem, item.isOffline && styles.offlineNote]}>
            <Text style={styles.noteText}>{item.text}</Text>
            <View style={styles.noteMeta}>
              <Text style={styles.noteDate}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
              {item.isOffline && (
                <Text style={styles.offlineLabel}>📱 Offline</Text>
              )}
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// Performance Optimization Component
function PerformanceOptimization() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renderTime, setRenderTime] = useState(0);

  const generateLargeDataset = () => {
    const startTime = Date.now();
    setLoading(true);
    
    // Simulate generating large dataset
    setTimeout(() => {
      const largeData = Array.from({ length: 1000 }, (_, index) => ({
        id: index,
        title: `Item ${index + 1}`,
        description: `This is a description for item ${index + 1}`,
        category: ['Category A', 'Category B', 'Category C'][index % 3],
        timestamp: Date.now() - Math.random() * 1000000
      }));
      
      setData(largeData);
      setLoading(false);
      
      const endTime = Date.now();
      setRenderTime(endTime - startTime);
    }, 1000);
  };

  const clearData = () => {
    setData([]);
    setRenderTime(0);
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={styles.itemCategory}>{item.category}</Text>
    </View>
  );

  const getItemLayout = (data, index) => ({
    length: 80, // Approximate height of each item
    offset: 80 * index,
    index,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚡ Performance Optimization</Text>
      
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.generateButton} onPress={generateLargeDataset}>
          <Text style={styles.buttonText}>
            {loading ? 'Generating...' : 'Generate 1000 Items'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.clearButton} onPress={clearData}>
          <Text style={styles.buttonText}>Clear Data</Text>
        </TouchableOpacity>
      </View>

      {renderTime > 0 && (
        <View style={styles.performanceInfo}>
          <Text style={styles.performanceText}>
            Render Time: {renderTime}ms
          </Text>
          <Text style={styles.performanceText}>
            Items: {data.length}
          </Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Generating data...</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        />
      )}
    </View>
  );
}

// Code Splitting Example
function CodeSplittingExample() {
  const [currentModule, setCurrentModule] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadModule = async (moduleName) => {
    setLoading(true);
    
    // Simulate dynamic import
    setTimeout(() => {
      setCurrentModule(moduleName);
      setLoading(false);
    }, 1000);
  };

  const modules = [
    { name: 'UserProfile', description: 'User profile management' },
    { name: 'Settings', description: 'App settings and preferences' },
    { name: 'Analytics', description: 'App analytics and reports' },
    { name: 'Notifications', description: 'Push notification management' }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Code Splitting</Text>
      
      <View style={styles.modulesContainer}>
        <Text style={styles.sectionTitle}>Available Modules:</Text>
        {modules.map(module => (
          <TouchableOpacity
            key={module.name}
            style={[
              styles.moduleButton,
              currentModule === module.name && styles.activeModule
            ]}
            onPress={() => loadModule(module.name)}
            disabled={loading}
          >
            <Text style={[
              styles.moduleButtonText,
              currentModule === module.name && styles.activeModuleText
            ]}>
              {module.name}
            </Text>
            <Text style={styles.moduleDescription}>{module.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading module...</Text>
        </View>
      )}

      {currentModule && !loading && (
        <View style={styles.moduleContent}>
          <Text style={styles.moduleTitle}>{currentModule} Module</Text>
          <Text style={styles.moduleInfo}>
            This module was loaded dynamically to demonstrate code splitting.
            In a real app, this would be loaded only when needed, reducing
            the initial bundle size.
          </Text>
          
          <View style={styles.moduleFeatures}>
            <Text style={styles.featureTitle}>Features:</Text>
            <Text style={styles.featureItem}>• Lazy loading</Text>
            <Text style={styles.featureItem}>• Reduced bundle size</Text>
            <Text style={styles.featureItem}>• Better performance</Text>
            <Text style={styles.featureItem}>• Faster initial load</Text>
          </View>
        </View>
      )}
    </View>
  );
}

// Main component that demonstrates all examples
function OfflineOptimizationExample() {
  const [currentExample, setCurrentExample] = useState('offline');

  const renderExample = () => {
    switch (currentExample) {
      case 'offline':
        return <OfflineNotes />;
      case 'performance':
        return <PerformanceOptimization />;
      case 'splitting':
        return <CodeSplittingExample />;
      default:
        return <OfflineNotes />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 Offline & Optimization</Text>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, currentExample === 'offline' && styles.activeTab]}
          onPress={() => setCurrentExample('offline')}
        >
          <Text style={[styles.tabText, currentExample === 'offline' && styles.activeTabText]}>
            Offline
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, currentExample === 'performance' && styles.activeTab]}
          onPress={() => setCurrentExample('performance')}
        >
          <Text style={[styles.tabText, currentExample === 'performance' && styles.activeTabText]}>
            Performance
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, currentExample === 'splitting' && styles.activeTab]}
          onPress={() => setCurrentExample('splitting')}
        >
          <Text style={[styles.tabText, currentExample === 'splitting' && styles.activeTabText]}>
            Code Splitting
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
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
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  noteItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  offlineNote: {
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  noteText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  noteMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteDate: {
    fontSize: 12,
    color: '#666',
  },
  offlineLabel: {
    fontSize: 12,
    color: '#ffc107',
    fontWeight: '600',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  performanceInfo: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  performanceText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
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
  list: {
    flex: 1,
  },
  listItem: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: '#007bff',
    fontWeight: '600',
  },
  modulesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  moduleButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activeModule: {
    backgroundColor: '#007bff',
  },
  moduleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activeModuleText: {
    color: 'white',
  },
  moduleDescription: {
    fontSize: 14,
    color: '#666',
  },
  moduleContent: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  moduleInfo: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 15,
  },
  moduleFeatures: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  featureItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default OfflineOptimizationExample;
