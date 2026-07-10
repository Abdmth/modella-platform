const express = require('express');
const router = express.Router();
const Clothing = require('../models/Clothing');
const { auth, storeAuth } = require('../middleware/auth');

// Get all clothes
router.get('/', async (req, res) => {
  try {
    const { category, storeId, page = 1, limit = 10 } = req.query;
    
    let query = { isActive: true };
    if (category) query.category = category;
    if (storeId) query.storeId = storeId;

    const clothes = await Clothing.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('storeId', 'storeName storeLogo');

    const total = await Clothing.countDocuments(query);

    res.json({
      clothes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single clothing
router.get('/:id', async (req, res) => {
  try {
    const clothing = await Clothing.findById(req.params.id)
      .populate('storeId', 'storeName storeLogo storeImages');

    if (!clothing) {
      return res.status(404).json({ message: 'Clothing not found' });
    }

    res.json(clothing);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get my clothes (store owner)
router.get('/store/my-clothes', storeAuth, async (req, res) => {
  try {
    const clothes = await Clothing.find({ storeId: req.user.id });
    res.json(clothes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create clothing
router.post('/', storeAuth, async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'Image file required' });
    }

    const { name, category, description, price, colors, sizes } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: 'Name and category required' });
    }

    const file = req.files.image;
    const filename = `clothing_${Date.now()}.${file.name.split('.').pop()}`;
    const filepath = `./uploads/${filename}`;

    await file.mv(filepath);

    const clothing = new Clothing({
      name,
      category,
      storeId: req.user.id,
      originalImage: `/uploads/${filename}`,
      description,
      price,
      colors: colors ? JSON.parse(colors) : [],
      sizes: sizes ? JSON.parse(sizes) : []
    });

    await clothing.save();

    res.status(201).json({
      message: 'Clothing created successfully',
      clothing
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add try-on image
router.post('/:id/try-on', storeAuth, async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'Image file required' });
    }

    const clothing = await Clothing.findById(req.params.id);
    if (!clothing || clothing.storeId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { modelId } = req.body;
    if (!modelId) {
      return res.status(400).json({ message: 'Model ID required' });
    }

    const file = req.files.image;
    const filename = `tryon_${Date.now()}.${file.name.split('.').pop()}`;
    const filepath = `./uploads/${filename}`;

    await file.mv(filepath);

    const socialMediaImages = {};
    
    // If social media images provided
    if (req.files.instagram) {
      const igFilename = `social_ig_${Date.now()}.${req.files.instagram.name.split('.').pop()}`;
      await req.files.instagram.mv(`./uploads/${igFilename}`);
      socialMediaImages.instagram = `/uploads/${igFilename}`;
    }

    if (req.files.tiktok) {
      const tkFilename = `social_tk_${Date.now()}.${req.files.tiktok.name.split('.').pop()}`;
      await req.files.tiktok.mv(`./uploads/${tkFilename}`);
      socialMediaImages.tiktok = `/uploads/${tkFilename}`;
    }

    clothing.tryOnImages.push({
      modelId,
      imageUrl: `/uploads/${filename}`,
      socialMediaImages
    });

    await clothing.save();

    res.json({
      message: 'Try-on image added successfully',
      clothing
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update clothing
router.put('/:id', storeAuth, async (req, res) => {
  try {
    const clothing = await Clothing.findById(req.params.id);
    if (!clothing || clothing.storeId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { name, category, description, price, colors, sizes, isActive } = req.body;

    Object.assign(clothing, {
      name,
      category,
      description,
      price,
      colors,
      sizes,
      isActive
    });

    await clothing.save();

    res.json({
      message: 'Clothing updated successfully',
      clothing
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete clothing
router.delete('/:id', storeAuth, async (req, res) => {
  try {
    const clothing = await Clothing.findById(req.params.id);
    if (!clothing || clothing.storeId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Clothing.findByIdAndDelete(req.params.id);

    res.json({ message: 'Clothing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
