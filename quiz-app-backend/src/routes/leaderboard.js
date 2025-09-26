const express = require('express');
const leaderboardController = require('../controllers/leaderboardController');

const router = express.Router();

router.get('/', leaderboardController.getLeaderboard);
router.get('/user/:userId', leaderboardController.getUserStats);

module.exports = router;
