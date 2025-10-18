import React from 'react';
import { Link } from 'react-router-dom';
import './ArticleCard.css';

function ArticleCard({ article, featured = false }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      technology: '💻',
      politics: '🏛️',
      health: '🏥',
      sports: '⚽',
      business: '💼',
      entertainment: '🎬'
    };
    return icons[category] || '📰';
  };

  return (
    <article className={`article-card ${featured ? 'featured' : ''}`}>
      <div className="article-image">
        <img 
          src={article.imageUrl} 
          alt={article.title}
          loading="lazy"
        />
        <div className="article-category">
          <span className="category-icon">{getCategoryIcon(article.category)}</span>
          <span className="category-name">{article.category}</span>
        </div>
      </div>
      
      <div className="article-content">
        <div className="article-meta">
          <span className="article-date">{formatDate(article.publishedAt)}</span>
          <span className="article-read-time">{article.readTime}</span>
          <span className="article-author">By {article.author}</span>
        </div>
        
        <h2 className="article-title">
          <Link to={`/news/${article.id}`}>
            {article.title}
          </Link>
        </h2>
        
        <p className="article-summary">{article.summary}</p>
        
        <div className="article-tags">
          {article.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="article-actions">
          <Link to={`/news/${article.id}`} className="read-more-btn">
            Read More →
          </Link>
          <button className="bookmark-btn" title="Bookmark article">
            🔖
          </button>
        </div>
      </div>
    </article>
  );
}

export default ArticleCard;
