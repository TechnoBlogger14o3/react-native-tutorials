import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchArticles } from '../../services/newsApi';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import './Search.css';

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(query);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setArticles([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const results = await searchArticles(searchQuery);
      
      // Sort results
      const sortedResults = [...results].sort((a, b) => {
        switch (sortBy) {
          case 'relevance':
            // Simple relevance: title matches first, then summary, then content
            const aTitleMatch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
            const bTitleMatch = b.title.toLowerCase().includes(searchQuery.toLowerCase());
            if (aTitleMatch && !bTitleMatch) return -1;
            if (!aTitleMatch && bTitleMatch) return 1;
            
            const aSummaryMatch = a.summary.toLowerCase().includes(searchQuery.toLowerCase());
            const bSummaryMatch = b.summary.toLowerCase().includes(searchQuery.toLowerCase());
            if (aSummaryMatch && !bSummaryMatch) return -1;
            if (!aSummaryMatch && bSummaryMatch) return 1;
            
            return new Date(b.publishedAt) - new Date(a.publishedAt);
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
      
      setArticles(sortedResults);
    } catch (err) {
      setError('Search failed');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(searchTerm.trim())}`);
      performSearch(searchTerm.trim());
    }
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    if (query) {
      performSearch(query);
    }
  };

  const getSearchSuggestions = () => {
    const suggestions = [
      'React', 'Technology', 'Climate Change', 'AI', 'Space', 
      'Health', 'Sports', 'Business', 'Politics', 'Entertainment'
    ];
    
    return suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
  };

  return (
    <div className="search">
      <div className="search-container">
        {/* Search Header */}
        <div className="search-header">
          <h1>🔍 Search News</h1>
          <p>Find articles by keywords, topics, or phrases</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for news articles..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              🔍 Search
            </button>
          </div>
        </form>

        {/* Search Results */}
        {query && (
          <div className="search-results">
            <div className="results-header">
              <h2>
                {loading ? 'Searching...' : `Search Results for "${query}"`}
              </h2>
              
              {!loading && articles.length > 0 && (
                <div className="results-controls">
                  <div className="sort-controls">
                    <label htmlFor="sort-select">Sort by:</label>
                    <select 
                      id="sort-select"
                      value={sortBy} 
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="sort-select"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="latest">Latest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="title">Title A-Z</option>
                    </select>
                  </div>
                  
                  <div className="results-count">
                    {articles.length} article{articles.length !== 1 ? 's' : ''} found
                  </div>
                </div>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="search-loading">
                <div className="loading-spinner"></div>
                <p>Searching for articles...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="search-error">
                <h3>⚠️ Search Error</h3>
                <p>{error}</p>
                <button onClick={() => performSearch(query)}>
                  Try Again
                </button>
              </div>
            )}

            {/* No Results */}
            {!loading && !error && articles.length === 0 && query && (
              <div className="no-results">
                <h3>No articles found</h3>
                <p>Try searching with different keywords or check your spelling.</p>
                <div className="search-suggestions">
                  <h4>Popular searches:</h4>
                  <div className="suggestion-tags">
                    {getSearchSuggestions().map((suggestion, index) => (
                      <button
                        key={index}
                        className="suggestion-tag"
                        onClick={() => {
                          setSearchTerm(suggestion);
                          performSearch(suggestion);
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Results Grid */}
            {!loading && !error && articles.length > 0 && (
              <div className="results-grid">
                {articles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search Tips */}
        {!query && (
          <div className="search-tips">
            <h3>💡 Search Tips</h3>
            <ul>
              <li>Use specific keywords for better results</li>
              <li>Try different variations of your search terms</li>
              <li>Search for topics like "technology", "politics", or "health"</li>
              <li>Use quotes for exact phrase matches</li>
            </ul>
            
            <div className="popular-searches">
              <h4>Popular searches:</h4>
              <div className="popular-tags">
                {getSearchSuggestions().map((suggestion, index) => (
                  <button
                    key={index}
                    className="popular-tag"
                    onClick={() => {
                      setSearchTerm(suggestion);
                      performSearch(suggestion);
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
