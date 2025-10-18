# Course 1: React Basics

## 🎯 Goal

Understand the core principles of React and build your first interactive applications. By the end of this course, you'll be comfortable with JSX, functional components, props, state, and event handling.

## 📚 What You'll Learn

- Introduction to React & JSX
- Functional components
- Props & State
- Event handling
- Conditional rendering
- Lists and keys
- Building your first React apps

---

## 🚀 Introduction to React & JSX

### What is React?

React is a JavaScript library for building user interfaces, particularly web applications. It was created by Facebook and is now maintained by Meta and the community.

**Key Features:**
- **Component-based**: Build encapsulated components that manage their own state
- **Declarative**: Describe what the UI should look like for any given state
- **Learn Once, Write Anywhere**: Can be used for web, mobile, and desktop apps

### What is JSX?

JSX is a syntax extension for JavaScript that looks similar to HTML. It allows you to write HTML-like code in your JavaScript files.

```jsx
// This is JSX
const element = <h1>Hello, World!</h1>;

// This is equivalent to:
const element = React.createElement('h1', null, 'Hello, World!');
```

**JSX Rules:**
1. Always return a single parent element (or use React.Fragment)
2. Use camelCase for HTML attributes (`className` instead of `class`)
3. Self-closing tags must end with `/>`
4. Use curly braces `{}` for JavaScript expressions

---

## 🧩 Functional Components

Functional components are JavaScript functions that return JSX. They're the modern way to write React components.

### Basic Functional Component

```jsx
// Greeting.jsx
function Greeting() {
  return <h1>Hello, React!</h1>;
}

// Arrow function version
const Greeting = () => {
  return <h1>Hello, React!</h1>;
};

// With implicit return
const Greeting = () => <h1>Hello, React!</h1>;

export default Greeting;
```

### Component with Props

```jsx
// Welcome.jsx
function Welcome({ name, age }) {
  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}

// Usage
<Welcome name="Alice" age={25} />
```

---

## 📦 Props & State

### Props (Properties)

Props are how you pass data from parent to child components. They are read-only and cannot be modified by the child component.

```jsx
// UserCard.jsx
function UserCard({ user, isOnline }) {
  return (
    <div className={`user-card ${isOnline ? 'online' : 'offline'}`}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <span>{isOnline ? '🟢 Online' : '🔴 Offline'}</span>
    </div>
  );
}

// Usage
const user = { name: 'John Doe', email: 'john@example.com' };
<UserCard user={user} isOnline={true} />
```

### State with useState Hook

State allows components to manage and update their own data. The `useState` hook is used to add state to functional components.

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

**useState Rules:**
1. Always call hooks at the top level of your component
2. Never call hooks inside loops, conditions, or nested functions
3. State updates are asynchronous
4. State updates trigger re-renders

---

## 🎯 Event Handling

React uses synthetic events that work consistently across browsers. Event handlers are functions that respond to user interactions.

### Basic Event Handling

```jsx
function ButtonExample() {
  const [message, setMessage] = useState('');

  const handleClick = () => {
    setMessage('Button was clicked!');
  };

  const handleMouseOver = () => {
    console.log('Mouse is over the button');
  };

  return (
    <div>
      <button 
        onClick={handleClick}
        onMouseOver={handleMouseOver}
      >
        Click me!
      </button>
      <p>{message}</p>
    </div>
  );
}
```

### Form Handling

