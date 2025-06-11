import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import { MoviesGrid } from '../components/MovieCard';
import { movieAPI } from '../services/api';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [insights, setInsights] = useState('');
  const [insightsLoading, setInsightsLoading] = useState(false);

  const handleSearch = async (query, useVector) => {
    setLoading(true);
    setError(null);
    setSearchQuery(query);
    setInsights('');

    try {
      const response = await movieAPI.search(query, useVector);
      
      if (response.success) {
        setMovies(response.movies);
        
        // Generate insights if movies found
        if (response.movies.length > 0) {
          generateInsights(response.movies);
        }
      } else {
        setError('Search failed. Please try again.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'Search failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async (moviesList) => {
    setInsightsLoading(true);
    try {
      const response = await movieAPI.getInsights(moviesList);
      if (response.success) {
        setInsights(response.insight);
      }
    } catch (err) {
      console.error('Insights error:', err);
      // Don't show error for insights as it's not critical
    } finally {
      setInsightsLoading(false);
    }
  };

  return (
    <div className="container">
      <SearchBar onSearch={handleSearch} loading={loading} />
      
      {searchQuery && (
        <div className="search-results fade-in">
          {insights && (
            <div className="card bounce-in" style={{ marginBottom: '2rem', '--stagger-delay': '1' }}>
              <h3 style={{ marginBottom: '1rem' }} className="gradient-text">
                🤖 AI Insights
              </h3>
              {insightsLoading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  <span>Generating insights...</span>
                </div>
              ) : (
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>{insights}</p>
              )}
            </div>
          )}
          
          <MoviesGrid 
            movies={movies} 
            loading={loading} 
            error={error}
          />
        </div>
      )}
      
      {!searchQuery && !loading && (
        <div className="welcome-section">
          <div className="card scale-in" style={{ textAlign: 'center', marginTop: '2rem' }}>
            <h3 className="gradient-text" style={{ marginBottom: '1rem' }}>
              🎬 Discover Movies with AI
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Use natural language to search for movies. Our AI-powered search understands 
              queries like "movies like The Matrix" or "popular sci-fi films from the 90s".
            </p>
            
            <div className="try-examples">
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1rem' }}>
                Try these examples:
              </h4>
              <div className="example-queries">
                {[
                  'movies like The Matrix',
                  'popular sci-fi films',
                  'romantic comedies from the 90s',
                  'action movies with high ratings',
                  'thriller films from Christopher Nolan',
                  'animated movies for kids'
                ].map((example, index) => (
                  <button
                    key={index}
                    className="example-query-btn"
                    onClick={() => handleSearch(example, true)}
                    style={{ '--stagger-delay': index }}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ marginTop: '2rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Powered by MongoDB Atlas Vector Search and Google Gemini AI
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
