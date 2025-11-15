const express = require('express');
const app = express();

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Route API
app.get('/api/player', async (req, res) => {
  const tag = req.query.tag;
  
  if (!tag) {
    return res.status(400).json({ error: 'Tag manquant' });
  }
  
  // ⚠️ REMPLACE PAR TA CLÉ API BRAWL STARS
  const API_KEY = process.env.BRAWL_API_KEY || 'COLLE_TA_CLE_ICI_SI_PAS_DE_ENV';
  
  const cleanTag = tag.replace('#', '').replace(/\s/g, '').toUpperCase();
  const apiUrl = `https://api.brawlstars.com/v1/players/%23${cleanTag}`;
  
  try {
    console.log('Calling Brawl Stars API for tag:', cleanTag);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      console.error('API Error:', data);
      return res.status(response.status).json({
        error: 'Brawl Stars API error',
        details: data
      });
    }
    
    return res.json(data);
    
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Page d'accueil
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Brawl Stars API Proxy</title></head>
      <body style="font-family: Arial; padding: 50px; text-align: center;">
        <h1>🎮 Brawl Stars API Proxy</h1>
        <p>API fonctionnelle ✅</p>
        <p>Utilisez: <code>/api/player?tag=VOTRE_TAG</code></p>
        <p>Exemple: <a href="/api/player?tag=2PP">/api/player?tag=2PP</a></p>
      </body>
    </html>
  `);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
