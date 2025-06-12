
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure User model is imported
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
// const jwt = require('jsonwebtoken'); // Already imported at the top

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// exports.register = async (req, res) => { // Assuming this is part of a module export
const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password.' });
  }
  // Optional: Add more specific validation e.g. password length, email format

  try {
    // Password Hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // User Creation
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    // JWT Generation
    const token = jwt.sign(
      { userId: savedUser._id, email: savedUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // Use default if not in .env
    );

    // Prepare user object for response (excluding password)
    const userResponse = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      createdAt: savedUser.createdAt, // If timestamps are enabled
      updatedAt: savedUser.updatedAt  // If timestamps are enabled
    };

    console.log(`User registered successfully: ${savedUser.email}`); // Logging

    res.status(201).json({ token, user: userResponse, message: 'User registered successfully.' });

  } catch (error) {
    if (error.code === 11000 || (error.message && error.message.includes('duplicate key error'))) { // Check for MongoDB duplicate key error
      console.error('Registration error: Email already exists - ', email);
      return res.status(409).json({ message: 'Email already exists. Please use a different email.' });
    }
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};
// }; // Assuming this is part of a module export

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password.' });
  }

  try {
    console.log(`Login attempt for email: ${email}`); // Logging

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.warn(`Login failed: User not found - ${email}`);
      return res.status(401).json({ message: 'Invalid credentials. Please check your email and password.' });
    }

    // Compare password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn(`Login failed: Password mismatch for user - ${email}`);
      return res.status(401).json({ message: 'Invalid credentials. Please check your email and password.' });
    }

    // If password matches, generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // Consistent with register
    );

    // Prepare user object for response (excluding password)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt, // If timestamps are enabled
      updatedAt: user.updatedAt  // If timestamps are enabled
      // Include other non-sensitive fields if necessary
    };

    console.log(`Login successful for user: ${email}`);

    res.status(200).json({ token, user: userResponse, message: 'Login successful.' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};
// }; // Assuming this is part of a module export

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password.' });
  }

  try {
    console.log(`Login attempt for email: ${email}`); // Logging

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.warn(`Login failed: User not found - ${email}`);
      return res.status(401).json({ message: 'Invalid credentials. Please check your email and password.' });
    }

    // Compare password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn(`Login failed: Password mismatch for user - ${email}`);
      return res.status(401).json({ message: 'Invalid credentials. Please check your email and password.' });
    }

    // If password matches, generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // Consistent with register
    );

    // Prepare user object for response (excluding password)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt, // If timestamps are enabled
      updatedAt: user.updatedAt  // If timestamps are enabled
      // Include other non-sensitive fields if necessary
    };

    console.log(`Login successful for user: ${email}`);

    res.status(200).json({ token, user: userResponse, message: 'Login successful.' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

const googleLoginOrRegister = async (req, res) => {
  const { credential } = req.body; // This is the Google ID token from the frontend

  if (!credential) {
    return res.status(400).json({ message: 'Google ID token is required.' });
  }

  try {
    console.log('Received Google ID token. Verifying...');
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();

    if (!payload) {
      console.error('Google token verification failed: No payload.');
      return res.status(401).json({ message: 'Invalid Google token: No payload.' });
    }

    const { sub: googleId, email, name, picture: profilePictureUrl, email_verified } = payload;

    if (!email_verified) {
      // Optional: You might want to restrict unverified emails, though Google usually ensures this.
      console.warn(`Google authentication for unverified email: ${email}`);
      // return res.status(401).json({ message: 'Google email not verified.' });
    }

    console.log(`Google token verified for email: ${email}, googleId: ${googleId}`);

    let user = await User.findOne({ googleId });

    if (user) {
      // Case 1: User exists with this googleId - Login
      console.log(`User found with googleId: ${user.email}. Logging in.`);
    } else {
      // Case 2: No user with this googleId, check by email
      user = await User.findOne({ email });
      if (user) {
        // Case 2a: User exists with this email - Link Google account
        console.log(`User found with email: ${user.email}. Linking googleId.`);
        user.googleId = googleId;
        user.profilePictureUrl = user.profilePictureUrl || profilePictureUrl; // Update pic if not already set
        // User might have registered with email/password, ensure name is updated if Google's is more complete
        user.name = user.name || name;
        await user.save();
      } else {
        // Case 2b: No user with this email or googleId - Create new user
        console.log(`No user found. Creating new user with email: ${email}`);
        user = new User({
          googleId,
          email,
          name,
          profilePictureUrl,
          // Password field is intentionally omitted for Google-based registration
        });
        await user.save();
        console.log(`New user created via Google: ${user.email}`);
      }
    }

    // Generate your application's JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    // Prepare user object for response
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
