const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  overview: { type: String, required: true },
  costOfLiving: { type: String },
  imageUrl: { type: String },
  keyNeighborhoods: [{ type: String }],
  essentials: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('City', citySchema);
