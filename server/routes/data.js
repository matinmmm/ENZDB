const express = require('express');
const router = express.Router();

const { loadMaterialData, getSheetNames } = require('../services/dataService');

// GET /api/data/sheets -> list
router.get('/sheets', (req, res) => {
  try {
    const names = getSheetNames();
    res.json(names);
  } catch (err) {
    console.error('Error listing sheets', err);
    res.status(500).json({ error: 'Failed to list sheets' });
  }
});

// GET /api/data
router.get('/', async (req, res) => {
  try {
    const { sheet } = req.query;
    const data = await loadMaterialData(sheet);
    res.json(data);
  } catch (err) {
    console.error('Error fetching data', err);
    res.status(500).json({ error: 'Failed to load data' });
  }
});

module.exports = router; 