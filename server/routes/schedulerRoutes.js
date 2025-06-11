const express = require('express');
const multer = require('multer');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createScheduledPost,
  getMyScheduledPosts,
  updateScheduledPost,
  deleteScheduledPost
} = require('../controllers/schedulerController');

const upload = multer({ dest: 'uploads/' });

router.post('/create', authMiddleware, upload.single('media'), createScheduledPost);
router.get('/mine', authMiddleware, getMyScheduledPosts);
router.put('/edit/:id', authMiddleware, updateScheduledPost);
router.delete('/delete/:id', authMiddleware, deleteScheduledPost);

module.exports = router;
