const quizService = require('../services/quizService');

class QuizController {
  async getCategories(req, res) {
    try {
      const categories = await quizService.getQuizCategories();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ 
        error: 'Failed to fetch categories',
        details: error.message 
      });
    }
  }

  async startQuiz(req, res) {
    try {
      const { userId, categoryId } = req.body;
      
      if (!userId || !categoryId) {
        return res.status(400).json({ 
          error: 'User ID and category ID are required' 
        });
      }

      console.log('Starting quiz for user:', userId, 'category:', categoryId);

      // Verify user exists
      const { data: userExists, error: userError } = await require('../config/supabase').supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (userError) {
        console.error('Error checking user:', userError);
        return res.status(500).json({ error: 'Error verifying user' });
      }

      if (!userExists) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify category exists
      const { data: categoryExists, error: categoryError } = await require('../config/supabase').supabase
        .from('quiz_categories')
        .select('id')
        .eq('id', categoryId)
        .maybeSingle();

      if (categoryError) {
        console.error('Error checking category:', categoryError);
        return res.status(500).json({ error: 'Error verifying category' });
      }

      if (!categoryExists) {
        return res.status(404).json({ error: 'Category not found' });
      }

      // Create quiz attempt
      const attempt = await quizService.createQuizAttempt(userId, categoryId);
      console.log('Quiz attempt created:', attempt);
      
      // Get questions (without correct answers)
      const questions = await quizService.getQuestionsByCategory(categoryId);
      console.log('Questions fetched:', questions.length);
      
      if (questions.length === 0) {
        return res.status(404).json({ 
          error: 'No questions found for this category' 
        });
      }

      res.json({
        attemptId: attempt.id,
        questions: questions.map(q => ({
          id: q.id,
          question: q.question_text,
          options: {
            A: q.option_a,
            B: q.option_b,
            C: q.option_c,
            D: q.option_d
          },
          difficulty: q.difficulty_level
        }))
      });
    } catch (error) {
      console.error('Error starting quiz:', error);
      res.status(500).json({ 
        error: 'Failed to start quiz',
        details: error.message 
      });
    }
  }

  async submitQuiz(req, res) {
    console.log("inside submit call")
    try {
      const { attemptId, answers, timeTaken } = req.body;
      
      console.log('Submit quiz request:', { attemptId, answers, timeTaken });

      if (!attemptId || !answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: 'Invalid submission data' });
      }

      if (answers.length === 0) {
        return res.status(400).json({ error: 'No answers provided' });
      }

      // Validate answer format
      for (const answer of answers) {
        if (!answer.questionId || !answer.selectedAnswer) {
          return res.status(400).json({ 
            error: 'Invalid answer format. Each answer must have questionId and selectedAnswer' 
          });
        }
      }

      // Add time taken to answers
      const answersWithTime = answers.map(answer => ({
        ...answer,
        timeTaken: timeTaken || 0
      }));

      const result = await quizService.submitQuizAnswers(attemptId, answersWithTime);
      
      res.json({
        score: result.score,
        totalQuestions: result.totalQuestions,
        percentage: Math.round((result.score / result.totalQuestions) * 100),
        results: result.results.map(r => ({
          question: r.questions?.question_text || 'Question not found',
          yourAnswer: r.selected_answer,
          correctAnswer: r.questions?.correct_answer || 'Unknown',
          isCorrect: r.is_correct,
          options: r.questions ? {
            A: r.questions.option_a,
            B: r.questions.option_b,
            C: r.questions.option_c,
            D: r.questions.option_d
          } : {}
        }))
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      res.status(500).json({ 
        error: 'Failed to submit quiz',
        details: error.message 
      });
    }
  }
}

module.exports = new QuizController();
