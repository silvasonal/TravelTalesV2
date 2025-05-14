const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token has expired' }); 
            } else {
                return res.status(403).json({ error: 'Invalid token' }); 
            }
        }
        req.user = user; 
        next();
    });
};

module.exports = authenticateToken;
