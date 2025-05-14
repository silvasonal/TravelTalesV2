const bcryptUtils = require('../utils/bcryptUtils');
const usersDao = require('../daos/usersDao');

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    // Check for duplicates
    const existingUsername = await usersDao.findUserByUsername(username);
    if (existingUsername) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const existingEmail = await usersDao.findUserByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash password and create user
    const hashedPassword = await bcryptUtils.hashPassword(password);
    const user = await usersDao.createUser(username, email, hashedPassword);

    return res.status(201).json({
      message: 'User created successfully',
      user
    });

  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ error: 'Error registering user' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await usersDao.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Error fetching users' });
  }
};

const passwordReset = async (req, res) => {
  const { email, newPassword } = req.body;

  // Validate input
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!newPassword) {
    return res.status(400).json({ error: 'New password is required' });
  }

  try {
    // Hash new password and update user
    const hashedPassword = await bcryptUtils.hashPassword(newPassword);
    const user = await usersDao.passwordReset(email, hashedPassword);

    if (!user) {
      return res.status(404).json({ error: 'User with email not found' });
    }

    return res.status(200).json({
      message: 'Password reset successfully',
      user
    });

  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ error: 'Error resetting password' });
  }
};

module.exports = {
  registerUser,
  getAllUsers,
  passwordReset
};