```jsx
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Your name"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Your email"
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Your message"
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

---

## 🔄 Conditional Rendering

Conditional rendering allows you to show different content based on conditions.

### Using if/else

```jsx
function UserProfile({ user, isLoggedIn }) {
  if (!isLoggedIn) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

### Using Ternary Operator

```jsx
function Notification({ message, type }) {
  return (
    <div className={`notification ${type}`}>
      {type === 'error' ? '❌' : '✅'} {message}
    </div>
  );
}
```

### Using Logical AND

```jsx
function ShoppingCart({ items }) {
  return (
    <div>
      <h2>Shopping Cart</h2>
      {items.length > 0 && (
        <div>
          <p>You have {items.length} items in your cart.</p>
          <button>Checkout</button>
        </div>
      )}
      {items.length === 0 && (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}
```

---

## 📋 Lists and Keys

When rendering lists in React, you need to provide a unique `key` prop for each item to help React efficiently update the DOM.

### Basic List Rendering

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <span className={todo.completed ? 'completed' : ''}>
            {todo.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
```

### List with Interactive Elements

```jsx
function ShoppingList({ items, onToggleItem, onDeleteItem }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} className={item.purchased ? 'purchased' : ''}>
          <input
            type="checkbox"
            checked={item.purchased}
            onChange={() => onToggleItem(item.id)}
          />
          <span>{item.name}</span>
          <button onClick={() => onDeleteItem(item.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

**Key Rules:**
1. Keys must be unique among siblings
2. Keys should be stable (don't use array index for dynamic lists)
3. Keys help React identify which items have changed, been added, or removed

---

## 🧩 Mini Tasks

Complete these exercises to practice what you've learned:

### Task 1: Simple Greeting Component
Create a component that displays a personalized greeting message.

**Requirements:**
- Accept `name` and `timeOfDay` props
- Display "Good morning", "Good afternoon", or "Good evening" based on `timeOfDay`
- Show the person's name in the greeting

### Task 2: Interactive Counter
Build a counter component with multiple buttons.

**Requirements:**
- Display current count
- Buttons to increment (+1), decrement (-1), and reset (0)
- Add a "Double" button that multiplies count by 2
- Prevent negative numbers

### Task 3: Todo Item Component
Create a component for individual todo items.

**Requirements:**
- Display todo text
- Show completion status
- Toggle completion on click
- Delete button to remove the item
- Different styling for completed vs incomplete items

### Task 4: Weather Display
Build a component that shows weather information.

**Requirements:**
- Accept weather data as props (temperature, condition, city)
- Display temperature in both Celsius and Fahrenheit
- Show appropriate weather icon/emoji
- Handle missing data gracefully

---

## 🚀 Projects

### Project 1: Calculator App

Build a fully functional calculator with basic arithmetic operations.

**Features:**
- Number input (0-9)
- Basic operations (+, -, ×, ÷)
- Clear and equals functionality
- Display current number and operation
- Handle decimal numbers
- Error handling for division by zero

**Technical Requirements:**
- Use functional components
- Implement proper state management
- Handle button clicks with event handlers
- Use conditional rendering for different states

### Project 2: Counter App

Create an enhanced counter application with multiple features.

**Features:**
- Increment/decrement buttons
- Reset functionality
- Step size selector (1, 5, 10, 25)
- Counter history (show last 5 operations)
- Color-coded positive/negative numbers
- Save/load counter value from localStorage

**Technical Requirements:**
- Use useState for multiple state variables
- Implement array operations for history
- Use useEffect for localStorage persistence
- Apply conditional styling based on counter value

---

## 📚 Next Steps

Congratulations! You've completed the React Basics course. Here's what to focus on next:

### Immediate Next Steps:
1. **Complete both projects** - Don't skip the hands-on practice
2. **Experiment with styling** - Try CSS modules or styled-components
3. **Add more features** - Extend your projects with additional functionality

### Prepare for Course 2:
- Review component composition patterns
- Learn about React Router basics
- Understand the useEffect hook
- Practice lifting state up between components

### Additional Resources:
- [React Official Documentation](https://react.dev/)
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [CodeSandbox](https://codesandbox.io/) - Online React playground
- [React Patterns](https://reactpatterns.com/) - Common React patterns

### Key Takeaways:
- ✅ JSX is a powerful way to write UI components
- ✅ Props pass data down, state manages internal data
- ✅ Event handlers respond to user interactions
- ✅ Conditional rendering creates dynamic UIs
- ✅ Keys are essential for efficient list rendering

**Ready for Course 2?** 🚀

Move on to **Course 2: Components & State Management** to learn about component composition, React Router, and more advanced state patterns!

---

*Happy coding! Remember, the best way to learn React is by building projects and experimenting with code.*
