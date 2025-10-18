import React, { useState, useEffect } from 'react';

// Example 1: Basic Fetch API Usage
function BasicFetchExample() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Using JSONPlaceholder API for demo
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="basic-fetch-example">
      <h2>🌐 Basic Fetch API</h2>
      
      <div className="fetch-controls">
        <button onClick={fetchUsers} disabled={loading}>
          {loading ? 'Loading...' : '🔄 Refresh Users'}
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <h3>❌ Error</h3>
          <p>{error}</p>
          <button onClick={fetchUsers}>Try Again</button>
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="users-grid">
          {users.slice(0, 6).map(user => (
            <div key={user.id} className="user-card">
              <h3>{user.name}</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Website:</strong> {user.website}</p>
              <div className="user-address">
                <strong>Address:</strong>
                <p>{user.address.street}, {user.address.city}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Example 2: POST Request with Form Data
function PostRequestExample() {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    userId: 1
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      
      // Reset form
      setFormData({ title: '', body: '', userId: 1 });
    } catch (err) {
      setError(err.message);
      console.error('POST error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-request-example">
      <h2>📤 POST Request Example</h2>
      
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter post title"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="body">Content:</label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleChange}
            required
            placeholder="Enter post content"
            rows="4"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="userId">User ID:</label>
          <input
            type="number"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            min="1"
            max="10"
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : '📝 Create Post'}
        </button>
      </form>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Creating post...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <h3>❌ Error</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="success">
          <h3>✅ Post Created Successfully!</h3>
          <div className="result-card">
            <p><strong>ID:</strong> {result.id}</p>
            <p><strong>Title:</strong> {result.title}</p>
            <p><strong>Content:</strong> {result.body}</p>
            <p><strong>User ID:</strong> {result.userId}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Example 3: Error Handling Patterns
function ErrorHandlingExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchDataWithRetry = async (retries = 3) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate different error scenarios
      const randomError = Math.random();
      
      if (randomError < 0.3) {
        // Simulate network error
        throw new Error('Network connection failed');
      } else if (randomError < 0.6) {
        // Simulate server error
        throw new Error('Server error (500)');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      setRetryCount(0);
      
    } catch (err) {
      setError(err.message);
      
      if (retries > 0) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          fetchDataWithRetry(retries - 1);
        }, 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchDataWithRetry();
  };

  return (
    <div className="error-handling-example">
      <h2>🛡️ Error Handling Patterns</h2>
      
      <div className="error-controls">
        <button onClick={() => fetchDataWithRetry()} disabled={loading}>
          {loading ? 'Loading...' : '🔄 Fetch Data (with errors)'}
        </button>
        <button onClick={handleRetry} disabled={loading}>
          🔁 Manual Retry
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading data... {retryCount > 0 && `(Retry ${retryCount})`}</p>
        </div>
      )}

      {error && (
        <div className="error">
          <h3>❌ Error Occurred</h3>
          <p><strong>Error:</strong> {error}</p>
          <p><strong>Retry Count:</strong> {retryCount}</p>
          <button onClick={handleRetry}>Try Again</button>
        </div>
      )}

      {data && (
        <div className="success">
          <h3>✅ Data Loaded Successfully!</h3>
          <div className="data-card">
            <p><strong>ID:</strong> {data.id}</p>
            <p><strong>Title:</strong> {data.title}</p>
            <p><strong>Content:</strong> {data.body}</p>
            <p><strong>User ID:</strong> {data.userId}</p>
          </div>
        </div>
      )}

      <div className="error-info">
        <h4>Error Handling Strategies Demonstrated:</h4>
        <ul>
          <li><strong>Try-Catch Blocks:</strong> Proper error catching</li>
          <li><strong>HTTP Status Checking:</strong> Checking response.ok</li>
          <li><strong>Retry Logic:</strong> Automatic retry with backoff</li>
          <li><strong>User Feedback:</strong> Clear error messages</li>
          <li><strong>Loading States:</strong> Visual feedback during operations</li>
        </ul>
      </div>
    </div>
  );
}

// Example 4: Loading States and UX
function LoadingStatesExample() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="loading-states-example">
      <h2>⏳ Loading States & UX</h2>
      
      <div className="loading-controls">
        <button onClick={fetchUsers} disabled={loading}>
          {loading ? 'Loading...' : '🔄 Load Users'}
        </button>
        
        {users.length > 0 && (
          <div className="search-controls">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading users...</p>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h3>Failed to load users</h3>
          <p>{error}</p>
          <button onClick={fetchUsers}>Try Again</button>
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="users-container">
          <div className="users-header">
            <h3>Users ({filteredUsers.length})</h3>
          </div>
          
          <div className="users-list">
            {filteredUsers.map(user => (
              <div key={user.id} className="user-item">
                <div className="user-avatar">
                  {user.name.charAt(0)}
                </div>
                <div className="user-info">
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                  <p>{user.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No users loaded</h3>
          <p>Click the button above to load users</p>
        </div>
      )}
    </div>
  );
}

// Main component that demonstrates all examples
function FetchApiExample() {
  const [currentExample, setCurrentExample] = useState('basic');

  return (
    <div className="fetch-api-example">
      <h1>🌐 Fetch API Examples</h1>
      
      <div className="example-selector">
        <button 
          onClick={() => setCurrentExample('basic')}
          className={currentExample === 'basic' ? 'active' : ''}
        >
          Basic Fetch
        </button>
        <button 
          onClick={() => setCurrentExample('post')}
          className={currentExample === 'post' ? 'active' : ''}
        >
          POST Request
        </button>
        <button 
          onClick={() => setCurrentExample('error')}
          className={currentExample === 'error' ? 'active' : ''}
        >
          Error Handling
        </button>
        <button 
          onClick={() => setCurrentExample('loading')}
          className={currentExample === 'loading' ? 'active' : ''}
        >
          Loading States
        </button>
      </div>

      <div className="example-content">
        {currentExample === 'basic' && <BasicFetchExample />}
        {currentExample === 'post' && <PostRequestExample />}
        {currentExample === 'error' && <ErrorHandlingExample />}
        {currentExample === 'loading' && <LoadingStatesExample />}
      </div>

      <div className="explanation">
        <h3>Key Concepts Demonstrated:</h3>
        <ul>
          <li><strong>Fetch API:</strong> Modern way to make HTTP requests</li>
          <li><strong>Async/Await:</strong> Clean asynchronous code</li>
          <li><strong>Error Handling:</strong> Proper error catching and user feedback</li>
          <li><strong>Loading States:</strong> Better user experience during API calls</li>
          <li><strong>HTTP Methods:</strong> GET, POST requests with proper headers</li>
          <li><strong>Response Handling:</strong> Checking status and parsing JSON</li>
        </ul>
      </div>
    </div>
  );
}

export default FetchApiExample;
