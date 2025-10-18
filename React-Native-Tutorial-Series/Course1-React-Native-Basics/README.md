# Course 1: React Native Basics

## 🎯 Goal

Understand the core principles of React Native and build your first mobile applications. By the end of this course, you'll be comfortable with React Native components, styling, props, state, and touch events.

## 📚 What You'll Learn

- Introduction to React Native & mobile development
- React Native components (View, Text, TouchableOpacity, etc.)
- Styling with StyleSheet and Flexbox
- Props & State in mobile context
- Touch events and gestures
- Platform-specific code
- Building your first mobile apps

---

## 📱 Introduction to React Native

### What is React Native?

React Native is a framework for building native mobile applications using React. It allows you to write JavaScript code that runs on both iOS and Android platforms.

**Key Features:**
- **Cross-platform**: Write once, run on both iOS and Android
- **Native Performance**: Uses native components under the hood
- **Hot Reloading**: See changes instantly during development
- **Rich Ecosystem**: Access to native device features

### React Native vs React Web

| Feature | React Web | React Native |
|---------|-----------|--------------|
| Components | `div`, `span`, `button` | `View`, `Text`, `TouchableOpacity` |
| Styling | CSS | StyleSheet with Flexbox |
| Navigation | React Router | React Navigation |
| Storage | localStorage | AsyncStorage |
| Networking | fetch API | fetch API (same) |

---

## 🧩 React Native Components

### Core Components

React Native provides a set of core components that map to native UI elements:

```jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function BasicComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello React Native!</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Tap Me!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BasicComponent;
```

### Component Hierarchy

```jsx
// Parent component
function App() {
  return (
    <View style={styles.app}>
      <Header />
      <Content />
      <Footer />
    </View>
  );
}

// Child components
function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>My App</Text>
    </View>
  );
}

function Content() {
  return (
    <View style={styles.content}>
      <Text>Main content goes here</Text>
    </View>
  );
}

function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>Footer</Text>
    </View>
  );
}
```

---

## 🎨 Styling with StyleSheet

### StyleSheet vs CSS

React Native uses StyleSheet for styling, which is similar to CSS but optimized for mobile:

```jsx
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,                    // Equivalent to flex: 1
    backgroundColor: '#fff',    // background-color
    padding: 20,                // padding
    marginTop: 10,              // margin-top
  },
  text: {
    fontSize: 16,               // font-size
    color: '#333',             // color
    fontWeight: 'bold',       // font-weight
    textAlign: 'center',       // text-align
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,     // padding-left + padding-right
    paddingVertical: 10,       // padding-top + padding-bottom
    borderRadius: 8,           // border-radius
    marginTop: 10,
  },
});
```

### Flexbox Layout

React Native uses Flexbox for layout (no CSS Grid):

```jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',    // row, column
    justifyContent: 'center',   // flex-start, center, flex-end, space-between, space-around
    alignItems: 'center',       // flex-start, center, flex-end, stretch
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item: {
    flex: 1,                   // flex-grow
    marginHorizontal: 5,       // margin-left + margin-right
  },
});
```

---

## 📦 Props & State in Mobile Context

### Props (Properties)

Props work the same way in React Native as in React web:

```jsx
// UserCard component
function UserCard({ user, isOnline, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <View style={[styles.status, { backgroundColor: isOnline ? '#4CAF50' : '#F44336' }]}>
          <Text style={styles.statusText}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Usage
const user = { name: 'John Doe', email: 'john@example.com' };
<UserCard 
  user={user} 
  isOnline={true} 
  onPress={() => console.log('User tapped!')}
/>
```

### State with useState Hook

State management is identical to React web:

```jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <View style={styles.container}>
      <Text style={styles.countText}>Count: {count}</Text>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={decrement}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={reset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={increment}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
```

---

## 👆 Touch Events and Gestures

### TouchableOpacity

The most common component for handling touch events:

```jsx
import { TouchableOpacity } from 'react-native';

function TouchExample() {
  const handlePress = () => {
    console.log('Button pressed!');
  };

  const handleLongPress = () => {
    console.log('Button long pressed!');
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={0.7}  // Opacity when pressed
    >
      <Text style={styles.buttonText}>Press Me</Text>
    </TouchableOpacity>
  );
}
```

### TouchableHighlight

Provides a highlight effect when pressed:

```jsx
import { TouchableHighlight } from 'react-native';

function HighlightExample() {
  return (
    <TouchableHighlight
      style={styles.button}
      onPress={() => console.log('Pressed')}
      underlayColor="#DDDDDD"  // Color when pressed
    >
      <Text style={styles.buttonText}>Highlight Button</Text>
    </TouchableHighlight>
  );
}
```

### Pressable (Modern Approach)

The newer, more flexible component for touch handling:

