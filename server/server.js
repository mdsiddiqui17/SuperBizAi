const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

// Routes
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const crmRoutes = require('./routes/crmRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const googleRoutes = require('./routes/googleRoutes');
const contentRoutes = require('./routes/contentRoutes');
const imageRoutes = require('./routes/imageRoutes');
const schedulerRoutes = require('./routes/schedulerRoutes');
const adRoutes = require('./routes/adRoutes');
const productRoutes = require('./routes/productRoutes');
const analyticsRoutes = require('./routes/analytics'); // ✅ Analytics
const formRoutes = require('./routes/form'); // ✅ Smart Forms
const competitorRoutes = require('./routes/competitorRoutes'); // ✅ Competitor Analysis

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Check for route file existence
console.log('✅ Checking if productRoutes.js exists:', fs.existsSync(path.resolve(__dirname, 'routes/productRoutes.js')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection failed:', err));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leads', crmRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/scheduler', schedulerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/forms', formRoutes); // ✅ Smart Forms
app.use('/api/competitors', competitorRoutes); // ✅ Competitor Analysis
app.use('/api', protectedRoutes);

// Root
app.get('/', (req, res) => {
  res.send('SuperBiz AI Backend is Running 🚀');
});

// Fallback for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: `No route found for ${req.originalUrl}` });
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
