import React ,{useState, useRef, useEffect} from 'react';
import { Layout, Typography, Space, Button, Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined, BarChartOutlined, TrophyOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header = ({ onNavigate }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    onNavigate?.('login');
  };

  const userMenuItems = [
    // {
    //   key: 'profile',
    //   icon: <UserOutlined />,
    //   label: 'Profile',
    //   onClick: () => onNavigate?.('profile'),
    // },
    {
      key: 'stats',
      icon: <BarChartOutlined />,
      label: 'My Stats',
      onClick: () => onNavigate?.('leaderboard'),
    },
    // {
    //   type: 'divider',
    // },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader
      style={{
        background: 'linear-gradient(135deg, #1890ff, #096dd9)',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
      }}>
        {/* Logo */}
        <Space
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigate?.('home')}
        >
          <TrophyOutlined style={{ fontSize: 24, color: '#fff' }} />
          <Title
            level={3}
            style={{
              color: '#fff',
              margin: 0,
              fontWeight: 600,
            }}
          >
            QuizMaster
          </Title>
        </Space>

        {/* User Section */}
        {isAuthenticated ? (
          <Space>
            <Button
              type="text"
              icon={<BarChartOutlined />}
              onClick={() => onNavigate?.('leaderboard')}
              style={{ color: '#fff' }}
            >
              Leaderboard
            </Button>

            <div style={{ position: "relative", display: "inline-block" }} ref={dropdownRef}>
      <div
        style={{ display: "flex", alignItems: "center", cursor: "pointer", color: "#fff" }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Avatar
          icon={<UserOutlined />}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            marginRight: 8,
          }}
        />
        <span style={{ fontWeight: 500 }}>{user?.name}</span>
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "100%",
            backgroundColor: "#fff",
            color: "#000",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            borderRadius: 4,
            marginTop: 8,
            minWidth: 160,
            zIndex: 1000,
          }}
        >
          {userMenuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                item.onClick(); // trigger menu item action
                setOpen(false);
              }}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                borderBottom: index !== userMenuItems.length - 1 ? "1px solid #eee" : "none",
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
            
            {/* <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Space style={{ cursor: 'pointer', color: '#fff' }}>
                <Avatar
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                />
                <span style={{ fontWeight: 500 }}>{user?.name}</span>
              </Space>
            </Dropdown> */}
          </Space>
        ) : (
          <Button type="primary" ghost onClick={() => onNavigate?.('login')}>
            Get Started
          </Button>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;
