# Course 5: Offline Support & Optimization

## 🎯 Goal

Build fast, offline-ready applications with performance optimization techniques. Learn service workers, lazy loading, caching strategies, and modern React optimization patterns.

## 📚 What You'll Learn

- Service workers (intro)
- Lazy loading & code splitting
- React Query / SWR for data caching
- Performance optimization techniques
- Building an offline-capable notes application

---

## 🔧 Service Workers

### Introduction to Service Workers

Service workers enable offline functionality and background processing in web applications.

```jsx
// public/sw.js - Service Worker
const CACHE_NAME = 'notes-app-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Update event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

### Registering Service Worker in React

```jsx
// src/serviceWorker.js
export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

// src/index.js
import { register } from './serviceWorker';

// Register service worker
register();
```

---

## ⚡ Lazy Loading & Code Splitting

### React.lazy and Suspense

```jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Notes = lazy(() => import('./pages/Notes'));

// Loading component
function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/notes">Notes</Link>
        </nav>
        
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/notes" element={<Notes />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
```

### Dynamic Imports

```jsx
// Dynamic component loading
function LazyComponent({ componentName }) {
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadComponent = async () => {
    setLoading(true);
    try {
      const module = await import(`./components/${componentName}`);
      setComponent(() => module.default);
    } catch (error) {
      console.error('Failed to load component:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComponent();
  }, [componentName]);

  if (loading) return <div>Loading component...</div>;
  if (!Component) return <div>Component not found</div>;

  return <Component />;
}
```

---

## 🔄 React Query / SWR

### React Query for Data Caching

```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// API functions
const fetchNotes = async () => {
  const response = await fetch('/api/notes');
  if (!response.ok) throw new Error('Failed to fetch notes');
  return response.json();
};

const createNote = async (note) => {
  const response = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note)
  });
  if (!response.ok) throw new Error('Failed to create note');
  return response.json();
};

// Notes component with React Query
function NotesApp() {
  const queryClient = useQueryClient();

  // Fetch notes with caching
  const { data: notes, isLoading, error } = useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      // Invalidate and refetch notes
      queryClient.invalidateQueries(['notes']);
    },
  });

  const handleCreateNote = (noteData) => {
    createNoteMutation.mutate(noteData);
  };

  if (isLoading) return <div>Loading notes...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>My Notes</h1>
      <NoteForm onSubmit={handleCreateNote} />
      <NotesList notes={notes} />
    </div>
  );
}
```

### SWR Alternative

```jsx
import useSWR from 'swr';

// Fetcher function
const fetcher = (url) => fetch(url).then((res) => res.json());

function NotesWithSWR() {
  const { data: notes, error, mutate } = useSWR('/api/notes', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 0,
  });

  const createNote = async (noteData) => {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData)
    });
    
    if (response.ok) {
      mutate(); // Revalidate data
    }
  };

  if (error) return <div>Failed to load notes</div>;
  if (!notes) return <div>Loading...</div>;

  return (
    <div>
      <h1>My Notes</h1>
      <NoteForm onSubmit={createNote} />
      <NotesList notes={notes} />
    </div>
  );
}
```

---

## 🚀 Performance Optimization

### React.memo and useMemo

```jsx
import React, { memo, useMemo, useCallback } from 'react';

// Memoized component
const NoteItem = memo(({ note, onEdit, onDelete }) => {
  console.log('NoteItem rendered:', note.id);
  
  return (
    <div className="note-item">
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <button onClick={() => onEdit(note.id)}>Edit</button>
      <button onClick={() => onDelete(note.id)}>Delete</button>
    </div>
  );
});

// Parent component with optimization
function NotesList({ notes, searchTerm }) {
  // Memoized filtered notes
  const filteredNotes = useMemo(() => {
    console.log('Filtering notes...');
    return notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [notes, searchTerm]);

  // Memoized callbacks
  const handleEdit = useCallback((noteId) => {
    console.log('Edit note:', noteId);
    // Edit logic
  }, []);

  const handleDelete = useCallback((noteId) => {
    console.log('Delete note:', noteId);
    // Delete logic
  }, []);

  return (
    <div className="notes-list">
      {filteredNotes.map(note => (
        <NoteItem
          key={note.id}
          note={note}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
```

### Virtual Scrolling for Large Lists

```jsx
import { FixedSizeList as List } from 'react-window';

function VirtualizedNotesList({ notes }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <NoteItem note={notes[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={notes.length}
      itemSize={120}
      width="100%"
    >
      {Row}
    </List>
  );
}
```

---

## 🧩 Mini Tasks

### Task 1: Service Worker Setup
Create a basic service worker for caching static assets.

### Task 2: Lazy Loading Implementation
Implement lazy loading for different pages in your app.

### Task 3: React Query Integration
Set up React Query for data fetching with caching.

### Task 4: Performance Optimization
Optimize a component using React.memo and useMemo.

---

## 🚀 Project: Offline-capable Notes App

Build a comprehensive notes application that works offline and syncs when online.

### Features:
- Create, edit, and delete notes
- Offline functionality with service worker
- Data synchronization when online
- Search and filter notes
- Categories and tags
- Rich text editing
- Export/import functionality

### Technical Requirements:
- Service worker for offline support
- IndexedDB for local storage
- React Query for data synchronization
- Lazy loading for performance
- Responsive design
- PWA capabilities

### Offline Strategy:
```jsx
// Offline data management
class OfflineManager {
  constructor() {
    this.db = null;
    this.initDB();
  }

  async initDB() {
    const request = indexedDB.open('NotesDB', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const store = db.createObjectStore('notes', { keyPath: 'id' });
      store.createIndex('title', 'title', { unique: false });
      store.createIndex('category', 'category', { unique: false });
    };

    request.onsuccess = (event) => {
      this.db = event.target.result;
    };
  }

  async saveNote(note) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      const request = store.put(note);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getNotes() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['notes'], 'readonly');
      const store = transaction.objectStore('notes');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}
```

---

## 📚 Next Steps

### Congratulations! You've completed the React Tutorial Series!

### What's Next:
1. **Build Real Projects**: Apply your knowledge to real-world applications
2. **Learn Advanced Patterns**: Explore more complex React patterns
3. **Explore Ecosystem**: Try Next.js, Gatsby, or other React frameworks
4. **Contribute to Open Source**: Share your knowledge with the community

### Additional Learning Resources:
- [React Performance](https://react.dev/learn/render-and-commit)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [React Query Docs](https://tanstack.com/query/latest)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

### Key Takeaways:
- ✅ Service workers enable offline functionality
- ✅ Lazy loading improves initial load performance
- ✅ React Query/SWR provide powerful data caching
- ✅ Performance optimization is crucial for user experience
- ✅ Offline-first apps provide better user experience

### Portfolio Projects to Build:
1. **E-commerce Platform**: Full-featured online store
2. **Social Media App**: Real-time updates and interactions
3. **Project Management Tool**: Complex state management
4. **Blog Platform**: Content management and SEO
5. **Dashboard Application**: Data visualization and analytics

**You're now ready to build amazing React applications!** 🎉

---

*Congratulations on completing the React Tutorial Series! You've learned everything from basic components to advanced optimization techniques. Keep building, keep learning, and happy coding!*
