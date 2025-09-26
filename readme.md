# QuizMaster - Full-Stack Online Quiz Application

A comprehensive full-stack quiz application built with **React, Redux Toolkit, Node.js, Express, and Supabase**. Test your knowledge, track your progress, and compete with others on the leaderboard!
https://verto-quiz-master.vercel.app/

---

## 🎯 Project Overview
QuizMaster is a modern, responsive online quiz platform that allows users to take timed quizzes across different categories, view detailed results, and compete on a global leaderboard. The application features user authentication, real-time scoring, and a professional UI/UX built with Ant Design.

---

## Key Features
- 🔐 **User Authentication** – Register/login system with email validation  
- 📚 **Multiple Quiz Categories** – JavaScript, React, General Programming, and more  
- ⏰ **Timed Quizzes** – 10-minute countdown timer with auto-submission  
- 🎯 **Interactive Quiz Interface** – Navigate between questions, review answers  
- 📊 **Detailed Results** – See correct/incorrect answers with explanations  
- 🏆 **Global Leaderboard** – Compete with other users, view personal statistics  
- 📱 **Responsive Design** – Works seamlessly on desktop and mobile devices  
- ⚡ **Real-time Updates** – Live scoring and leaderboard updates  
- 🎨 **Professional UI** – Built with Ant Design components  

---

## 🛠️ Technology Stack

### Frontend
- React 18 – Functional components & hooks  
- Redux Toolkit – State management with RTK Query  
- Ant Design – Professional UI component library  
- React Router v6 – Client-side routing  
- Axios – HTTP client for API requests  
- Redux Persist – Persist user authentication state  

### Backend
- Node.js – Server-side JavaScript runtime  
- Express.js – Web application framework  
- Supabase – PostgreSQL database with real-time features  
- Helmet – Security middleware  
- CORS – Cross-origin resource sharing  
- Morgan – HTTP request logger  

### Database
- PostgreSQL (via Supabase) – Relational database  

---

## 📋 Prerequisites
- Node.js (v20 or higher)  
- npm or yarn package manager  
- Supabase account (free tier available)  
- Git for version control  

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/ani2707/verto-ase
cd quiz-master
```

### 2. Database Setup (Supabase)

1. **Create a new project** at [Supabase](https://app.supabase.com/).

2. Go to **Settings > API** and copy your **Project URL** and **Anon Key**.

3. In the **SQL Editor**, run the following database schema:

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz categories
CREATE TABLE quiz_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions table
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES quiz_categories(id),
  question_text TEXT NOT NULL,
  option_a VARCHAR(255) NOT NULL,
  option_b VARCHAR(255) NOT NULL,
  option_c VARCHAR(255) NOT NULL,
  option_d VARCHAR(255) NOT NULL,
  correct_answer CHAR(1) CHECK (correct_answer IN ('A', 'B', 'C', 'D')) NOT NULL,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz attempts
CREATE TABLE quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  category_id UUID REFERENCES quiz_categories(id),
  score INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  time_taken INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User answers
CREATE TABLE user_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID REFERENCES quiz_attempts(id),
  question_id UUID REFERENCES questions(id),
  selected_answer CHAR(1) CHECK (selected_answer IN ('A', 'B', 'C', 'D')),
  is_correct BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);



-- Create public access policies (for demo)
CREATE POLICY "Public access" ON users FOR ALL USING (true);
CREATE POLICY "Public access" ON quiz_categories FOR ALL USING (true);
CREATE POLICY "Public access" ON questions FOR ALL USING (true);
CREATE POLICY "Public access" ON quiz_attempts FOR ALL USING (true);
CREATE POLICY "Public access" ON user_answers FOR ALL USING (true);

-- Insert sample categories
INSERT INTO quiz_categories (name, description) VALUES
('JavaScript Fundamentals', 'Basic JavaScript concepts and syntax'),
('React Development', 'React.js framework and components'),
('General Programming', 'Programming logic and best practices');

-- Insert sample questions
INSERT INTO questions (category_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty_level) VALUES
((SELECT id FROM quiz_categories WHERE name = 'JavaScript Fundamentals'), 'What is the correct way to create a function in JavaScript?', 'function myFunc() {}', 'create function myFunc() {}', 'def myFunc() {}', 'func myFunc() {}', 'A', 1),
((SELECT id FROM quiz_categories WHERE name = 'JavaScript Fundamentals'), 'Which method is used to add an element to the end of an array?', 'append()', 'push()', 'add()', 'insert()', 'B', 2),
((SELECT id FROM quiz_categories WHERE name = 'React Development'), 'What is JSX?', 'A JavaScript library', 'A syntax extension for JavaScript', 'A database query language', 'A CSS framework', 'B', 2),
((SELECT id FROM quiz_categories WHERE name = 'React Development'), 'Which hook is used to manage component state in React?', 'useEffect', 'useState', 'useContext', 'useReducer', 'B', 1),
((SELECT id FROM quiz_categories WHERE name = 'General Programming'), 'What does DRY principle stand for?', 'Do Repeat Yourself', 'Don''t Repeat Yourself', 'Do Run Yesterday', 'Don''t Run Yesterday', 'B', 3);
```

### 3. Backend Setup

1. **Navigate to the backend folder** and install dependencies:

```bash
cd quiz-app-backend
npm install
```
2. Create a .env file in quiz-app-backend with the following content:

```bash
PORT=5000
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key
NODE_ENV=development
```
3. Start the backend server:

```bash
npm run dev
```
4. Your backend server will run at: http://localhost:5000


### 4. Frontend Setup
1. **Navigate to the frontend folder** and install dependencies:

```bash
cd quiz-app-frontend
npm install
```
2. Create a .env file in quiz-app-frontend with the following content:


```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=QuizMaster
GENERATE_SOURCEMAP=false

```
3. Start the frontend development server:

```bash
npm start
```
4. Your frontend will run at: http://localhost:3000


## 🧪 Running Tests
### Backend Tests
The backend includes comprehensive test coverage using Jest and Supertest:

```bash
cd quiz-app-backend
```
### Run all tests
```bash
npm test
```
### Run tests in watch mode
```bash
npm run test:watch
```
### Run tests with coverage report
```bash
npm run test:coverage
```
### Run specific test file
```bash
npx jest tests/quiz.test.js
```
### Run tests with verbose output
```bash
npm run test:verbose
```
### Test Coverage
The test suite covers:

✅ User registration and authentication

✅ Quiz category retrieval

✅ Quiz creation and management

✅ Answer submission and scoring

✅ Leaderboard functionality

✅ Error handling and edge cases
