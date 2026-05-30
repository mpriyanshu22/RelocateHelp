const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['housing', 'school', 'healthcare'], required: true },
  location: { type: String, required: true },
  description: { type: String },
  price: { type: Number },
  contactDetails: { type: String },
  imageUrl: { type: String },
  cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);
