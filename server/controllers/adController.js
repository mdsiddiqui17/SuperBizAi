const Ad = require('../models/Ad');
const { v4: uuidv4 } = require('uuid');

exports.generateAd = async (req, res) => {
  try {
    const { contentText } = req.body;
    const imageUrl = `https://api.dummyimage.com/600x400/${uuidv4()}`;

    const ad = new Ad({
      user: req.user.userId,
      contentText,
      imageUrl,
      type: "generated",
    });

    await ad.save();
    res.status(201).json(ad);
  } catch (error) {
    console.error("❌ Error generating ad:", error);
    res.status(500).json({ message: "Server error generating ad" });
  }
};

exports.saveCustomAd = async (req, res) => {
  try {
    const { contentText, imageUrl } = req.body;
    const ad = new Ad({
      user: req.user.userId,
      contentText,
      imageUrl,
      type: "custom",
    });
    await ad.save();
    res.status(201).json(ad);
  } catch (err) {
    res.status(500).json({ message: "Error saving custom ad" });
  }
};

exports.listAds = async (req, res) => {
  try {
    const ads = await Ad.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: "Error fetching ads" });
  }
};

exports.scheduleAd = async (req, res) => {
  try {
    const { adId, platform, scheduledFor } = req.body;
    const ad = await Ad.findById(adId);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    ad.platform = platform;
    ad.scheduledFor = scheduledFor;
    ad.status = "scheduled";
    await ad.save();
    res.json({ message: "Ad scheduled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error scheduling ad" });
  }
};
