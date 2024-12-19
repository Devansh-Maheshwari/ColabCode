
const express = require('express');
const router = express.Router();
const { dashboard, getHeatMap } = require('../controllers/dashboardController');

router.get('/dashboard', dashboard);
router.get('/heatmap/:userId',getHeatMap)


module.exports = router;
