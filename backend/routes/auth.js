const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const { auth } = require('../middleware/auth.js');
const bcrypt = require('bcrypt');
// @route   POST api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ error: 'User already exists' });

    const hashpass = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashpass, role });
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite:
        process.env.NODE_ENV === 'production'
          ? 'none'
          : 'lax',
      maxAge: 60 * 60 * 1000
    });

    const reply = {
      name: user.name,
      email: user.email,
      _id: user._id,
      role: user.role,
    }
    res.status(200).json({
      user: reply,
      message: "registered in successfully"
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isAllowed = await bcrypt.compare(password, user.password);
    if (!isAllowed) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite:
        process.env.NODE_ENV === 'production'
          ? 'none'
          : 'lax',
      maxAge: 60 * 60 * 1000
    });
    const reply = {
      name: user.name,
      email: user.email,
      role: user.role,
      _id: user._id,
    }
    res.status(200).json({
      user: reply,
      message: "logged in successfully"
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('savedListings');

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

// @route   POST api/auth/save-listing
router.post('/save-listing', auth, async (req, res) => {
  try {
    const { listingId } = req.body;
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isSaved = user.savedListings.some(id => (id._id ? id._id.toString() : id.toString()) === listingId);
    if (isSaved) {
      user.savedListings = user.savedListings.filter(id => (id._id ? id._id.toString() : id.toString()) !== listingId);
    } else {
      user.savedListings.push(listingId);
    }
    
    await user.save();
    await user.populate('savedListings');
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
