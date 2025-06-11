const geminiService = require('../services/geminiService');
const mongoService = require('../services/mongoService');

class MovieController {
  async search(req, res) {
    try {
      console.log('🔍 Search request received:', req.body);
      const { query, useVector = true } = req.body;

      if (!query) {
        console.log('❌ No query provided');
        return res.status(400).json({ error: 'Query is required' });
      }

      console.log(`🔍 Searching for: "${query}", useVector: ${useVector}`);
      let movies = [];

      if (useVector) {
        try {
          console.log('🤖 Attempting vector search...');
          // Generate embedding for the query
          const embedding = await geminiService.generateEmbedding(query);
          console.log('✅ Embedding generated successfully, length:', embedding.length);
          // Perform vector search
          movies = await mongoService.vectorSearch(embedding, 10);
          console.log(`✅ Vector search completed: ${movies.length} movies found`);
          
          // If vector search returns no results, fall back to text search
          if (movies.length === 0) {
            console.log('⚠️ Vector search returned 0 results, falling back to text search...');
            movies = await mongoService.searchMovies(query, 10);
            console.log(`✅ Text search fallback completed: ${movies.length} movies found`);
          }
        } catch (error) {
          console.log('❌ Vector search failed, falling back to text search:', error.message);
          // Fallback to text search if vector search fails
          movies = await mongoService.searchMovies(query, 10);
          console.log(`✅ Text search fallback completed: ${movies.length} movies found`);
        }
      } else {
        console.log('📝 Performing text search...');
        // Use text search
        movies = await mongoService.searchMovies(query, 10);
        console.log(`✅ Text search completed: ${movies.length} movies found`);
      }

      console.log('📤 Sending response...');
      res.json({
        success: true,
        query,
        movies,
        count: movies.length
      });
    } catch (error) {
      console.error('💥 Search error:', error);
      res.status(500).json({ 
        error: 'Search failed', 
        message: error.message 
      });
    }
  }

  async getInsights(req, res) {
    try {
      const { movies } = req.body;

      if (!movies || !Array.isArray(movies) || movies.length === 0) {
        return res.status(400).json({ error: 'Movies array is required' });
      }

      const insight = await geminiService.generateInsight(movies);

      res.json({
        success: true,
        insight
      });
    } catch (error) {
      console.error('Insights error:', error);
      res.status(500).json({ 
        error: 'Failed to generate insights', 
        message: error.message 
      });
    }
  }

  async analyzeQuery(req, res) {
    try {
      const { query } = req.body;

      if (!query) {
        return res.status(400).json({ error: 'Query is required' });
      }

      const analysis = await geminiService.analyzeQuery(query);

      res.json({
        success: true,
        query,
        analysis
      });
    } catch (error) {
      console.error('Query analysis error:', error);
      res.status(500).json({ 
        error: 'Failed to analyze query', 
        message: error.message 
      });
    }
  }
}

module.exports = new MovieController();
