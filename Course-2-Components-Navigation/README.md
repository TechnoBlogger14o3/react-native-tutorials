# Course 2: Components & Navigation

## 🎯 Goal

Master component composition patterns and React Navigation for building multi-screen mobile applications. Learn to create reusable components, manage state across screens, and implement mobile navigation patterns.

## 📚 What You'll Learn

- Component composition for mobile apps
- State lifting patterns in React Native
- React Navigation (Stack, Tab, Drawer)
- useEffect hooks for mobile data fetching
- Form handling in React Native
- Building multi-screen mobile applications

---

## 🧩 Component Composition for Mobile

### Understanding Mobile Component Composition

Component composition in React Native follows the same principles as React web, but with mobile-specific considerations like touch interactions, screen sizes, and platform differences.

```jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Parent component that composes smaller components
function NewsApp() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      <Header />
      <Navigation />
      <ArticleList articles={articles} loading={loading} />
      <Footer />
    </View>
  );
}

// Child components that are composed together
function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>News App</Text>
      <SearchBar />
    </View>
  );
}
```

### Mobile Component Hierarchy Best Practices

1. **Touch-Friendly Components**: Use TouchableOpacity, TouchableHighlight, or Pressable
2. **Responsive Layouts**: Use Flexbox for mobile layouts
3. **Platform-Specific Rendering**: Handle iOS/Android differences
4. **Performance**: Optimize for mobile performance with FlatList
5. **Accessibility**: Include accessibility props for screen readers

---

## 🔄 State Lifting in React Native

When multiple components need to share the same state, lift the state up to their common parent component.

### Example: Shared Counter State

```jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Parent component manages shared state
function CounterApp() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <CounterDisplay count={count} />
      <CounterControls 
        count={count} 
        onIncrement={() => setCount(count + 1)}
        onDecrement={() => setCount(count - 1)}
        onReset={() => setCount(0)}
      />
    </View>
  );
}

// Child components receive state and handlers as props
function CounterDisplay({ count }) {
  return (
    <View style={styles.displayContainer}>
      <Text style={styles.countText}>Count: {count}</Text>
    </View>
  );
}

function CounterControls({ onIncrement, onDecrement, onReset }) {
  return (
    <View style={styles.controlsContainer}>
      <TouchableOpacity style={styles.button} onPress={onIncrement}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onDecrement}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onReset}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### When to Lift State Up in Mobile Apps

- Multiple screens need the same data
- Components need to communicate across navigation
- You need to synchronize state across different screens
- State changes should trigger updates in multiple places
- User preferences need to persist across screens

---

## 🎣 useEffect for Mobile Data Fetching

### useEffect Hook in React Native

The `useEffect` hook works the same way in React Native as in React web, but with mobile-specific considerations like network connectivity and app lifecycle.

```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user data when component mounts or userId changes
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]); // Dependency array

  // Cleanup effect for timers
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Timer tick');
    }, 1000);

    return () => {
      clearInterval(timer); // Cleanup function
    };
  }, []); // Empty dependency array = run once

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007bff" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
  
  if (error) return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Error: {error}</Text>
    </View>
  );
  
  if (!user) return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>User not found</Text>
    </View>
  );

  return (
    <View style={styles.userProfile}>
      <Text style={styles.userName}>{user.name}</Text>
      <Text style={styles.userEmail}>{user.email}</Text>
    </View>
  );
}
```

### Mobile-Specific useEffect Patterns

1. **Network State Monitoring**: Track connectivity changes
2. **App State Changes**: Handle app backgrounding/foregrounding
3. **Location Services**: Start/stop location tracking
4. **Push Notifications**: Set up notification listeners
5. **Biometric Authentication**: Handle authentication state

---

## 🧭 React Navigation

React Navigation is the standard navigation library for React Native applications, providing stack, tab, and drawer navigation patterns.

### Installation

```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npx pod-install ios # For iOS
```

### Stack Navigation Setup

```jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'News App' }}
        />
        <Stack.Screen 
          name="ArticleDetail" 
          component={ArticleDetailScreen}
          options={{ title: 'Article' }}
        />
        <Stack.Screen 
          name="Search" 
          component={SearchScreen}
          options={{ title: 'Search' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Screen components
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('ArticleDetail', { articleId: 1 })}
      >
        <Text>Go to Article</Text>
      </TouchableOpacity>
    </View>
  );
}

