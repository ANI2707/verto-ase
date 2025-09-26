import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Table, Typography, Select, Space, Button, Tag, Row, Col, Statistic, Avatar, Empty, Spin } from 'antd';
import { TrophyOutlined, UserOutlined, ClockCircleOutlined, ReloadOutlined, StarOutlined, CrownOutlined } from '@ant-design/icons';
import { fetchLeaderboard, fetchUserStats } from '../../store/slices/leaderboardSlice';
import { fetchCategories } from '../../store/slices/quizSlice';

const { Title, Text } = Typography;
const { Option } = Select;

const Leaderboard = ({ onBackToQuiz }) => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { leaderboard, userStats, loading } = useSelector((state) => state.leaderboard);
  const { categories } = useSelector((state) => state.quiz);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchLeaderboard());
    if (user?.id) {
      dispatch(fetchUserStats(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    dispatch(fetchLeaderboard(selectedCategory));
  }, [dispatch, selectedCategory]);

  const handleRefresh = () => {
    dispatch(fetchLeaderboard(selectedCategory));
    if (user?.id) {
      dispatch(fetchUserStats(user.id));
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <CrownOutlined style={{ color: '#FFD700', fontSize: 20 }} />;
      case 2: return <TrophyOutlined style={{ color: '#C0C0C0', fontSize: 18 }} />;
      case 3: return <TrophyOutlined style={{ color: '#CD7F32', fontSize: 16 }} />;
      default: return <span style={{ fontWeight: 'bold', color: '#666' }}>{rank}</span>;
    }
  };

  const getRankBackground = (rank) => {
    switch (rank) {
      case 1: return 'linear-gradient(135deg, #FFD70020, #FFD70010)';
      case 2: return 'linear-gradient(135deg, #C0C0C020, #C0C0C010)';
      case 3: return 'linear-gradient(135deg, #CD7F3220, #CD7F3210)';
      default: return 'transparent';
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      align: 'center',
      render: (rank) => getRankIcon(rank),
    },
    {
      title: 'Player',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <div>
            <div style={{ fontWeight: 600 }}>{name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      align: 'center',
      render: (score, record) => (
        <div>
          <Text strong style={{ fontSize: 16 }}>
            {score}/{record.totalQuestions}
          </Text>
        </div>
      ),
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      align: 'center',
      render: (percentage) => (
        <Tag 
          color={percentage >= 80 ? 'success' : percentage >= 60 ? 'warning' : 'error'}
          style={{ fontSize: 14, padding: '4px 8px' }}
        >
          {percentage}%
        </Tag>
      ),
    },
    {
      title: 'Time',
      dataIndex: 'timeTaken',
      key: 'timeTaken',
      align: 'center',
      render: (time) => (
        <Space>
          <ClockCircleOutlined />
          <Text>{formatTime(time)}</Text>
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'completedAt',
      key: 'completedAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  const topThree = leaderboard.slice(0, 3);
  const remainingPlayers = leaderboard.slice(3);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <Card>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <TrophyOutlined style={{ fontSize: 24, color: '#FFD700' }} />
                <Title level={2} style={{ margin: 0 }}>
                  Leaderboard
                </Title>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
                  Refresh
                </Button>
                <Button type="primary" onClick={onBackToQuiz}>
                  Take Quiz
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* User Stats */}
        {userStats && (
          <Card title="Your Statistics" extra={<StarOutlined style={{ color: '#faad14' }} />}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={6}>
                <Statistic
                  title="Total Attempts"
                  value={userStats.totalAttempts}
                  prefix={<TrophyOutlined />}
                />
              </Col>
              <Col xs={24} sm={6}>
                <Statistic
                  title="Average Score"
                  value={userStats.averageScore}
                  suffix="%"
                  prefix={<StarOutlined />}
                />
              </Col>
              <Col xs={24} sm={6}>
                <Statistic
                  title="Best Score"
                  value={userStats.bestScore}
                  suffix="%"
                  prefix={<CrownOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col xs={24} sm={6}>
                <Statistic
                  title="Recent Activity"
                  value={userStats.recentAttempts.length}
                  suffix="quizzes"
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
            </Row>
          </Card>
        )}

        {/* Category Filter */}
        <Card>
          <Row align="middle" gutter={16}>
            <Col>
              <Text strong>Filter by Category:</Text>
            </Col>
            <Col flex={1}>
              <select
    value={selectedCategory || ""}
    onChange={(e) => setSelectedCategory(e.target.value || null)}
    style={{
      width: "100%",
      padding: "8px 12px",
      fontSize: "14px",
      borderRadius: "4px",
      border: "1px solid #d9d9d9",
      outline: "none",
      appearance: "none",
      backgroundColor: "#fff",
      cursor: "pointer",
      boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
    }}
  >
    {/* Placeholder option */}
    <option value="" disabled>
      All Categories
    </option>

    {categories.map((category) => (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    ))}

    {/* Optional clear option */}
    {selectedCategory && (
      <option value="">
        Clear Selection
      </option>
    )}
  </select>
            </Col>
          </Row>
        </Card>

        {/* Top 3 Podium */}
        {topThree.length > 0 && (
          <Card title="🏆 Top Performers">
            <Row gutter={[16, 16]} justify="center">
              {topThree.map((player, index) => (
                <Col key={player.rank} xs={24} sm={8}>
                  <Card
                    style={{
                      textAlign: 'center',
                      background: getRankBackground(player.rank),
                      border: `2px solid ${player.rank === 1 ? '#FFD700' : player.rank === 2 ? '#C0C0C0' : '#CD7F32'}`,
                    }}
                  >
                    <Space direction="vertical" size="middle">
                      <div style={{ fontSize: 32 }}>
                        {getRankIcon(player.rank)}
                      </div>
                      <div>
                        <Title level={4} style={{ margin: 0 }}>
                          {player.name}
                        </Title>
                        <Text type="secondary">{player.email}</Text>
                      </div>
                      <div>
                        <Statistic
                          value={player.percentage}
                          suffix="%"
                          valueStyle={{
                            color: player.rank === 1 ? '#FFD700' : player.rank === 2 ? '#C0C0C0' : '#CD7F32',
                            fontSize: 24,
                          }}
                        />
                        <Text type="secondary">
                          {player.score}/{player.totalQuestions} correct
                        </Text>
                      </div>
                      <Tag color="blue">{player.category}</Tag>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        )}

        {/* Full Leaderboard Table */}
        <Card title="Complete Rankings">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Spin size="large" />
              <div style={{ marginTop: 16 }}>
                <Text>Loading leaderboard...</Text>
              </div>
            </div>
          ) : leaderboard.length === 0 ? (
            <Empty
              description="No quiz attempts found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={onBackToQuiz}>
                Be the first to take a quiz!
              </Button>
            </Empty>
          ) : (
            <Table
              columns={columns}
              dataSource={leaderboard}
              rowKey="rank"
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} players`,
              }}
              rowClassName={(record) => 
                record.email === user?.email ? 'highlight-current-user' : ''
              }
              scroll={{ x: 800 }}
            />
          )}
        </Card>
      </Space>

      <style jsx>{`
        .highlight-current-user {
          background-color: #e6f7ff !important;
          border: 2px solid #1890ff;
        }
      `}</style>
    </div>
  );
};

export default Leaderboard;
