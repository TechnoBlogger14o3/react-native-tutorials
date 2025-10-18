import React, { useState } from 'react';

// Example 1: Shared Counter State
function CounterApp() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <div className="counter-app">
      <h2>🔄 State Lifting Example</h2>
      <CounterDisplay count={count} />
      <CounterControls 
        count={count} 
        onIncrement={increment}
        onDecrement={decrement}
        onReset={reset}
      />
      <CounterHistory count={count} />
    </div>
  );
}

// Child components receive state and handlers as props
function CounterDisplay({ count }) {
  const getCountColor = () => {
    if (count > 0) return 'positive';
    if (count < 0) return 'negative';
    return 'neutral';
  };

  return (
    <div className={`count-display ${getCountColor()}`}>
      <h3>Count: {count}</h3>
      <p>Status: {count > 0 ? 'Positive' : count < 0 ? 'Negative' : 'Zero'}</p>
    </div>
  );
}

function CounterControls({ onIncrement, onDecrement, onReset }) {
  return (
    <div className="controls">
      <button onClick={onDecrement} className="decrement-btn">
        ➖ Decrement
      </button>
      <button onClick={onReset} className="reset-btn">
        🔄 Reset
      </button>
      <button onClick={onIncrement} className="increment-btn">
        ➕ Increment
      </button>
    </div>
  );
}

function CounterHistory({ count }) {
  return (
    <div className="counter-history">
      <h4>Current State:</h4>
      <p>Count value: {count}</p>
      <p>Count type: {typeof count}</p>
      <p>Is even: {count % 2 === 0 ? 'Yes' : 'No'}</p>
    </div>
  );
}

// Example 2: Shopping Cart with Lifted State
function ShoppingCartApp() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Laptop', price: 999, quantity: 1 },
    { id: 2, name: 'Mouse', price: 25, quantity: 2 },
    { id: 3, name: 'Keyboard', price: 75, quantity: 1 }
  ]);

  const addItem = (item) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="shopping-cart-app">
      <h2>🛒 Shopping Cart with Lifted State</h2>
      
      <div className="cart-layout">
        <CartItems 
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
        />
        
        <CartSummary 
          totalPrice={getTotalPrice()}
          totalItems={getTotalItems()}
        />
      </div>

      <AddItemForm onAddItem={addItem} />
    </div>
  );
}

function CartItems({ items, onUpdateQuantity, onRemoveItem }) {
  return (
    <div className="cart-items">
      <h3>Cart Items ({items.length})</h3>
      {items.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        items.map(item => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />
        ))
      )}
    </div>
  );
}

function CartItem({ item, onUpdateQuantity, onRemoveItem }) {
  return (
    <div className="cart-item">
      <div className="item-info">
        <h4>{item.name}</h4>
        <p>${item.price} each</p>
      </div>
      
      <div className="quantity-controls">
        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
          ➖
        </button>
        <span className="quantity">{item.quantity}</span>
        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
          ➕
        </button>
      </div>
      
      <div className="item-total">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
      
      <button 
        onClick={() => onRemoveItem(item.id)}
        className="remove-btn"
      >
        🗑️
      </button>
    </div>
  );
}

function CartSummary({ totalPrice, totalItems }) {
  return (
    <div className="cart-summary">
      <h3>Order Summary</h3>
      <div className="summary-line">
        <span>Items ({totalItems}):</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>
      <div className="summary-line">
        <span>Shipping:</span>
        <span>Free</span>
      </div>
      <div className="summary-line total">
        <span><strong>Total:</strong></span>
        <span><strong>${totalPrice.toFixed(2)}</strong></span>
      </div>
      <button className="checkout-btn">
        Proceed to Checkout
      </button>
    </div>
  );
}

