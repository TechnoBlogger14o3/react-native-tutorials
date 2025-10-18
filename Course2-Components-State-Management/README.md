# Course 2: Components & State Management

## 🎯 Goal

Dive deeper into reusable components and state patterns. Learn component composition, React Router for navigation, and advanced state management techniques.

## 📚 What You'll Learn

- Component hierarchy & composition
- Lifting state up
- useEffect & useState hooks
- React Router basics (multi-screen navigation)
- Form handling
- Building a multi-page news application

---

## 🧩 Component Hierarchy & Composition

### Understanding Component Composition

Component composition is the practice of building complex UIs by combining smaller, reusable components. This creates a hierarchy where parent components manage state and pass data down to child components.

```jsx
// Parent component that composes smaller components
function NewsApp() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="news-app">
      <Header />
      <Navigation />
      <ArticleList articles={articles} loading={loading} />
      <Footer />
    </div>
  );
}

// Child components that are composed together
function Header() {
  return (
    <header className="app-header">
      <h1>News App</h1>
      <SearchBar />
    </header>
  );
}
```

### Component Hierarchy Best Practices

1. **Single Responsibility**: Each component should have one clear purpose
2. **Props Down, Events Up**: Data flows down, events bubble up
3. **Composition over Inheritance**: Build complex components by combining simple ones
4. **Container vs Presentational**: Separate logic from presentation

---

## 🔄 Lifting State Up

When multiple components need to share the same state, lift the state up to their common parent component.

### Example: Shared Counter State

```jsx
// Parent component manages shared state
function CounterApp() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <CounterDisplay count={count} />
      <CounterControls 
        count={count} 
        onIncrement={() => setCount(count + 1)}
        onDecrement={() => setCount(count - 1)}
        onReset={() => setCount(0)}
      />
    </div>
  );
}

// Child components receive state and handlers as props
function CounterDisplay({ count }) {
  return <div className="count-display">Count: {count}</div>;
}

function CounterControls({ onIncrement, onDecrement, onReset }) {
  return (
    <div className="controls">
      <button onClick={onIncrement}>+</button>
      <button onClick={onDecrement}>-</button>
      <button onClick={onReset}>Reset</button>
    </div>
  );
}
```

### When to Lift State Up

- Multiple components need the same data
- Components need to communicate with each other
- You need to synchronize state across components
- State changes should trigger updates in multiple places

---

## 🎣 useEffect & useState Hooks

### useEffect Hook

The `useEffect` hook lets you perform side effects in functional components. It's equivalent to `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` combined.

```jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user data when component mounts or userId changes
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
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

  // Cleanup effect
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Timer tick');
    }, 1000);

    return () => {
      clearInterval(timer); // Cleanup function
    };
  }, []); // Empty dependency array = run once

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

### useEffect Patterns

1. **Data Fetching**: Load data when component mounts
2. **Subscriptions**: Set up and clean up event listeners
3. **Timers**: Create and clear intervals/timeouts
4. **DOM Manipulation**: Direct DOM access when needed

### useState Advanced Patterns

```jsx
function TodoApp() {
  // Multiple state variables
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [newTodo, setNewTodo] = useState('');

  // State updater function
  const addTodo = (text) => {
    setTodos(prevTodos => [
      ...prevTodos,
      { id: Date.now(), text, completed: false }
    ]);
  };

  // Complex state updates
  const toggleTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div>
      <TodoForm onAddTodo={addTodo} />
      <TodoFilter filter={filter} onFilterChange={setFilter} />
      <TodoList todos={todos} onToggleTodo={toggleTodo} />
    </div>
  );
}
```

---

## 🧭 React Router Basics

React Router enables client-side routing in React applications, allowing you to create single-page applications with multiple views.

### Basic Setup

```jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
```

### Navigation Components

```jsx
import { useNavigate, useParams, useLocation } from 'react-router-dom';

