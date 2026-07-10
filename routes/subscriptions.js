const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const { auth } = require('../middleware/auth');

// Get all subscription plans
router.get('/', async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ isActive: true });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get subscription by ID
router.get('/:id', async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Subscribe to plan
router.post('/:id/subscribe', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    const user = await User.findById(req.user.id);
    const wallet = await Wallet.findOne({ userId: req.user.id });

    // Check if user has enough balance (manual payment, so we just record it)
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + subscription.duration * 24 * 60 * 60 * 1000);

    // Update user subscription
    user.subscription = {
      plan: subscription.name,
      startDate,
      endDate,
      isActive: true
    };

    await user.save();

    // Record transaction
    wallet.transactions.push({
      type: 'subscription',
      amount: subscription.price,
      description: `Subscription: ${subscription.name}`,
      status: 'pending' // Manual payment
    });

    await wallet.save();

    res.json({
      message: 'Subscription request created. Awaiting manual payment confirmation.',
      subscription: user.subscription,
      amountDue: subscription.price
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
