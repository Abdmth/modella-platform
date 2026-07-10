const express = require('express');
const router = express.Router();
const Model = require('../models/Model');
const { auth, storeAuth } = require('../middleware/auth');

// Get all models for a store
router.get('/:storeId', async (req, res) => {
  try {
    const models = await Model.find({ storeId: req.params.storeId, isActive: true });
    res.json(models);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get my models (store owner)
router.get('/my-models', storeAuth, async (req, res) => {
  try {
    const models = await Model.find({ storeId: req.user.id });
    res.json(models);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create model
router.post('/', storeAuth, async (req, res) => {
  try {
    const { name, measurements, description } = req.body;

    if (!name || !measurements) {
      return res.status(400).json({ message: 'Name and measurements required' });
    }

    const model = new Model({
      name,
      storeId: req.user.id,
      measurements,
      description
    });

    await model.save();

    res.status(201).json({
      message: 'Model created successfully',
      model
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload model images
router.post('/:id/upload-images', storeAuth, async (req, res) => {
  try {
    if (!req.files || !req.files.images) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const model = await Model.findById(req.params.id);
    if (!model || model.storeId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

    for (const file of images) {
      const filename = `model_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${file.name.split('.').pop()}`;
      const filepath = `./uploads/${filename}`;

      await file.mv(filepath);
      model.images.push({
        url: `/uploads/${filename}`
      });
    }

    await model.save();

    res.json({
      message: 'Images uploaded successfully',
      model
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update model
router.put('/:id', storeAuth, async (req, res) => {
  try {
    const model = await Model.findById(req.params.id);
    if (!model || model.storeId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { name, measurements, description, isActive } = req.body;

    Object.assign(model, { name, measurements, description, isActive });
    await model.save();

    res.json({
      message: 'Model updated successfully',
      model
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete model
router.delete('/:id', storeAuth, async (req, res) => {
  try {
    const model = await Model.findById(req.params.id);
    if (!model || model.storeId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Model.findByIdAndDelete(req.params.id);

    res.json({ message: 'Model deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
