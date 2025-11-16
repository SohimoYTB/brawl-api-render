const express = require('express');
const app = express();

// CORS - Doit être AVANT toutes les routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Route API principale
app.get('/api/player', async (req, res) => {
  const tag = req.query.tag;
  
  if (!tag) {
    return res.status(400).json({ error: 'Tag manquant' });
  }
  
  // Récupérer la clé API depuis les variables d'environnement
  const API_KEY = process.env.BRAWL_API_KEY;
  
  if (!API_KEY) {
    return res.status(500).json({ error: 'API Key non configurée' });
  }
  
  const cleanTag = tag.replace('#', '').replace(/\s/g, '').toUpperCase();
  const apiUrl = `https://api.brawlstars.com/v1/players/%23${cleanTag}`;
  
  try {
    console.log('Appel API Brawl Stars pour le tag:', cleanTag);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Statut de réponse API:', response.status);
    
    if (!response.ok) {
      console.error('Erreur API:', data);
      return res.status(response.status).json({
        error: 'Erreur API Brawl Stars',
        details: data
      });
    }
    
    return res.json(data);
    
  } catch (error) {
    console.error('Erreur serveur:', error);
    return res.status(500).json({ 
      error: 'Erreur interne du serveur',
      message: error.message 
    });
  }
});

// Page d'accueil
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Brawl Stars API Proxy</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 50px;
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            margin: 0;
          }
          h1 { font-size: 3em; margin-bottom: 20px; }
          p { font-size: 1.2em; margin: 10px 0; }
          code { 
            background: rgba(255,255,255,0.2); 
            padding: 5px 10px; 
            border-radius: 5px;
            font-family: monospace;
          }
          a { color: #FFD700; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .status { 
            background: rgba(255,255,255,0.2); 
            padding: 20px; 
            border-radius: 10px; 
            margin-top: 30px;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <h1>🎮 Brawl Stars API Proxy</h1>
        <div class="status">
          <p>✅ API fonctionnelle</p>
          <p>⚡ Serveur en ligne</p>
        </div>
        <p style="margin-top: 30px;">Utilisez: <code>/api/player?tag=VOTRE_TAG</code></p>
        <p>Exemple: <a href="/api/player?tag=2PP">/api/player?tag=2PP</a></p>
        <p style="margin-top: 30px; opacity: 0.8; font-size: 0.9em;">
          Health check: <a href="/health">/health</a>
        </p>
      </body>
    </html>
  `);
});

// Health check pour vérifier que le serveur fonctionne
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ CORS activé pour tous les domaines`);
});
