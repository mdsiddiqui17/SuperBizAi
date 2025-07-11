const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const listEndpoints = require('express-list-endpoints'); // 📌 Add this

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection failed:', err));

// ✅ Route Imports
console.log('✅ Loading routes...');
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
const analyticsRoutes = require('./routes/analytics');
const formRoutes = require('./routes/form');
const competitorRoutes = require('./routes/competitorRoutes');
const orderRoutes = require('./routes/orderRoutes');

// ✅ Mount Routes
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
app.use('/api/forms', formRoutes);
app.use('/api/competitors', competitorRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', protectedRoutes);

// ✅ Root Route
app.get('/', (req, res) => {
  res.send('SuperBiz AI Backend is Running 🚀');
});

// ✅ List all registered routes on startup
console.table(listEndpoints(app));

// ❗ Place this LAST – fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `No route found for ${req.originalUrl}` });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
