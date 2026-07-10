const mongoose = require('mongoose');

const clothingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['dress', 'shirt', 'pants', 'jacket', 'accessories', 'other'],
    required: true
  },
  originalImage: {
    type: String,
    required: true
  },
  tryOnImages: [{
    modelId: mongoose.Schema.Types.ObjectId,
    imageUrl: String,
    socialMediaImages: {
      instagram: String,
      tiktok: String,
      twitter: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  price: Number,
  description: String,
  colors: [String],
  sizes: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Clothing', clothingSchema);
