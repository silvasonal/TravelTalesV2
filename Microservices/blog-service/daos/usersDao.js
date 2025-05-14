const pool = require('../config/db');

const createUser = async (username, email, password) => {
  try {
    const result = await pool.query(
      'INSERT INTO users (username,email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, password]
    );
    return result.rows[0];

  } catch (error) {
    throw new Error('Error creating user');
  }
};


const findUserByEmail = async (email) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];

  } catch (error) {
    throw new Error('Error fetching user');
  }
};

const findUserByUsername = async (username) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0];

  } catch (error) {
    throw new Error('Error fetching user');
  }
};

const getAllUsers = async () => {
  try {
    const result = await pool.query('SELECT id,username	FROM users');
    return result.rows;
  } catch (error) {
    throw new Error('Error fetching users');
  }
};

const passwordReset = async (email, newPassword) => {
  try {
    const result = await pool.query(
      'UPDATE users SET password = $1, created_at = NOW() WHERE email = $2 RETURNING *',
      [newPassword, email]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Error updating password');
  }
};


module.exports = { createUser, findUserByEmail, findUserByUsername, getAllUsers, passwordReset };

