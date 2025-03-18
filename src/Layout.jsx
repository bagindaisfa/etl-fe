import { useState, useEffect } from 'react';
import { Layout, Menu, message, Spin, Image } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  LogoutOutlined,
  DatabaseOutlined,
  ImportOutlined,
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from './services/axiosService';
import core_icon from './assets/core_icon.jpeg';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

function AppLayout({ children }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('Data View'); // Default title

  const success = (message) => {
    messageApi.open({
      type: 'success',
      content: message,
    });
  };

  const error = (message) => {
    messageApi.open({
      type: 'error',
      content: message,
    });
  };

  useEffect(() => {
    let selectedTitle = 'Data View'; // Default title

    const selected = menuItems.find((item) => {
      if (item.path === location.pathname) {
        selectedTitle = item.title;
        return true;
      }
      const child = item.children?.find(
        (child) => child.path === location.pathname
      );
      if (child) {
        selectedTitle = `${item.title} / ${child.title}`;
        return true;
      }
      return false;
    });

    if (selected) setHeaderTitle(selectedTitle);
  }, [location.pathname]);

  const handleLogout = async () => {
    setLoadingLogout(true);
    try {
      await api.post('/logout'); // 🔥 Calls the backend logout API
      success('Logged out successfully!');
      sessionStorage.removeItem('id_user');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('password');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      error('Logout failed. Try again.');
    } finally {
      setLoadingLogout(false);
    }
  };

  // Define menu items with title updates
  const menuItems = [
    {
      key: '1',
      path: '/data-view',
      icon: <HomeOutlined />,
      title: 'Data View',
    },
    {
      key: '2',
      icon: <DatabaseOutlined />,
      title: 'Data Mapping',
      children: [
        {
          key: '2-1',
          path: '/data-mapping/excel_mapping',
          title: 'Excel',
        },
        {
          key: '2-2',
          path: '/data-mapping/data-view-mapping',
          title: 'Data View',
        },
      ],
    },
    {
      key: '3',
      path: '/import',
      icon: <ImportOutlined />,
      title: 'Import Data',
    },
    {
      key: '4',
      path: '/user',
      icon: <UserOutlined />,
      title: 'User Management',
    },
    {
      key: '5',
      path: '/logout',
      icon: <LogoutOutlined />,
      title: 'Logging Out...',
    },
  ];

  return (
    <>
      {contextHolder}
      <Layout style={{ minHeight: '100vh', width: '100vw' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div
            className="logo"
            style={{
              color: 'white',
              backgroundColor: '#17183a',
              textAlign: 'center',
              padding: 16,
            }}
          >
            <Image src={core_icon} preview={false} height={60} width={60} />
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={({ key }) => {
              let selectedTitle = '';

              const selected = menuItems.find((item) => {
                if (item.key === key) {
                  selectedTitle = item.title; // Parent title
                  return true;
                }
                const child = item.children?.find((child) => child.key === key);
                if (child) {
                  selectedTitle = `${item.title} / ${child.title}`; // Parent / Child
                  return true;
                }
                return false;
              });

              if (selected) setHeaderTitle(selectedTitle);
            }}
          >
            {menuItems.map((item) =>
              item.children ? (
                <SubMenu key={item.key} icon={item.icon} title={item.title}>
                  {item.children.map((child) => (
                    <Menu.Item key={child.key}>
                      <Link to={child.path}>{child.title}</Link>
                    </Menu.Item>
                  ))}
                </SubMenu>
              ) : item.key === '5' ? (
                <Menu.Item
                  key={item.key}
                  icon={item.icon}
                  onClick={handleLogout}
                >
                  {loadingLogout ? <Spin size="small" /> : 'Logout'}
                </Menu.Item>
              ) : (
                <Menu.Item key={item.key} icon={item.icon}>
                  <Link to={item.path}>{item.title}</Link>
                </Menu.Item>
              )
            )}
          </Menu>
        </Sider>

        {/* Main Layout */}
        <Layout style={{ flex: 1 }}>
          <Header
            style={{
              background: '#fff',
              padding: 0,
              textAlign: 'left',
              width: '100%',
              marginLeft: 15,
            }}
          >
            <h2 style={{ marginLeft: 10, marginTop: 5 }}>{headerTitle}</h2>
          </Header>

          {/* Content */}
          <Content
            style={{ margin: '16px', padding: 24, background: '#fff', flex: 1 }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default AppLayout;