function ArticleDetailScreen({ route, navigation }) {
  const { articleId } = route.params;
  
  return (
    <View style={styles.container}>
      <Text>Article ID: {articleId}</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Tab Navigation

```jsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🔍</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
```

### Navigation Hooks

```jsx
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

function NewsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Fetch fresh data when screen is focused
      fetchNewsData();
    }, [])
  );

  const handleArticlePress = (articleId) => {
    navigation.navigate('ArticleDetail', { articleId });
  };

  return (
    <View>
      {/* Screen content */}
    </View>
  );
}
```

---

## 📝 Form Handling in React Native

### Controlled Components in React Native

React Native forms use TextInput components controlled by React state.

```jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet } from 'react-native';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    newsletter: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form submitted:', formData);
      Alert.alert('Success', 'Form submitted successfully!');
      
      // Reset form
      setFormData({ name: '', email: '', message: '', newsletter: false });
      setErrors({});
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={formData.name}
          onChangeText={(text) => handleInputChange('name', text)}
          placeholder="Enter your name"
          placeholderTextColor="#999"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Message:</Text>
        <TextInput
          style={[styles.textArea, errors.message && styles.inputError]}
          value={formData.message}
          onChangeText={(text) => handleInputChange('message', text)}
          placeholder="Enter your message"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        {errors.message && <Text style={styles.errorText}>{errors.message}</Text>}
      </View>

      <View style={styles.switchGroup}>
        <Text style={styles.label}>Subscribe to newsletter:</Text>
        <Switch
          value={formData.newsletter}
          onValueChange={(value) => handleInputChange('newsletter', value)}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={formData.newsletter ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>

      <TouchableOpacity 
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
```

### Mobile Form Best Practices

1. **Keyboard Handling**: Use appropriate keyboardType props
2. **Input Validation**: Real-time validation with clear error messages
3. **Accessibility**: Include accessibility labels and hints
4. **Platform Differences**: Handle iOS/Android input differences
5. **Performance**: Use ScrollView for long forms

---

## 🧩 Mini Tasks

Complete these exercises to practice React Native component composition and navigation:

### Task 1: Mobile Component Composition
Create a `UserDashboard` component that composes smaller mobile components.

**Requirements:**
- Use `UserProfile`, `UserStats`, and `UserActions` components
- Pass user data down through props
- Handle user actions (edit profile, logout) with callbacks
- Use TouchableOpacity for interactive elements

### Task 2: State Lifting with Navigation
Build a `ShoppingCart` component with navigation between screens.

**Requirements:**
- Lift cart state up to parent component
- Allow adding/removing items from different screens
- Update total price automatically
- Use React Navigation for screen transitions

### Task 3: useEffect Data Fetching
Create a `NewsList` component that fetches news articles.

**Requirements:**
- Use useEffect to fetch data on component mount
- Handle loading and error states with ActivityIndicator
- Implement pull-to-refresh functionality
- Handle network connectivity changes

### Task 4: React Navigation Setup
Build a multi-screen application with navigation.

**Requirements:**
- Create Home, News, and Profile screens
- Implement stack navigation between screens
- Use tab navigation for main sections
- Pass data between screens using navigation params

---

## 🚀 Project: Multi-Screen News App

Build a complete news application with multiple screens, React Navigation, and external API integration.

### Features:
- **Home Screen**: Featured articles and categories
- **News List Screen**: Paginated list of all articles
- **Article Detail Screen**: Full article view with related articles
- **Search Screen**: Search functionality across articles
- **Profile Screen**: User preferences and settings
- **Tab Navigation**: Easy navigation between main sections
- **Stack Navigation**: Deep linking to specific articles

### Technical Requirements:
- Use React Navigation for all navigation
- Implement component composition patterns
- Use useEffect for data fetching
- Handle loading and error states
- Implement form handling for search
- Use FlatList for performance
- Handle platform differences (iOS/Android)

### API Integration:
```jsx
// News API service for React Native
const NEWS_API_KEY = 'your-api-key';
const NEWS_API_URL = 'https://newsapi.org/v2';

export const fetchNews = async (category = 'general', page = 1) => {
  try {
    const response = await fetch(
      `${NEWS_API_URL}/top-headlines?category=${category}&page=${page}&apiKey=${NEWS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const searchNews = async (query, page = 1) => {
  try {
    const response = await fetch(
      `${NEWS_API_URL}/everything?q=${query}&page=${page}&apiKey=${NEWS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching news:', error);
    throw error;
  }
};
```

### Project Structure:
```
news-app/
├── src/
│   ├── components/
│   │   ├── Header/
│   │   ├── Navigation/
│   │   ├── ArticleCard/
│   │   ├── ArticleList/
│   │   └── SearchBar/
│   ├── screens/
│   │   ├── HomeScreen/
│   │   ├── NewsListScreen/
│   │   ├── ArticleDetailScreen/
│   │   ├── SearchScreen/
│   │   └── ProfileScreen/
│   ├── navigation/
│   │   ├── AppNavigator.js
│   │   ├── StackNavigator.js
│   │   └── TabNavigator.js
│   ├── services/
│   │   └── newsApi.js
│   └── App.js
```

---

## 📚 Next Steps

Congratulations! You've completed Course 2. Here's what to focus on next:

### Immediate Next Steps:
1. **Complete the News App project** - Apply all concepts learned
2. **Experiment with React Navigation** - Try nested navigators and deep linking
3. **Practice mobile component composition** - Build reusable mobile component libraries

### Prepare for Course 3:
- Learn about async/await and Promises in mobile context
- Understand REST API concepts for mobile apps
- Practice error handling patterns for mobile
- Learn about loading states and mobile UX

### Additional Resources:
- [React Navigation Documentation](https://reactnavigation.org/)
- [React Native Hooks Guide](https://react.dev/reference/react)
- [Mobile Component Patterns](https://reactnative.dev/docs/components-and-apis)
- [Form Handling in React Native](https://reactnative.dev/docs/textinput)

### Key Takeaways:
- ✅ Component composition creates maintainable mobile code
- ✅ Lifting state up enables component communication across screens
- ✅ useEffect handles side effects and mobile data fetching
- ✅ React Navigation enables native mobile navigation patterns
- ✅ Controlled components provide better mobile form control

**Ready for Course 3?** 🚀

Move on to **Course 3: API Integration & Asynchronous Programming** to learn how to work with external data sources and handle asynchronous operations in mobile applications!

---

*Happy mobile coding! Remember, good component design and navigation patterns are the foundation of scalable React Native applications.*