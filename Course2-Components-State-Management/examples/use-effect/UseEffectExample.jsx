import React, { useState, useEffect } from 'react';

// Example 1: Data Fetching with useEffect
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user data when component mounts or userId changes
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockUser = {
          id: userId,
          name: `User ${userId}`,
          email: `user${userId}@example.com`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
          joinDate: '2023-01-15',
          posts: Math.floor(Math.random() * 100),
          followers: Math.floor(Math.random() * 1000)
        };
        
        setUser(mockUser);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]); // Dependency array - effect runs when userId changes

  // Cleanup effect for subscriptions
  useEffect(() => {
    const timer = setInterval(() => {
      console.log(`Timer tick for user ${userId}`);
    }, 5000);

    return () => {
      clearInterval(timer); // Cleanup function
    };
  }, [userId]); // Empty dependency array = run once per userId

  if (loading) return <div className="loading">Loading user profile...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!user) return <div className="not-found">User not found</div>;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <img src={user.avatar} alt={user.name} className="avatar" />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
      
      <div className="profile-stats">
        <div className="stat">
          <span className="number">{user.posts}</span>
          <span className="label">Posts</span>
        </div>
        <div className="stat">
          <span className="number">{user.followers}</span>
          <span className="label">Followers</span>
        </div>
        <div className="stat">
          <span className="number">{user.joinDate}</span>
          <span className="label">Joined</span>
        </div>
      </div>
    </div>
  );
}

