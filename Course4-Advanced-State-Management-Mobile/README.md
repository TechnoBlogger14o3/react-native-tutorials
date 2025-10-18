# Course 4: Advanced State Management

## 🎯 Goal

Master state management libraries and patterns for large React Native applications. Learn Context API, Redux Toolkit, Zustand, and AsyncStorage for mobile state persistence.

## 📚 What You'll Learn

- Context API for mobile apps
- Redux Toolkit for React Native
- Zustand (modern lightweight alternative)
- AsyncStorage for mobile persistence
- Middleware & dev tools
- Building an e-commerce shopping cart with persistent state

---

## 🎯 Context API for Mobile

### Creating and Using Context in React Native

Context provides a way to pass data through the component tree without having to pass props down manually at every level.

```jsx
import React, { createContext, useContext, useReducer } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Create context
const CartContext = createContext();

// Context provider component
function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use context
function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Reducer function
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];

    case 'REMOVE_FROM_CART':
      return state.filter(item => item.id !== action.payload);

    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
}

// Usage in components
function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <View style={styles.productCard}>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>${product.price}</Text>
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => addToCart(product)}
      >
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

function CartSummary() {
  const { cart, totalItems, totalPrice } = useCart();

  return (
    <View style={styles.cartSummary}>
      <Text style={styles.cartTitle}>Cart ({totalItems} items)</Text>
      <Text style={styles.cartTotal}>Total: ${totalPrice.toFixed(2)}</Text>
    </View>
  );
}
```

---

## 🏪 Redux Toolkit for React Native

### Modern Redux with Redux Toolkit

Redux Toolkit simplifies Redux development with less boilerplate and better patterns for mobile applications.

```jsx
import React from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

// Create slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalItems: 0,
    totalPrice: 0
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.id === productId);
      
      if (item) {
        item.quantity = quantity;
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== productId);
        }
      }
      
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    }
  }
});

// Configure store
const store = configureStore({
  reducer: {
    cart: cartSlice.reducer
  }
});

// Export actions
export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// App component
function App() {
  return (
    <Provider store={store}>
      <View style={styles.app}>
        <Header />
        <ProductList />
        <CartSidebar />
      </View>
    </Provider>
  );
}

// Component using Redux
function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <View style={styles.productCard}>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>${product.price}</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

function CartSidebar() {
  const { items, totalItems, totalPrice } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  return (
    <View style={styles.cartSidebar}>
      <Text style={styles.cartTitle}>Cart ({totalItems} items)</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.cartItemName}>{item.name}</Text>
            <Text style={styles.cartItemQty}>Qty: {item.quantity}</Text>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => dispatch(removeFromCart(item.id))}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Text style={styles.cartTotal}>Total: ${totalPrice.toFixed(2)}</Text>
      <TouchableOpacity 
        style={styles.clearButton}
        onPress={() => dispatch(clearCart())}
      >
        <Text style={styles.clearButtonText}>Clear Cart</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## 🐻 Zustand for React Native

### Lightweight State Management

Zustand is a small, fast, and scalable state management solution perfect for React Native applications.

```jsx
import React from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

