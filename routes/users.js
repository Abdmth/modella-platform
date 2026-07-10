const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const { auth, storeAuth } = require('../middleware/auth');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const wallet = await Wallet.findOne({ userId: req.user.id });

    res.json({
      user,
      walletBalance: wallet ? wallet.balance : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, phone, storeName, storeDescription } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        username: username || undefined,
        phone: phone || undefined,
        storeName: storeName || undefined,
        storeDescription: storeDescription || undefined,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload store logo
router.post('/store-logo', storeAuth, async (req, res) => {
  try {
    if (!req.files || !req.files.logo) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.files.logo;
    const filename = `logo_${Date.now()}.${file.name.split('.').pop()}`;
    const filepath = `./uploads/${filename}`;

    await file.mv(filepath);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { storeLogo: `/uploads/${filename}` },
      { new: true }
    );

    res.json({
      message: 'Logo uploaded successfully',
      storeLogo: `/uploads/${filename}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get wallet
router.get('/wallet', auth, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get wallet transactions
router.get('/wallet/transactions', auth, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.json(wallet.transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
