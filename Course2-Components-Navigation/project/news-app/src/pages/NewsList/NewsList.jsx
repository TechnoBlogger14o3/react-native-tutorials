import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchArticlesByCategory, fetchAllArticles } from '../../services/newsApi';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import './NewsList.css';

function NewsList() {
  const { category } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const fetchedArticles = category 
          ? await fetchArticlesByCategory(category)
          : await fetchAllArticles();
        
        // Sort articles
        const sortedArticles = [...fetchedArticles].sort((a, b) => {
          switch (sortBy) {
            case 'latest':
              return new Date(b.publishedAt) - new Date(a.publishedAt);
            case 'oldest':
              return new Date(a.publishedAt) - new Date(b.publishedAt);
            case 'title':
              return a.title.localeCompare(b.title);
            default:
              return 0;
          }
        });
        
        setArticles(sortedArticles);
        setCurrentPage(1);
      } catch (err) {
        setError('Failed to load articles');
        console.error('Error loading articles:', err);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [category, sortBy]);

  const getPageTitle = () => {
    if (category) {
      const categoryNames = {
        technology: 'Technology',
        politics: 'Politics',
        health: 'Health',
        sports: 'Sports',
        business: 'Business',
        entertainment: 'Entertainment'
      };
      return categoryNames[category] || category;
    }
    return 'All News';
  };

  const getPageDescription = () => {
    if (category) {
      return `Latest news and updates in ${getPageTitle().toLowerCase()}`;
    }
    return 'Browse all the latest news articles from around the world';
  };

  const articlesPerPage = 6;
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="news-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading {getPageTitle().toLowerCase()} articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-list-error">
        <h2>⚠️ Error Loading Articles</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="news-list">
      <div className="news-list-container">
        {/* Page Header */}
        <div className="page-header">
          <h1>{getPageTitle()}</h1>
          <p>{getPageDescription()}</p>
          <div className="page-meta">
            <span className="article-count">{articles.length} articles</span>
            <span className="last-updated">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="news-controls">
          <div className="sort-controls">
            <label htmlFor="sort-select">Sort by:</label>
            <select 
              id="sort-select"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
          
          <div className="view-controls">
            <button className="view-btn active" title="Grid view">
              ⊞
            </button>
            <button className="view-btn" title="List view">
              ☰
            </button>
          </div>
        </div>

        {/* Articles Grid */}
        {currentArticles.length === 0 ? (
          <div className="no-articles">
            <h3>No articles found</h3>
            <p>There are no articles available in this category.</p>
          </div>
        ) : (
          <div className="articles-grid">
            {currentArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            
            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsList;
