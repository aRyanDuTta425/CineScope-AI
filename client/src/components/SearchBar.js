import React, { useState } from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [useVector, setUseVector] = useState(true);

  const exampleQueries = [
    "movies like The Matrix",
    "popular sci-fi films",
    "romantic comedies from the 90s",
    "action movies with high ratings",
    "thriller films from Christopher Nolan",
    "animated movies for kids"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), useVector);
    }
  };

  const handleExampleClick = (example) => {
    setQuery(example);
    onSearch(example, useVector);
  };

  return (
    <div className="search-container">
      <h2 className="search-title">🎬 Discover Movies with AI</h2>
      
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about movies... (e.g., 'movies like The Matrix', 'popular sci-fi films')"
          className="search-input"
        />
        <button 
          type="submit" 
          disabled={loading || !query.trim()}
          className="search-button"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div className="search-options">
        <label className="search-toggle">
          <input
            type="checkbox"
            checked={useVector}
            onChange={(e) => setUseVector(e.target.checked)}
          />
          Use AI Vector Search (recommended)
        </label>
      </div>

      <div className="search-examples">
        <h4>Try these examples:</h4>
        <div className="example-queries">
          {exampleQueries.map((example, index) => (
            <span
              key={index}
              className="example-query"
              style={{ '--index': index }}
              onClick={() => handleExampleClick(example)}
            >
              {example}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
