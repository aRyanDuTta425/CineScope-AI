import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';
import './styles/App.css';

const Navigation = () => {
  const location = useLocation();

  const handleLogoClick = () => {
    // Scroll to top when logo is clicked
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={handleLogoClick}>
          🎬 MovieDash
        </Link>
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Search
          </Link>
          <Link 
            to="/dashboard" 
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