function AddItemForm({ onAddItem }) {
  const [formData, setFormData] = useState({
    name: '',
    price: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.price) {
      const newItem = {
        id: Date.now(),
        name: formData.name,
        price: parseFloat(formData.price)
      };
      onAddItem(newItem);
      setFormData({ name: '', price: '' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="add-item-form">
      <h3>Add New Item</h3>
      <input
        type="text"
        name="name"
        placeholder="Item name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        step="0.01"
        min="0"
        required
      />
      <button type="submit">Add to Cart</button>
    </form>
  );
}

// Example 3: Theme Toggle with Lifted State
function ThemeApp() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState({ name: 'John Doe', preferences: {} });

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const updateUserPreference = (key, value) => {
    setUser(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value }
    }));
  };

  return (
    <div className={`theme-app ${theme}`}>
      <h2>🎨 Theme Management with Lifted State</h2>
      
      <ThemeControls 
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      
      <UserProfile 
        user={user}
        theme={theme}
        onUpdatePreference={updateUserPreference}
      />
      
      <ContentArea theme={theme} />
    </div>
  );
}

function ThemeControls({ theme, onToggleTheme }) {
  return (
    <div className="theme-controls">
      <h3>Theme Controls</h3>
      <p>Current theme: <strong>{theme}</strong></p>
      <button onClick={onToggleTheme} className="theme-toggle-btn">
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
      </button>
    </div>
  );
}

function UserProfile({ user, theme, onUpdatePreference }) {
  return (
    <div className="user-profile">
      <h3>User Profile</h3>
      <p>Name: {user.name}</p>
      <p>Theme preference: {theme}</p>
      
      <div className="preferences">
        <label>
          <input
            type="checkbox"
            checked={user.preferences.notifications || false}
            onChange={(e) => onUpdatePreference('notifications', e.target.checked)}
          />
          Enable notifications
        </label>
        
        <label>
          <input
            type="checkbox"
            checked={user.preferences.emailUpdates || false}
            onChange={(e) => onUpdatePreference('emailUpdates', e.target.checked)}
          />
          Email updates
        </label>
      </div>
    </div>
  );
}

function ContentArea({ theme }) {
  return (
    <div className="content-area">
      <h3>Content Area</h3>
      <p>This content adapts to the {theme} theme.</p>
      <div className="sample-content">
        <div className="card">Sample Card 1</div>
        <div className="card">Sample Card 2</div>
        <div className="card">Sample Card 3</div>
      </div>
    </div>
  );
}

// Main component that demonstrates all examples
function StateLiftingExample() {
  const [currentExample, setCurrentExample] = useState('counter');

  return (
    <div className="state-lifting-example">
      <h1>🔄 State Lifting Examples</h1>
      
      <div className="example-selector">
        <button 
          onClick={() => setCurrentExample('counter')}
          className={currentExample === 'counter' ? 'active' : ''}
        >
          Counter App
        </button>
        <button 
          onClick={() => setCurrentExample('cart')}
          className={currentExample === 'cart' ? 'active' : ''}
        >
          Shopping Cart
        </button>
        <button 
          onClick={() => setCurrentExample('theme')}
          className={currentExample === 'theme' ? 'active' : ''}
        >
          Theme Management
        </button>
      </div>

      <div className="example-content">
        {currentExample === 'counter' && <CounterApp />}
        {currentExample === 'cart' && <ShoppingCartApp />}
        {currentExample === 'theme' && <ThemeApp />}
      </div>

      <div className="explanation">
        <h3>Key Concepts Demonstrated:</h3>
        <ul>
          <li><strong>Shared State:</strong> Multiple components access the same state</li>
          <li><strong>Single Source of Truth:</strong> State lives in one place (parent component)</li>
          <li><strong>Props Down:</strong> State is passed down to child components</li>
          <li><strong>Events Up:</strong> Child components communicate changes via callbacks</li>
          <li><strong>State Synchronization:</strong> Changes in one component affect others</li>
        </ul>
      </div>
    </div>
  );
}

export default StateLiftingExample;
