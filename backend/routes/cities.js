const express = require('express');
const router = express.Router();
const City = require('../models/City');
const { auth, adminAuth } = require('../middleware/auth');

// @route   GET api/cities
router.get('/', async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET api/cities/:id
router.get('/:id', async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ error: 'City not found' });
    res.json(city);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST api/cities (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, overview, costOfLiving, imageUrl, keyNeighborhoods, essentials } = req.body;
    
    // Convert comma-separated strings to arrays if they are strings
    let parsedNeighborhoods = keyNeighborhoods;
    if (typeof keyNeighborhoods === 'string') {
      parsedNeighborhoods = keyNeighborhoods.split(',').map(n => n.trim()).filter(n => n);
    }
    
    let parsedEssentials = essentials;
    if (typeof essentials === 'string') {
      parsedEssentials = essentials.split(',').map(e => e.trim()).filter(e => e);
    }

    const newCity = new City({
      name,
      overview,
      costOfLiving,
      imageUrl,
      keyNeighborhoods: parsedNeighborhoods || [],
      essentials: parsedEssentials || []
    });
    
    const city = await newCity.save();
    res.json(city);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
