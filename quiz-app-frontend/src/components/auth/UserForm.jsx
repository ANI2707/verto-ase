import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Form, Input, Button, Alert, Typography, Space } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import { registerUser, loginUser, clearError } from '../../store/slices/authSlice';

const { Title, Text } = Typography;

const UserForm = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleSubmit = async (values) => {
    try {
      if (isLogin) {
        await dispatch(loginUser(values.email)).unwrap();
      } else {
        await dispatch(registerUser(values)).unwrap();
      }
      onSuccess?.();
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    form.resetFields();
    dispatch(clearError());
  };

  return (
    <Card
      style={{ 
        width: '100%', 
        maxWidth: 400, 
        margin: '0 auto',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={3} style={{ marginBottom: 8 }}>
            {isLogin ? 'Welcome Back!' : 'Get Started'}
          </Title>
          <Text type="secondary">
            {isLogin ? 'Sign in to continue your quiz journey' : 'Create your account to start taking quizzes'}
          </Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => dispatch(clearError())}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          {!isLogin && (
            <Form.Item
              name="name"
              label="Full Name"
              rules={[
                { required: true, message: 'Please enter your name' },
                { min: 2, message: 'Name must be at least 2 characters' },
                { max: 50, message: 'Name must not exceed 50 characters' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your full name"
                autoComplete="name"
              />
            </Form.Item>
          )}

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter your email"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{ 
                height: 48,
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Button type="link" onClick={toggleMode} style={{ padding: 0 }}>
                {isLogin ? 'Sign up here' : 'Sign in here'}
              </Button>
            </Text>
          </div>
        </Form>
      </Space>
    </Card>
  );
};

export default UserForm;
