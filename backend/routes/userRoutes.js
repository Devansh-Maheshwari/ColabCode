const express = require('express');
const router = express.Router();
// const { getUserSubmissionsForProblem,submitSolution } = require('../controllers/submissionController');

const {userLogin,userSignup}=require('../controllers/userController')
router.post('/signup', userSignup);

router.post('/login', userLogin);

module.exports = router;