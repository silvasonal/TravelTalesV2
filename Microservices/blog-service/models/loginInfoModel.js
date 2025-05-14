const jwt = require('jsonwebtoken');
const bcryptUtils = require('../utils/bcryptUtils');
const usersDao = require('../daos/usersDao');
require('dotenv').config();

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, username: user.username},
    process.env.JWT_SECRET,
    { expiresIn: '60d' }
  );
};

// Function to log in a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    // Check if user exists
    const user = await usersDao.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate password
    const isPasswordValid = await bcryptUtils.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT
    const token = generateToken(user);

    // Return response
    return res.status(200).json({
      message: 'User logged in successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error in loginUser:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { loginUser };
