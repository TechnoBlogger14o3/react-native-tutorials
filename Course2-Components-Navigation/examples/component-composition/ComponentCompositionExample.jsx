import React, { useState } from 'react';

// Example 1: Basic Component Composition
function NewsApp() {
  const [articles, setArticles] = useState([
    { id: 1, title: 'Breaking News', category: 'politics', read: false },
    { id: 2, title: 'Tech Update', category: 'technology', read: false },
    { id: 3, title: 'Sports News', category: 'sports', read: false }
  ]);
  const [loading, setLoading] = useState(false);

  const markAsRead = (articleId) => {
    setArticles(prev => 
      prev.map(article => 
        article.id === articleId 
          ? { ...article, read: true }
          : article
      )
    );
  };

  return (
    <div className="news-app">
      <Header />
      <Navigation />
      <ArticleList 
        articles={articles} 
        loading={loading} 
        onMarkAsRead={markAsRead}
      />
      <Footer />
    </div>
  );
}

// Child components that are composed together
function Header() {
  return (
    <header className="app-header">
      <h1>📰 News App</h1>
      <SearchBar />
    </header>
  );
}

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search articles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button>🔍</button>
    </div>
  );
}

function Navigation() {
  const categories = ['All', 'Politics', 'Technology', 'Sports', 'Business'];

  return (
    <nav className="navigation">
      {categories.map(category => (
        <button key={category} className="nav-button">
          {category}
        </button>
      ))}
    </nav>
  );
}

function ArticleList({ articles, loading, onMarkAsRead }) {
  if (loading) {
    return <div className="loading">Loading articles...</div>;
  }

  return (
    <div className="article-list">
      {articles.map(article => (
        <ArticleCard 
          key={article.id} 
          article={article} 
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
}

function ArticleCard({ article, onMarkAsRead }) {
  return (
    <div className={`article-card ${article.read ? 'read' : 'unread'}`}>
      <h3>{article.title}</h3>
      <p>Category: {article.category}</p>
      <button onClick={() => onMarkAsRead(article.id)}>
        {article.read ? '✅ Read' : '📖 Mark as Read'}
      </button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="app-footer">
      <p>© 2024 News App - Built with React</p>
    </footer>
  );
}

// Example 2: User Dashboard Composition
function UserDashboard() {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    stats: { posts: 15, followers: 1200, following: 300 }
  });

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
  };

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <div className="user-dashboard">
      <UserProfile user={user} />
      <UserStats stats={user.stats} />
      <UserActions 
        onEditProfile={handleEditProfile}
        onLogout={handleLogout}
      />
    </div>
  );
}

function UserProfile({ user }) {
  return (
    <div className="user-profile">
      <div className="avatar">👤</div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

function UserStats({ stats }) {
  return (
    <div className="user-stats">
      <div className="stat">
        <span className="number">{stats.posts}</span>
        <span className="label">Posts</span>
      </div>
      <div className="stat">
        <span className="number">{stats.followers}</span>
        <span className="label">Followers</span>
      </div>
      <div className="stat">
        <span className="number">{stats.following}</span>
        <span className="label">Following</span>
      </div>
    </div>
  );
}

function UserActions({ onEditProfile, onLogout }) {
  return (
    <div className="user-actions">
      <button onClick={onEditProfile} className="edit-btn">
        ✏️ Edit Profile
      </button>
      <button onClick={onLogout} className="logout-btn">
        🚪 Logout
      </button>
    </div>
  );
}

// Main component that demonstrates both examples
function ComponentCompositionExample() {
  const [currentExample, setCurrentExample] = useState('news');

  return (
    <div className="component-composition-example">
      <h1>🧩 Component Composition Examples</h1>
      
      <div className="example-selector">
        <button 
          onClick={() => setCurrentExample('news')}
          className={currentExample === 'news' ? 'active' : ''}
        >
          News App Composition
        </button>
        <button 
          onClick={() => setCurrentExample('dashboard')}
          className={currentExample === 'dashboard' ? 'active' : ''}
        >
          User Dashboard Composition
        </button>
      </div>

      <div className="example-content">
        {currentExample === 'news' && <NewsApp />}
        {currentExample === 'dashboard' && <UserDashboard />}
      </div>

      <div className="explanation">
        <h3>Key Concepts Demonstrated:</h3>
        <ul>
          <li><strong>Single Responsibility:</strong> Each component has one clear purpose</li>
          <li><strong>Props Down:</strong> Data flows from parent to child components</li>
          <li><strong>Events Up:</strong> Child components communicate with parents via callbacks</li>
          <li><strong>Composition:</strong> Complex UIs built by combining simple components</li>
          <li><strong>Reusability:</strong> Components can be reused in different contexts</li>
        </ul>
      </div>
    </div>
  );
}

export default ComponentCompositionExample;
