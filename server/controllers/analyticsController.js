const { getPlatformStats } = require('../services/analyticsService');

// GET /api/admin/analytics
const getAnalytics = async (req, res) => {
  try {
    const stats = await getPlatformStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };