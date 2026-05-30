const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, { timestamps: true });

// Update average rating on listing when review is added
reviewSchema.post('save', async function() {
  const Listing = mongoose.model('Listing');
  const reviews = await this.model('Review').find({ listing: this.listing });
  
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((acc, item) => acc + item.rating, 0) / totalReviews 
    : 0;

  await Listing.findByIdAndUpdate(this.listing, {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10
  });
});

module.exports = mongoose.model('Review', reviewSchema);
