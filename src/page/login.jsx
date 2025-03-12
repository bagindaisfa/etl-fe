import React from 'react';
import axios from 'axios';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, values);
      message.success('Login successful!');
      console.log('Response:', response.data);

      // Store token (if returned from API)
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
    } catch (error) {
      console.error('Login error:', error);
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
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Login</h2>
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
            <Button block type="primary" htmlType="submit">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
