import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Platform,
  RefreshControl,
} from 'react-native';

// Example 1: Basic Fetch API Usage
function BasicFetchExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', `Failed to fetch data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithError = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // This will intentionally fail
      const response = await fetch('https://jsonplaceholder.typicode.com/invalid-endpoint');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', `Failed to fetch data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌐 Basic Fetch API</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={fetchData} disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Loading...' : '🔄 Fetch Data'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.errorButton} onPress={fetchWithError} disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Loading...' : '❌ Test Error'}
          </Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading data...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {data && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataTitle}>✅ Data Loaded</Text>
          <Text style={styles.dataId}>ID: {data.id}</Text>
          <Text style={styles.dataTitleText}>Title: {data.title}</Text>
          <Text style={styles.dataBody}>Body: {data.body}</Text>
        </View>
      )}
    </View>
  );
}

// Example 2: POST Request with Form Data
function PostRequestExample() {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    userId: 1,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const submitPost = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setResult(result);
      Alert.alert('Success', 'Post created successfully!');
      
      // Reset form
      setFormData({ title: '', body: '', userId: 1 });
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', `Failed to create post: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 POST Request Example</Text>
      
      <ScrollView style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title:</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => handleInputChange('title', text)}
            placeholder="Enter post title"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Body:</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.body}
            onChangeText={(text) => handleInputChange('body', text)}
            placeholder="Enter post body"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>User ID:</Text>
          <TextInput
            style={styles.input}
            value={formData.userId.toString()}
            onChangeText={(text) => handleInputChange('userId', parseInt(text) || 1)}
            placeholder="Enter user ID"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
          onPress={submitPost}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Creating...' : '📤 Create Post'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Creating post...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>✅ Post Created</Text>
          <Text style={styles.resultId}>ID: {result.id}</Text>
          <Text style={styles.resultTitleText}>Title: {result.title}</Text>
          <Text style={styles.resultBody}>Body: {result.body}</Text>
        </View>
      )}
    </View>
  );
}

// Example 3: Error Handling and Retry Logic
function ErrorHandlingExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const fetchDataWithRetry = async (isRetry = false) => {
    try {
      setLoading(true);
      setError(null);
      
      if (isRetry) {
        setRetryCount(prev => prev + 1);
        // Add delay for retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Simulate network issues randomly
      const shouldFail = Math.random() < 0.3; // 30% chance of failure
      
      if (shouldFail) {
        throw new Error('Network request failed');
      }
      
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      setRetryCount(0);
      setLastFetchTime(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    if (retryCount < 3) {
      fetchDataWithRetry(true);
    } else {
      Alert.alert('Max Retries', 'Maximum retry attempts reached. Please try again later.');
    }
  };

  const resetAndFetch = () => {
    setRetryCount(0);
    setError(null);
    fetchDataWithRetry();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛡️ Error Handling & Retry</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => fetchDataWithRetry()} disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Loading...' : '🔄 Fetch Data'}
          </Text>
        </TouchableOpacity>
        
        {error && retryCount < 3 && (
          <TouchableOpacity style={styles.retryButton} onPress={retry} disabled={loading}>
            <Text style={styles.buttonText}>
              🔄 Retry ({retryCount}/3)
            </Text>
          </TouchableOpacity>
        )}
        
        {retryCount >= 3 && (
          <TouchableOpacity style={styles.resetButton} onPress={resetAndFetch} disabled={loading}>
            <Text style={styles.buttonText}>
              🔄 Reset & Fetch
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>
            Loading data... {retryCount > 0 && `(Retry ${retryCount})`}
          </Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>❌ Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryInfo}>
            Retry attempts: {retryCount}/3
          </Text>
        </View>
      )}

      {data && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataTitle}>✅ Data Loaded Successfully</Text>
          <Text style={styles.dataId}>ID: {data.id}</Text>
          <Text style={styles.dataTitleText}>Title: {data.title}</Text>
          <Text style={styles.dataBody}>Body: {data.body}</Text>
          {lastFetchTime && (
            <Text style={styles.fetchTime}>Last fetched: {lastFetchTime}</Text>
          )}
        </View>
      )}
    </View>
  );
}

