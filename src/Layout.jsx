import { Layout, Menu } from 'antd';
import { UserOutlined, HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header, Sider, Content, Footer } = Layout;

function AppLayout({ children }) {
  return (
    <Layout style={{ minHeight: '100vh', width: '100vw' }}>
      {' '}
      <Sider collapsible>
        <div
          className="logo"
          style={{ color: 'white', textAlign: 'center', padding: 16 }}
        >
          My App
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/profile">Profile</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<SettingOutlined />}>
            <Link to="/settings">Settings</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      {/* Main Layout */}
      <Layout style={{ flex: 1 }}>
        {' '}
        <Header
          style={{
            background: '#fff',
            padding: 0,
            textAlign: 'center',
            width: '100%',
          }}
        >
          <h1 style={{ margin: 0 }}>Dashboard</h1>
        </Header>
        {/* Content */}
        <Content
          style={{ margin: '16px', padding: 24, background: '#fff', flex: 1 }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
