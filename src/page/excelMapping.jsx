import React, { useState, useEffect } from 'react';
import { Form, Select, Button, message, Input, Row, Col } from 'antd';
import api from '../services/axiosService';

const { Option } = Select;

const generateHeaderCells = () => {
  const headers = [];
  for (let i = 65; i <= 90; i++) headers.push(String.fromCharCode(i)); // A-Z
  for (let i = 65; i <= 90; i++) {
    for (let j = 65; j <= 90; j++) {
      headers.push(String.fromCharCode(i) + String.fromCharCode(j)); // AA-ZZ
    }
  }
  return headers;
};

const ExcelMapping = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [tableNames, setTableNames] = useState([]);
  const [columnNames, setColumnNames] = useState([]);
  const [headerCells] = useState(generateHeaderCells());
  const [selectedTable, setSelectedTable] = useState(null);
  const [mappingRows, setMappingRows] = useState([
    { key: Date.now(), header_cell: '', column_name: '' },
  ]);

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

  const fetchColumns = async (tableName) => {
    try {
      const res = await api.get(`/master_column_name/${tableName}`);
      setColumnNames(res.data);
    } catch (err) {
      error('Failed to load column names');
    }
  };

  const handleTableChange = (value) => {
    setSelectedTable(value);
    fetchColumns(value);
  };

  const handleAddRow = () => {
    setMappingRows([
      ...mappingRows,
      { key: Date.now(), header_cell: '', column_name: '' },
    ]);
  };

  const handleRemoveRow = (key) => {
    setMappingRows(mappingRows.filter((row) => row.key !== key));
  };

  const onFinish = async (values) => {
    try {
      await api.post('/data_maping', {
        table_name: values.table_name,
        detail: values.mappings,
      });
      success('Data mapped successfully!');
      setSelectedTable(null);
      form.resetFields();
    } catch (err) {
      error('Failed to submit mapping');
    }
  };

  return (
    <>
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="table_name"
          label="Table Name"
          rules={[{ required: true }]}
        >
          <Select
            showSearch
            placeholder="Select a table"
            onChange={handleTableChange}
          >
            {tableNames.map(({ id, table_name }) => (
              <Option key={id} value={table_name}>
                {table_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {mappingRows.map((row, index) => (
          <Row gutter={16} key={row.key} align="middle">
            <Col span={8}>
              <Form.Item
                name={['mappings', index, 'header_cell']}
                label="Header Cell"
                rules={[{ required: true }]}
              >
                <Select showSearch placeholder="Select header">
                  {headerCells.map((cell) => (
                    <Option key={cell} value={cell}>
                      {cell}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['mappings', index, 'column_name']}
                label="Column Name"
                rules={[{ required: true }]}
              >
                <Select
                  showSearch
                  placeholder="Select column"
                  disabled={!selectedTable}
                >
                  {columnNames.map(({ id, column_name }) => (
                    <Option key={id} value={column_name}>
                      {column_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button type="danger" onClick={() => handleRemoveRow(row.key)}>
                Remove
              </Button>
            </Col>
          </Row>
        ))}

        <Button type="dashed" onClick={handleAddRow} block>
          Add Row
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          block
          style={{ marginTop: 16 }}
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default ExcelMapping;
