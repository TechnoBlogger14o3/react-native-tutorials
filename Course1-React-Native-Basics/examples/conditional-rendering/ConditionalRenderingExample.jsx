import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';

// Example 1: Basic Conditional Rendering
function BasicConditionalRendering() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user'
  });

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔄 Basic Conditional Rendering</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Login Status</Text>
        
        <TouchableOpacity
          style={[styles.button, isLoggedIn ? styles.logoutButton : styles.loginButton]}
          onPress={toggleLogin}
        >
          <Text style={styles.buttonText}>
            {isLoggedIn ? 'Logout' : 'Login'}
          </Text>
        </TouchableOpacity>

        {/* Conditional rendering based on login status */}
        {isLoggedIn ? (
          <View style={styles.userProfile}>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userRole}>Role: {user.role}</Text>
          </View>
        ) : (
          <View style={styles.loginPrompt}>
            <Text style={styles.loginText}>Please log in to view your profile</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// Example 2: Conditional Rendering with Multiple Conditions
function MultipleConditions() {
  const [weather, setWeather] = useState({
    temperature: 25,
    condition: 'sunny',
    isRaining: false,
    windSpeed: 10
  });

  const getWeatherIcon = () => {
    if (weather.isRaining) return '🌧️';
    if (weather.condition === 'sunny') return '☀️';
    if (weather.condition === 'cloudy') return '☁️';
    if (weather.condition === 'snowy') return '❄️';
    return '🌤️';
  };

  const getTemperatureColor = () => {
    if (weather.temperature > 30) return '#FF6B6B'; // Hot - Red
    if (weather.temperature > 20) return '#FFA726'; // Warm - Orange
    if (weather.temperature > 10) return '#66BB6A'; // Cool - Green
    return '#42A5F5'; // Cold - Blue
  };

  const getWindDescription = () => {
    if (weather.windSpeed > 20) return 'Very Windy';
    if (weather.windSpeed > 10) return 'Windy';
    if (weather.windSpeed > 5) return 'Light Wind';
    return 'Calm';
  };

  const changeWeather = (type) => {
    switch (type) {
      case 'sunny':
        setWeather(prev => ({ ...prev, condition: 'sunny', isRaining: false }));
        break;
      case 'cloudy':
        setWeather(prev => ({ ...prev, condition: 'cloudy', isRaining: false }));
        break;
      case 'rainy':
        setWeather(prev => ({ ...prev, condition: 'rainy', isRaining: true }));
        break;
      case 'snowy':
        setWeather(prev => ({ ...prev, condition: 'snowy', isRaining: false }));
        break;
      case 'hotter':
        setWeather(prev => ({ ...prev, temperature: prev.temperature + 5 }));
        break;
      case 'colder':
        setWeather(prev => ({ ...prev, temperature: prev.temperature - 5 }));
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌤️ Multiple Conditions</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weather Display</Text>
        
        <View style={styles.weatherCard}>
          <Text style={styles.weatherIcon}>{getWeatherIcon()}</Text>
          <Text style={[styles.temperature, { color: getTemperatureColor() }]}>
            {weather.temperature}°C
          </Text>
          <Text style={styles.condition}>{weather.condition.toUpperCase()}</Text>
          
          {/* Conditional content based on weather */}
          {weather.isRaining && (
            <Text style={styles.rainWarning}>⚠️ It's raining! Bring an umbrella!</Text>
          )}
          
          {weather.temperature > 30 && (
            <Text style={styles.hotWarning}>🔥 It's very hot! Stay hydrated!</Text>
          )}
          
          {weather.temperature < 5 && (
            <Text style={styles.coldWarning}>🧥 It's cold! Dress warmly!</Text>
          )}
          
          <Text style={styles.windInfo}>
            Wind: {weather.windSpeed} km/h ({getWindDescription()})
          </Text>
        </View>

        <View style={styles.weatherControls}>
          <Text style={styles.controlTitle}>Change Weather:</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.weatherButton} onPress={() => changeWeather('sunny')}>
              <Text style={styles.weatherButtonText}>☀️ Sunny</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.weatherButton} onPress={() => changeWeather('cloudy')}>
              <Text style={styles.weatherButtonText}>☁️ Cloudy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.weatherButton} onPress={() => changeWeather('rainy')}>
              <Text style={styles.weatherButtonText}>🌧️ Rainy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.weatherButton} onPress={() => changeWeather('snowy')}>
              <Text style={styles.weatherButtonText}>❄️ Snowy</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.tempButton} onPress={() => changeWeather('hotter')}>
              <Text style={styles.tempButtonText}>🔥 Hotter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tempButton} onPress={() => changeWeather('colder')}>
              <Text style={styles.tempButtonText}>❄️ Colder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

