const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

// POST /api/movies/search - Search movies using vector or text search
router.post('/search', movieController.search);

// POST /api/movies/insights - Generate insights for movies
router.post('/insights', movieController.getInsights);

// POST /api/movies/analyze - Analyze search query
router.post('/analyze', movieController.analyzeQuery);

module.exports = router;
