const User = require('../models/User');
const Resume = require('../models/Resume');
const JobPosting = require('../models/JobPosting');
const LearningRoadmap = require('../models/LearningRoadmap');

const getPlatformStats = async () => {
  // Simple counts — plain queries, no aggregation needed here
  const totalUsers = await User.countDocuments();
  const totalResumesAnalyzed = await Resume.countDocuments({ parsedSkills: { $ne: [] } });
  const totalJobPostings = await JobPosting.countDocuments();
  const totalRoadmaps = await LearningRoadmap.countDocuments();

  // User signups grouped by day, for a trend chart
  const signupsOverTime = await User.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Most common target roles users are pursuing
  const popularRoles = await Resume.aggregate([
    { $match: { targetRole: { $ne: null } } },
    { $group: { _id: '$targetRole', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  // Most frequently MISSING skills across all roadmaps — the real "gap in the market" signal
  const topMissingSkills = await LearningRoadmap.aggregate([
    { $unwind: '$items' }, // flatten each roadmap's items array into individual documents
    { $match: { 'items.completed': false } },
    { $group: { _id: '$items.skill', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  // Roadmap completion rate — average % of items completed across all roadmaps
  const completionStats = await LearningRoadmap.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: null,
        totalItems: { $sum: 1 },
        completedItems: { $sum: { $cond: ['$items.completed', 1, 0] } },
      },
    },
  ]);

  const avgCompletionRate =
    completionStats.length > 0 && completionStats[0].totalItems > 0
      ? Math.round((completionStats[0].completedItems / completionStats[0].totalItems) * 100)
      : 0;

  return {
    totals: { totalUsers, totalResumesAnalyzed, totalJobPostings, totalRoadmaps },
    signupsOverTime: signupsOverTime.map((d) => ({ date: d._id, count: d.count })),
    popularRoles: popularRoles.map((r) => ({ role: r._id, count: r.count })),
    topMissingSkills: topMissingSkills.map((s) => ({ skill: s._id, count: s.count })),
    avgCompletionRate,
  };
};

module.exports = { getPlatformStats };