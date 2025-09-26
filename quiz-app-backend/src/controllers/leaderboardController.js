const { supabase } = require('../config/supabase');

class LeaderboardController {
  async getLeaderboard(req, res) {
    try {
      const { categoryId } = req.query;
      
      let query = supabase
        .from('quiz_attempts')
        .select(`
          id,
          score,
          total_questions,
          time_taken,
          completed_at,
          users (name, email),
          quiz_categories (name)
        `)
        .order('score', { ascending: false })
        .order('time_taken', { ascending: true })
        

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      const leaderboard = data.map((attempt, index) => ({
        rank: index + 1,
        name: attempt.users.name,
        email: attempt.users.email,
        score: attempt.score,
        totalQuestions: attempt.total_questions,
        percentage: Math.round((attempt.score / attempt.total_questions) * 100),
        timeTaken: attempt.time_taken,
        category: attempt.quiz_categories.name,
        completedAt: attempt.completed_at
      }));

      res.json(leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  }

  async getUserStats(req, res) {
    try {
      const { userId } = req.params;
      
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select(`
          score,
          total_questions,
          time_taken,
          completed_at,
          quiz_categories (name)
        `)
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });
      
      if (error) throw error;

      const stats = {
        totalAttempts: data.length,
        averageScore: data.length > 0 ? Math.round(data.reduce((sum, attempt) => sum + (attempt.score / attempt.total_questions), 0) / data.length * 100) : 0,
        bestScore: data.length > 0 ? Math.max(...data.map(attempt => Math.round((attempt.score / attempt.total_questions) * 100))) : 0,
        recentAttempts: data.slice(0, 5).map(attempt => ({
          score: attempt.score,
          totalQuestions: attempt.total_questions,
          percentage: Math.round((attempt.score / attempt.total_questions) * 100),
          category: attempt.quiz_categories.name,
          completedAt: attempt.completed_at
        }))
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({ error: 'Failed to fetch user statistics' });
    }
  }
}

module.exports = new LeaderboardController();
