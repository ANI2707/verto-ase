import React from 'react';
import { Layout, Typography, Space } from 'antd';
import { HeartFilled, GithubOutlined, LinkedinOutlined } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <AntFooter
      style={{
        textAlign: 'center',
        backgroundColor: '#f0f2f5',
        borderTop: '1px solid #d9d9d9',
        marginTop: 'auto',
      }}
    >
      <Space direction="vertical" size="small">
        <Text>
          Made with <HeartFilled style={{ color: '#ff4d4f' }} /> for learning and growth
        </Text>
        <Text type="secondary">
          QuizMaster © {currentYear} - Test Your Knowledge, Track Your Progress
        </Text>
        <Space>
          <Link href="https://github.com/ANI2707" target="_blank">
            <GithubOutlined style={{ fontSize: 18 }} />
          </Link>
          <Link href="https://www.linkedin.com/in/aniket-bhosale-217a7a223/" target="_blank">
            <LinkedinOutlined style={{ fontSize: 18 }} />
          </Link>
        </Space>
      </Space>
    </AntFooter>
  );
};

export default Footer;
