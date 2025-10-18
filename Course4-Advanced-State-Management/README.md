# Course 4: Advanced State Management

## 🎯 Goal

Master state management libraries and patterns for large React applications. Learn Context API, Redux Toolkit, Zustand, and state persistence techniques.

## 📚 What You'll Learn

- Context API
- Redux Toolkit
- Zustand (modern lightweight alternative)
- Middleware & dev tools
- Persisting state (localStorage/sessionStorage)
- Building an e-commerce shopping cart with persistent state

---

## 🎯 Context API

### Creating and Using Context

Context provides a way to pass data through the component tree without having to pass props down manually at every level.

```jsx
import { createContext, useContext, useReducer } from 'react';

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
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
}

function CartSummary() {
  const { cart, totalItems, totalPrice } = useCart();

  return (
    <div className="cart-summary">
      <h3>Cart ({totalItems} items)</h3>
      <p>Total: ${totalPrice.toFixed(2)}</p>
    </div>
  );
}
```

---

## 🏪 Redux Toolkit

### Modern Redux with Redux Toolkit

Redux Toolkit simplifies Redux development with less boilerplate and better patterns.

```jsx
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

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
      <div className="app">
        <Header />
        <ProductList />
        <CartSidebar />
      </div>
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
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}

function CartSidebar() {
  const { items, totalItems, totalPrice } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  return (
    <div className="cart-sidebar">
      <h3>Cart ({totalItems} items)</h3>
      {items.map(item => (
        <div key={item.id} className="cart-item">
          <span>{item.name}</span>
          <span>Qty: {item.quantity}</span>
          <button onClick={() => dispatch(removeFromCart(item.id))}>
            Remove
          </button>
        </div>
      ))}
      <p>Total: ${totalPrice.toFixed(2)}</p>
      <button onClick={() => dispatch(clearCart())}>
        Clear Cart
      </button>
    </div>
  );
}
```

---

## 🐻 Zustand

### Lightweight State Management

Zustand is a small, fast, and scalable state management solution.

```jsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Create store
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
      name: 'cart-storage', // unique name for localStorage key
    }
  )
);

// Component using Zustand
function ProductCard({ product }) {
  const addToCart = useCartStore(state => state.addToCart);

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
}

function CartSummary() {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity } = useCartStore();

  return (
    <div className="cart-summary">
      <h3>Cart ({totalItems} items)</h3>
      {items.map(item => (
        <div key={item.id} className="cart-item">
          <span>{item.name}</span>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
            min="1"
          />
          <button onClick={() => removeFromCart(item.id)}>
            Remove
          </button>
        </div>
      ))}
      <p>Total: ${totalPrice.toFixed(2)}</p>
    </div>
  );
}
```

---

## 💾 State Persistence

### localStorage and sessionStorage

```jsx
import { useState, useEffect } from 'react';

// Custom hook for localStorage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// Usage example
function UserPreferences() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'en');

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
      </select>
    </div>
  );
}
```

---

## 🧩 Mini Tasks

### Task 1: Context API Shopping Cart
Create a shopping cart using Context API with add/remove/update functionality.

### Task 2: Redux Toolkit Counter
Build a counter app with Redux Toolkit including increment, decrement, and reset actions.

### Task 3: Zustand Todo App
Create a todo application using Zustand with persistence.

### Task 4: State Persistence
Implement localStorage persistence for user preferences and settings.

---

## 🚀 Project: E-commerce Shopping Cart

Build a complete e-commerce shopping cart with persistent state management.

### Features:
- Product catalog with categories
- Shopping cart with add/remove/update
- User authentication state
- Order history
- Wishlist functionality
- Persistent cart across sessions
- Responsive design

### Technical Requirements:
- Choose one state management solution (Context, Redux, or Zustand)
- Implement state persistence
- Handle loading and error states
- Use React Router for navigation
- Implement form validation

### State Structure:
```jsx
// Example state structure
{
  user: {
    isAuthenticated: false,
    profile: null,
    preferences: {}
  },
  cart: {
    items: [],
    totalItems: 0,
    totalPrice: 0
  },
  products: {
    items: [],
    categories: [],
    loading: false,
    error: null
  },
  orders: {
    history: [],
    currentOrder: null
  }
}
```

---

## 📚 Next Steps

### Prepare for Course 5:
- Learn about service workers
- Understand code splitting concepts
- Practice performance optimization
- Learn about caching strategies

### Key Takeaways:
- ✅ Context API is great for simple state sharing
- ✅ Redux Toolkit reduces boilerplate significantly
- ✅ Zustand provides a lightweight alternative
- ✅ State persistence improves user experience
- ✅ Choose the right tool for your project size

**Ready for Course 5?** 🚀

Move on to **Course 5: Offline Support & Optimization** to learn about performance optimization and offline capabilities!

---

*Happy coding! Remember, good state management is crucial for scalable applications.*
