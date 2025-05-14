const bcrypt = require('bcrypt');

// Hash a password before saving it to the database
const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Compare password with the stored hash
const comparePassword = async (password, dbpassword) => {
  const match = await bcrypt.compare(password, dbpassword);
  return match;
};

module.exports = { hashPassword, comparePassword };

