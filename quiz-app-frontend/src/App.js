import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, ConfigProvider, theme, message } from 'antd';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Loading from './components/common/Loading';
import UserForm from './components/auth/UserForm';
import QuizStart from './components/quiz/QuizStart';
import QuizQuestion from './components/quiz/QuizQuestion';
import QuizResults from './components/quiz/QuizResults';
import Leaderboard from './components/leaderboard/Leaderboard';

// Redux
import { setUser } from './store/slices/authSlice';
import { resetQuiz } from './store/slices/quizSlice';

// Styles
import './styles/global.css';

const { Content } = Layout;

function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { currentQuiz ,results} = useSelector((state) => state.quiz);
  const [currentView, setCurrentView] = useState('login');
  const [appLoading, setAppLoading] = useState(true);

console.log("currentView-------->",currentView);
console.log("results------->",results);
console.log("isAuthenticated------->",isAuthenticated);
  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for stored user
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          dispatch(setUser(userData));
          // setCurrentView('home');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        message.error('Error loading user data');
      } finally {
        setAppLoading(false);
      }
    };

    initializeApp();
  }, [dispatch]);

  // Handle authentication state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      if (currentView === 'login') {
        console.log('User authenticated, navigating to home');
        setCurrentView('home');
      }
    } else {
      setCurrentView('login');
      dispatch(resetQuiz());
    }
  }, [isAuthenticated, user, currentView,dispatch]);

  // Navigation handler
  const handleNavigate = (view) => {
    setCurrentView(view);
    
    if (view === 'home') {
      dispatch(resetQuiz());
    }
  };

  // Quiz flow handlers
  const handleQuizStart = () => {
    setCurrentView('quiz');
  };

  const handleQuizComplete = () => {
    console.log('Quiz complete, navigating to results');
    setCurrentView('results');
  };

  const handleStartNewQuiz = () => {
    setCurrentView('home');
  };

  const handleViewLeaderboard = () => {
    setCurrentView('leaderboard');
  };

  const handleUserFormSuccess = () => {
    setCurrentView('home');
    message.success('Welcome to QuizMaster!');
  };

  // Render current view
  const renderCurrentView = () => {
    if (!isAuthenticated) {
      return <UserForm onSuccess={handleUserFormSuccess} />;
    }

    switch (currentView) {
      case 'home':
        return <QuizStart onQuizStart={handleQuizStart} />;
      
      case 'quiz':
        if (currentQuiz.isActive && currentQuiz.questions.length > 0) {
          return <QuizQuestion onQuizComplete={handleQuizComplete} />;
        }
        // return <QuizStart onQuizStart={handleQuizStart} />;
      
      case 'results':
        console.log('Rendering results, current results:', results);
        console.log('kjja', currentView);
        if (results) {
          return (
            <QuizResults
              onStartNew={handleStartNewQuiz}
              onViewLeaderboard={handleViewLeaderboard}
            />
          );
        }
        return <QuizStart onQuizStart={handleQuizStart} />;
      
      case 'leaderboard':
        return <Leaderboard onBackToQuiz={() => handleNavigate('home')} />;
      
      default:
        return <QuizStart onQuizStart={handleQuizStart} />;
    }
  };

  if (appLoading) {
    return (
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 8,
            fontSize: 14,
          },
        }}
      >
        <Layout style={{ minHeight: '100vh' }}>
          <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loading message="Initializing QuizMaster..." />
          </Content>
        </Layout>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
          fontSize: 14,
          colorBgContainer: '#ffffff',
          colorBgLayout: '#f0f2f5',
        },
        components: {
          Button: {
            borderRadius: 8,
            controlHeight: 40,
          },
          Input: {
            borderRadius: 8,
            controlHeight: 40,
          },
          Card: {
            borderRadius: 12,
          },
          Table: {
            borderRadius: 8,
          },
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Header onNavigate={handleNavigate} />
        
        <Content style={{ 
          padding: isAuthenticated ? '24px' : '0',
          minHeight: 'calc(100vh - 128px)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ 
            flex: 1,
            display: 'flex',
            alignItems: isAuthenticated ? 'flex-start' : 'center',
            justifyContent: 'center',
            padding: isAuthenticated ? '0' : '20px',
          }}>
            {renderCurrentView()}
          </div>
        </Content>
        
        <Footer />
      </Layout>
    </ConfigProvider>
  );
}

export default App;
