const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Submission = require('../models/submission');
const Problem = require('../models/problem');
const mongoose = require('mongoose');

exports.dashboard = async (req, res) => {
  const userId = req.query.userId;
  // const {userId} = req.body; // Ensure the user is authenticated and req.user is populated
  console.log(userId)
  try {
    // Fetch user data
    const user = await User.findById(userId)
      .populate('solvedProblems', 'title level')
      .populate('submittedProblems', 'title level');

    // Count submissions and calculate metrics
    const totalSubmissions = user.submissionCount;
    const submittedProblemsCount = user.submittedProblems.length;
    const levelStats = user.problemsSolvedByLevel; // Easy, Medium, Hard stats

    // Aggregate submissions by status
    const submissionsByStatus = await Submission.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Get recent submission activity (last 7 days)
    const recentSubmissions = await Submission.find({ 
      user: user._id,
      submittedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })
    .populate('problem', 'title')
    .sort('-submittedAt');

    // Send consolidated data to frontend
    res.json({
      username: user.username,
      email: user.email,
      totalSubmissions,
      submittedProblemsCount,
      problemsSolvedByLevel: levelStats,
      submissionsByStatus,
      recentSubmissions,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data.' });
  }
};

exports.getHeatMap =async (req, res)=>{
  try{
    const {userId}=req.params;
    const {startDate,endDate}=req.query;
    console.log(startDate,endDate)
    const heatmapData = await Submission.aggregate([
      {
          $match: {
              user: new mongoose.Types.ObjectId(userId),
              submittedAt: {
                  $gte: new Date(startDate),
                  $lte: new Date(endDate),
              },
          },
      },
      {
          $group: {
              _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$submittedAt" },
              },
              count: { $sum: 1 },
          },
      },
      { $sort: { _id: 1 } },
  ]);

    res.status(200).json(
      heatmapData.map((data)=>({
        date:data._id,
        count:data.count,
      }))
    );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error generating heatmap data' });
    }
}