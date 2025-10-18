import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';

// Example 1: Basic React Native Components
function BasicComponentsExample() {
  const [message, setMessage] = useState('Welcome to React Native!');

  const handlePress = () => {
    setMessage('Button was pressed!');
  };

  const handleLongPress = () => {
    Alert.alert('Long Press', 'You held the button for a while!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧩 Basic React Native Components</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Text Component</Text>
        <Text style={styles.message}>{message}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TouchableOpacity</Text>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Tap Me!</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TouchableHighlight</Text>
        <TouchableHighlight
          style={styles.button}
          onPress={() => setMessage('Highlight button pressed!')}
          underlayColor="#DDDDDD"
        >
          <Text style={styles.buttonText}>Highlight Me!</Text>
        </TouchableHighlight>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pressable (Modern)</Text>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]}
          onPress={() => setMessage('Pressable button pressed!')}
          onLongPress={handleLongPress}
        >
          {({ pressed }) => (
            <Text style={[styles.buttonText, pressed && styles.textPressed]}>
              {pressed ? 'Pressed!' : 'Press & Hold'}
            </Text>
          )}
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Platform Info</Text>
        <Text style={styles.platformText}>
          Running on: {Platform.OS}
        </Text>
        <Text style={styles.platformText}>
          Version: {Platform.Version}
        </Text>
      </View>
    </View>
  );
}

// Example 2: Styling with StyleSheet
function StylingExample() {
  const [selectedStyle, setSelectedStyle] = useState('default');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f8f9fa',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
      color: '#333',
    },
    section: {
      marginBottom: 30,
      padding: 15,
      backgroundColor: 'white',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 15,
      color: '#007bff',
    },
    flexRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    flexColumn: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    box: {
      width: 60,
      height: 60,
      margin: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    box1: { backgroundColor: '#FF6B6B' },
    box2: { backgroundColor: '#4ECDC4' },
    box3: { backgroundColor: '#45B7D1' },
    box4: { backgroundColor: '#96CEB4' },
    boxText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 12,
    },
    styleButton: {
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
      marginHorizontal: 5,
      marginVertical: 5,
    },
    defaultButton: { backgroundColor: '#6c757d' },
    primaryButton: { backgroundColor: '#007bff' },
    successButton: { backgroundColor: '#28a745' },
    dangerButton: { backgroundColor: '#dc3545' },
    buttonText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 14,
    },
    selectedStyle: {
      backgroundColor: '#ffc107',
    },
    selectedText: {
      color: '#000',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎨 Styling with StyleSheet</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Flexbox Layout - Row</Text>
        <View style={styles.flexRow}>
          <View style={[styles.box, styles.box1]}>
            <Text style={styles.boxText}>1</Text>
          </View>
          <View style={[styles.box, styles.box2]}>
            <Text style={styles.boxText}>2</Text>
          </View>
          <View style={[styles.box, styles.box3]}>
            <Text style={styles.boxText}>3</Text>
          </View>
          <View style={[styles.box, styles.box4]}>
            <Text style={styles.boxText}>4</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Flexbox Layout - Column</Text>
        <View style={styles.flexColumn}>
          <View style={[styles.box, styles.box1]}>
            <Text style={styles.boxText}>A</Text>
          </View>
          <View style={[styles.box, styles.box2]}>
            <Text style={styles.boxText}>B</Text>
          </View>
          <View style={[styles.box, styles.box3]}>
            <Text style={styles.boxText}>C</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dynamic Styling</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <TouchableOpacity
            style={[
              styles.styleButton,
              selectedStyle === 'default' ? styles.defaultButton : styles.defaultButton,
              selectedStyle === 'default' && styles.selectedStyle
            ]}
            onPress={() => setSelectedStyle('default')}
          >
            <Text style={[
              styles.buttonText,
              selectedStyle === 'default' && styles.selectedText
            ]}>
              Default
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.styleButton,
              styles.primaryButton,
              selectedStyle === 'primary' && styles.selectedStyle
            ]}
            onPress={() => setSelectedStyle('primary')}
          >
            <Text style={[
              styles.buttonText,
              selectedStyle === 'primary' && styles.selectedText
            ]}>
              Primary
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.styleButton,
              styles.successButton,
              selectedStyle === 'success' && styles.selectedStyle
            ]}
            onPress={() => setSelectedStyle('success')}
          >
            <Text style={[
              styles.buttonText,
              selectedStyle === 'success' && styles.selectedText
            ]}>
              Success
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.styleButton,
              styles.dangerButton,
              selectedStyle === 'danger' && styles.selectedStyle
            ]}
            onPress={() => setSelectedStyle('danger')}
          >
            <Text style={[
              styles.buttonText,
              selectedStyle === 'danger' && styles.selectedText
            ]}>
              Danger
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={{ marginTop: 10, textAlign: 'center' }}>
          Selected: {selectedStyle}
        </Text>
      </View>
    </View>
  );
}

// Example 3: Props and State
function PropsStateExample() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    isOnline: true,
  });

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  const toggleOnlineStatus = () => {
    setUser(prev => ({ ...prev, isOnline: !prev.isOnline }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Props & State Example</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Counter State</Text>
        <Text style={styles.countText}>Count: {count}</Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.counterButton} onPress={decrement}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.counterButton} onPress={reset}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.counterButton} onPress={increment}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Profile</Text>
        <UserCard 
          user={user} 
          onToggleStatus={toggleOnlineStatus}
        />
      </View>
    </View>
  );
}

// UserCard Component (demonstrates props)
function UserCard({ user, onToggleStatus }) {
  return (
    <View style={styles.userCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
      </View>
      
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusIndicator, 
            { backgroundColor: user.isOnline ? '#4CAF50' : '#F44336' }
          ]} />
          <Text style={styles.statusText}>
            {user.isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.toggleButton} 
          onPress={onToggleStatus}
        >
          <Text style={styles.toggleButtonText}>
            Toggle Status
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Main component that demonstrates all examples
function ReactNativeBasicsExample() {
  const [currentExample, setCurrentExample] = useState('components');

  const renderExample = () => {
    switch (currentExample) {
      case 'components':
        return <BasicComponentsExample />;
      case 'styling':
        return <StylingExample />;
      case 'props-state':
        return <PropsStateExample />;
      default:
        return <BasicComponentsExample />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📱 React Native Basics</Text>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            currentExample === 'components' && styles.activeTab
          ]}
          onPress={() => setCurrentExample('components')}
        >
          <Text style={[
            styles.tabText,
            currentExample === 'components' && styles.activeTabText
          ]}>
            Components
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            currentExample === 'styling' && styles.activeTab
          ]}
          onPress={() => setCurrentExample('styling')}
        >
          <Text style={[
            styles.tabText,
            currentExample === 'styling' && styles.activeTabText
          ]}>
            Styling
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            currentExample === 'props-state' && styles.activeTab
          ]}
          onPress={() => setCurrentExample('props-state')}
        >
          <Text style={[
            styles.tabText,
            currentExample === 'props-state' && styles.activeTabText
          ]}>
            Props & State
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
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#007bff',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#0056b3',
    transform: [{ scale: 0.95 }],
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  textPressed: {
    color: '#ffc107',
  },
  platformText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  countText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  counterButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
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
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  toggleButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 12,
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
    fontSize: 14,
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

export default ReactNativeBasicsExample;
