import React from 'react';
import { Spin, Card } from 'antd';

const Loading = ({ message = "Loading...", size = "large" }) => {
  return (
    <Card
      style={{
        textAlign: 'center',
        margin: '40px auto',
        maxWidth: 400,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ padding: '40px 20px' }}>
        <Spin size={size} />
        <div style={{ marginTop: 16, color: '#666', fontSize: 16 }}>
          {message}
        </div>
      </div>
    </Card>
  );
};

export default Loading;
