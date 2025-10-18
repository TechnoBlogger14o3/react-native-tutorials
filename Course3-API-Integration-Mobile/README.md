# Course 3: API Integration & Asynchronous Programming

## 🎯 Goal

Learn how to interact with external data sources and handle asynchronous operations in React applications. Master data fetching, error handling, and loading states.

## 📚 What You'll Learn

- Fetch API / Axios
- Async/await in React
- Error handling
- Loading states
- useEffect for data fetching
- Building weather and movie search applications

---

## 🌐 Fetch API & Axios

### Fetch API Basics

The Fetch API is a modern way to make HTTP requests in JavaScript.

```jsx
import { useState, useEffect } from 'react';

function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => fetchWeather('London')}>
        Get London Weather
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <p>Temperature: {weather.main.temp}°C</p>
        </div>
      )}
    </div>
  );
}
```

### Axios Alternative

Axios provides a more feature-rich HTTP client with better error handling.

```jsx
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: 'YOUR_API_KEY'
  }
});

function MovieSearch() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');

  const searchMovies = async (searchQuery) => {
    try {
      const response = await api.get('/search/movie', {
        params: { query: searchQuery }
      });
      setMovies(response.data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies..."
      />
      <button onClick={() => searchMovies(query)}>Search</button>
      {movies.map(movie => (
        <div key={movie.id}>
          <h3>{movie.title}</h3>
          <p>{movie.overview}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## ⚡ Async/Await in React

### Data Fetching Patterns

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user and posts in parallel
        const [userResponse, postsResponse] = await Promise.all([
          fetch(`/api/users/${userId}`),
          fetch(`/api/users/${userId}/posts`)
        ]);

        const userData = await userResponse.json();
        const postsData = await postsResponse.json();

        setUser(userData);
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <h2>Posts ({posts.length})</h2>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🚨 Error Handling

### Comprehensive Error Handling

```jsx
function ApiComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/data');
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Data not found');
        } else if (response.status === 500) {
          throw new Error('Server error');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    fetchData();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button onClick={retry}>Try Again</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Data loaded successfully!</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

---

## 🔄 Loading States

### Loading State Patterns

```jsx
function DataComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <button onClick={() => fetchData(true)} disabled={refreshing}>
        {refreshing ? 'Refreshing...' : 'Refresh'}
      </button>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      ) : (
        <div className="data-list">
          {data.map(item => (
            <div key={item.id}>{item.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 🧩 Mini Tasks

### Task 1: Weather API Integration
Create a weather component that fetches current weather data.

**Requirements:**
- Use OpenWeatherMap API
- Handle loading and error states
- Display temperature, humidity, and weather description
- Add city search functionality

### Task 2: Movie Search App
Build a movie search component using The Movie Database API.

**Requirements:**
- Search movies by title
- Display movie posters and details
- Handle pagination
- Implement error handling

### Task 3: Data Fetching Hook
Create a custom hook for data fetching.

**Requirements:**
- Accept URL as parameter
- Return data, loading, and error states
- Include retry functionality
- Handle cleanup on unmount

---

## 🚀 Projects

### Project 1: Weather App

Build a comprehensive weather application with multiple features.

**Features:**
- Current weather display
- 5-day forecast
- City search and geolocation
- Weather alerts and notifications
- Responsive design

**Technical Requirements:**
- Use OpenWeatherMap API
- Implement error handling and loading states
- Use React Router for different views
- Implement local storage for favorite cities

### Project 2: Movie Search App

Create a movie discovery application with search and filtering.

**Features:**
- Movie search functionality
- Popular and trending movies
- Movie details and reviews
- Watchlist functionality
- Genre filtering

**Technical Requirements:**
- Use The Movie Database API
- Implement infinite scroll or pagination
- Handle API rate limiting
- Implement responsive design

---

## 📚 Next Steps

### Prepare for Course 4:
- Learn about state management libraries
- Understand Context API patterns
- Practice with Redux concepts
- Learn about middleware and dev tools

### Key Takeaways:
- ✅ Fetch API and Axios are powerful tools for HTTP requests
- ✅ Async/await makes asynchronous code more readable
- ✅ Proper error handling improves user experience
- ✅ Loading states provide better UX feedback
- ✅ useEffect is essential for data fetching in React

**Ready for Course 4?** 🚀

Move on to **Course 4: Advanced State Management** to learn about Context API, Redux, and other state management solutions!

---

*Happy coding! Remember, good API integration is key to building dynamic applications.*
