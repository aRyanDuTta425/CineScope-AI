const cors = require('cors');

const corsMiddleware = cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['your-production-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

module.exports = corsMiddleware;
