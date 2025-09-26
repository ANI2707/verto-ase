import React, { useEffect } from 'react';
import { Progress, Typography, Space } from 'antd';
import { ClockCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { useTimer } from '../../hooks/useTimer';

const { Text } = Typography;

const Timer = ({ initialTime, onTimeUp, isActive }) => {
  const { time, isRunning, start, pause, formatTime } = useTimer(initialTime, onTimeUp);

  useEffect(() => {
    if (isActive && !isRunning) {
      start();
    } else if (!isActive && isRunning) {
      pause();
    }
  }, [isActive, isRunning, start, pause]);

  const progressPercent = (time / initialTime) * 100;
  const isWarning = time <= 60; // Warning when 1 minute left
  const isCritical = time <= 30; // Critical when 30 seconds left

  const getProgressColor = () => {
    if (isCritical) return '#ff4d4f';
    if (isWarning) return '#faad14';
    return '#52c41a';
  };

  const getStatus = () => {
    if (isCritical) return 'exception';
    if (isWarning) return 'active';
    return 'success';
  };

  return (
    <div style={{ 
      padding: '12px 16px',
      backgroundColor: isCritical ? '#fff2f0' : isWarning ? '#fffbe6' : '#f6ffed',
      borderRadius: 8,
      border: `1px solid ${getProgressColor()}`,
    }}>
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Space>
            {isCritical ? (
              <WarningOutlined style={{ color: '#ff4d4f' }} />
            ) : (
              <ClockCircleOutlined style={{ color: getProgressColor() }} />
            )}
            <Text strong style={{ color: getProgressColor() }}>
              {formatTime()}
            </Text>
          </Space>
          
          {(isWarning || isCritical) && (
            <Text 
              type={isCritical ? 'danger' : 'warning'} 
              style={{ fontSize: 12, fontWeight: 500 }}
            >
              {isCritical ? 'Time almost up!' : 'Hurry up!'}
            </Text>
          )}
        </div>

        <Progress
          percent={progressPercent}
          strokeColor={getProgressColor()}
          status={getStatus()}
          showInfo={false}
          size="small"
        />
      </Space>
    </div>
  );
};

export default Timer;
