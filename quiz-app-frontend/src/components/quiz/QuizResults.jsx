import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Typography, Space, Button, Row, Col, Statistic, Tag, Collapse, Alert, Progress, Divider } from 'antd';
import { TrophyOutlined, ClockCircleOutlined, ReloadOutlined, BarChartOutlined, CheckCircleOutlined, CloseCircleOutlined, StarOutlined } from '@ant-design/icons';
import { resetQuiz } from '../../store/slices/quizSlice';
import { fetchLeaderboard } from '../../store/slices/leaderboardSlice';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const QuizResults = ({ onStartNew, onViewLeaderboard }) => {
  const dispatch = useDispatch();
  const { results } = useSelector((state) => state.quiz);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch updated leaderboard when results are shown
    if (results) {
      dispatch(fetchLeaderboard());
    }
  }, [dispatch, results]);

  if (!results) {
    return (
      <Card>
        <Alert
          message="No Results Available"
          description="Please take a quiz to see your results."
          type="info"
          showIcon
        />
      </Card>
    );
  }

  const { score, totalQuestions, percentage, results: questionResults } = results;

  const handleStartNewQuiz = () => {
    dispatch(resetQuiz());
    onStartNew?.();
  };

  const getPerformanceColor = (percent) => {
    if (percent >= 80) return '#52c41a';
    if (percent >= 60) return '#faad14';
    return '#ff4d4f';
  };

  const getPerformanceLevel = (percent) => {
    if (percent >= 90) return 'Excellent';
    if (percent >= 80) return 'Very Good';
    if (percent >= 70) return 'Good';
    if (percent >= 60) return 'Average';
    return 'Needs Improvement';
  };

  const getGradeEmoji = (percent) => {
    if (percent >= 90) return '🏆';
    if (percent >= 80) return '⭐';
    if (percent >= 70) return '👍';
    if (percent >= 60) return '👌';
    return '💪';
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Results Header */}
        <Card
          style={{
            textAlign: 'center',
            background: `linear-gradient(135deg, ${getPerformanceColor(percentage)}15, ${getPerformanceColor(percentage)}05)`,
            border: `2px solid ${getPerformanceColor(percentage)}`,
            borderRadius: 16,
          }}
        >
          <Space direction="vertical" size="middle">
            <div style={{ fontSize: 48 }}>{getGradeEmoji(percentage)}</div>
            <Title level={2} style={{ margin: 0, color: getPerformanceColor(percentage) }}>
              Quiz Completed!
            </Title>
            <Text style={{ fontSize: 18, color: '#666' }}>
              Great job, <strong>{user?.name}</strong>! Here are your results:
            </Text>
          </Space>
        </Card>

        {/* Score Overview */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Your Score"
                value={score}
                suffix={`/ ${totalQuestions}`}
                prefix={<TrophyOutlined style={{ color: getPerformanceColor(percentage) }} />}
                valueStyle={{ color: getPerformanceColor(percentage), fontSize: 28 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Percentage"
                value={percentage}
                suffix="%"
                prefix={<StarOutlined style={{ color: getPerformanceColor(percentage) }} />}
                valueStyle={{ color: getPerformanceColor(percentage), fontSize: 28 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Performance"
                value={getPerformanceLevel(percentage)}
                prefix={<BarChartOutlined style={{ color: getPerformanceColor(percentage) }} />}
                valueStyle={{ color: getPerformanceColor(percentage), fontSize: 18 }}
              />
            </Card>
          </Col>
        </Row>

        {/* Performance Progress */}
        <Card title="Performance Analysis">
          <Row gutter={[16, 16]} align="middle">
            <Col span={18}>
              <Progress
                percent={percentage}
                strokeColor={getPerformanceColor(percentage)}
                strokeWidth={12}
                format={(percent) => `${percent}%`}
              />
            </Col>
            <Col span={6} style={{ textAlign: 'center' }}>
              <Tag color={getPerformanceColor(percentage)} style={{ fontSize: 14, padding: '4px 12px' }}>
                {getPerformanceLevel(percentage)}
              </Tag>
            </Col>
          </Row>
          
          <Divider />
          
          <Row gutter={16} justify="center">
            <Col>
              <Statistic
                title="Correct Answers"
                value={score}
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col>
              <Statistic
                title="Incorrect Answers"
                value={totalQuestions - score}
                prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Col>
          </Row>
        </Card>

        {/* Detailed Results */}
        <Card title="Question Review" extra={<Text type="secondary">Review your answers</Text>}>
          <Collapse ghost>
            {questionResults?.map((result, index) => (
              <Panel
                header={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ flex: 1, paddingRight: 16 }}>
                      <strong>Q{index + 1}:</strong> {result.question}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {result.isCorrect ? (
                        <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 16 }} />
                      ) : (
                        <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 16 }} />
                      )}
                      <Tag color={result.isCorrect ? 'success' : 'error'}>
                        {result.isCorrect ? 'Correct' : 'Incorrect'}
                      </Tag>
                    </div>
                  </div>
                }
                key={index}
              >
                <div style={{ paddingLeft: 24 }}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                      <Text strong>Options:</Text>
                      <div style={{ marginTop: 8 }}>
                        {Object.entries(result.options).map(([key, value]) => (
                          <div
                            key={key}
                            style={{
                              padding: '8px 12px',
                              margin: '4px 0',
                              borderRadius: 6,
                              backgroundColor:
                                key === result.correctAnswer
                                  ? '#f6ffed'
                                  : key === result.yourAnswer && !result.isCorrect
                                  ? '#fff2f0'
                                  : '#fafafa',
                              border:
                                key === result.correctAnswer
                                  ? '1px solid #b7eb8f'
                                  : key === result.yourAnswer && !result.isCorrect
                                  ? '1px solid #ffccc7'
                                  : '1px solid #d9d9d9',
                            }}
                          >
                            <Space>
                              <Text strong>{key}.</Text>
                              <Text>{value}</Text>
                              {key === result.correctAnswer && (
                                <Tag color="success" size="small">
                                  Correct Answer
                                </Tag>
                              )}
                              {key === result.yourAnswer && key !== result.correctAnswer && (
                                <Tag color="error" size="small">
                                  Your Answer
                                </Tag>
                              )}
                            </Space>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Space>
                </div>
              </Panel>
            ))}
          </Collapse>
        </Card>

        {/* Action Buttons */}
        <Card>
          <Row gutter={16} justify="center">
            <Col>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                size="large"
                onClick={handleStartNewQuiz}
                style={{ minWidth: 150 }}
              >
                Take Another Quiz
              </Button>
            </Col>
            <Col>
              <Button
                icon={<BarChartOutlined />}
                size="large"
                onClick={onViewLeaderboard}
                style={{ minWidth: 150 }}
              >
                View Leaderboard
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Motivational Message */}
        <Card style={{ textAlign: 'center', backgroundColor: '#f0f9ff' }}>
          <Space direction="vertical">
            <Title level={4} style={{ color: '#1890ff' }}>
              {percentage >= 80 
                ? "🎉 Outstanding Performance!" 
                : percentage >= 60 
                ? "👏 Good Job! Keep practicing!" 
                : "💪 Don't give up! Practice makes perfect!"}
            </Title>
            <Paragraph style={{ color: '#666', maxWidth: 600, margin: '0 auto' }}>
              {percentage >= 80 
                ? "You've demonstrated excellent knowledge! Your hard work is paying off." 
                : percentage >= 60 
                ? "You're on the right track! A little more practice will help you excel." 
                : "Every expert was once a beginner. Keep learning and you'll improve!"}
            </Paragraph>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default QuizResults;
