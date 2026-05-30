const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const { auth, adminAuth } = require('../middleware/auth');

// @route   GET api/listings
// @desc    Get listings with optional filters (cityId, category)
router.get('/', async (req, res) => {
  try {
    const { cityId, category, search, minPrice, maxPrice, minRating, sortBy } = req.query;
    let query = {};

    if (cityId) query.cityId = cityId;
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (minRating) query.averageRating = { $gte: Number(minRating) };

    let mongoQuery = Listing.find(query).populate('cityId', 'name');
    
    if (sortBy === 'popularity') {
      mongoQuery = mongoQuery.sort('-totalReviews');
    } else if (sortBy === 'rating') {
      mongoQuery = mongoQuery.sort('-averageRating');
    }

    const listings = await mongoQuery;
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET api/listings/:id
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('cityId', 'name');
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST api/listings (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const newListing = new Listing(req.body);
    const listing = await newListing.save();
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
