const request = require('supertest');
const app = require('../src/app');

describe('Quiz API Tests', () => {
  let userId;
  let attemptId;

  // Test user registration
  test('POST /api/auth/register - should register a new user', async () => {
    const userData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.name).toBe(userData.name);
    userId = response.body.user.id;
  });

  // Test getting categories
  test('GET /api/quiz/categories - should return quiz categories', async () => {
    const response = await request(app)
      .get('/api/quiz/categories')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test starting a quiz
  test('POST /api/quiz/start - should start a new quiz', async () => {
    const categoriesResponse = await request(app).get('/api/quiz/categories');
    const categoryId = categoriesResponse.body[0].id;

    const response = await request(app)
      .post('/api/quiz/start')
      .send({
        userId,
        categoryId
      })
      .expect(200);

    expect(response.body).toHaveProperty('attemptId');
    expect(response.body).toHaveProperty('questions');
    expect(Array.isArray(response.body.questions)).toBe(true);
    attemptId = response.body.attemptId;
  });

  // Test quiz submission
  test('POST /api/quiz/submit - should submit quiz answers', async () => {
    const startResponse = await request(app)
      .post('/api/quiz/start')
      .send({
        userId,
        categoryId: (await request(app).get('/api/quiz/categories')).body[0].id
      });

    const questions = startResponse.body.questions;
    const answers = questions.map(q => ({
      questionId: q.id,
      selectedAnswer: 'A' // Mock answer
    }));

    const response = await request(app)
      .post('/api/quiz/submit')
      .send({
        attemptId: startResponse.body.attemptId,
        answers,
        timeTaken: 120
      })
      .expect(200);

    expect(response.body).toHaveProperty('score');
    expect(response.body).toHaveProperty('totalQuestions');
    expect(response.body).toHaveProperty('percentage');
  });

  // Test leaderboard
  test('GET /api/leaderboard - should return leaderboard', async () => {
    const response = await request(app)
      .get('/api/leaderboard')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});
