import { useState, useEffect } from 'react';
import { Upload, Button, Form, Input, Select, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import api from '../services/axiosService'; // Ensure axios is properly configured

const Import = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tableNames, setTableNames] = useState([]);

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
    const fetchTableNames = async () => {
      try {
        const response = await api.get('/table_name');
        setTableNames(response.data); // Assuming response is an array of table names
      } catch (err) {
        error('Failed to load table names');
        console.error('Table names fetch error:', err);
      }
    };

    fetchTableNames();
  }, []);

  const onFinish = async (values) => {
    if (!file) {
      error('Please upload a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('table_name', values.table_name);
    formData.append('month', values.month);
    formData.append('year', values.year);

    try {
      setLoading(true);
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      success('Upload successful!');
      console.log('Response:', response.data);
    } catch (err) {
      error('Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Form
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: 500, margin: 'auto', padding: 20 }}
      >
        {/* Table Name Input */}
        <Form.Item
          label="Table Name"
          name="table_name"
          rules={[{ required: true, message: 'Please select a table name' }]}
        >
          <Select
            showSearch
            placeholder="Select a table"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
            options={tableNames.map((table) => ({
              value: table.table_name, // Use table_name as value
              label: table.table_name, // Show table_name in dropdown
            }))}
          />
        </Form.Item>

        {/* Month Dropdown */}
        <Form.Item
          label="Month"
          name="month"
          rules={[{ required: true, message: 'Please select a month' }]}
        >
          <Select placeholder="Select month">
            {Array.from({ length: 12 }, (_, i) => (
              <Select.Option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Year Input */}
        <Form.Item
          label="Year"
          name="year"
          rules={[{ required: true, message: 'Please enter year' }]}
        >
          <Input type="number" placeholder="Enter year" />
        </Form.Item>

        {/* Upload Field */}
        <Form.Item label="Upload File">
          <Upload
            beforeUpload={(file) => {
              setFile(file);
              return false; // Prevent auto upload
            }}
            showUploadList={{ showRemoveIcon: true }}
            onRemove={() => setFile(null)}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Upload
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Import;
