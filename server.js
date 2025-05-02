// Production server for Hostinger
import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import { storage } from './server/storage.js';
import { apiConfig } from './server/config.js';

// Load environment variables from .env.production
dotenv.config({ path: '.env.production' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Parse JSON bodies
app.use(express.json());

// API Routes
app.get('/api/config', (req, res) => {
  // Return client-side configuration
  res.json({
    VITE_INSTAGRAM_CLIENT_ID: process.env.VITE_INSTAGRAM_CLIENT_ID || apiConfig.instagram.clientId,
    VITE_INSTAGRAM_CLIENT_SECRET: process.env.VITE_INSTAGRAM_CLIENT_SECRET || apiConfig.instagram.clientSecret,
    VITE_TWITTER_API_KEY: process.env.VITE_TWITTER_API_KEY || apiConfig.twitter.apiKey,
    VITE_TWITTER_API_SECRET: process.env.VITE_TWITTER_API_SECRET || apiConfig.twitter.apiSecret,
    VITE_YOUTUBE_API_KEY: process.env.VITE_YOUTUBE_API_KEY || apiConfig.youtube.apiKey,
    VITE_OPENAI_API_KEY: process.env.VITE_OPENAI_API_KEY || apiConfig.openai.apiKey
  });
});

// Settings API
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await storage.getSettings();
    res.json(settings || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const settings = await storage.saveSettings(req.body);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// History API
app.get('/api/history', async (req, res) => {
  try {
    const history = await storage.getHistory();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/history', async (req, res) => {
  try {
    const history = await storage.addToHistory(req.body);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/history', async (req, res) => {
  try {
    await storage.clearHistory();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static files from the dist/public directory
app.use(express.static(path.join(__dirname, 'dist/public')));

// Handle all routes for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});