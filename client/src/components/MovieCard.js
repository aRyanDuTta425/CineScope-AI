import React from 'react';
import '../styles/MovieCard.css';

const MovieCard = ({ movie, index = 0 }) => {
  const {
    title,
    year,
    genres = [],
    plot,
    poster,
    imdb = {},
    runtime,
    directors = [],
    cast = []
  } = movie;

  const getRatingClass = (rating) => {
    if (rating >= 7) return 'high';
    if (rating >= 5) return 'medium';
    return 'low';
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getPosterImage = () => {
    if (poster && poster !== 'N/A' && !poster.includes('nopicture')) {
      return poster;
    }
    return null;
  };

  return (
    <div 
      className="movie-card hover-lift" 
      style={{ '--card-index': index }}
    >
      <div className="movie-poster-container">
        {getPosterImage() ? (
          <img 
            src={getPosterImage()} 
            alt={`${title} poster`}
            className="movie-poster"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className="movie-poster-placeholder"
          style={{ display: getPosterImage() ? 'none' : 'flex' }}
        >
          🎬
        </div>
        
        {imdb.rating && (
          <div className={`movie-rating ${getRatingClass(imdb.rating)}`}>
            ⭐ {imdb.rating}
          </div>
        )}
      </div>

      <div className="movie-content">
        <h3 className="movie-title">{title}</h3>
        {year && <div className="movie-year">{year}</div>}
        
        {genres.length > 0 && (
          <div className="movie-genres">
            {genres.slice(0, 3).map((genre, genreIndex) => (
              <span 
                key={genreIndex} 
                className="genre-tag"
                style={{ '--index': genreIndex }}
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {plot && plot !== 'N/A' && (
          <p className="movie-plot">{plot}</p>
        )}

        <div className="movie-meta">
          {runtime && (
            <div className="movie-runtime">
              🕒 {formatRuntime(runtime)}
            </div>
          )}
          
          {directors.length > 0 && (
            <div className="movie-directors">
              Director: {directors[0]}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Component to display the movies grid
export const MoviesGrid = ({ movies, loading, error }) => {
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Searching for movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ background: 'rgba(220, 53, 69, 0.1)', borderColor: 'rgba(220, 53, 69, 0.3)' }}>
        <h3 style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Search Error</h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{error}</p>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="card scale-in" style={{ textAlign: 'center' }}>
        <h3 style={{ color: 'rgba(255, 255, 255, 0.9)' }}>No movies found</h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Try searching with different keywords or check your spelling.</p>
      </div>
    );
  }

  return (
    <div className="slide-up">
      <div className="movies-header">
        <div className="movies-count">
          Found {movies.length} movie{movies.length !== 1 ? 's' : ''}
        </div>
      </div>
      <div className="movies-grid">
        {movies.map((movie, index) => (
          <MovieCard 
            key={movie._id || index} 
            movie={movie} 
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieCard;