function NewsArticle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleHome = () => {
    navigate('/'); // Navigate to home
  };

  return (
    <div>
      <button onClick={handleBack}>← Back</button>
      <button onClick={handleHome}>🏠 Home</button>
      <h1>Article {id}</h1>
      <p>Current path: {location.pathname}</p>
    </div>
  );
}
```

### Nested Routes

```jsx
function NewsApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="news" element={<NewsList />} />
          <Route path="news/:id" element={<NewsArticle />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Layout() {
  return (
    <div>
      <Header />
      <Outlet /> {/* Child routes render here */}
      <Footer />
    </div>
  );
}
```

---

## 📝 Form Handling

### Controlled Components

Controlled components have their form data controlled by React state.

```jsx
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    newsletter: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
      alert('Form submitted successfully!');
      
      // Reset form
      setFormData({ name: '', email: '', message: '', newsletter: false });
      setErrors({});
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className={errors.message ? 'error' : ''}
        />
        {errors.message && <span className="error-message">{errors.message}</span>}
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            name="newsletter"
            checked={formData.newsletter}
            onChange={handleChange}
          />
          Subscribe to newsletter
        </label>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

### Form Validation Patterns

1. **Real-time validation**: Validate as user types
2. **Submit validation**: Validate on form submission
3. **Custom validation**: Create reusable validation functions
4. **Error display**: Show clear error messages

---

## 🧩 Mini Tasks

Complete these exercises to practice component composition and state management:

### Task 1: Component Composition
Create a `UserDashboard` component that composes smaller components.

**Requirements:**
- Use `UserProfile`, `UserStats`, and `UserActions` components
- Pass user data down through props
- Handle user actions (edit profile, logout) with callbacks

### Task 2: State Lifting
Build a `ShoppingCart` component with `CartItem` and `CartSummary` children.

**Requirements:**
- Lift cart state up to parent component
- Allow adding/removing items from child components
- Update total price automatically

### Task 3: useEffect Data Fetching
Create a `NewsList` component that fetches news articles.

**Requirements:**
- Use useEffect to fetch data on component mount
- Handle loading and error states
- Implement refresh functionality

### Task 4: React Router Navigation
Build a multi-page application with navigation.

**Requirements:**
- Create Home, About, and Contact pages
- Implement navigation between pages
- Use URL parameters for dynamic content

---

## 🚀 Project: Multi-Page News App

Build a complete news application with multiple pages, routing, and external API integration.

### Features:
- **Home Page**: Featured articles and categories
- **News List**: Paginated list of all articles
- **Article Detail**: Full article view with related articles
- **Search**: Search functionality across articles
- **Categories**: Filter articles by category
- **Responsive Design**: Works on all device sizes

### Technical Requirements:
- Use React Router for navigation
- Implement component composition patterns
- Use useEffect for data fetching
- Handle loading and error states
- Implement form handling for search
- Use the News API (free tier available)

### API Integration:
```jsx
// News API service
const NEWS_API_KEY = 'your-api-key';
const NEWS_API_URL = 'https://newsapi.org/v2';

export const fetchNews = async (category = 'general', page = 1) => {
  const response = await fetch(
    `${NEWS_API_URL}/top-headlines?category=${category}&page=${page}&apiKey=${NEWS_API_KEY}`
  );
  return response.json();
};

export const searchNews = async (query, page = 1) => {
  const response = await fetch(
    `${NEWS_API_URL}/everything?q=${query}&page=${page}&apiKey=${NEWS_API_KEY}`
  );
  return response.json();
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
│   ├── pages/
│   │   ├── Home/
│   │   ├── NewsList/
│   │   ├── ArticleDetail/
│   │   └── Search/
│   ├── services/
│   │   └── newsApi.js
│   └── App.jsx
```

---

## 📚 Next Steps

Congratulations! You've completed Course 2. Here's what to focus on next:

### Immediate Next Steps:
1. **Complete the News App project** - Apply all concepts learned
2. **Experiment with React Router** - Try nested routes and protected routes
3. **Practice component composition** - Build reusable component libraries

### Prepare for Course 3:
- Learn about async/await and Promises
- Understand REST API concepts
- Practice error handling patterns
- Learn about loading states and UX

### Additional Resources:
- [React Router Documentation](https://reactrouter.com/)
- [React Hooks Guide](https://react.dev/reference/react)
- [Component Composition Patterns](https://reactpatterns.com/)
- [Form Handling Best Practices](https://react.dev/reference/react-dom/components/form)

### Key Takeaways:
- ✅ Component composition creates maintainable code
- ✅ Lifting state up enables component communication
- ✅ useEffect handles side effects and data fetching
- ✅ React Router enables single-page application navigation
- ✅ Controlled components provide better form control

**Ready for Course 3?** 🚀

Move on to **Course 3: API Integration & Asynchronous Programming** to learn how to work with external data sources and handle asynchronous operations!

---

*Happy coding! Remember, good component design is the foundation of scalable React applications.*
