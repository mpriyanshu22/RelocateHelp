const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Listing = require('../models/Listing');
const { auth } = require('../middleware/auth');

// @route   GET api/reviews/:listingId
// @desc    Get all reviews for a listing
router.get('/:listingId', async (req, res) => {
  try {
    const reviews = await Review.find({ listing: req.params.listingId }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST api/reviews
// @desc    Add a review
router.post('/', auth, async (req, res) => {
  try {
    const { listingId, rating, comment } = req.body;
    
    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    // Check if user already reviewed
    const existingReview = await Review.findOne({ user: req.user._id, listing: listingId });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this listing' });
    }

    const newReview = new Review({
      user: req.user._id,
      listing: listingId,
      rating,
      comment
    });

    const review = await newReview.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
