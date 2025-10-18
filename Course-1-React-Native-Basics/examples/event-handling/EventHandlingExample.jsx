import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';

// Example 1: Basic Touch Events
function BasicTouchEvents() {
  const [message, setMessage] = useState('Tap the buttons below!');
  const [pressCount, setPressCount] = useState(0);

  const handlePress = () => {
    setPressCount(prev => prev + 1);
    setMessage(`Button pressed ${pressCount + 1} times!`);
  };

  const handleLongPress = () => {
    Alert.alert('Long Press', 'You held the button for a while!');
  };

  const handlePressIn = () => {
    setMessage('Button is being pressed...');
  };

  const handlePressOut = () => {
    setMessage('Button was released!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👆 Basic Touch Events</Text>
      
      <View style={styles.messageContainer}>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.counter}>Press Count: {pressCount}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>TouchableOpacity</Text>
        </TouchableOpacity>

        <TouchableHighlight
          style={styles.button}
          onPress={() => setMessage('Highlight button pressed!')}
          onLongPress={handleLongPress}
          underlayColor="#DDDDDD"
        >
          <Text style={styles.buttonText}>TouchableHighlight</Text>
        </TouchableHighlight>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]}
          onPress={() => setMessage('Pressable button pressed!')}
        >
          {({ pressed }) => (
            <Text style={[styles.buttonText, pressed && styles.textPressed]}>
              {pressed ? 'Pressed!' : 'Pressable'}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

// Example 2: Form Handling
function FormHandling() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    newsletter: false,
  });
  const [errors, setErrors] = useState({});

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

  const handleSubmit = () => {
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    Alert.alert(
      'Form Submitted',
      `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}\nNewsletter: ${formData.newsletter ? 'Yes' : 'No'}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setFormData({ name: '', email: '', message: '', newsletter: false });
            setErrors({});
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Form Handling</Text>
      
      <ScrollView style={styles.formContainer}>
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

        <View style={styles.checkboxGroup}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => handleInputChange('newsletter', !formData.newsletter)}
          >
            <View style={[styles.checkboxBox, formData.newsletter && styles.checkboxChecked]}>
              {formData.newsletter && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Subscribe to newsletter</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Form</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// Example 3: Gesture Handling
function GestureHandling() {
  const [gestureLog, setGestureLog] = useState([]);
  const [swipeDirection, setSwipeDirection] = useState('');

  const addToLog = (gesture) => {
    const timestamp = new Date().toLocaleTimeString();
    setGestureLog(prev => [
      { id: Date.now(), gesture, timestamp },
      ...prev.slice(0, 4) // Keep only last 5 entries
    ]);
  };

  const handleSwipe = (direction) => {
    setSwipeDirection(direction);
    addToLog(`Swipe ${direction}`);
  };

  const handleDoubleTap = () => {
    addToLog('Double Tap');
  };

  const handleTripleTap = () => {
    addToLog('Triple Tap');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🤏 Gesture Handling</Text>
      
      <View style={styles.gestureArea}>
        <Text style={styles.gestureTitle}>Gesture Detection Area</Text>
        <Text style={styles.swipeIndicator}>
          {swipeDirection ? `Last swipe: ${swipeDirection}` : 'Swipe in any direction'}
        </Text>
        
        <View style={styles.gestureButtons}>
          <TouchableOpacity
            style={styles.gestureButton}
            onPress={() => addToLog('Single Tap')}
          >
            <Text style={styles.gestureButtonText}>Single Tap</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.gestureButton}
            onPress={handleDoubleTap}
          >
            <Text style={styles.gestureButtonText}>Double Tap</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.gestureButton}
            onPress={handleTripleTap}
          >
            <Text style={styles.gestureButtonText}>Triple Tap</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.logContainer}>
        <Text style={styles.logTitle}>Gesture Log:</Text>
        {gestureLog.length === 0 ? (
          <Text style={styles.noLogs}>No gestures detected yet</Text>
        ) : (
          gestureLog.map(item => (
            <View key={item.id} style={styles.logItem}>
              <Text style={styles.logGesture}>{item.gesture}</Text>
              <Text style={styles.logTime}>{item.timestamp}</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

// Example 4: Platform-Specific Events
function PlatformSpecificEvents() {
  const [platformInfo, setPlatformInfo] = useState({
    os: Platform.OS,
    version: Platform.Version,
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
  });

  const handlePlatformAction = () => {
    if (Platform.OS === 'ios') {
      Alert.alert('iOS Action', 'This is an iOS-specific action!');
    } else if (Platform.OS === 'android') {
      Alert.alert('Android Action', 'This is an Android-specific action!');
    }
  };

  const handleHapticFeedback = () => {
    if (Platform.OS === 'ios') {
      // iOS haptic feedback would go here
      Alert.alert('Haptic Feedback', 'iOS haptic feedback triggered!');
    } else {
      Alert.alert('Vibration', 'Android vibration triggered!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📱 Platform-Specific Events</Text>
      
      <View style={styles.platformInfo}>
        <Text style={styles.platformTitle}>Platform Information:</Text>
        <Text style={styles.platformText}>OS: {platformInfo.os}</Text>
        <Text style={styles.platformText}>Version: {platformInfo.version}</Text>
        <Text style={styles.platformText}>
          Type: {platformInfo.isIOS ? 'iOS' : platformInfo.isAndroid ? 'Android' : 'Unknown'}
        </Text>
      </View>

      <View style={styles.platformButtons}>
        <TouchableOpacity
          style={[
            styles.platformButton,
            platformInfo.isIOS ? styles.iosButton : styles.androidButton
          ]}
          onPress={handlePlatformAction}
        >
          <Text style={styles.platformButtonText}>
            {platformInfo.isIOS ? 'iOS Action' : 'Android Action'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.platformButton}
          onPress={handleHapticFeedback}
        >
          <Text style={styles.platformButtonText}>
            {platformInfo.isIOS ? 'Haptic Feedback' : 'Vibration'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Main component that demonstrates all examples
function EventHandlingExample() {
  const [currentExample, setCurrentExample] = useState('touch');

  const renderExample = () => {
    switch (currentExample) {
      case 'touch':
        return <BasicTouchEvents />;
      case 'form':
        return <FormHandling />;
      case 'gesture':
        return <GestureHandling />;
      case 'platform':
        return <PlatformSpecificEvents />;
      default:
        return <BasicTouchEvents />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Event Handling Examples</Text>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, currentExample === 'touch' && styles.activeTab]}
          onPress={() => setCurrentExample('touch')}
        >
          <Text style={[styles.tabText, currentExample === 'touch' && styles.activeTabText]}>
            Touch Events
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, currentExample === 'form' && styles.activeTab]}
          onPress={() => setCurrentExample('form')}
        >
          <Text style={[styles.tabText, currentExample === 'form' && styles.activeTabText]}>
            Form Handling
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, currentExample === 'gesture' && styles.activeTab]}
          onPress={() => setCurrentExample('gesture')}
        >
          <Text style={[styles.tabText, currentExample === 'gesture' && styles.activeTabText]}>
            Gestures
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
  messageContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  counter: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    gap: 15,
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 15,
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
  inputError: {
    borderColor: '#dc3545',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
    height: 100,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: 5,
  },
  checkboxGroup: {
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  gestureArea: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  gestureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  swipeIndicator: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  gestureButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  gestureButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 6,
  },
  gestureButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  logContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  noLogs: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logGesture: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  logTime: {
    fontSize: 12,
    color: '#999',
  },
  platformInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  platformTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  platformText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  platformButtons: {
    paddingHorizontal: 20,
    gap: 15,
  },
  platformButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  iosButton: {
    backgroundColor: '#007AFF',
  },
  androidButton: {
    backgroundColor: '#4CAF50',
  },
  platformButtonText: {
    color: 'white',
    fontSize: 16,
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

export default EventHandlingExample;