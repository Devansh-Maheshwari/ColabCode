const Problem = require('../models/problem'); 
const User=require('../models/user')
const asyncHandler = require('express-async-handler'); 

exports.submitChallenge = asyncHandler(async (req, res) => {
    try {
        const { title, description, level, inputCases, outputCases, userId } = req.body;

        if (!title || !description || !level || !inputCases || !outputCases || !userId) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newProblem = new Problem({
            title,
            description,
            level,
            inputCases,
            outputCases,
            submittedBy: userId,
        });

        const savedProblem = await newProblem.save();

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.submittedProblems.push(savedProblem._id);
        // user.submissionCount += 1; 
        await user.save();

        res.status(201).json(savedProblem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


exports.getAllChallenges = asyncHandler(async (req, res) => {
    try {
       
        const problems = await Problem.find().populate('submittedBy', 'username'); 

        res.status(200).json(problems);
    } catch (error) {
       
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


exports.getChallengeById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        const problem = await Problem.findById(id).populate('submittedBy', 'username');

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        res.status(200).json(problem);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
