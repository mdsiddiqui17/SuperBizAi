const express = require('express');
const multer = require('multer');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware'); // ✅ FIXED
const {
  createScheduledPost,
  getMyScheduledPosts,
  updateScheduledPost,
  deleteScheduledPost
} = require('../controllers/schedulerController');

const upload = multer({ dest: 'uploads/' });

router.post('/create', verifyToken, upload.single('media'), createScheduledPost);
router.get('/mine', verifyToken, getMyScheduledPosts);
router.put('/edit/:id', verifyToken, updateScheduledPost);
router.delete('/delete/:id', verifyToken, deleteScheduledPost);

module.exports = router;
