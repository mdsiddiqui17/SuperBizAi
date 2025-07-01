const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// REGISTER
const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();

    const token = jwt.sign(
      { userId: savedUser._id, email: savedUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    const userResponse = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };

    res.status(201).json({ token, user: userResponse, message: 'User registered successfully.' });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email already exists. Please use a different email.' });
    }
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. Please check your email and password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Please check your email and password.' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(200).json({ token, user: userResponse, message: 'Login successful.' });

  } catch (error) {
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// GOOGLE LOGIN
const googleLoginOrRegister = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: 'Google ID token is required.' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { sub: googleId, email, name, picture: profilePictureUrl, email_verified } = payload;

    let user = await User.findOne({ googleId });

    if (user) {
      // Already exists with googleId
    } else {
      user = await User.findOne({ email });
      if (user) {
        user.googleId = googleId;
        user.profilePictureUrl = user.profilePictureUrl || profilePictureUrl;
        user.name = user.name || name;
        await user.save();
      } else {
        user = new User({ googleId, email, name, profilePictureUrl });
        await user.save();
      }
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePictureUrl: user.profilePictureUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({ token, user: userResponse, message: 'Google sign-in successful.' });

  } catch (error) {
    console.error('Google Sign-In Error:', error.message);
    if (error.message.includes('Token used too late') || error.message.includes('Invalid token signature')) {
      return res.status(401).json({ message: 'Invalid or expired Google token.' });
    }
    res.status(500).json({ message: 'Server error during Google sign-in.' });
  }
};

module.exports = { register, login, googleLoginOrRegister };
