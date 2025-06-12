
const jwt = require('jsonwebtoken');
// const User = require('../models/User'); // Not strictly needed here if only attaching token payload to req.user

module.exports = function(req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');

  // Check if not token
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  // Check token format (Bearer <token>)
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token is not valid (format: Bearer <token>).' });
  }

  const token = parts[1];

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user from payload to request object
    // decoded should contain { userId: '...', email: '...' } as per our authController fixes
    req.user = decoded;

    // Optional: Check if user still exists in DB (more secure, but adds DB lookup per request)
    // This is good practice if users can be deleted or banned while their tokens are still valid.
    // For now, we'll trust the token payload as per common practice for short-lived tokens.
    // If implementing:
    // const userFromDb = await User.findById(decoded.userId);
    // if (!userFromDb) {
    //   return res.status(401).json({ message: 'User belonging to this token no longer exists.' });
    // }
    // req.user = userFromDb; // Or attach specific fields from userFromDb

    next(); // Pass control to the next middleware/handler
  } catch (err) {
    console.error('Token verification failed:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token is expired.' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token is not valid (malformed or invalid signature).' });
    }
    // For other errors during verification
    res.status(401).json({ message: 'Token is not valid.' });
  }
};
