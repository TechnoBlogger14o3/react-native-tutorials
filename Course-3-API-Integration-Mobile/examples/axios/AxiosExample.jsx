import React, { useState, useEffect } from 'react';

// Example 1: Basic Axios Usage
function BasicAxiosExample() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Using axios-like syntax (we'll simulate it since we don't have axios installed)
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPosts(data.slice(0, 10)); // Limit to 10 posts
    } catch (err) {
      setError(err.message);
      console.error('Axios error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="basic-axios-example">
      <h2>📡 Basic Axios Usage</h2>
      
      <div className="axios-controls">
        <button onClick={fetchPosts} disabled={loading}>
          {loading ? 'Loading...' : '🔄 Refresh Posts'}
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading posts...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <h3>❌ Error</h3>
          <p>{error}</p>
          <button onClick={fetchPosts}>Try Again</button>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="posts-grid">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.body}</p>
              <div className="post-meta">
                <span>User ID: {post.userId}</span>
                <span>Post ID: {post.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Example 2: Axios Interceptors
function AxiosInterceptorsExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestCount, setRequestCount] = useState(0);

  // Simulate axios interceptors
  const axiosWithInterceptors = {
    async get(url) {
      // Request interceptor
      setRequestCount(prev => prev + 1);
      console.log(`🚀 Request #${requestCount + 1} to: ${url}`);
      
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Response interceptor
        console.log(`✅ Response #${requestCount + 1} received:`, data);
        
        return { data };
      } catch (err) {
        // Error interceptor
        console.log(`❌ Error #${requestCount + 1}:`, err.message);
        throw err;
      }
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosWithInterceptors.get('https://jsonplaceholder.typicode.com/users/1');
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="axios-interceptors-example">
      <h2>🔄 Axios Interceptors</h2>
      
      <div className="interceptors-info">
        <p><strong>Request Count:</strong> {requestCount}</p>
        <p>Check the console to see interceptor logs</p>
      </div>
      
      <div className="interceptors-controls">
        <button onClick={fetchUserData} disabled={loading}>
          {loading ? 'Loading...' : '🔄 Fetch User Data'}
        </button>
        <button onClick={() => setRequestCount(0)}>
          🔄 Reset Counter
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading user data...</p>
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
          <h3>✅ User Data Loaded</h3>
          <div className="user-data">
            <p><strong>Name:</strong> {data.name}</p>
            <p><strong>Email:</strong> {data.email}</p>
            <p><strong>Phone:</strong> {data.phone}</p>
            <p><strong>Website:</strong> {data.website}</p>
            <div className="address">
              <strong>Address:</strong>
              <p>{data.address.street}, {data.address.city}</p>
            </div>
          </div>
        </div>
      )}

      <div className="interceptors-explanation">
        <h4>Interceptor Features Demonstrated:</h4>
        <ul>
          <li><strong>Request Interceptor:</strong> Logs outgoing requests</li>
          <li><strong>Response Interceptor:</strong> Logs successful responses</li>
          <li><strong>Error Interceptor:</strong> Handles and logs errors</li>
          <li><strong>Request Counting:</strong> Tracks number of requests</li>
        </ul>
      </div>
    </div>
  );
}

