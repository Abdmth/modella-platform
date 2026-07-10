const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message
    });

    await contact.save();

    // Send WhatsApp notification (you can integrate WhatsApp API here)
    console.log(`New contact from: ${name} - ${phone}`);

    res.status(201).json({
      message: 'Your message has been sent successfully. We will contact you soon.',
      contact
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get contact by ID
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
