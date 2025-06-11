const ScheduledPost = require('../models/ScheduledPost');

exports.createScheduledPost = async (req, res) => {
  try {
    const { contentType, contentText, scheduledTime } = req.body;

    if (!contentType || !scheduledTime) {
      return res.status(400).json({ message: 'Content type and scheduled time are required.' });
    }

    const mediaUrl = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.mediaUrl || '';

    const newPost = new ScheduledPost({
      user: req.user.userId,
      contentType,
      contentText,
      mediaUrl,
      scheduledTime
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error('❌ Error creating scheduled post:', err.message);
    res.status(500).json({ message: 'Error creating scheduled post' });
  }
};

exports.getMyScheduledPosts = async (req, res) => {
  try {
    const posts = await ScheduledPost.find({ user: req.user.userId }).sort({ scheduledTime: 1 });
    res.json(posts);
  } catch (err) {
    console.error('❌ Error fetching scheduled posts:', err.message);
    res.status(500).json({ message: 'Error fetching scheduled posts' });
  }
};

exports.updateScheduledPost = async (req, res) => {
  try {
    const updated = await ScheduledPost.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Scheduled post not found or unauthorized' });
    }

    res.json(updated);
  } catch (err) {
    console.error('❌ Error updating scheduled post:', err.message);
    res.status(500).json({ message: 'Error updating scheduled post' });
  }
};

exports.deleteScheduledPost = async (req, res) => {
  try {
    const deleted = await ScheduledPost.findOneAndDelete({ _id: req.params.id, user: req.user.userId });

    if (!deleted) {
      return res.status(404).json({ message: 'Scheduled post not found or unauthorized' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting scheduled post:', err.message);
    res.status(500).json({ message: 'Error deleting scheduled post' });
  }
};