// Example 2: News List with useEffect
function NewsList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('general');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockArticles = [
          {
            id: 1,
            title: `${category.charAt(0).toUpperCase() + category.slice(1)} News Article 1`,
            summary: 'This is a sample news article summary...',
            category: category,
            publishedAt: new Date().toISOString(),
            read: false
          },
          {
            id: 2,
            title: `${category.charAt(0).toUpperCase() + category.slice(1)} News Article 2`,
            summary: 'Another interesting news article summary...',
            category: category,
            publishedAt: new Date(Date.now() - 86400000).toISOString(),
            read: false
          },
          {
            id: 3,
            title: `${category.charAt(0).toUpperCase() + category.slice(1)} News Article 3`,
            summary: 'Third news article with more details...',
            category: category,
            publishedAt: new Date(Date.now() - 172800000).toISOString(),
            read: false
          }
        ];
        
        setArticles(mockArticles);
      } catch (err) {
        setError('Failed to fetch news articles');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category]); // Re-fetch when category changes

  const refreshNews = () => {
    setArticles([]); // Clear current articles
    // useEffect will trigger again due to dependency
  };

  const markAsRead = (articleId) => {
    setArticles(prev => 
      prev.map(article => 
        article.id === articleId 
          ? { ...article, read: true }
          : article
      )
    );
  };

  return (
    <div className="news-list">
      <div className="news-controls">
        <h2>📰 News List</h2>
        
        <div className="category-selector">
          <label>Category:</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="general">General</option>
            <option value="technology">Technology</option>
            <option value="sports">Sports</option>
            <option value="business">Business</option>
            <option value="entertainment">Entertainment</option>
          </select>
        </div>
        
        <button onClick={refreshNews} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {loading && <div className="loading">Loading news articles...</div>}
      {error && <div className="error">{error}</div>}
      
      {!loading && !error && (
        <div className="articles">
          {articles.map(article => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              onMarkAsRead={markAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ArticleCard({ article, onMarkAsRead }) {
  return (
    <div className={`article-card ${article.read ? 'read' : 'unread'}`}>
      <h3>{article.title}</h3>
      <p className="summary">{article.summary}</p>
      <div className="article-meta">
        <span className="category">{article.category}</span>
        <span className="date">
          {new Date(article.publishedAt).toLocaleDateString()}
        </span>
      </div>
      <button 
        onClick={() => onMarkAsRead(article.id)}
        className="read-btn"
      >
        {article.read ? '✅ Read' : '📖 Mark as Read'}
      </button>
    </div>
  );
}

// Example 3: Timer with useEffect
function TimerApp() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    let interval = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]); // Effect depends on isRunning

  const startTimer = () => setIsRunning(true);
  const stopTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setSeconds(0);
    setIsRunning(false);
    setLaps([]);
  };
  
  const addLap = () => {
    setLaps(prev => [...prev, seconds]);
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer-app">
      <h2>⏱️ Timer with useEffect</h2>
      
      <div className="timer-display">
        <div className="time">{formatTime(seconds)}</div>
        <div className="status">{isRunning ? 'Running' : 'Stopped'}</div>
      </div>
      
      <div className="timer-controls">
        <button onClick={startTimer} disabled={isRunning}>
          ▶️ Start
        </button>
        <button onClick={stopTimer} disabled={!isRunning}>
          ⏸️ Stop
        </button>
        <button onClick={addLap} disabled={!isRunning}>
          ⏱️ Lap
        </button>
        <button onClick={resetTimer}>
          🔄 Reset
        </button>
      </div>
      
      {laps.length > 0 && (
        <div className="laps">
          <h3>Laps:</h3>
          <ul>
            {laps.map((lap, index) => (
              <li key={index}>
                Lap {index + 1}: {formatTime(lap)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Example 4: Local Storage with useEffect
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []); // Empty dependency array = run only once

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]); // Run whenever todos change

  const addTodo = (text) => {
    if (text.trim()) {
      const newTodoItem = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTodos(prev => [...prev, newTodoItem]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo(newTodo);
  };

  return (
    <div className="todo-app">
      <h2>📝 Todo App with localStorage</h2>
      
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          className="todo-input"
        />
        <button type="submit" className="add-btn">
          ➕ Add
        </button>
      </form>
      
      <div className="todo-filters">
        <button 
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'active' : ''}
        >
          All ({todos.length})
        </button>
        <button 
          onClick={() => setFilter('active')}
          className={filter === 'active' ? 'active' : ''}
        >
          Active ({todos.filter(t => !t.completed).length})
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={filter === 'completed' ? 'active' : ''}
        >
          Completed ({todos.filter(t => t.completed).length})
        </button>
      </div>
      
      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <p className="empty-message">
            {filter === 'all' ? 'No todos yet' : 
             filter === 'active' ? 'No active todos' : 
             'No completed todos'}
          </p>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
}

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="todo-checkbox"
      />
      <span className="todo-text">{todo.text}</span>
      <span className="todo-date">
        {new Date(todo.createdAt).toLocaleDateString()}
      </span>
      <button 
        onClick={() => onDelete(todo.id)}
        className="delete-btn"
      >
        🗑️
      </button>
    </div>
  );
}

// Main component that demonstrates all examples
function UseEffectExample() {
  const [currentExample, setCurrentExample] = useState('user');
  const [userId, setUserId] = useState(1);

  return (
    <div className="use-effect-example">
      <h1>🎣 useEffect Hook Examples</h1>
      
      <div className="example-selector">
        <button 
          onClick={() => setCurrentExample('user')}
          className={currentExample === 'user' ? 'active' : ''}
        >
          User Profile
        </button>
        <button 
          onClick={() => setCurrentExample('news')}
          className={currentExample === 'news' ? 'active' : ''}
        >
          News List
        </button>
        <button 
          onClick={() => setCurrentExample('timer')}
          className={currentExample === 'timer' ? 'active' : ''}
        >
          Timer
        </button>
        <button 
          onClick={() => setCurrentExample('todo')}
          className={currentExample === 'todo' ? 'active' : ''}
        >
          Todo App
        </button>
      </div>

      {currentExample === 'user' && (
        <div className="user-example">
          <div className="user-controls">
            <label>User ID:</label>
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(parseInt(e.target.value) || 1)}
              min="1"
              max="10"
            />
          </div>
          <UserProfile userId={userId} />
        </div>
      )}

      {currentExample === 'news' && <NewsList />}
      {currentExample === 'timer' && <TimerApp />}
      {currentExample === 'todo' && <TodoApp />}

      <div className="explanation">
        <h3>Key Concepts Demonstrated:</h3>
        <ul>
          <li><strong>Data Fetching:</strong> Load data when component mounts</li>
          <li><strong>Dependency Array:</strong> Control when effects run</li>
          <li><strong>Cleanup:</strong> Prevent memory leaks with cleanup functions</li>
          <li><strong>Side Effects:</strong> Handle timers, subscriptions, and external data</li>
          <li><strong>localStorage:</strong> Persist data across sessions</li>
        </ul>
      </div>
    </div>
  );
}

export default UseEffectExample;