// Example 3: Axios Configuration
function AxiosConfigExample() {
  const [config, setConfig] = useState({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
      'X-Custom-Header': 'React-Tutorial'
    }
  });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = async (endpoint) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `${config.baseURL}${endpoint}`;
      console.log(`Making request to: ${url}`);
      console.log('Headers:', config.headers);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: config.headers,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResponse({ data, status: response.status, headers: Object.fromEntries(response.headers) });
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timeout');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="axios-config-example">
      <h2>⚙️ Axios Configuration</h2>
      
      <div className="config-panel">
        <h3>Configuration Settings</h3>
        
        <div className="config-group">
          <label htmlFor="baseURL">Base URL:</label>
          <input
            id="baseURL"
            type="text"
            value={config.baseURL}
            onChange={(e) => updateConfig('baseURL', e.target.value)}
          />
        </div>
        
        <div className="config-group">
          <label htmlFor="timeout">Timeout (ms):</label>
          <input
            id="timeout"
            type="number"
            value={config.timeout}
            onChange={(e) => updateConfig('timeout', parseInt(e.target.value))}
            min="1000"
            max="30000"
          />
        </div>
        
        <div className="config-group">
          <label htmlFor="customHeader">Custom Header:</label>
          <input
            id="customHeader"
            type="text"
            value={config.headers['X-Custom-Header']}
            onChange={(e) => updateConfig('headers', {
              ...config.headers,
              'X-Custom-Header': e.target.value
            })}
          />
        </div>
      </div>
      
      <div className="request-buttons">
        <button onClick={() => makeRequest('/posts/1')} disabled={loading}>
          {loading ? 'Loading...' : '📝 Get Post'}
        </button>
        <button onClick={() => makeRequest('/users/1')} disabled={loading}>
          {loading ? 'Loading...' : '👤 Get User'}
        </button>
        <button onClick={() => makeRequest('/comments/1')} disabled={loading}>
          {loading ? 'Loading...' : '💬 Get Comment'}
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Making request with current config...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <h3>❌ Request Failed</h3>
          <p>{error}</p>
        </div>
      )}

      {response && (
        <div className="success">
          <h3>✅ Request Successful</h3>
          <div className="response-info">
            <p><strong>Status:</strong> {response.status}</p>
            <p><strong>Data:</strong></p>
            <pre>{JSON.stringify(response.data, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

// Example 4: Concurrent Requests
function ConcurrentRequestsExample() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});

  const fetchSingleData = async (type, id) => {
    try {
      setLoading(prev => ({ ...prev, [type]: true }));
      setError(prev => ({ ...prev, [type]: null }));
      
      const response = await fetch(`https://jsonplaceholder.typicode.com/${type}/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResults(prev => ({ ...prev, [type]: data }));
    } catch (err) {
      setError(prev => ({ ...prev, [type]: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading({ posts: true, users: true, comments: true });
      setError({});
      
      const [postsResponse, usersResponse, commentsResponse] = await Promise.all([
        fetch('https://jsonplaceholder.typicode.com/posts/1'),
        fetch('https://jsonplaceholder.typicode.com/users/1'),
        fetch('https://jsonplaceholder.typicode.com/comments/1')
      ]);

      const [posts, users, comments] = await Promise.all([
        postsResponse.json(),
        usersResponse.json(),
        commentsResponse.json()
      ]);

      setResults({ posts, users, comments });
    } catch (err) {
      setError({ general: err.message });
    } finally {
      setLoading({});
    }
  };

  const clearResults = () => {
    setResults({});
    setError({});
  };

  return (
    <div className="concurrent-requests-example">
      <h2>🚀 Concurrent Requests</h2>
      
      <div className="concurrent-controls">
        <div className="single-requests">
          <h3>Single Requests</h3>
          <button 
            onClick={() => fetchSingleData('posts', 1)} 
            disabled={loading.posts}
          >
            {loading.posts ? 'Loading...' : '📝 Get Post'}
          </button>
          <button 
            onClick={() => fetchSingleData('users', 1)} 
            disabled={loading.users}
          >
            {loading.users ? 'Loading...' : '👤 Get User'}
          </button>
          <button 
            onClick={() => fetchSingleData('comments', 1)} 
            disabled={loading.comments}
          >
            {loading.comments ? 'Loading...' : '💬 Get Comment'}
          </button>
        </div>
        
        <div className="concurrent-request">
          <h3>Concurrent Request</h3>
          <button 
            onClick={fetchAllData} 
            disabled={Object.values(loading).some(Boolean)}
          >
            {Object.values(loading).some(Boolean) ? 'Loading All...' : '🚀 Fetch All Data'}
          </button>
        </div>
        
        <button onClick={clearResults} className="clear-btn">
          🗑️ Clear Results
        </button>
      </div>

      <div className="results-container">
        {Object.keys(results).length > 0 && (
          <div className="results">
            <h3>📊 Results</h3>
            
            {results.posts && (
              <div className="result-card">
                <h4>📝 Post</h4>
                <p><strong>Title:</strong> {results.posts.title}</p>
                <p><strong>Body:</strong> {results.posts.body}</p>
              </div>
            )}
            
            {results.users && (
              <div className="result-card">
                <h4>👤 User</h4>
                <p><strong>Name:</strong> {results.users.name}</p>
                <p><strong>Email:</strong> {results.users.email}</p>
              </div>
            )}
            
            {results.comments && (
              <div className="result-card">
                <h4>💬 Comment</h4>
                <p><strong>Name:</strong> {results.comments.name}</p>
                <p><strong>Body:</strong> {results.comments.body}</p>
              </div>
            )}
          </div>
        )}

        {Object.keys(error).length > 0 && (
          <div className="errors">
            <h3>❌ Errors</h3>
            {Object.entries(error).map(([key, value]) => (
              <div key={key} className="error-item">
                <strong>{key}:</strong> {value}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Main component that demonstrates all examples
function AxiosExample() {
  const [currentExample, setCurrentExample] = useState('basic');

  return (
    <div className="axios-example">
      <h1>📡 Axios Examples</h1>
      
      <div className="example-selector">
        <button 
          onClick={() => setCurrentExample('basic')}
          className={currentExample === 'basic' ? 'active' : ''}
        >
          Basic Axios
        </button>
        <button 
          onClick={() => setCurrentExample('interceptors')}
          className={currentExample === 'interceptors' ? 'active' : ''}
        >
          Interceptors
        </button>
        <button 
          onClick={() => setCurrentExample('config')}
          className={currentExample === 'config' ? 'active' : ''}
        >
          Configuration
        </button>
        <button 
          onClick={() => setCurrentExample('concurrent')}
          className={currentExample === 'concurrent' ? 'active' : ''}
        >
          Concurrent Requests
        </button>
      </div>

      <div className="example-content">
        {currentExample === 'basic' && <BasicAxiosExample />}
        {currentExample === 'interceptors' && <AxiosInterceptorsExample />}
        {currentExample === 'config' && <AxiosConfigExample />}
        {currentExample === 'concurrent' && <ConcurrentRequestsExample />}
      </div>

      <div className="explanation">
        <h3>Key Concepts Demonstrated:</h3>
        <ul>
          <li><strong>Axios Library:</strong> Popular HTTP client for React</li>
          <li><strong>Interceptors:</strong> Request/response middleware</li>
          <li><strong>Configuration:</strong> Global settings and defaults</li>
          <li><strong>Concurrent Requests:</strong> Promise.all for parallel requests</li>
          <li><strong>Error Handling:</strong> Comprehensive error management</li>
          <li><strong>Request Cancellation:</strong> AbortController for timeouts</li>
        </ul>
      </div>
    </div>
  );
}

export default AxiosExample;
