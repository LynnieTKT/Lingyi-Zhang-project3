const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const router = express.Router();
const Status = require('../models/Status'); 
const mongoose = require('mongoose');



// Register user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Logout user
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Search users
router.get('/search', async (req, res) => {
  const { query } = req.query;
  if (!query || query.trim() === '') {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const users = await User.find({
      username: { $regex: query, $options: 'i' }, 
    }).select('username _id');
    res.json(users);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Failed to search users' });
  }
});


// Get user information and statuses
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const statuses = await Status.find({ userId: id }).sort({ timestamp: -1 });
        res.status(200).json({ user, statuses });
    } catch (error) {
        console.error('Error fetching user data:', error.message);
        res.status(500).json({ message: 'Failed to fetch user data' });
    }
});
  

module.exports = router;
