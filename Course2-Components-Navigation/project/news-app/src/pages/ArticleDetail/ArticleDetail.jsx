import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchArticleById, fetchRelatedArticles } from '../../services/newsApi';
import './ArticleDetail.css';

function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [articleData, relatedData] = await Promise.all([
          fetchArticleById(id),
          fetchRelatedArticles(id)
        ]);
        
        setArticle(articleData);
        setRelatedArticles(relatedData);
        
        // Check if article is bookmarked (from localStorage)
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        setIsBookmarked(bookmarks.includes(parseInt(id)));
      } catch (err) {
        setError('Article not found');
        console.error('Error loading article:', err);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const articleId = parseInt(id);
    
    if (isBookmarked) {
      const updatedBookmarks = bookmarks.filter(bookmarkId => bookmarkId !== articleId);
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
    } else {
      bookmarks.push(articleId);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      setIsBookmarked(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (loading) {
    return (
      <div className="article-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-detail-error">
        <h2>⚠️ Article Not Found</h2>
        <p>{error || 'The article you\'re looking for doesn\'t exist.'}</p>
        <button onClick={() => navigate('/')}>
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="article-detail">
      <div className="article-detail-container">
        {/* Navigation */}
        <div className="article-navigation">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back
          </button>
          <button onClick={() => navigate('/')} className="home-btn">
            🏠 Home
          </button>
        </div>

        {/* Article Header */}
        <header className="article-header">
          <div className="article-category">
            <span className="category-icon">{getCategoryIcon(article.category)}</span>
            <span className="category-name">{article.category}</span>
          </div>
          
          <h1 className="article-title">{article.title}</h1>
          
          <div className="article-meta">
            <div className="meta-item">
              <span className="meta-label">By</span>
              <span className="meta-value">{article.author}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Published</span>
              <span className="meta-value">{formatDate(article.publishedAt)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Read time</span>
              <span className="meta-value">{article.readTime}</span>
            </div>
          </div>
        </header>

        {/* Article Image */}
        <div className="article-image">
          <img src={article.imageUrl} alt={article.title} />
        </div>

        {/* Article Actions */}
        <div className="article-actions">
          <button 
            onClick={handleBookmark}
            className={`action-btn bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
          >
            {isBookmarked ? '🔖 Bookmarked' : '🔖 Bookmark'}
          </button>
          <button onClick={handleShare} className="action-btn share-btn">
            📤 Share
          </button>
          <button className="action-btn print-btn">
            🖨️ Print
          </button>
        </div>

        {/* Article Summary */}
        <div className="article-summary">
          <p>{article.summary}</p>
        </div>

        {/* Article Content */}
        <div className="article-content">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="content-paragraph">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Article Tags */}
        <div className="article-tags">
          <h3>Tags:</h3>
          <div className="tags-list">
            {article.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="related-articles">
            <h2>Related Articles</h2>
            <div className="related-grid">
              {relatedArticles.map(relatedArticle => (
                <div key={relatedArticle.id} className="related-card">
                  <img 
                    src={relatedArticle.imageUrl} 
                    alt={relatedArticle.title}
                    onClick={() => navigate(`/news/${relatedArticle.id}`)}
                  />
                  <div className="related-content">
                    <h3 onClick={() => navigate(`/news/${relatedArticle.id}`)}>
                      {relatedArticle.title}
                    </h3>
                    <p>{relatedArticle.summary}</p>
                    <div className="related-meta">
                      <span>{relatedArticle.readTime}</span>
                      <span>{new Date(relatedArticle.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ArticleDetail;
