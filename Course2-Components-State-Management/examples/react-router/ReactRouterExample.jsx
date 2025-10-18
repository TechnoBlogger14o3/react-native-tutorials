import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';

// Example 1: Basic React Router Setup
function BasicRouterExample() {
  return (
    <BrowserRouter>
      <div className="basic-router-example">
        <h2>🧭 Basic React Router</h2>
        
        <nav className="router-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/products" className="nav-link">Products</Link>
        </nav>
        
        <div className="router-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<Products />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <div className="page">
      <h3>🏠 Home Page</h3>
      <p>Welcome to our React Router example!</p>
      <p>This is the home page of our application.</p>
    </div>
  );
}

function About() {
  return (
    <div className="page">
      <h3>ℹ️ About Page</h3>
      <p>Learn more about our company and mission.</p>
      <p>We are passionate about creating great React applications!</p>
    </div>
  );
}

function Contact() {
  return (
    <div className="page">
      <h3>📞 Contact Page</h3>
      <p>Get in touch with us!</p>
      <div className="contact-info">
        <p>Email: contact@example.com</p>
        <p>Phone: (555) 123-4567</p>
        <p>Address: 123 React Street, Component City</p>
      </div>
    </div>
  );
}

function Products() {
  const products = [
    { id: 1, name: 'React Pro', price: '$99' },
    { id: 2, name: 'Component Kit', price: '$49' },
    { id: 3, name: 'Hook Master', price: '$79' }
  ];

  return (
    <div className="page">
      <h3>🛍️ Products Page</h3>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h4>{product.name}</h4>
            <p>{product.price}</p>
            <Link to={`/products/${product.id}`} className="product-link">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="page">
      <h3>❌ Page Not Found</h3>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="back-link">← Go Home</Link>
    </div>
  );
}

