import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Radio, Button, Space, Typography, Progress, Tag, Row, Col, Alert } from 'antd';
import { LeftOutlined, RightOutlined, CheckOutlined } from '@ant-design/icons';
import { setCurrentQuestion, setAnswer, submitQuiz } from '../../store/slices/quizSlice';
import Timer from './Timer';

const { Title, Text } = Typography;

const QuizQuestion = ({ onQuizComplete }) => {
  const dispatch = useDispatch();
  const { currentQuiz, loading } = useSelector((state) => state.quiz);
  const { user } = useSelector((state) => state.auth);
  
  const [timeStarted] = useState(Date.now());
  
  const {
    questions,
    currentQuestionIndex,
    answers,
    attemptId,
    timeRemaining,
    isActive,
  } = currentQuiz;

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const currentAnswer = answers[currentQuestion?.id];

  // Calculate progress
  const answeredQuestions = Object.keys(answers).length;
  const progressPercent = (answeredQuestions / questions.length) * 100;

  const handleAnswerChange = (e) => {
    dispatch(setAnswer({
      questionId: currentQuestion.id,
      answer: e.target.value,
    }));
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      dispatch(setCurrentQuestion(currentQuestionIndex - 1));
    }
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      dispatch(setCurrentQuestion(currentQuestionIndex + 1));
    }
  };

  const handleSubmit = async () => {
    const timeTaken = Math.floor((Date.now() - timeStarted) / 1000);
    
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      selectedAnswer: answer,
    }));

    try {
      await dispatch(submitQuiz({
        attemptId,
        answers: formattedAnswers,
        timeTaken,
      })).unwrap();
      
      onQuizComplete();
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    }
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  if (!currentQuestion) {
    return (
      <Card>
        <Alert
          message="No questions available"
          description="Please try starting the quiz again."
          type="warning"
          showIcon
        />
      </Card>
    );
  }

  const getDifficultyColor = (level) => {
    switch (level) {
      case 1: return 'green';
      case 2: return 'blue';
      case 3: return 'orange';
      case 4: return 'red';
      case 5: return 'purple';
      default: return 'default';
    }
  };

  const getDifficultyText = (level) => {
    switch (level) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      case 4: return 'Very Hard';
      case 5: return 'Expert';
      default: return 'Unknown';
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Timer */}
        <Timer
          initialTime={600} // 10 minutes
          onTimeUp={handleTimeUp}
          isActive={isActive}
        />

        {/* Progress */}
        <Card size="small">
          <Row gutter={16} align="middle">
            <Col span={12}>
              <Text strong>
                Question {currentQuestionIndex + 1} of {questions.length}
              </Text>
            </Col>
            <Col span={12}>
              <div style={{ textAlign: 'right' }}>
                <Text type="secondary">
                  {answeredQuestions} answered
                </Text>
                <Progress
                  percent={progressPercent}
                  size="small"
                  style={{ marginTop: 4 }}
                />
              </div>
            </Col>
          </Row>
        </Card>

        {/* Question Card */}
        <Card
          style={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: 12,
          }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Question Header */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0, flex: 1 }}>
                  {currentQuestion.question}
                </Title>
                <Tag color={getDifficultyColor(currentQuestion.difficulty)}>
                  {getDifficultyText(currentQuestion.difficulty)}
                </Tag>
              </div>
            </div>

            {/* Answer Options */}
            <Radio.Group
              value={currentAnswer}
              onChange={handleAnswerChange}
              style={{ width: '100%' }}
              size="large"
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {Object.entries(currentQuestion.options).map(([key, value]) => (
                  <Radio
                    key={key}
                    value={key}
                    style={{
                      padding: '12px 16px',
                      border: '1px solid #d9d9d9',
                      borderRadius: 8,
                      backgroundColor: currentAnswer === key ? '#e6f7ff' : '#fff',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ marginLeft: 8, fontSize: 16 }}>
                      <strong>{key}.</strong> {value}
                    </div>
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Space>
        </Card>

        {/* Navigation */}
        <Card size="small">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <Button
              icon={<LeftOutlined />}
              onClick={handlePrevious}
              disabled={isFirstQuestion}
            >
              Previous
            </Button>

            <Space>
              {/* Question indicators */}
              <Space size="small">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 
                        index === currentQuestionIndex 
                          ? '#1890ff' 
                          : answers[questions[index]?.id] 
                          ? '#52c41a' 
                          : '#d9d9d9',
                      cursor: 'pointer',
                    }}
                    onClick={() => dispatch(setCurrentQuestion(index))}
                  />
                ))}
              </Space>
            </Space>

            {isLastQuestion ? (
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={handleSubmit}
                loading={loading}
                disabled={answeredQuestions === 0}
                style={{ minWidth: 120 }}
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<RightOutlined />}
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </div>
        </Card>

        {/* Submit Warning */}
        {answeredQuestions < questions.length && (
          <Alert
            message={`You have ${questions.length - answeredQuestions} unanswered questions`}
            description="Make sure to answer all questions before submitting."
            type="info"
            showIcon
          />
        )}
      </Space>
    </div>
  );
};

export default QuizQuestion;