// Example 3: Conditional Rendering with Lists
function ConditionalLists() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Learn React Native', completed: false, priority: 'high' },
    { id: 2, text: 'Build mobile app', completed: true, priority: 'medium' },
    { id: 3, text: 'Deploy to app store', completed: false, priority: 'low' },
    { id: 4, text: 'Write documentation', completed: false, priority: 'medium' },
  ]);
  const [filter, setFilter] = useState('all'); // all, completed, pending, high, medium, low

  const addTask = (text, priority = 'medium') => {
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
      priority
    };
    setTasks(prev => [...prev, newTask]);
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'pending':
        return tasks.filter(task => !task.completed);
      case 'high':
        return tasks.filter(task => task.priority === 'high');
      case 'medium':
        return tasks.filter(task => task.priority === 'medium');
      case 'low':
        return tasks.filter(task => task.priority === 'low');
      default:
        return tasks;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFA726';
      case 'low': return '#66BB6A';
      default: return '#999';
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Conditional Lists</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Task Manager</Text>
        
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Filter:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterButtons}>
              {['all', 'completed', 'pending', 'high', 'medium', 'low'].map(filterType => (
                <TouchableOpacity
                  key={filterType}
                  style={[
                    styles.filterButton,
                    filter === filterType && styles.activeFilterButton
                  ]}
                  onPress={() => setFilter(filterType)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    filter === filterType && styles.activeFilterButtonText
                  ]}>
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.taskStats}>
          <Text style={styles.statsText}>
            Total: {tasks.length} | 
            Completed: {tasks.filter(t => t.completed).length} | 
            Pending: {tasks.filter(t => !t.completed).length}
          </Text>
        </View>

        {/* Conditional rendering based on filtered tasks */}
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addTask('New Task', 'medium')}
            >
              <Text style={styles.addButtonText}>Add First Task</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView style={styles.taskList}>
            {filteredTasks.map(task => (
              <View key={task.id} style={styles.taskItem}>
                <TouchableOpacity
                  style={styles.taskContent}
                  onPress={() => toggleTask(task.id)}
                >
                  <View style={[
                    styles.checkbox,
                    task.completed && styles.checkboxCompleted
                  ]}>
                    {task.completed && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  
                  <View style={styles.taskInfo}>
                    <Text style={[
                      styles.taskText,
                      task.completed && styles.taskTextCompleted
                    ]}>
                      {task.text}
                    </Text>
                    <View style={styles.taskMeta}>
                      <View style={[
                        styles.priorityBadge,
                        { backgroundColor: getPriorityColor(task.priority) }
                      ]}>
                        <Text style={styles.priorityText}>{task.priority}</Text>
                      </View>
                      <Text style={styles.taskStatus}>
                        {task.completed ? 'Completed' : 'Pending'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteTask(task.id)}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        <View style={styles.addTaskContainer}>
          <TouchableOpacity
            style={styles.addTaskButton}
            onPress={() => addTask('Quick Task', 'medium')}
          >
            <Text style={styles.addTaskButtonText}>+ Add Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Example 4: Platform-Specific Conditional Rendering
function PlatformSpecificRendering() {
  const [featureEnabled, setFeatureEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📱 Platform-Specific Rendering</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Platform Detection</Text>
        
        <View style={styles.platformInfo}>
          <Text style={styles.platformText}>
            Current Platform: {Platform.OS}
          </Text>
          <Text style={styles.platformText}>
            Platform Version: {Platform.Version}
          </Text>
        </View>

        <View style={styles.featureToggle}>
          <Text style={styles.toggleLabel}>Enable Platform Features:</Text>
          <Switch
            value={featureEnabled}
            onValueChange={setFeatureEnabled}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={featureEnabled ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        {/* iOS-specific rendering */}
        {Platform.OS === 'ios' && (
          <View style={styles.platformSection}>
            <Text style={styles.platformSectionTitle}>🍎 iOS Features</Text>
            <Text style={styles.platformDescription}>
              These features are only available on iOS devices
            </Text>
            
            {featureEnabled && (
              <View style={styles.iosFeatures}>
                <TouchableOpacity style={styles.iosButton}>
                  <Text style={styles.iosButtonText}>iOS Haptic Feedback</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iosButton}>
                  <Text style={styles.iosButtonText}>iOS Share Sheet</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iosButton}>
                  <Text style={styles.iosButtonText}>iOS Biometric Auth</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Android-specific rendering */}
        {Platform.OS === 'android' && (
          <View style={styles.platformSection}>
            <Text style={styles.platformSectionTitle}>🤖 Android Features</Text>
            <Text style={styles.platformDescription}>
              These features are only available on Android devices
            </Text>
            
            {featureEnabled && (
              <View style={styles.androidFeatures}>
                <TouchableOpacity style={styles.androidButton}>
                  <Text style={styles.androidButtonText}>Android Vibration</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.androidButton}>
                  <Text style={styles.androidButtonText}>Android Share Intent</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.androidButton}>
                  <Text style={styles.androidButtonText}>Android Fingerprint</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Cross-platform rendering */}
        <View style={styles.platformSection}>
          <Text style={styles.platformSectionTitle}>🌐 Cross-Platform Features</Text>
          <Text style={styles.platformDescription}>
            These features work on both iOS and Android
          </Text>
          
          {featureEnabled && (
            <View style={styles.crossPlatformFeatures}>
              <TouchableOpacity style={styles.crossPlatformButton}>
                <Text style={styles.crossPlatformButtonText}>Push Notifications</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.crossPlatformButton}>
                <Text style={styles.crossPlatformButtonText}>Camera Access</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.crossPlatformButton}>
                <Text style={styles.crossPlatformButtonText}>Location Services</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

// Main component that demonstrates all examples
function ConditionalRenderingExample() {
  const [currentExample, setCurrentExample] = useState('basic');

  const renderExample = () => {
    switch (currentExample) {
      case 'basic':
        return <BasicConditionalRendering />;
      case 'multiple':
        return <MultipleConditions />;
      case 'lists':
        return <ConditionalLists />;
      case 'platform':
        return <PlatformSpecificRendering />;
      default:
        return <BasicConditionalRendering />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔄 Conditional Rendering Examples</Text>
      
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
          style={[styles.tab, currentExample === 'multiple' && styles.activeTab]}
          onPress={() => setCurrentExample('multiple')}
        >
          <Text style={[styles.tabText, currentExample === 'multiple' && styles.activeTabText]}>
            Multiple
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, currentExample === 'lists' && styles.activeTab]}
          onPress={() => setCurrentExample('lists')}
        >
          <Text style={[styles.tabText, currentExample === 'lists' && styles.activeTabText]}>
            Lists
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, currentExample === 'platform' && styles.activeTab]}
          onPress={() => setCurrentExample('platform')}
        >
          <Text style={[styles.tabText, currentExample === 'platform' && styles.activeTabText]}>
            Platform
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
  section: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#28a745',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  userProfile: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#1976d2',
    marginBottom: 5,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  userRole: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
  },
  loginPrompt: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#856404',
  },
  weatherCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  weatherIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  condition: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  rainWarning: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  hotWarning: {
    color: '#dc3545',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  coldWarning: {
    color: '#17a2b8',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  windInfo: {
    fontSize: 12,
    color: '#999',
  },
  weatherControls: {
    marginTop: 10,
  },
  controlTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weatherButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  weatherButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  tempButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  tempButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  filterContainer: {
    marginBottom: 15,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#e9ecef',
  },
  activeFilterButton: {
    backgroundColor: '#007bff',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  activeFilterButtonText: {
    color: 'white',
  },
  taskStats: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
  },
  statsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 15,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  taskList: {
    maxHeight: 300,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskInfo: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  priorityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  taskStatus: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  addTaskContainer: {
    marginTop: 15,
  },
  addTaskButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addTaskButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  platformInfo: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  platformText: {
    fontSize: 14,
    color: '#1976d2',
    marginBottom: 5,
  },
  featureToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  platformSection: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  platformSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  platformDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  iosFeatures: {
    gap: 10,
  },
  iosButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  iosButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  androidFeatures: {
    gap: 10,
  },
  androidButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  androidButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  crossPlatformFeatures: {
    gap: 10,
  },
  crossPlatformButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  crossPlatformButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
});

export default ConditionalRenderingExample;