// Example 2: Dynamic Routes with Parameters
function DynamicRouterExample() {
  return (
    <BrowserRouter>
      <div className="dynamic-router-example">
        <h2>🔗 Dynamic Routes</h2>
        
        <nav className="router-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/users" className="nav-link">Users</Link>
          <Link to="/posts" className="nav-link">Posts</Link>
        </nav>
        
        <div className="router-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/posts" element={<PostsList />} />
            <Route path="/posts/:id" element={<PostDetail />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

function UsersList() {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
  ];

  return (
    <div className="page">
      <h3>👥 Users List</h3>
      <div className="users-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <h4>{user.name}</h4>
            <p>{user.email}</p>
            <Link to={`/users/${user.id}`} className="user-link">
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Mock user data
  const user = {
    id: parseInt(id),
    name: `User ${id}`,
    email: `user${id}@example.com`,
    bio: `This is the bio for user ${id}`,
    joinDate: '2023-01-15',
    posts: Math.floor(Math.random() * 50),
    followers: Math.floor(Math.random() * 1000)
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleHome = () => {
    navigate('/'); // Navigate to home
  };

  return (
    <div className="page">
      <div className="navigation-controls">
        <button onClick={handleBack} className="nav-btn">← Back</button>
        <button onClick={handleHome} className="nav-btn">🏠 Home</button>
      </div>
      
      <h3>👤 User Profile: {user.name}</h3>
      <div className="user-detail">
        <div className="user-info">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Bio:</strong> {user.bio}</p>
          <p><strong>Joined:</strong> {user.joinDate}</p>
        </div>
        
        <div className="user-stats">
          <div className="stat">
            <span className="number">{user.posts}</span>
            <span className="label">Posts</span>
          </div>
          <div className="stat">
            <span className="number">{user.followers}</span>
            <span className="label">Followers</span>
          </div>
        </div>
      </div>
      
      <div className="debug-info">
        <p><strong>Current URL:</strong> {location.pathname}</p>
        <p><strong>User ID from URL:</strong> {id}</p>
      </div>
    </div>
  );
}

function PostsList() {
  const posts = [
    { id: 1, title: 'Getting Started with React', author: 'John Doe' },
    { id: 2, title: 'Advanced React Patterns', author: 'Jane Smith' },
    { id: 3, title: 'React Hooks Deep Dive', author: 'Bob Johnson' }
  ];

  return (
    <div className="page">
      <h3>📝 Posts List</h3>
      <div className="posts-list">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <h4>{post.title}</h4>
            <p>By: {post.author}</p>
            <Link to={`/posts/${post.id}`} className="post-link">
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock post data
  const post = {
    id: parseInt(id),
    title: `Post ${id}: Advanced React Concepts`,
    author: `Author ${id}`,
    content: `This is the detailed content for post ${id}. It contains comprehensive information about React concepts and best practices.`,
    publishDate: '2023-12-01',
    readTime: '5 min read',
    tags: ['React', 'JavaScript', 'Frontend']
  };

  return (
    <div className="page">
      <div className="navigation-controls">
        <button onClick={() => navigate(-1)} className="nav-btn">← Back</button>
        <button onClick={() => navigate('/posts')} className="nav-btn">📝 All Posts</button>
      </div>
      
      <article className="post-detail">
        <h3>{post.title}</h3>
        <div className="post-meta">
          <span>By: {post.author}</span>
          <span>Published: {post.publishDate}</span>
          <span>{post.readTime}</span>
        </div>
        
        <div className="post-content">
          <p>{post.content}</p>
        </div>
        
        <div className="post-tags">
          {post.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </article>
    </div>
  );
}

// Example 3: Nested Routes
function NestedRouterExample() {
  return (
    <BrowserRouter>
      <div className="nested-router-example">
        <h2>🌳 Nested Routes</h2>
        
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />}>
              <Route index element={<GeneralSettings />} />
              <Route path="privacy" element={<PrivacySettings />} />
              <Route path="notifications" element={<NotificationSettings />} />
            </Route>
            <Route path="help" element={<Help />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function Layout() {
  const location = useLocation();
  
  return (
    <div className="layout">
      <header className="app-header">
        <h1>🏢 Company Dashboard</h1>
        <p>Current page: {location.pathname}</p>
      </header>
      
      <div className="layout-content">
        <nav className="sidebar">
          <Link to="/" className="nav-link">📊 Dashboard</Link>
          <Link to="/profile" className="nav-link">👤 Profile</Link>
          <Link to="/settings" className="nav-link">⚙️ Settings</Link>
          <Link to="/help" className="nav-link">❓ Help</Link>
        </nav>
        
        <main className="main-content">
          <Outlet /> {/* Child routes render here */}
        </main>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="page">
      <h3>📊 Dashboard</h3>
      <p>Welcome to your dashboard! Here's an overview of your account.</p>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h4>Total Users</h4>
          <span className="stat-number">1,234</span>
        </div>
        <div className="stat-card">
          <h4>Active Sessions</h4>
          <span className="stat-number">567</span>
        </div>
        <div className="stat-card">
          <h4>Revenue</h4>
          <span className="stat-number">$12,345</span>
        </div>
      </div>
    </div>
  );
}

function Profile() {
  return (
    <div className="page">
      <h3>👤 Profile</h3>
      <p>Manage your personal information and preferences.</p>
      <div className="profile-form">
        <div className="form-group">
          <label>Name:</label>
          <input type="text" defaultValue="John Doe" />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" defaultValue="john@example.com" />
        </div>
        <button className="save-btn">Save Changes</button>
      </div>
    </div>
  );
}

function Settings() {
  return (
    <div className="page">
      <h3>⚙️ Settings</h3>
      <div className="settings-layout">
        <nav className="settings-nav">
          <Link to="/settings" className="settings-link">General</Link>
          <Link to="/settings/privacy" className="settings-link">Privacy</Link>
          <Link to="/settings/notifications" className="settings-link">Notifications</Link>
        </nav>
        
        <div className="settings-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function GeneralSettings() {
  return (
    <div className="settings-page">
      <h4>General Settings</h4>
      <div className="setting-item">
        <label>
          <input type="checkbox" defaultChecked />
          Enable dark mode
        </label>
      </div>
      <div className="setting-item">
        <label>
          Language:
          <select defaultValue="en">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </label>
      </div>
    </div>
  );
}

function PrivacySettings() {
  return (
    <div className="settings-page">
      <h4>Privacy Settings</h4>
      <div className="setting-item">
        <label>
          <input type="checkbox" defaultChecked />
          Make profile public
        </label>
      </div>
      <div className="setting-item">
        <label>
          <input type="checkbox" />
          Allow data collection
        </label>
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="settings-page">
      <h4>Notification Settings</h4>
      <div className="setting-item">
        <label>
          <input type="checkbox" defaultChecked />
          Email notifications
        </label>
      </div>
      <div className="setting-item">
        <label>
          <input type="checkbox" />
          Push notifications
        </label>
      </div>
    </div>
  );
}

function Help() {
  return (
    <div className="page">
      <h3>❓ Help & Support</h3>
      <p>Find answers to common questions and get support.</p>
      <div className="help-sections">
        <div className="help-section">
          <h4>📚 Documentation</h4>
          <p>Comprehensive guides and API references.</p>
        </div>
        <div className="help-section">
          <h4>💬 Contact Support</h4>
          <p>Get help from our support team.</p>
        </div>
        <div className="help-section">
          <h4>🐛 Report Bug</h4>
          <p>Help us improve by reporting issues.</p>
        </div>
      </div>
    </div>
  );
}

// Main component that demonstrates all examples
function ReactRouterExample() {
  const [currentExample, setCurrentExample] = useState('basic');

  return (
    <div className="react-router-example">
      <h1>🧭 React Router Examples</h1>
      
      <div className="example-selector">
        <button 
          onClick={() => setCurrentExample('basic')}
          className={currentExample === 'basic' ? 'active' : ''}
        >
          Basic Router
        </button>
        <button 
          onClick={() => setCurrentExample('dynamic')}
          className={currentExample === 'dynamic' ? 'active' : ''}
        >
          Dynamic Routes
        </button>
        <button 
          onClick={() => setCurrentExample('nested')}
          className={currentExample === 'nested' ? 'active' : ''}
        >
          Nested Routes
        </button>
      </div>

      <div className="example-content">
        {currentExample === 'basic' && <BasicRouterExample />}
        {currentExample === 'dynamic' && <DynamicRouterExample />}
        {currentExample === 'nested' && <NestedRouterExample />}
      </div>

      <div className="explanation">
        <h3>Key Concepts Demonstrated:</h3>
        <ul>
          <li><strong>BrowserRouter:</strong> Enables client-side routing</li>
          <li><strong>Routes & Route:</strong> Define application routes</li>
          <li><strong>Link & NavLink:</strong> Navigation components</li>
          <li><strong>useParams:</strong> Access URL parameters</li>
          <li><strong>useNavigate:</strong> Programmatic navigation</li>
          <li><strong>useLocation:</strong> Access current location</li>
          <li><strong>Nested Routes:</strong> Hierarchical routing structure</li>
          <li><strong>Outlet:</strong> Render child routes</li>
        </ul>
      </div>
    </div>
  );
}

export default ReactRouterExample;
