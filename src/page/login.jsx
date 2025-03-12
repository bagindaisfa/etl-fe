import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axiosService';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const navigate = useNavigate();
  const [loadingLogin, setLoadingLogin] = useState(false);

  const onFinish = async (values) => {
    setLoadingLogin(true);
    try {
      const response = await api.post('/login', values);
      setLoadingLogin(false);
      message.success('Login successful!');
      const { id, username, password, is_super_admin } = response.data.user[0];
      sessionStorage.setItem('id_user', id);
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('password', password);
      sessionStorage.setItem('is_super_admin', is_super_admin);
      navigate('/data-view');
    } catch (error) {
      console.error('Login error:', error);
      setLoadingLogin(false);
      message.error(
        error.response?.data?.message || 'Login failed. Try again.'
      );
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#f0f2f5', // Light gray background like Ant Design's login page
      }}
    >
      <div
        style={{
          width: 360,
          padding: 24,
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: 24, color: 'black' }}>
          Login
        </h2>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={loadingLogin}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
