import React, { useEffect,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Select, Typography, Space, Alert, Row, Col, Statistic } from 'antd';
import { PlayCircleOutlined, TrophyOutlined, ClockCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { fetchCategories, startQuiz, resetQuiz } from '../../store/slices/quizSlice';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const QuizStart = ({ onQuizStart }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { categories, loading, error } = useSelector((state) => state.quiz);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(resetQuiz());
  }, [dispatch]);

  const handleStartQuiz = async () => {
    if (!selectedCategory || !user) return;

    try {
      await dispatch(startQuiz({
        userId: user.id,
        categoryId: selectedCategory
      })).unwrap();
      
      onQuizStart?.();
    } catch (error) {
      console.error('Failed to start quiz:', error);
    }
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  console.log('Categories:', categories);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <Card
        style={{
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: 12,
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div>
            <TrophyOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
            <Title level={1} style={{ marginBottom: 8 }}>
              Ready for the Challenge?
            </Title>
            <Paragraph style={{ fontSize: 16, color: '#666' }}>
              Test your knowledge and compete with others. Select a category to begin!
            </Paragraph>
          </div>

          {/* Quiz Stats */}
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={8}>
              <Card size="small" style={{ backgroundColor: '#f0f9ff' }}>
                <Statistic
                  title="Time Limit"
                  value="10"
                  suffix="minutes"
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card size="small" style={{ backgroundColor: '#f6ffed' }}>
                <Statistic
                  title="Questions"
                  value="5-10"
                  suffix="per quiz"
                  prefix={<QuestionCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card size="small" style={{ backgroundColor: '#fff7e6' }}>
                <Statistic
                  title="Scoring"
                  value="100%"
                  suffix="max score"
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
          </Row>

          {error && (
            <Alert
              message="Error loading categories"
              description={error}
              type="error"
              showIcon
            />
          )}

          {/* Category Selection */}
            <div style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>
              <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 16 }}>
                Choose Your Category
              </Text>

              <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #d9d9d9",
                outline: "none",
                appearance: "none",
                backgroundColor: "#fff",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}
            >
              <option value="" disabled>
                Select a quiz category
              </option>

              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
              {/* <Select
                size="large"
                placeholder="Select a quiz category"
                value={selectedCategory}
                onChange={setSelectedCategory}
                style={{ width: '100%' }}
                loading={loading}
                
              >
                {categories?.map((category) => (
                  <Option key={category.id} value={category.id}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{category.name}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>
                        {category.description}
                      </div>
                    </div>
                  </Option>
                ))}
              </Select> */}
            </div>




          {/* Category Preview */}
          {selectedCategoryData && (
            <Card
              size="small"
              style={{ 
                backgroundColor: '#f5f5f5',
                border: '1px solid #d9d9d9',
                maxWidth: 400,
                margin: '0 auto',
              }}
            >
              <Text strong>{selectedCategoryData.name}</Text>
              <br />
              <Text type="secondary">{selectedCategoryData.description}</Text>
            </Card>
          )}

          {/* Start Button */}
          <Button
            type="primary"
            size="large"
            icon={<PlayCircleOutlined />}
            onClick={handleStartQuiz}
            disabled={!selectedCategory || loading}
            loading={loading}
            style={{
              height: 48,
              fontSize: 16,
              fontWeight: 600,
              minWidth: 200,
            }}
          >
            Start Quiz
          </Button>

          {/* Instructions */}
          <Card
            size="small"
            title="Quiz Instructions"
            style={{ textAlign: 'left', maxWidth: 500, margin: '0 auto' }}
          >
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              <li>Read each question carefully</li>
              <li>Select the best answer from the options</li>
              <li>Use "Next" and "Previous" to navigate</li>
              <li>Submit your answers before time runs out</li>
              <li>Review your results and see the leaderboard</li>
            </ul>
          </Card>
        </Space>
      </Card>
    </div>
  );
};

export default QuizStart;
