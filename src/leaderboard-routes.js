const express = require('express');
const pool = require('./database');
const router = express.Router();

router.get('/leaderboard/global', async (req, res) => {
  try {
    const [leaders] = await pool.query(`
      SELECT 
        u.id, 
        u.username, 
        u.faction, 
        u.exp_points,
        u.hexes_captured as hexes,
        u.distance_traveled
      FROM users u
      WHERE u.hexes_captured > 0
      ORDER BY u.hexes_captured DESC, u.exp_points DESC
      LIMIT 50
    `);
    
    res.json({ leaderboard: leaders });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/leaderboard/local/:region', async (req, res) => {
  try {
    const [leaders] = await pool.query(`
      SELECT 
        u.id, 
        u.username, 
        u.faction, 
        u.exp_points,
        u.hexes_captured as hexes,
        u.distance_traveled
      FROM users u
      WHERE u.hexes_captured > 0
      ORDER BY u.hexes_captured DESC, u.exp_points DESC
      LIMIT 50
    `);
    
    res.json({ leaderboard: leaders });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
