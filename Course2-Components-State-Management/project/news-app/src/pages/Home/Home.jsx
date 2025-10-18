import React, { useState, useEffect } from 'react';
import { fetchFeaturedArticles, fetchAllArticles } from '../../services/newsApi';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import './Home.css';

function Home() {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [featured, latest] = await Promise.all([
          fetchFeaturedArticles(),
          fetchAllArticles()
        ]);
        
        setFeaturedArticles(featured);
        setLatestArticles(latest.slice(3, 9)); // Get articles 4-9 for latest section
      } catch (err) {
        setError('Failed to load articles');
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>Loading latest news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-error">
        <h2>⚠️ Error Loading News</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="home-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Stay Informed with the Latest News</h1>
            <p>Get breaking news, in-depth analysis, and comprehensive coverage of today's most important stories.</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">1M+</span>
                <span className="stat-label">Readers</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Coverage</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Countries</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Articles */}
        <section className="featured-section">
          <div className="section-header">
            <h2>🔥 Featured Stories</h2>
            <p>Today's most important news stories</p>
          </div>
          
          <div className="featured-grid">
            {featuredArticles.map((article, index) => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                featured={index === 0} // Make first article larger
              />
            ))}
          </div>
        </section>

        {/* Latest News */}
        <section className="latest-section">
          <div className="section-header">
            <h2>📰 Latest News</h2>
            <p>Stay up to date with the most recent developments</p>
          </div>
          
          <div className="latest-grid">
            {latestArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="newsletter-section">
          <div className="newsletter-content">
            <h2>📧 Stay Updated</h2>
            <p>Get the latest news delivered directly to your inbox</p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="newsletter-input"
              />
              <button className="newsletter-btn">
                Subscribe Now
              </button>
            </div>
            <p className="newsletter-privacy">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
