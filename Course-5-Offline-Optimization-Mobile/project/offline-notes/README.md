# Offline-capable Notes App

## Course 5 Project: Offline Support & Optimization (Mobile)

A complete React Native notes application demonstrating offline capabilities, performance optimization, and advanced mobile development patterns.

## Features

### 📝 Note Management
- **Create/Edit Notes**: Rich text editing with formatting
- **Search & Filter**: Find notes quickly with real-time search
- **Categories**: Organize notes with tags and categories
- **Favorites**: Mark important notes as favorites
- **Sync Status**: Visual indicators for sync status

### 🔄 Offline Support
- **Offline-First**: Works completely offline
- **Auto-Sync**: Automatically syncs when connection is restored
- **Conflict Resolution**: Handles sync conflicts intelligently
- **Network Status**: Real-time network connectivity monitoring
- **Offline Indicators**: Clear visual feedback for offline state

### ⚡ Performance Optimization
- **Lazy Loading**: Notes load on-demand for better performance
- **Virtual Lists**: Efficient rendering of large note lists
- **Image Optimization**: Compressed and cached images
- **Memory Management**: Optimized memory usage
- **Bundle Splitting**: Dynamic code loading

### 💾 Data Persistence
- **Local Database**: SQLite for reliable local storage
- **AsyncStorage**: Quick access to frequently used data
- **Backup/Restore**: Export and import notes
- **Data Compression**: Efficient storage utilization

## Project Structure

```
offline-notes/
├── src/
│   ├── components/
│   │   ├── NoteCard/
│   │   ├── SearchBar/
│   │   ├── OfflineIndicator/
│   │   ├── SyncStatus/
│   │   └── LoadingSpinner/
│   ├── screens/
│   │   ├── NotesListScreen/
│   │   ├── NoteEditorScreen/
│   │   ├── CategoriesScreen/
│   │   └── SettingsScreen/
│   ├── services/
│   │   ├── databaseService.js
│   │   ├── syncService.js
│   │   ├── storageService.js
│   │   └── networkService.js
│   ├── hooks/
│   │   ├── useNotes.js
│   │   ├── useOffline.js
│   │   ├── useSync.js
│   │   └── usePerformance.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── performance.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   └── context/
│       ├── NotesContext.js
│       └── OfflineContext.js
├── App.js
└── index.js
```

## Key Learning Concepts

### 1. Offline-First Architecture
- Local-first data storage
- Network state monitoring
- Sync conflict resolution
- Offline user experience

### 2. Performance Optimization
- React.memo and useMemo optimization
- FlatList virtualization
- Image lazy loading
- Bundle code splitting
- Memory leak prevention

### 3. Data Management
- SQLite database operations
- AsyncStorage for quick access
- Data compression techniques
- Efficient data structures

### 4. Mobile-Specific Patterns
- Background sync
- Network-aware UI
- Touch gesture optimization
- Mobile performance monitoring

## Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **iOS Setup** (if targeting iOS):
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Run the App**:
   ```bash
   # Android
   npm run android
   
   # iOS
   npm run ios
   ```

## Usage

1. **Create Notes**: Tap the + button to create new notes
2. **Edit Notes**: Tap any note to edit its content
3. **Search**: Use the search bar to find specific notes
4. **Offline Mode**: App works seamlessly without internet
5. **Sync**: Notes automatically sync when connection is restored

## Technical Implementation

### Offline Support
```javascript
// OfflineContext.js
const OfflineContext = createContext();

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSync, setPendingSync] = useState([]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
      if (state.isConnected && pendingSync.length > 0) {
        syncPendingChanges();
      }
    });
    return unsubscribe;
  }, [pendingSync]);

  const syncPendingChanges = async () => {
    // Sync logic here
  };
};
```

### Performance Optimization
```javascript
// usePerformance.js
export const usePerformance = () => {
  const [performanceMetrics, setMetrics] = useState({});

  const measureRenderTime = (componentName) => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      setMetrics(prev => ({
        ...prev,
        [componentName]: end - start
      }));
    };
  };

  return { measureRenderTime, performanceMetrics };
};
```

### Database Service
```javascript
// databaseService.js
import SQLite from 'react-native-sqlite-storage';

export class DatabaseService {
  constructor() {
    this.db = SQLite.openDatabase({
      name: 'NotesDB.db',
      location: 'default',
    });
    this.initDatabase();
  }

  initDatabase() {
    this.db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, created_at DATETIME, updated_at DATETIME, category TEXT, is_favorite BOOLEAN)'
      );
    });
  }

  async saveNote(note) {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'INSERT OR REPLACE INTO notes (id, title, content, created_at, updated_at, category, is_favorite) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [note.id, note.title, note.content, note.createdAt, note.updatedAt, note.category, note.isFavorite],
          (tx, results) => resolve(results),
          (tx, error) => reject(error)
        );
      });
    });
  }
}
```

## Learning Outcomes

After completing this project, you will understand:

1. **Offline-First Development**: Building apps that work without internet
2. **Performance Optimization**: Making React Native apps fast and efficient
3. **Data Persistence**: Reliable local data storage patterns
4. **Network Management**: Handling connectivity changes gracefully
5. **Mobile Performance**: Monitoring and optimizing mobile app performance
6. **Advanced Patterns**: Production-ready mobile development techniques

## Performance Features

### Optimization Techniques
- **Memoization**: React.memo, useMemo, useCallback
- **Virtualization**: FlatList with getItemLayout
- **Lazy Loading**: Dynamic imports and code splitting
- **Image Optimization**: Compressed images with caching
- **Memory Management**: Proper cleanup and garbage collection

### Monitoring
- **Render Performance**: Component render time tracking
- **Memory Usage**: Memory leak detection
- **Network Performance**: API call optimization
- **User Experience**: Smooth animations and interactions

## Offline Features

### Data Sync
- **Conflict Resolution**: Last-write-wins with timestamps
- **Incremental Sync**: Only sync changed data
- **Background Sync**: Sync when app becomes active
- **Retry Logic**: Automatic retry for failed syncs

### User Experience
- **Offline Indicators**: Clear visual feedback
- **Sync Status**: Real-time sync progress
- **Offline Actions**: Full functionality without internet
- **Data Integrity**: Consistent data across devices

## Next Steps

This project prepares you for:
- **Production Apps**: Real-world mobile applications
- **Advanced Optimization**: Further performance techniques
- **Enterprise Development**: Large-scale mobile projects
- **Mobile Architecture**: Scalable mobile app patterns

## Troubleshooting

### Common Issues
1. **Database errors**: Check SQLite setup and permissions
2. **Sync conflicts**: Implement proper conflict resolution
3. **Performance issues**: Use React DevTools Profiler
4. **Memory leaks**: Monitor component unmounting

### Performance Tips
1. Use `getItemLayout` for FlatList optimization
2. Implement proper `keyExtractor` for lists
3. Use `React.memo` for expensive components
4. Optimize images with proper sizing
5. Monitor memory usage with Flipper

---

**Happy Note-Taking! 📝📱**
