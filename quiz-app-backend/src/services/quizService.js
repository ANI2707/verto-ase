const { supabase } = require('../config/supabase');

class QuizService {
  async getQuizCategories() {
    const { data, error } = await supabase
      .from('quiz_categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  }

  async getQuestionsByCategory(categoryId) {
    const { data, error } = await supabase
      .from('questions')
      .select('id, question_text, option_a, option_b, option_c, option_d, difficulty_level')
      .eq('category_id', categoryId)
      .order('difficulty_level');
    
    if (error) throw error;
    return data;
  }

  async createQuizAttempt(userId, categoryId) {
    // FIXED: Added .select() to return the inserted row
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert([{
        user_id: userId,
        category_id: categoryId,
        score: 0,
        total_questions: 0
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating quiz attempt:', error);
      throw error;
    }
    return data;
  }

  async submitQuizAnswers(attemptId, answers) {
    try {
      console.log('Submitting quiz with attemptId:', attemptId);
      console.log('Answers received:', answers);

      // Step 1: Verify the quiz attempt exists
      const { data: attemptExists, error: attemptError } = await supabase
        .from('quiz_attempts')
        .select('id, user_id, category_id')
        .eq('id', attemptId)
        .maybeSingle(); // FIXED: Use maybeSingle instead of single

      if (attemptError) {
        console.error('Error checking attempt:', attemptError);
        throw attemptError;
      }

      if (!attemptExists) {
        throw new Error(`Quiz attempt with ID ${attemptId} not found`);
      }

      console.log('Quiz attempt found:', attemptExists);

      // Step 2: Get questions with correct answers
      const questionIds = answers.map(a => a.questionId);
      console.log('Question IDs:', questionIds);

      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('id, correct_answer')
        .in('id', questionIds);
      
      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        throw questionsError;
      }

      if (!questions || questions.length === 0) {
        throw new Error('No questions found for the provided IDs');
      }

      console.log('Questions found:', questions);

      // Step 3: Calculate score and prepare answer records
      let score = 0;
      const userAnswers = answers.map(answer => {
        const question = questions.find(q => q.id === answer.questionId);
        if (!question) {
          console.warn(`Question not found for ID: ${answer.questionId}`);
          return null;
        }

        const isCorrect = question.correct_answer === answer.selectedAnswer;
        if (isCorrect) score++;

        return {
          attempt_id: attemptId,
          question_id: answer.questionId,
          selected_answer: answer.selectedAnswer,
          is_correct: isCorrect
        };
      }).filter(Boolean); // Remove null entries

      console.log('User answers to insert:', userAnswers);
      console.log('Calculated score:', score);

      // Step 4: Insert user answers
      if (userAnswers.length > 0) {
        const { error: answersError } = await supabase
          .from('user_answers')
          .insert(userAnswers);
        
        if (answersError) {
          console.error('Error inserting answers:', answersError);
          throw answersError;
        }
        console.log('User answers inserted successfully');
      }

      // Step 5: Update quiz attempt with score
      const timeTaken = answers[0]?.timeTaken || 0;

      console.log('Time taken:', timeTaken);
      console.log('score:', score);
      console.log('total_questions', answers.length);
      console.log('attemptId', attemptId);
      

      const { data: updatedAttempt, error: updateError } = await supabase
        .from('quiz_attempts')
        .update({
          score,
          total_questions: answers.length,
          time_taken: timeTaken,
          completed_at: new Date().toISOString()
        })
        .eq('id', attemptId)
        .select()
        .maybeSingle();
      
      if (updateError) {
        console.error('Error updating quiz attempt:', updateError);
        throw updateError;
      }

      console.log('Quiz attempt updated:', updatedAttempt);

      // Step 6: Get detailed results with proper joins
      const { data: results, error: resultsError } = await supabase
        .from('user_answers')
        .select(`
          question_id,
          selected_answer,
          is_correct,
          questions (
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer
          )
        `)
        .eq('attempt_id', attemptId);
      
      if (resultsError) {
        console.error('Error fetching results:', resultsError);
        throw resultsError;
      }

      console.log('Results fetched:', results);

      return {
        attempt: updatedAttempt,
        score,
        totalQuestions: answers.length,
        results: results || []
      };

    } catch (error) {
      console.error('Error in submitQuizAnswers:', error);
      throw error;
    }
  }
}

module.exports = new QuizService();
