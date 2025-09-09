const jsonServer = require('json-server');
const cors = require('cors');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
  noCors: true // Disable default CORS to use our custom setup
});

// Custom CORS configuration for production
const corsOptions = {
  origin: [
    'http://localhost:5173',           // Development frontend
    'http://localhost:3000',           // Alternative dev port
    'https://*.railway.app',           // Railway frontend deployment
    /^https:\/\/.*\.railway\.app$/,    // Dynamic Railway domains
    /^https:\/\/.*\.vercel\.app$/,     // Vercel deployments
    /^https:\/\/.*\.netlify\.app$/     // Netlify deployments
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Apply CORS middleware
server.use(cors(corsOptions));

// Apply default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'SOS HelpMed API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Add API info endpoint
server.get('/api/info', (req, res) => {
  res.json({
    name: 'SOS HelpMed API',
    description: 'Emergency Medical Services API',
    version: '1.0.0',
    endpoints: {
      users: '/users',
      emergencies: '/emergencies',
      pendingEmergencies: '/pendingEmergencies',
      ambulances: '/ambulances',
      adminPlanConfiguration: '/adminPlanConfiguration',
      surveyResponses: '/surveyResponses',
      externalEntities: '/externalEntities'
    }
  });
});

// Use default router
server.use(router);

// Start server
const port = process.env.PORT || 4001;
server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 SOS HelpMed API Server is running on port ${port}`);
  console.log(`📊 JSON Server UI: http://localhost:${port}`);
  console.log(`🔗 API Base URL: http://localhost:${port}`);
  console.log(`❤️  Health Check: http://localhost:${port}/health`);
});

module.exports = server;