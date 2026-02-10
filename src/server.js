const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
require('dotenv').config();

const routes = require('./routes');
const advancedRoutes = require('./advanced-routes');
const authRoutes = require('./auth-routes');
const settingsRoutes = require('./settings-routes');
const runRoutes = require('./run-routes');
const itemRoutes = require('./item-routes');
const squadRoutes = require('./squad-routes');
const leaderboardRoutes = require('./leaderboard-routes');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 3000;

const clients = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'register') {
      clients.set(data.userId, ws);
    }
  });
  ws.on('close', () => {
    for (const [userId, client] of clients.entries()) {
      if (client === ws) clients.delete(userId);
    }
  });
});

app.locals.broadcast = (event, data) => {
  clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ event, data }));
    }
  });
};

app.locals.notifyUser = (userId, event, data) => {
  const ws = clients.get(userId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ event, data }));
  }
};

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', routes);
app.use('/api', advancedRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', settingsRoutes);
app.use('/api', runRoutes);
app.use('/api', itemRoutes);
app.use('/api', squadRoutes);
app.use('/api', leaderboardRoutes);

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/landing.html'));
});

app.get('/map', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/map-new.html'));
});

app.get('/leaderboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/leaderboard-new.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/profile-new.html'));
});

app.get('/items', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/items-new.html'));
});

app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/settings.html'));
});

app.get('/squad', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/squad.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/about.html'));
});

app.get('/rules', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/rules.html'));
});

server.listen(PORT, () => {
  console.log(`Hexa server running on http://localhost:${PORT}`);
  console.log(`WebSocket server ready`);
});
