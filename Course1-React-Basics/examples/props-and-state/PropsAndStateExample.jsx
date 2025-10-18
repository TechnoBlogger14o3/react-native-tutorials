// props-and-state/PropsAndStateExample.jsx
import React, { useState } from 'react';

// Component demonstrating props (read-only data from parent)
function UserCard({ user, isOnline, onToggleStatus }) {
  return (
    <div className={`user-card ${isOnline ? 'online' : 'offline'}`}>
      <h3>{user.name}</h3>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <div className="status">
        <span>{isOnline ? '🟢 Online' : '🔴 Offline'}</span>
        <button onClick={onToggleStatus}>
          {isOnline ? 'Go Offline' : 'Go Online'}
        </button>
      </div>
    </div>
  );
}

// Component demonstrating state (internal data that can change)
function Counter() {
  // useState returns [currentValue, setterFunction]
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  const increment = () => setCount(count + step);
  const decrement = () => setCount(count - step);
  const reset = () => setCount(0);

  return (
    <div className="counter">
      <h3>Counter: {count}</h3>
      <div className="controls">
        <button onClick={decrement}>-{step}</button>
        <button onClick={increment}>+{step}</button>
        <button onClick={reset}>Reset</button>
      </div>
      <div className="step-control">
        <label>
          Step size:
          <input
            type="number"
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
            min="1"
            max="10"
          />
        </label>
      </div>
    </div>
  );
}

// Component combining props and state
function TodoItem({ todo, onToggle, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    // In a real app, you'd call a function to update the todo
    console.log('Saving:', editText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      
      {isEditing ? (
        <div className="edit-mode">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <div className="view-mode">
          <span onDoubleClick={() => setIsEditing(true)}>
            {todo.text}
          </span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
      
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
}

// Main component demonstrating props and state together
function PropsAndStateExample() {
  // State for the main component
  const [users] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Developer' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Designer' },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', role: 'Manager' }
  ]);

  const [userStatus, setUserStatus] = useState({
    1: true,  // Alice is online
    2: false, // Bob is offline
    3: true   // Carol is online
  });

  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React basics', completed: false },
    { id: 2, text: 'Build a calculator app', completed: true },
    { id: 3, text: 'Practice with props and state', completed: false }
  ]);

  const toggleUserStatus = (userId) => {
    setUserStatus(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const toggleTodo = (todoId) => {
    setTodos(prev => prev.map(todo =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (todoId) => {
    setTodos(prev => prev.filter(todo => todo.id !== todoId));
  };

  return (
    <div className="props-and-state-example">
      <h1>Props and State Examples</h1>
      
      <section>
        <h2>Props Example - User Cards</h2>
        <p>Props are passed down from parent to child components.</p>
        <div className="user-cards">
          {users.map(user => (
            <UserCard
              key={user.id}
              user={user}
              isOnline={userStatus[user.id]}
              onToggleStatus={() => toggleUserStatus(user.id)}
            />
          ))}
        </div>
      </section>

      <section>
        <h2>State Example - Counter</h2>
        <p>State is managed internally by components and can change over time.</p>
        <Counter />
      </section>

      <section>
        <h2>Combined Example - Todo Items</h2>
        <p>This combines props (todo data) with state (editing mode).</p>
        <div className="todo-list">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default PropsAndStateExample;
