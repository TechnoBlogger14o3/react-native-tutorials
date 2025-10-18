// lists-and-keys/ListsAndKeysExample.jsx
import React, { useState } from 'react';

// Basic list rendering with keys
function TodoList({ todos, onToggleTodo, onDeleteTodo }) {
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggleTodo(todo.id)}
          />
          <span>{todo.text}</span>
          <button onClick={() => onDeleteTodo(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

// List with complex items
function UserList({ users, onSelectUser }) {
  return (
    <div className="user-list">
      {users.map(user => (
        <div key={user.id} className="user-card" onClick={() => onSelectUser(user)}>
          <div className="user-avatar">
            <img src={user.avatar} alt={user.name} />
          </div>
          <div className="user-info">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <span className={`status ${user.isOnline ? 'online' : 'offline'}`}>
              {user.isOnline ? '🟢 Online' : '🔴 Offline'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// List with filtering and sorting
function ProductList({ products, filter, sortBy }) {
  // Filter products
  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    return product.category === filter;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return a.price - b.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="product-list">
      {sortedProducts.map(product => (
        <div key={product.id} className="product-card">
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p className="price">${product.price}</p>
          <div className="rating">
            {'★'.repeat(Math.floor(product.rating))}
            {'☆'.repeat(5 - Math.floor(product.rating))}
            <span>({product.rating})</span>
          </div>
          <p className="category">{product.category}</p>
        </div>
      ))}
    </div>
  );
}

// List with nested data
function CommentList({ comments }) {
  const renderComment = (comment) => (
    <div key={comment.id} className="comment">
      <div className="comment-header">
        <strong>{comment.author}</strong>
        <span className="comment-date">{comment.date}</span>
      </div>
      <p className="comment-text">{comment.text}</p>
      {comment.replies && comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map(reply => renderComment(reply))}
        </div>
      )}
    </div>
  );

  return (
    <div className="comment-list">
      {comments.map(comment => renderComment(comment))}
    </div>
  );
}

// List with dynamic data and operations
function ShoppingCart({ items, onUpdateQuantity, onRemoveItem }) {
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="shopping-cart">
      <h3>Shopping Cart ({items.length} items)</h3>
      
      {items.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>${item.price}</p>
                </div>
                <div className="quantity-controls">
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <button onClick={() => onRemoveItem(item.id)}>Remove</button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h4>Total: ${totalPrice.toFixed(2)}</h4>
            <button className="checkout-btn">Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}

// Main component demonstrating all list examples
function ListsAndKeysExample() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React basics', completed: false },
    { id: 2, text: 'Build a calculator app', completed: true },
    { id: 3, text: 'Practice with lists and keys', completed: false }
  ]);

  const [users] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', avatar: 'https://via.placeholder.com/50', isOnline: true },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', avatar: 'https://via.placeholder.com/50', isOnline: false },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', avatar: 'https://via.placeholder.com/50', isOnline: true }
  ]);

  const [products] = useState([
    { id: 1, name: 'Laptop', price: 999, rating: 4.5, category: 'electronics', image: 'https://via.placeholder.com/100' },
    { id: 2, name: 'Coffee Mug', price: 15, rating: 4.2, category: 'kitchen', image: 'https://via.placeholder.com/100' },
    { id: 3, name: 'Book', price: 25, rating: 4.8, category: 'books', image: 'https://via.placeholder.com/100' },
    { id: 4, name: 'Headphones', price: 150, rating: 4.3, category: 'electronics', image: 'https://via.placeholder.com/100' }
  ]);

  const [comments] = useState([
    {
      id: 1,
      author: 'John Doe',
      date: '2024-01-15',
      text: 'Great article! Very helpful.',
      replies: [
        { id: 2, author: 'Jane Smith', date: '2024-01-15', text: 'I agree!' },
        { id: 3, author: 'Bob Wilson', date: '2024-01-16', text: 'Thanks for sharing!' }
      ]
    },
    {
      id: 4,
      author: 'Alice Brown',
      date: '2024-01-16',
      text: 'Could you explain more about hooks?',
      replies: []
    }
  ]);

  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Laptop', price: 999, quantity: 1, image: 'https://via.placeholder.com/50' },
    { id: 2, name: 'Mouse', price: 25, quantity: 2, image: 'https://via.placeholder.com/50' }
  ]);

  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const addTodo = () => {
    const newTodo = {
      id: Date.now(),
      text: `New todo ${todos.length + 1}`,
      completed: false
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev => prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const removeCartItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="lists-and-keys-example">
      <h1>Lists and Keys Examples</h1>
      
      <section>
        <h2>Basic Todo List</h2>
        <p>Simple list with keys for efficient updates.</p>
        <TodoList todos={todos} onToggleTodo={toggleTodo} onDeleteTodo={deleteTodo} />
        <button onClick={addTodo}>Add Todo</button>
      </section>

      <section>
        <h2>User List</h2>
        <p>List with complex items and click handlers.</p>
        <UserList users={users} onSelectUser={(user) => alert(`Selected: ${user.name}`)} />
      </section>

      <section>
        <h2>Product List with Filtering</h2>
        <p>List with filtering and sorting capabilities.</p>
        <div className="controls">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="kitchen">Kitchen</option>
            <option value="books">Books</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>
        <ProductList products={products} filter={filter} sortBy={sortBy} />
      </section>

      <section>
        <h2>Nested Comments</h2>
        <p>List with nested data structure.</p>
        <CommentList comments={comments} />
      </section>

      <section>
        <h2>Shopping Cart</h2>
        <p>Interactive list with dynamic operations.</p>
        <ShoppingCart 
          items={cartItems} 
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeCartItem}
        />
      </section>

      <div className="tips">
        <h3>💡 Lists and Keys Tips:</h3>
        <ul>
          <li>Always provide a unique key prop for list items</li>
          <li>Use stable, unique identifiers (not array indices for dynamic lists)</li>
          <li>Keys help React identify which items have changed</li>
          <li>Extract list items into separate components for better organization</li>
          <li>Use map() to transform arrays into JSX elements</li>
          <li>Consider using React.Fragment for lists without wrapper elements</li>
        </ul>
      </div>
    </div>
  );
}

export default ListsAndKeysExample;
