const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const user = new User({ username, password });
    console.log('Password before hashing:', password);
    await user.save();
    console.log('Password after hashing:', user.password);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, { httpOnly: true });
    res.status(201).json({ username: user.username, token, user: { username: user.username, description: user.description } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'User registration failed' });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  console.log('Login attempt:', { username, password });

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Found user:', user);

    console.log('Password from input:', password);
    console.log('Password from DB:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log('Generated token:', token);

    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'Login successful', token, user: { username: user.username, description: user.description } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

module.exports = { registerUser, loginUser };
