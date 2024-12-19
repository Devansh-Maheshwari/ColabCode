const express = require('express');
const router = express.Router();
const { submitChallenge, getAllChallenges, getChallengeById } = require('../controllers/challengeController');

// Route for submitting a new challenge
router.post('/', submitChallenge);

// Route for getting all challenges
router.get('/', getAllChallenges);

// Route for getting a single challenge by ID
router.get('/:id', getChallengeById);

module.exports = router;
