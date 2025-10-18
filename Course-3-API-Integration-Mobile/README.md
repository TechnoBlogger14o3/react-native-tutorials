# Course 3: API Integration & Asynchronous Programming

## 🎯 Goal

Learn how to interact with external data sources and handle asynchronous operations in React Native applications. Master data fetching, error handling, and loading states for mobile apps.

## 📚 What You'll Learn

- Fetch API in React Native
- Async/await patterns for mobile
- Error handling and retry logic
- Loading states and mobile UX
- useEffect for mobile data fetching
- Building weather and movie search mobile applications

---

## 🌐 Fetch API in React Native

### Fetch API Basics for Mobile

The Fetch API works the same way in React Native as in web applications, but with mobile-specific considerations like network connectivity and app lifecycle.

```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';

function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', `Failed to fetch weather: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => fetchWeather('London')}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Get London Weather</Text>
      </TouchableOpacity>
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading weather...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}
      
      {weather && (
        <View style={styles.weatherContainer}>
          <Text style={styles.cityName}>{weather.name}</Text>
          <Text style={styles.temperature}>{weather.main.temp}°C</Text>
          <Text style={styles.description}>{weather.weather[0].description}</Text>
        </View>
      )}
    </View>
  );
}
```

### Mobile-Specific Fetch Considerations

1. **Network Connectivity**: Handle offline scenarios
2. **App Lifecycle**: Pause/resume network requests
3. **Background Refresh**: Update data when app becomes active
4. **Rate Limiting**: Implement request throttling
5. **Caching**: Store data locally for offline access

---

## ⚡ Async/Await in React Native

### Data Fetching Patterns for Mobile

```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user and posts in parallel for better performance
        const [userResponse, postsResponse] = await Promise.all([
          fetch(`https://jsonplaceholder.typicode.com/users/${userId}`),
          fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
        ]);

        if (!userResponse.ok || !postsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const userData = await userResponse.json();
        const postsData = await postsResponse.json();

        setUser(userData);
        setPosts(postsData);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading user data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>
      
      <Text style={styles.postsTitle}>Posts ({posts.length})</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.postItem}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postBody}>{item.body}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
```

### Mobile Async Patterns

1. **Parallel Requests**: Use Promise.all for multiple API calls
2. **Sequential Requests**: Chain dependent API calls
3. **Timeout Handling**: Implement request timeouts
4. **Retry Logic**: Automatic retry for failed requests
5. **Background Sync**: Update data when app becomes active

---

## 🚨 Error Handling for Mobile

### Comprehensive Error Handling

```jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';

function ApiComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = async (isRetry = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      
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
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      setError(err.message);
      
      // Show platform-specific error alerts
      if (Platform.OS === 'ios') {
        Alert.alert('Error', err.message, [
          { text: 'OK', style: 'default' },
          { text: 'Retry', onPress: () => retry() }
        ]);
      } else {
        Alert.alert('Error', err.message, [
          { text: 'OK', style: 'default' },
          { text: 'Retry', onPress: () => retry() }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      fetchData(true);
    } else {
      Alert.alert('Max Retries', 'Maximum retry attempts reached');
    }
  };

  const handleRefresh = () => {
    setRetryCount(0);
    fetchData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading data...</Text>
        {retryCount > 0 && (
          <Text style={styles.retryText}>Retry attempt: {retryCount}</Text>
        )}
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={retry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.successTitle}>Data loaded successfully!</Text>
      {data && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataTitle}>{data.title}</Text>
          <Text style={styles.dataBody}>{data.body}</Text>
        </View>
      )}
    </View>
  );
}
```

### Mobile Error Handling Patterns

1. **Network Errors**: Handle offline scenarios gracefully
2. **Timeout Errors**: Implement request timeouts
3. **Retry Logic**: Automatic retry with exponential backoff
4. **User Feedback**: Clear error messages and recovery options
5. **Platform Differences**: iOS vs Android error handling

---

## 🔄 Loading States for Mobile

### Mobile Loading State Patterns

```jsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl,
  StyleSheet 
} from 'react-native';

function DataComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  const fetchData = async (isRefresh = false, isLoadMore = false) => {
    if (isRefresh) {
      setRefreshing(true);
      setPage(1);
    } else if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
      );
      const result = await response.json();
      
      if (isRefresh || !isLoadMore) {
        setData(result);
      } else {
        setData(prev => [...prev, ...result]);
      }
      
      if (isLoadMore) {
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const handleRefresh = () => {
    fetchData(true);
  };

  const handleLoadMore = () => {
    if (!loadingMore) {
      fetchData(false, true);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007bff" />
        <Text style={styles.footerText}>Loading more...</Text>
      </View>
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemBody}>{item.body}</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#007bff']} // Android
            tintColor="#007bff" // iOS
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
```

### Mobile Loading Patterns

1. **Pull-to-Refresh**: Use RefreshControl for data refresh
2. **Infinite Scroll**: Load more data as user scrolls
3. **Skeleton Loading**: Show placeholder content while loading
4. **Progressive Loading**: Load critical content first
5. **Background Loading**: Load data in background

---

## 🧩 Mini Tasks

### Task 1: Weather API Integration
Create a weather component that fetches current weather data for mobile.

**Requirements:**
- Use OpenWeatherMap API
- Handle loading and error states with ActivityIndicator
- Display temperature, humidity, and weather description
- Add city search functionality with TextInput
- Implement pull-to-refresh
- Handle network connectivity issues

### Task 2: Movie Search App
Build a movie search component using The Movie Database API.

**Requirements:**
- Search movies by title with TextInput
- Display movie posters and details in FlatList
- Handle pagination with infinite scroll
- Implement error handling with retry logic
- Add loading states for search and load more
- Cache search results locally

### Task 3: Custom Data Fetching Hook
Create a custom hook for data fetching in React Native.

**Requirements:**
- Accept URL and options as parameters
- Return data, loading, and error states
- Include retry functionality with exponential backoff
- Handle cleanup on unmount
- Support refresh and load more patterns
- Handle network connectivity changes

### Task 4: Offline-First Data Sync
Build a component that works offline and syncs when online.

**Requirements:**
- Store data locally using AsyncStorage
- Show cached data when offline
- Sync data when network becomes available
- Handle conflict resolution
- Show offline/online status
- Implement background sync

---

## 🚀 Projects

### Project 1: Weather App

Build a comprehensive weather application with mobile-specific features.

**Features:**
- Current weather display with location services
- 5-day forecast with swipeable cards
- City search with autocomplete
- Weather alerts and notifications
- Offline weather data caching
- Pull-to-refresh functionality
- Background weather updates

**Technical Requirements:**
- Use OpenWeatherMap API
- Implement error handling and loading states
- Use React Navigation for different screens
- Implement AsyncStorage for favorite cities
- Handle location permissions
- Use FlatList for forecast display
- Implement push notifications for weather alerts

### Project 2: Movie Search App

Create a movie discovery application with search and filtering for mobile.

**Features:**
- Movie search with real-time suggestions
- Popular and trending movies carousel
- Movie details with full-screen images
- Watchlist functionality with local storage
- Genre filtering with chips
- Infinite scroll for movie lists
- Offline movie data caching

**Technical Requirements:**
- Use The Movie Database API
- Implement infinite scroll with FlatList
- Handle API rate limiting
- Implement responsive design for different screen sizes
- Use AsyncStorage for watchlist
- Implement image caching
- Handle deep linking to specific movies

---

## 📚 Next Steps

### Prepare for Course 4:
- Learn about state management libraries for mobile
- Understand Context API patterns in React Native
- Practice with Redux Toolkit for mobile apps
- Learn about AsyncStorage and data persistence
- Understand mobile-specific state management patterns

### Additional Resources:
- [React Native Networking](https://reactnative.dev/docs/network)
- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [AsyncStorage Guide](https://react-native-async-storage.github.io/async-storage/)
- [React Native Performance](https://reactnative.dev/docs/performance)

### Key Takeaways:
- ✅ Fetch API works seamlessly in React Native
- ✅ Async/await makes mobile data fetching more readable
- ✅ Proper error handling improves mobile user experience
- ✅ Loading states provide better mobile UX feedback
- ✅ useEffect is essential for data fetching in React Native
- ✅ Mobile-specific patterns like pull-to-refresh enhance UX

**Ready for Course 4?** 🚀

Move on to **Course 4: Advanced State Management** to learn about Context API, Redux Toolkit, AsyncStorage, and other state management solutions for mobile applications!

---

*Happy mobile coding! Remember, good API integration and error handling are key to building robust mobile applications.*