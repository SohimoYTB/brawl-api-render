const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.get('/api/player', async (req, res) => {
  try {
    const tag = req.query.tag;
    if (!tag) return res.status(400).json({ error: 'Tag manquant' });
    
    const API_KEY = process.env.BRAWL_API_KEY;
    if (!API_KEY) return res.status(500).json({ error: 'API Key non configuree' });
    
    const cleanTag = tag.replace('#', '').toUpperCase().trim();
    const url = 'https://api.brawlstars.com/v1/players/%23' + cleanTag;
    
    const response = await fetch(url, {
      headers: { 'Authorization': 'Bearer ' + API_KEY }
    });
    
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('<h1>API Brawl Stars OK</h1><p>Utilisez /api/player?tag=2PP</p>');
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
