import { useState, useEffect } from 'react';
import { Upload, Button, Form, Input, Select, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import api from '../services/axiosService'; // Ensure axios is properly configured

const Import = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tableNames, setTableNames] = useState([]);
  const [fileType, setFileType] = useState(null);

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
    if (fileType === 'csv' || fileType === 'formated_csv') {
      formData.append('range_start', values.range_start);
      formData.append('range_end', values.range_end);
    } else {
      formData.append('total_row', values.total_row);
      formData.append('range', values.range);
    }

    try {
      setLoading(true);
      const endpoint =
        values.file_type === 'csv'
          ? '/upload/csv'
          : values.file_type === 'formated_csv'
          ? '/upload/csv-formated'
          : '/upload';
      const response = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      form.resetFields();
      setFile(null);
      success(response.data.message);
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
        form={form}
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

        <Form.Item
          label="File Type"
          name="file_type"
          rules={[{ required: true, message: 'Please select a file type' }]}
        >
          <Select
            placeholder="Please select a file type"
            options={[
              {
                value: 'xlsx',
                label: 'Xlsx',
              },
              {
                value: 'csv',
                label: 'CSV',
              },
              {
                value: 'formated_csv',
                label: 'Formated CSV',
              },
            ]}
            onChange={(value) => setFileType(value)}
          />
        </Form.Item>
        {fileType === 'csv' || fileType === 'formated_csv' ? (
          <>
            <Form.Item
              label="Range Start"
              name="range_start"
              rules={[{ required: true, message: 'Please enter range start' }]}
            >
              <Input type="number" placeholder="Enter start range" min={0} />
            </Form.Item>

            <Form.Item
              label="Range End"
              name="range_end"
              rules={[{ required: true, message: 'Please enter range end' }]}
            >
              <Input type="number" placeholder="Enter end range" min={0} />
            </Form.Item>
          </>
        ) : fileType === 'xlsx' ? (
          <>
            <Form.Item
              label="Total Row Number"
              name="total_row"
              rules={[
                { required: true, message: 'Please enter total row number' },
              ]}
            >
              <Input
                type="number"
                placeholder="Enter total row number"
                min={0}
              />
            </Form.Item>
            <Form.Item
              label="Start Row Number"
              name="range"
              rules={[
                { required: true, message: 'Please enter start row number' },
              ]}
            >
              <Input
                type="number"
                placeholder="Enter start row number"
                min={0}
              />
            </Form.Item>
          </>
        ) : null}

        {/* Upload Field */}
        <Form.Item label="Upload File">
          <Upload
            beforeUpload={(file) => {
              setFile(file);
              return false; // Prevent auto upload
            }}
            showUploadList={{ showRemoveIcon: true }}
            onRemove={() => setFile(null)}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            disabled={!file}
          >
            Upload
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Import;
