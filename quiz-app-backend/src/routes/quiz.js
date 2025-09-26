const express = require('express');
const quizController = require('../controllers/quizController');

const router = express.Router();

router.get('/categories', quizController.getCategories);
router.post('/start', quizController.startQuiz);
router.post('/submit', quizController.submitQuiz);

module.exports = router;
