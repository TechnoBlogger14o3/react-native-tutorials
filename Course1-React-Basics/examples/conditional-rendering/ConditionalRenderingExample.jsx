// conditional-rendering/ConditionalRenderingExample.jsx
import React, { useState } from 'react';

// Basic conditional rendering with if/else
function LoginStatus({ isLoggedIn, user }) {
  if (!isLoggedIn) {
    return (
      <div className="login-prompt">
        <h3>Please log in</h3>
        <p>You need to be logged in to view this content.</p>
        <button>Login</button>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <h3>Welcome back, {user.name}!</h3>
      <p>Email: {user.email}</p>
      <p>Last login: {user.lastLogin}</p>
    </div>
  );
}

// Conditional rendering with ternary operator
function Notification({ message, type, show }) {
  return (
    <div>
      {show ? (
        <div className={`notification ${type}`}>
          {type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'} 
          {message}
        </div>
      ) : null}
    </div>
  );
}

// Conditional rendering with logical AND
function ShoppingCart({ items, onCheckout }) {
  const hasItems = items.length > 0;
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="shopping-cart">
      <h3>Shopping Cart</h3>
      
      {hasItems && (
        <div className="cart-content">
          <p>You have {items.length} items in your cart.</p>
          <p>Total: ${totalPrice.toFixed(2)}</p>
          <button onClick={onCheckout}>Checkout</button>
        </div>
      )}
      
      {!hasItems && (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <p>Add some items to get started!</p>
        </div>
      )}
    </div>
  );
}

// Complex conditional rendering with multiple conditions
function WeatherDisplay({ weather, loading, error }) {
  if (loading) {
    return (
      <div className="weather-loading">
        <div className="spinner"></div>
        <p>Loading weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-error">
        <h3>❌ Error loading weather</h3>
        <p>{error}</p>
        <button>Retry</button>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="weather-no-data">
        <h3>No weather data available</h3>
        <p>Please check your location settings.</p>
      </div>
    );
  }

  return (
    <div className="weather-display">
      <h3>Weather in {weather.city}</h3>
      <div className="weather-info">
        <div className="temperature">
          <span className="temp-value">{weather.temperature}°C</span>
          <span className="temp-feels">Feels like {weather.feelsLike}°C</span>
        </div>
        <div className="weather-details">
          <p>Condition: {weather.condition}</p>
          <p>Humidity: {weather.humidity}%</p>
          <p>Wind: {weather.windSpeed} km/h</p>
        </div>
      </div>
    </div>
  );
}

// Conditional rendering with switch-like pattern
function UserRoleDisplay({ user }) {
  const getRoleContent = (role) => {
    switch (role) {
      case 'admin':
        return (
          <div className="admin-panel">
            <h3>Admin Panel</h3>
            <button>Manage Users</button>
            <button>System Settings</button>
            <button>View Analytics</button>
          </div>
        );
      case 'moderator':
        return (
          <div className="moderator-panel">
            <h3>Moderator Panel</h3>
            <button>Review Content</button>
            <button>Manage Comments</button>
          </div>
        );
      case 'user':
        return (
          <div className="user-panel">
            <h3>User Dashboard</h3>
            <button>View Profile</button>
            <button>Edit Settings</button>
          </div>
        );
      default:
        return (
          <div className="guest-panel">
            <h3>Welcome, Guest!</h3>
            <p>Please log in to access your dashboard.</p>
          </div>
        );
    }
  };

  return getRoleContent(user.role);
}

// Interactive conditional rendering example
function ConditionalRenderingExample() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [cartItems, setCartItems] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = () => {
    const mockUser = {
      name: 'John Doe',
      email: 'john@example.com',
      lastLogin: '2 hours ago',
      role: 'user'
    };
    setUser(mockUser);
    setIsLoggedIn(true);
    showNotification('Successfully logged in!', 'success');
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    showNotification('Logged out successfully', 'info');
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'info' });
    }, 3000);
  };

  const addToCart = () => {
    const newItem = {
      id: Date.now(),
      name: `Item ${cartItems.length + 1}`,
      price: Math.random() * 50 + 10
    };
    setCartItems([...cartItems, newItem]);
    showNotification('Item added to cart!', 'success');
  };

  const clearCart = () => {
    setCartItems([]);
    showNotification('Cart cleared', 'info');
  };

  const loadWeather = () => {
    setLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      if (Math.random() > 0.3) { // 70% success rate
        setWeather({
          city: 'New York',
          temperature: 22,
          feelsLike: 25,
          condition: 'Partly Cloudy',
          humidity: 65,
          windSpeed: 12
        });
      } else {
        setError('Failed to load weather data');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="conditional-rendering-example">
      <h1>Conditional Rendering Examples</h1>
      
      <section>
        <h2>Login Status</h2>
        <LoginStatus isLoggedIn={isLoggedIn} user={user} />
        <div className="auth-buttons">
          {!isLoggedIn ? (
            <button onClick={handleLogin}>Login</button>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
        </div>
      </section>

      <section>
        <h2>Notifications</h2>
        <Notification 
          message={notification.message}
          type={notification.type}
          show={notification.show}
        />
        <div className="notification-buttons">
          <button onClick={() => showNotification('This is an info message', 'info')}>
            Show Info
          </button>
          <button onClick={() => showNotification('This is a success message', 'success')}>
            Show Success
          </button>
          <button onClick={() => showNotification('This is an error message', 'error')}>
            Show Error
          </button>
        </div>
      </section>

      <section>
        <h2>Shopping Cart</h2>
        <ShoppingCart items={cartItems} onCheckout={() => showNotification('Checkout completed!', 'success')} />
        <div className="cart-buttons">
          <button onClick={addToCart}>Add Item</button>
          <button onClick={clearCart}>Clear Cart</button>
        </div>
      </section>

      <section>
        <h2>Weather Display</h2>
        <WeatherDisplay weather={weather} loading={loading} error={error} />
        <button onClick={loadWeather}>Load Weather</button>
      </section>

      <section>
        <h2>User Role Display</h2>
        <UserRoleDisplay user={user || { role: 'guest' }} />
      </section>

      <div className="tips">
        <h3>💡 Conditional Rendering Tips:</h3>
        <ul>
          <li>Use if/else for complex conditions</li>
          <li>Use ternary operator for simple true/false conditions</li>
          <li>Use logical AND (&&) for conditional rendering without else</li>
          <li>Consider using early returns for cleaner code</li>
          <li>Extract complex conditions into separate functions</li>
        </ul>
      </div>
    </div>
  );
}

export default ConditionalRenderingExample;
