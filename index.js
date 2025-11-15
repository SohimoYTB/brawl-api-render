const express = require('express');
const app = express();

const express = require('express');
const app = express();

// CORS - DOIT ÊTRE AVANT TOUTES LES ROUTES
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});
```

6. **Commit changes**

---

### Étape 2 : Attendre le redéploiement

1. Va sur **https://dashboard.render.com**
2. Clique sur ton service **brawl-api**
3. Tu verras **"Deploying..."** pendant 1-2 minutes
4. Attends que ça dise **"Live"** ✅

---

### Étape 3 : Tester directement l'API

Ouvre cette URL dans ton navigateur (remplace par ton URL) :
```
https://brawl-api-xxxx.onrender.com/api/player?tag=2PP

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
