import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const location = useLocation();
  
  const categories = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/news', label: 'All News', icon: '📰' },
    { path: '/category/technology', label: 'Technology', icon: '💻' },
    { path: '/category/politics', label: 'Politics', icon: '🏛️' },
    { path: '/category/health', label: 'Health', icon: '🏥' },
    { path: '/category/sports', label: 'Sports', icon: '⚽' },
    { path: '/category/business', label: 'Business', icon: '💼' }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-links">
          {categories.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className={`nav-link ${isActive(category.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{category.icon}</span>
              <span className="nav-label">{category.label}</span>
            </Link>
          ))}
        </div>
        
        <div className="nav-meta">
          <span className="breaking-news">🔥 Breaking News</span>
          <span className="live-indicator">🔴 LIVE</span>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
