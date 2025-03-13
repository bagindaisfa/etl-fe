import React, { useState, useEffect } from 'react';
import { Button, message, Form, Input, Divider, Typography } from 'antd';
import api from '../services/axiosService';

const { Title } = Typography;

const UserManagement = () => {
  const [form] = Form.useForm();
  const [formInsert] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingNew, setLoadingNew] = useState(false);
  const userId = sessionStorage.getItem('id_user');
  const superAdmin = sessionStorage.getItem('is_super_admin') === 'true';

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
    form.setFieldsValue({
      ['username']: sessionStorage.getItem('username'),
    });
  }, []);

  const onFinishUpdate = async (values) => {
    setLoadingUpdate(true);
    try {
      const response = await api.put(`/users/${userId}`, values);
      success('Update successful!');
      setLoadingUpdate(false);
    } catch (err) {
      console.error('Update error:', err);
      setLoadingUpdate(false);
      error(error.response?.data?.message || 'Update failed. Try again.');
    }
  };

  const onFinishFailedUpdate = (errorInfo) => {
    error('Failed:', errorInfo);
  };

  const onFinishNew = async (values) => {
    setLoadingNew(true);
    try {
      const response = await api.post(`/users/register`, values);
      success('Create User successful!');
      setLoadingNew(false);
      formInsert.setFieldsValue({
        ['username']: '',
        ['password']: '',
      });
    } catch (err) {
      console.error('Create User error:', err);
      setLoadingNew(false);
      error(error.response?.data?.message || 'Create User failed. Try again.');
    }
  };

  const onFinishFailedNew = (errorInfo) => {
    error('Failed:', errorInfo);
  };

  return (
    <>
      {contextHolder}
      <Title level={4}>Update User</Title>
      <Form
        form={form}
        layout="vertical"
        name="updateUser"
        style={{
          marginTop: 20,
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinishUpdate}
        onFinishFailed={onFinishFailedUpdate}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" loading={loadingUpdate}>
            Update
          </Button>
        </Form.Item>
      </Form>
      {superAdmin && (
        <>
          <Divider style={{ marginTop: 40, marginBottom: 40 }} />
          <Title level={4}>Create User</Title>
          <Form
            form={formInsert}
            layout="vertical"
            title="Create User"
            name="create_user"
            style={{
              marginTop: 20,
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinishNew}
            onFinishFailed={onFinishFailedNew}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item label={null}>
              <Button type="primary" htmlType="submit" loading={loadingNew}>
                New User
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </>
  );
};

export default UserManagement;
