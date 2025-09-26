import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { quizApi } from '../../services/api';

// Async thunks
export const fetchCategories = createAsyncThunk(
  'quiz/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await quizApi.getCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch categories');
    }
  }
);

export const startQuiz = createAsyncThunk(
  'quiz/start',
  async ({ userId, categoryId }, { rejectWithValue }) => {
    try {
      const response = await quizApi.startQuiz({ userId, categoryId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to start quiz');
    }
  }
);

export const submitQuiz = createAsyncThunk(
  'quiz/submit',
  async ({ attemptId, answers, timeTaken }, { rejectWithValue }) => {
    try {
      const response = await quizApi.submitQuiz({ attemptId, answers, timeTaken });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to submit quiz');
    }
  }
);
// In your quizSlice.js, add better error handling
// export const submitQuiz = createAsyncThunk(
//   'quiz/submit',
//   async ({ attemptId, answers, timeTaken }, { rejectWithValue }) => {
//     try {
//       console.log('Frontend submitting quiz:', { attemptId, answers, timeTaken });
      
//       if (!attemptId) {
//         throw new Error('No attempt ID provided');
//       }
      
//       if (!answers || answers.length === 0) {
//         throw new Error('No answers provided');
//       }

//       const response = await quizApi.submitQuiz({ attemptId, answers, timeTaken });
//       return response.data;
//     } catch (error) {
//       console.error('Frontend submit error:', error);
      
//       if (error.response?.data) {
//         return rejectWithValue(error.response.data.error || 'Failed to submit quiz');
//       }
      
//       return rejectWithValue(error.message || 'Failed to submit quiz');
//     }
//   }
// );

const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    categories: [],
    currentQuiz: {
      attemptId: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: {},
      timeRemaining: 0,
      isActive: false,
    },
    results: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentQuestion: (state, action) => {
      state.currentQuiz.currentQuestionIndex = action.payload;
    },
    setAnswer: (state, action) => {
      const { questionId, answer } = action.payload;
      state.currentQuiz.answers[questionId] = answer;
    },
    setTimeRemaining: (state, action) => {
      state.currentQuiz.timeRemaining = action.payload;
    },
    resetQuiz: (state) => {
      state.currentQuiz = {
        attemptId: null,
        questions: [],
        currentQuestionIndex: 0,
        answers: {},
        timeRemaining: 0,
        isActive: false,
      };
      state.results = null;
      state.error = null;
    },
    setQuizActive: (state, action) => {
      state.currentQuiz.isActive = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Start quiz
      .addCase(startQuiz.pending, (state) => {
        state.loading = true;
      })
      .addCase(startQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = {
          attemptId: action.payload.attemptId,
          questions: action.payload.questions,
          currentQuestionIndex: 0,
          answers: {},
          timeRemaining: 600, // 10 minutes default
          isActive: true,
        };
      })
      .addCase(startQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit quiz
      .addCase(submitQuiz.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        console.log('Quiz submitted successfully, results:', action.payload);
        state.loading = false;
        state.results = action.payload;
        state.currentQuiz.isActive = false;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setCurrentQuestion,
  setAnswer,
  setTimeRemaining,
  resetQuiz,
  setQuizActive,
} = quizSlice.actions;

export default quizSlice.reducer;