// Example 4: Loading States and Pull-to-Refresh
function LoadingStatesExample() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchData(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔄 Loading States & Refresh</Text>
      
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#007bff']} // Android
            tintColor="#007bff" // iOS
            title="Pull to refresh"
            titleColor="#666"
          />
        }
      >
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Error</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => fetchData()}>
              <Text style={styles.buttonText}>🔄 Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {data.length > 0 && (
          <View style={styles.postsContainer}>
            <Text style={styles.postsTitle}>Posts ({data.length})</Text>
            {data.map(post => (
              <View key={post.id} style={styles.postItem}>
                <Text style={styles.postId}>#{post.id}</Text>
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postBody}>{post.body}</Text>
              </View>
            ))}
          </View>
        )}

        {refreshing && (
          <View style={styles.refreshIndicator}>
            <ActivityIndicator size="small" color="#007bff" />
            <Text style={styles.refreshText}>Refreshing...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// Main component that demonstrates all examples
function FetchApiExample() {
  const [currentExample, setCurrentExample] = useState('basic');

  const renderExample = () => {
    switch (currentExample) {
      case 'basic':
        return <BasicFetchExample />;
      case 'post':
        return <PostRequestExample />;
      case 'error':
        return <ErrorHandlingExample />;
      case 'loading':
        return <LoadingStatesExample />;
      default:
        return <BasicFetchExample />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌐 Fetch API Examples</Text>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, currentExample === 'basic' && styles.activeTab]}
          onPress={() => setCurrentExample('basic')}
        >
          <Text style={[styles.tabText, currentExample === 'basic' && styles.activeTabText]}>
            Basic
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, currentExample === 'post' && styles.activeTab]}
          onPress={() => setCurrentExample('post')}
        >
          <Text style={[styles.tabText, currentExample === 'post' && styles.activeTabText]}>
            POST
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, currentExample === 'error' && styles.activeTab]}
          onPress={() => setCurrentExample('error')}
        >
          <Text style={[styles.tabText, currentExample === 'error' && styles.activeTabText]}>
            Error
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, currentExample === 'loading' && styles.activeTab]}
          onPress={() => setCurrentExample('loading')}
        >
          <Text style={[styles.tabText, currentExample === 'loading' && styles.activeTabText]}>
            Loading
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {renderExample()}
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Fetch API Concepts:</Text>
        <Text style={styles.infoText}>
          • GET requests for data fetching
          {'\n'}• POST requests with JSON data
          {'\n'}• Error handling and retry logic
          {'\n'}• Loading states and user feedback
          {'\n'}• Pull-to-refresh functionality
        </Text>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  errorButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  retryButton: {
    backgroundColor: '#ffc107',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  resetButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#721c24',
    marginBottom: 5,
  },
  errorText: {
    fontSize: 14,
    color: '#721c24',
  },
  retryInfo: {
    fontSize: 12,
    color: '#721c24',
    marginTop: 5,
    fontStyle: 'italic',
  },
  dataContainer: {
    backgroundColor: '#d4edda',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#155724',
    marginBottom: 10,
  },
  dataId: {
    fontSize: 14,
    color: '#155724',
    marginBottom: 5,
  },
  dataTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#155724',
    marginBottom: 8,
  },
  dataBody: {
    fontSize: 14,
    color: '#155724',
    lineHeight: 20,
  },
  fetchTime: {
    fontSize: 12,
    color: '#155724',
    marginTop: 5,
    fontStyle: 'italic',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
  },
  resultContainer: {
    backgroundColor: '#d1ecf1',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0c5460',
    marginBottom: 10,
  },
  resultId: {
    fontSize: 14,
    color: '#0c5460',
    marginBottom: 5,
  },
  resultTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0c5460',
    marginBottom: 8,
  },
  resultBody: {
    fontSize: 14,
    color: '#0c5460',
    lineHeight: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  postsContainer: {
    paddingHorizontal: 20,
  },
  postsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  postItem: {
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
  postId: {
    fontSize: 12,
    color: '#007bff',
    fontWeight: '600',
    marginBottom: 5,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  postBody: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  refreshIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  refreshText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  infoSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default FetchApiExample;