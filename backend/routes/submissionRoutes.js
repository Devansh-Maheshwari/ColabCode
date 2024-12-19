const express = require('express');
const { runCode, submitCode, submissionHistory } = require('../controllers/submissionController');
const router = express.Router();

// Align routes with frontend expectations
router.post('/run', runCode);
router.post('/submit', submitCode);
router.get('/submissions/:problemId/:userId',submissionHistory)
module.exports = router;
