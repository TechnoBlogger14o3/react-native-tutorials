import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Navigation from './components/Navigation/Navigation';
import Home from './pages/Home/Home';
import NewsList from './pages/NewsList/NewsList';
import ArticleDetail from './pages/ArticleDetail/ArticleDetail';
import Search from './pages/Search/Search';
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <Navigation />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<NewsList />} />
            <Route path="/news/:id" element={<ArticleDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/category/:category" element={<NewsList />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