// Create store with AsyncStorage persistence
const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addToCart: (product) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id);
          
          if (existingItem) {
            const updatedItems = state.items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
            
            return {
              items: updatedItems,
              totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
              totalPrice: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
          } else {
            const newItems = [...state.items, { ...product, quantity: 1 }];
            return {
              items: newItems,
              totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
              totalPrice: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
          }
        });
      },

      removeFromCart: (productId) => {
        set((state) => {
          const newItems = state.items.filter(item => item.id !== productId);
          return {
            items: newItems,
            totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return get().removeFromCart(productId);
          }
          
          const updatedItems = state.items.map(item =>
            item.id === productId ? { ...item, quantity } : item
          );
          
          return {
            items: updatedItems,
            totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
          };
        });
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 });
      }
    }),
    {
      name: 'cart-storage', // unique name for AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Component using Zustand
function ProductCard({ product }) {
  const addToCart = useCartStore(state => state.addToCart);

  return (
    <View style={styles.productCard}>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>${product.price}</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => addToCart(product)}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

function CartSummary() {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity } = useCartStore();

  return (
    <View style={styles.cartSummary}>
      <Text style={styles.cartTitle}>Cart ({totalItems} items)</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.cartItemName}>{item.name}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => removeFromCart(item.id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Text style={styles.cartTotal}>Total: ${totalPrice.toFixed(2)}</Text>
    </View>
  );
}
```

---

## 💾 AsyncStorage for Mobile Persistence

### AsyncStorage Integration

AsyncStorage is React Native's equivalent to localStorage, providing persistent storage for mobile applications.

```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom hook for AsyncStorage
function useAsyncStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        const item = await AsyncStorage.getItem(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error(`Error reading AsyncStorage key "${key}":`, error);
        Alert.alert('Error', 'Failed to load saved data');
      } finally {
        setLoading(false);
      }
    };

    loadStoredValue();
  }, [key]);

  const setValue = async (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting AsyncStorage key "${key}":`, error);
      Alert.alert('Error', 'Failed to save data');
    }
  };

  return [storedValue, setValue, loading];
}

// Usage example
function UserPreferences() {
  const [theme, setTheme] = useAsyncStorage('theme', 'light');
  const [language, setLanguage] = useAsyncStorage('language', 'en');
  const [notifications, setNotifications] = useAsyncStorage('notifications', true);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading preferences...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Preferences</Text>
      
      <View style={styles.settingGroup}>
        <Text style={styles.settingLabel}>Theme:</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={[styles.themeButton, theme === 'light' && styles.activeButton]}
            onPress={() => setTheme('light')}
          >
            <Text style={[styles.buttonText, theme === 'light' && styles.activeButtonText]}>
              Light
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.themeButton, theme === 'dark' && styles.activeButton]}
            onPress={() => setTheme('dark')}
          >
            <Text style={[styles.buttonText, theme === 'dark' && styles.activeButtonText]}>
              Dark
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.settingGroup}>
        <Text style={styles.settingLabel}>Language:</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={[styles.languageButton, language === 'en' && styles.activeButton]}
            onPress={() => setLanguage('en')}
          >
            <Text style={[styles.buttonText, language === 'en' && styles.activeButtonText]}>
              English
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.languageButton, language === 'es' && styles.activeButton]}
            onPress={() => setLanguage('es')}
          >
            <Text style={[styles.buttonText, language === 'es' && styles.activeButtonText]}>
              Spanish
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.languageButton, language === 'fr' && styles.activeButton]}
            onPress={() => setLanguage('fr')}
          >
            <Text style={[styles.buttonText, language === 'fr' && styles.activeButtonText]}>
              French
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.settingGroup}>
        <Text style={styles.settingLabel}>Notifications:</Text>
        <TouchableOpacity 
          style={[styles.notificationButton, notifications && styles.activeButton]}
          onPress={() => setNotifications(!notifications)}
        >
          <Text style={[styles.buttonText, notifications && styles.activeButtonText]}>
            {notifications ? 'Enabled' : 'Disabled'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Advanced AsyncStorage patterns
class StorageManager {
  static async saveUserData(userData) {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  }

  static async getUserData() {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  static async clearAllData() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }

  static async getStorageSize() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;
      
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        totalSize += value ? value.length : 0;
      }
      
      return totalSize;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  }
}
```

---

## 🧩 Mini Tasks

### Task 1: Context API Shopping Cart
Create a shopping cart using Context API with add/remove/update functionality for mobile.

**Requirements:**
- Use Context API for state management
- Implement cart operations (add, remove, update quantity)
- Display cart items in FlatList
- Show total items and price
- Use TouchableOpacity for interactions
- Handle empty cart state

### Task 2: Redux Toolkit Counter
Build a counter app with Redux Toolkit including increment, decrement, and reset actions.

**Requirements:**
- Use Redux Toolkit for state management
- Implement counter actions (increment, decrement, reset)
- Display current count with large, readable text
- Use TouchableOpacity buttons
- Show action history
- Implement undo/redo functionality

### Task 3: Zustand Todo App
Create a todo application using Zustand with AsyncStorage persistence.

**Requirements:**
- Use Zustand for state management
- Implement CRUD operations for todos
- Persist todos using AsyncStorage
- Add todo categories and filtering
- Implement search functionality
- Use FlatList for todo display

### Task 4: AsyncStorage User Settings
Implement AsyncStorage persistence for user preferences and settings.

**Requirements:**
- Create custom AsyncStorage hooks
- Save user preferences (theme, language, notifications)
- Implement data migration for app updates
- Handle storage errors gracefully
- Add data export/import functionality
- Implement storage cleanup

---

## 🚀 Project: E-commerce Shopping Cart

Build a complete e-commerce shopping cart with persistent state management for mobile.

### Features:
- Product catalog with categories and search
- Shopping cart with add/remove/update functionality
- User authentication state management
- Order history with AsyncStorage persistence
- Wishlist functionality
- Persistent cart across app sessions
- Offline cart functionality
- Push notifications for cart reminders

### Technical Requirements:
- Choose one state management solution (Context, Redux, or Zustand)
- Implement AsyncStorage for persistence
- Handle loading and error states
- Use React Navigation for screen navigation
- Implement form validation for checkout
- Handle network connectivity changes
- Implement deep linking for product sharing

### Mobile-Specific Considerations:
- Optimize for different screen sizes
- Handle app lifecycle events (background/foreground)
- Implement haptic feedback for interactions
- Use platform-specific UI patterns
- Handle memory constraints
- Implement proper error boundaries

### State Structure:
```jsx
// Example state structure for mobile e-commerce app
{
  user: {
    isAuthenticated: false,
    profile: null,
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: true
    }
  },
  cart: {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    lastUpdated: null
  },
  products: {
    items: [],
    categories: [],
    searchResults: [],
    loading: false,
    error: null,
    lastFetch: null
  },
  orders: {
    history: [],
    currentOrder: null,
    loading: false
  },
  wishlist: {
    items: [],
    totalItems: 0
  },
  app: {
    isOnline: true,
    lastSync: null,
    version: '1.0.0'
  }
}
```

---

## 📚 Next Steps

### Prepare for Course 5:
- Learn about React Native performance optimization
- Understand code splitting and lazy loading
- Practice with React Native debugging tools
- Learn about mobile-specific caching strategies
- Understand app bundle optimization

### Additional Resources:
- [React Native Performance](https://reactnative.dev/docs/performance)
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

### Key Takeaways:
- ✅ Context API is great for simple state sharing in mobile apps
- ✅ Redux Toolkit reduces boilerplate significantly for complex apps
- ✅ Zustand provides a lightweight alternative with AsyncStorage integration
- ✅ AsyncStorage enables persistent state across app sessions
- ✅ Choose the right state management tool based on app complexity
- ✅ Mobile state management requires consideration of app lifecycle

**Ready for Course 5?** 🚀

Move on to **Course 5: Offline Support & Optimization** to learn about performance optimization and offline capabilities for React Native applications!

---

*Happy mobile coding! Remember, good state management is crucial for scalable React Native applications.*