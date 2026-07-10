const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Contact = require('../models/Contact');
const Subscription = require('../models/Subscription');
const { adminAuth } = require('../middleware/auth');

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (role) query.role = role;

    const users = await User.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-password');

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create user
router.post('/users', adminAuth, async (req, res) => {
  try {
    const { username, email, password, phone, role, storeName } = req.body;

    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      username,
      email,
      password,
      phone,
      role: role || 'user',
      storeName: storeName || '',
      isVerified: true
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user
router.put('/users/:id', adminAuth, async (req, res) => {
  try {
    const { username, email, phone, role, storeName, isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, phone, role, storeName, isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all contacts
router.get('/contacts', adminAuth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reply to contact
router.put('/contacts/:id', adminAuth, async (req, res) => {
  try {
    const { reply } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: 'replied', reply, repliedAt: new Date() },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ message: 'Reply sent', contact });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get subscriptions
router.get('/subscriptions', adminAuth, async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create subscription plan
router.post('/subscriptions', adminAuth, async (req, res) => {
  try {
    const { name, price, duration, features, maxModels, maxClothings, maxGenerations } = req.body;

    let subscription = await Subscription.findOne({ name });
    if (subscription) {
      return res.status(400).json({ message: 'Subscription plan already exists' });
    }

    subscription = new Subscription({
      name,
      price,
      duration,
      features,
      maxModels,
      maxClothings,
      maxGenerations
    });

    await subscription.save();

    res.status(201).json({
      message: 'Subscription plan created',
      subscription
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