```jsx
import { Pressable } from 'react-native';

function PressableExample() {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed
      ]}
      onPress={() => console.log('Pressed')}
    >
      {({ pressed }) => (
        <Text style={[styles.buttonText, pressed && styles.textPressed]}>
          {pressed ? 'Pressed!' : 'Press Me'}
        </Text>
      )}
    </Pressable>
  );
}
```

---

## 📱 Platform-Specific Code

### Platform Detection

```jsx
import { Platform } from 'react-native';

function PlatformExample() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Running on: {Platform.OS}
      </Text>
      
      {Platform.OS === 'ios' && (
        <Text style={styles.iosText}>iOS specific content</Text>
      )}
      
      {Platform.OS === 'android' && (
        <Text style={styles.androidText}>Android specific content</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  iosText: {
    color: '#007AFF',
    fontSize: 16,
  },
  androidText: {
    color: '#4CAF50',
    fontSize: 16,
  },
});
```

### Platform-Specific Styles

```jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 44 : 24,  // Status bar height
  },
  button: {
    backgroundColor: Platform.OS === 'ios' ? '#007AFF' : '#2196F3',
    borderRadius: Platform.OS === 'ios' ? 8 : 4,
  },
});
```

---

## 🧩 Mini Tasks

Complete these exercises to practice React Native basics:

### Task 1: Mobile Greeting Component
Create a component that displays a personalized greeting with mobile-optimized styling.

**Requirements:**
- Accept `name` and `timeOfDay` props
- Display "Good morning", "Good afternoon", or "Good evening" based on `timeOfDay`
- Use TouchableOpacity for interaction
- Apply mobile-friendly styling

### Task 2: Interactive Counter
Build a counter component with touch-friendly buttons.

**Requirements:**
- Display current count with large, readable text
- TouchableOpacity buttons for increment (+1), decrement (-1), and reset (0)
- Add a "Double" button that multiplies count by 2
- Prevent negative numbers
- Use appropriate button sizes for mobile

### Task 3: Todo Item Component
Create a component for individual todo items with mobile interactions.

**Requirements:**
- Display todo text with proper typography
- Show completion status with visual indicators
- TouchableOpacity to toggle completion
- Delete button with confirmation
- Different styling for completed vs incomplete items

### Task 4: Weather Display
Build a component that shows weather information in a mobile-friendly format.

**Requirements:**
- Accept weather data as props (temperature, condition, city)
- Display temperature in large, readable text
- Show appropriate weather icon/emoji
- Handle missing data gracefully
- Use mobile-optimized layout

---

## 🚀 Projects

### Project 1: Calculator App

Build a fully functional calculator optimized for mobile devices.

**Features:**
- Number input (0-9) with large touch targets
- Basic operations (+, -, ×, ÷)
- Clear and equals functionality
- Display current number and operation
- Handle decimal numbers
- Error handling for division by zero
- Responsive layout for different screen sizes

**Technical Requirements:**
- Use React Native components (View, Text, TouchableOpacity)
- Implement proper state management
- Handle touch events with TouchableOpacity
- Use StyleSheet for mobile-optimized styling
- Test on both iOS and Android

### Project 2: Counter App

Create an enhanced counter application with mobile-specific features.

**Features:**
- Increment/decrement buttons with haptic feedback
- Reset functionality
- Step size selector (1, 5, 10, 25)
- Counter history (show last 5 operations)
- Color-coded positive/negative numbers
- Save/load counter value from AsyncStorage
- Share counter value functionality

**Technical Requirements:**
- Use useState for multiple state variables
- Implement array operations for history
- Use AsyncStorage for persistence
- Apply conditional styling based on counter value
- Use Platform-specific features

---

## 📚 Next Steps

Congratulations! You've completed the React Native Basics course. Here's what to focus on next:

### Immediate Next Steps:
1. **Complete both projects** - Don't skip the hands-on practice
2. **Test on real devices** - Use both iOS and Android devices/simulators
3. **Experiment with styling** - Try different layouts and animations

### Prepare for Course 2:
- Review React Navigation basics
- Learn about mobile navigation patterns
- Understand component composition for mobile
- Practice with different screen sizes

### Additional Resources:
- [React Native Official Documentation](https://reactnative.dev/)
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Expo](https://expo.dev/) - Development platform for React Native
- [React Native Elements](https://reactnativeelements.com/) - UI component library

### Key Takeaways:
- ✅ React Native components map to native UI elements
- ✅ StyleSheet provides mobile-optimized styling
- ✅ TouchableOpacity handles touch interactions
- ✅ Platform-specific code enables native features
- ✅ Flexbox is the primary layout system

**Ready for Course 2?** 🚀

Move on to **Course 2: Components & Navigation** to learn about component composition, React Navigation, and building multi-screen mobile applications!

---

*Happy mobile coding! Remember, the best way to learn React Native is by building projects and testing on real devices.*
