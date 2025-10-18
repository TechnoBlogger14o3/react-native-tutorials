import React, { useState, useEffect } from 'react';

// Example 1: Basic Async/Await Patterns
function BasicAsyncAwaitExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Basic async function
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Async function with multiple awaits
  const fetchMultipleData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Starting multiple data fetch...');
      
      // Sequential async calls
      const postResponse = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      const post = await postResponse.json();
      console.log('Post fetched:', post.title);
      
      const userResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${post.userId}`);
      const user = await userResponse.json();
      console.log('User fetched:', user.name);
      
      const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`);
      const comments = await commentsResponse.json();
      console.log('Comments fetched:', comments.length);
      
      setData({ post, user, comments });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="basic-async-await-example">
      <h2>⏳ Basic Async/Await Patterns</h2>
      
      <div className="async-controls">
        <button onClick={fetchData} disabled={loading}>
          {loading ? 'Loading...' : '🔄 Fetch Single Data'}
        </button>
        <button onClick={fetchMultipleData} disabled={loading}>
          {loading ? 'Loading...' : '🔄 Fetch Multiple Data'}
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <h3>❌ Error</h3>
          <p>{error}</p>
        </div>
      )}

      {data && (
        <div className="success">
          <h3>✅ Data Loaded</h3>
          <div className="data-display">
            {data.post && (
              <div className="data-section">
                <h4>📝 Post</h4>
                <p><strong>Title:</strong> {data.post.title}</p>
                <p><strong>Body:</strong> {data.post.body}</p>
              </div>
            )}
            
            {data.user && (
              <div className="data-section">
                <h4>👤 User</h4>
                <p><strong>Name:</strong> {data.user.name}</p>
                <p><strong>Email:</strong> {data.user.email}</p>
              </div>
            )}
            
            {data.comments && (
              <div className="data-section">
                <h4>💬 Comments ({data.comments.length})</h4>
                {data.comments.slice(0, 3).map(comment => (
                  <div key={comment.id} className="comment">
                    <p><strong>{comment.name}:</strong> {comment.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Example 2: Promise.all vs Sequential Await
function PromiseAllExample() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [method, setMethod] = useState('');

  // Sequential async calls (slower)
  const fetchSequential = async () => {
    try {
      setLoading(true);
      setError(null);
      setMethod('Sequential');
      
      const startTime = Date.now();
      
      const post = await fetch('https://jsonplaceholder.typicode.com/posts/1').then(r => r.json());
      const user = await fetch('https://jsonplaceholder.typicode.com/users/1').then(r => r.json());
      const comments = await fetch('https://jsonplaceholder.typicode.com/comments/1').then(r => r.json());
      
      const endTime = Date.now();
      
      setResults({ post, user, comments, time: endTime - startTime });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Parallel async calls (faster)
  const fetchParallel = async () => {
    try {
      setLoading(true);
      setError(null);
      setMethod('Parallel');
      
      const startTime = Date.now();
      
      const [post, user, comments] = await Promise.all([
        fetch('https://jsonplaceholder.typicode.com/posts/1').then(r => r.json()),
        fetch('https://jsonplaceholder.typicode.com/users/1').then(r => r.json()),
        fetch('https://jsonplaceholder.typicode.com/comments/1').then(r => r.json())
      ]);
      
      const endTime = Date.now();
      
      setResults({ post, user, comments, time: endTime - startTime });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="promise-all-example">
      <h2>🚀 Promise.all vs Sequential Await</h2>
      
      <div className="promise-controls">
        <button onClick={fetchSequential} disabled={loading}>
          {loading ? 'Loading...' : '🐌 Sequential Fetch'}
        </button>
        <button onClick={fetchParallel} disabled={loading}>
          {loading ? 'Loading...' : '⚡ Parallel Fetch'}
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Fetching data using {method} method...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <h3>❌ Error</h3>
          <p>{error}</p>
        </div>
      )}

      {results && (
        <div className="success">
          <h3>✅ Data Loaded ({method})</h3>
          <div className="timing-info">
            <p><strong>⏱️ Time taken:</strong> {results.time}ms</p>
            <p><strong>Method:</strong> {method}</p>
          </div>
          
          <div className="results-grid">
            <div className="result-card">
              <h4>📝 Post</h4>
              <p>{results.post.title}</p>
            </div>
            <div className="result-card">
              <h4>👤 User</h4>
              <p>{results.user.name}</p>
            </div>
            <div className="result-card">
              <h4>💬 Comment</h4>
              <p>{results.comments.name}</p>
            </div>
          </div>
        </div>
      )}

      <div className="explanation">
        <h4>Key Differences:</h4>
        <ul>
          <li><strong>Sequential:</strong> Each request waits for the previous one</li>
          <li><strong>Parallel:</strong> All requests happen simultaneously</li>
          <li><strong>Performance:</strong> Parallel is usually much faster</li>
          <li><strong>Error Handling:</strong> Promise.all fails fast on first error</li>
        </ul>
      </div>
    </div>
  );
}

// Example 3: Async Error Handling Patterns
function AsyncErrorHandlingExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Simulate different error scenarios
  const simulateError = () => {
    const random = Math.random();
    if (random < 0.3) {
      throw new Error('Network connection failed');
    } else if (random < 0.6) {
      throw new Error('Server error (500)');
    } else if (random < 0.8) {
      throw new Error('Timeout error');
    }
    // Success case
  };

  // Basic error handling
  const fetchWithBasicErrorHandling = async () => {
    try {
      setLoading(true);
      setError(null);
      
      simulateError();
      
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      const data = await response.json();
      setData(data);
    } catch (err) {
      setError(`Basic Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Advanced error handling with retry
  const fetchWithRetry = async (maxRetries = 3) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        setLoading(true);
        setError(null);
        setRetryCount(attempt - 1);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        simulateError();
        
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setData(data);
        setRetryCount(0);
        return; // Success, exit retry loop
        
      } catch (err) {
        lastError = err;
        console.log(`Attempt ${attempt} failed:`, err.message);
        
        if (attempt === maxRetries) {
          setError(`Failed after ${maxRetries} attempts: ${lastError.message}`);
        } else {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } finally {
        if (attempt === maxRetries) {
          setLoading(false);
        }
      }
    }
  };

  return (
    <div className="async-error-handling-example">
      <h2>🛡️ Async Error Handling Patterns</h2>
      
      <div className="error-controls">
        <div className="control-group">
          <h3>Basic Error Handling</h3>
          <button onClick={fetchWithBasicErrorHandling} disabled={loading}>
            {loading ? 'Loading...' : '🔄 Basic Fetch'}
          </button>
        </div>
        
        <div className="control-group">
          <h3>Retry Logic</h3>
          <button onClick={() => fetchWithRetry()} disabled={loading}>
            {loading ? `Retrying... (${retryCount})` : '🔄 Fetch with Retry'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading data... {retryCount > 0 && `(Retry ${retryCount})`}</p>
        </div>
      )}

      {error && (
        <div className="error">
          <h3>Error Details</h3>
          <p>{error}</p>
          <button onClick={() => setError(null)}>Clear Error</button>
        </div>
      )}

      {data && (
        <div className="success">
          <h3>✅ Data Loaded Successfully</h3>
          <div className="data-card">
            <p><strong>Title:</strong> {data.title}</p>
            <p><strong>Body:</strong> {data.body}</p>
            <p><strong>User ID:</strong> {data.userId}</p>
          </div>
        </div>
      )}

      <div className="error-patterns">
        <h4>Error Handling Patterns Demonstrated:</h4>
        <ul>
          <li><strong>Try-Catch-Finally:</strong> Basic error catching</li>
          <li><strong>Retry Logic:</strong> Automatic retry with backoff</li>
          <li><strong>Error Classification:</strong> Different handling for different errors</li>
          <li><strong>User-Friendly Messages:</strong> Clear error communication</li>
          <li><strong>Graceful Degradation:</strong> App continues to work despite errors</li>
        </ul>
      </div>
    </div>
  );
}

// Example 4: Async Functions in useEffect
function AsyncUseEffectExample() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(1);

  // Proper async function in useEffect
  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user data
        const userResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        if (!userResponse.ok) throw new Error('Failed to fetch user');
        const userData = await userResponse.json();
        
        // Fetch user's posts
        const postsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        if (!postsResponse.ok) throw new Error('Failed to fetch posts');
        const postsData = await postsResponse.json();
        
        setUser(userData);
        setPosts(postsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, [userId]); // Dependency array

  const changeUser = (newUserId) => {
    setUserId(newUserId);
  };

  return (
    <div className="async-useeffect-example">
      <h2>🎣 Async Functions in useEffect</h2>
      
      <div className="user-controls">
        <h3>Select User:</h3>
        <div className="user-buttons">
          {[1, 2, 3, 4, 5].map(id => (
            <button
              key={id}
              onClick={() => changeUser(id)}
              className={userId === id ? 'active' : ''}
              disabled={loading}
            >
              User {id}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading user {userId} and posts...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <h3>❌ Error</h3>
          <p>{error}</p>
        </div>
      )}

      {user && (
        <div className="user-info">
          <h3>👤 User Information</h3>
          <div className="user-card">
            <h4>{user.name}</h4>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Website:</strong> {user.website}</p>
          </div>
        </div>
      )}

      {posts.length > 0 && (
        <div className="posts-section">
          <h3>📝 User Posts ({posts.length})</h3>
          <div className="posts-list">
            {posts.slice(0, 5).map(post => (
              <div key={post.id} className="post-item">
                <h4>{post.title}</h4>
                <p>{post.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="useeffect-explanation">
        <h4>useEffect with Async Functions:</h4>
        <ul>
          <li><strong>Async Function:</strong> Define async function inside useEffect</li>
          <li><strong>Dependency Array:</strong> Re-run when userId changes</li>
          <li><strong>Cleanup:</strong> Proper error handling and loading states</li>
          <li><strong>Data Fetching:</strong> Fetch related data based on dependencies</li>
        </ul>
      </div>
    </div>
  );
}

// Main component that demonstrates all examples
function AsyncAwaitExample() {
  const [currentExample, setCurrentExample] = useState('basic');

  return (
    <div className="async-await-example">
      <h1>⏳ Async/Await Examples</h1>
      
      <div className="example-selector">
        <button 
          onClick={() => setCurrentExample('basic')}
          className={currentExample === 'basic' ? 'active' : ''}
        >
          Basic Async/Await
        </button>
        <button 
          onClick={() => setCurrentExample('promise-all')}
          className={currentExample === 'promise-all' ? 'active' : ''}
        >
          Promise.all
        </button>
        <button 
          onClick={() => setCurrentExample('error-handling')}
          className={currentExample === 'error-handling' ? 'active' : ''}
        >
          Error Handling
        </button>
        <button 
          onClick={() => setCurrentExample('useeffect')}
          className={currentExample === 'useeffect' ? 'active' : ''}
        >
          useEffect Async
        </button>
      </div>

      <div className="example-content">
        {currentExample === 'basic' && <BasicAsyncAwaitExample />}
        {currentExample === 'promise-all' && <PromiseAllExample />}
        {currentExample === 'error-handling' && <AsyncErrorHandlingExample />}
        {currentExample === 'useeffect' && <AsyncUseEffectExample />}
      </div>

      <div className="explanation">
        <h3>Key Concepts Demonstrated:</h3>
        <ul>
          <li><strong>Async/Await Syntax:</strong> Clean asynchronous code</li>
          <li><strong>Promise.all:</strong> Parallel vs sequential execution</li>
          <li><strong>Error Handling:</strong> Try-catch with async functions</li>
          <li><strong>Retry Logic:</strong> Automatic retry mechanisms</li>
          <li><strong>useEffect Integration:</strong> Async functions in React hooks</li>
          <li><strong>Performance:</strong> Optimizing API call patterns</li>
        </ul>
      </div>
    </div>
  );
}

export default AsyncAwaitExample;