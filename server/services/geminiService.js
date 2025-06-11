const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GEMINI_API_KEY } = require('../utils/config');

class GeminiService {
  constructor() {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is required');
    }
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Updated model name
    this.embeddingModel = this.genAI.getGenerativeModel({ model: 'text-embedding-004' }); // Updated embedding model
  }

  async generateEmbedding(text) {
    try {
      const result = await this.embeddingModel.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  async generateInsight(movies) {
    try {
      const movieSummary = movies.map(movie => 
        `${movie.title} (${movie.year}) - ${movie.genres?.join(', ')} - ${movie.plot || 'No plot available'}`
      ).join('\n');

      const prompt = `Based on these movies, provide a brief insight or recommendation (2-3 sentences):

${movieSummary}

Please provide a helpful insight about these movies, common themes, or recommendations for similar films.`;

      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error generating insight:', error);
      throw new Error('Failed to generate insight');
    }
  }

  async analyzeQuery(query) {
    try {
      const prompt = `Analyze this movie search query and extract key themes, genres, or characteristics: "${query}"
      
      Respond with a brief analysis focusing on what type of movies the user is looking for.`;

      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error analyzing query:', error);
      return 'Unable to analyze query';
    }
  }
}

module.exports = new GeminiService();
