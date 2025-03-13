import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Card, message } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import api from '../services/axiosService';

const { Option } = Select;

const DataViewMapping = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [tableName, setTableName] = useState(null);
  const [tableOptions, setTableOptions] = useState([]);
  const [columnNames, setColumnNames] = useState([]);
  const [hasHeader, setHasHeader] = useState(false);

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
        setTableOptions(response.data);
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
    setTableName(value);
    fetchColumns(value);
  };

  const handleAddHeader = async (values) => {
    try {
      await api.post('/table_headers', {
        table_name: tableName,
        headers: values.headers,
      });
      success('Table headers added successfully');
    } catch (err) {
      error('Failed to add table headers');
      console.error('Add table headers error:', err);
    }
  };

  return (
    <>
      {contextHolder}
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h2>Table Headers Input</h2>
          <Form form={form} onFinish={handleAddHeader} layout="vertical">
            <Form.Item
              name="table_name"
              label="Select Table"
              rules={[{ required: true }]}
            >
              <Select
                showSearch
                placeholder="Select a table"
                onChange={handleTableChange}
              >
                {tableOptions.map((table) => (
                  <Option key={table.id} value={table.table_name}>
                    {table.table_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.List name="headers">
              {(fields, { add, remove }) => (
                <div>
                  {fields.map((field) => (
                    <Card
                      size="small"
                      key={field.key}
                      title={`Column ${field.name + 1}`}
                      extra={
                        <CloseOutlined
                          onClick={() => {
                            remove(field.name);
                            setHasHeader(false);
                          }}
                        />
                      }
                    >
                      <Form.Item
                        name={[field.name, 'title']}
                        label="Title"
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="Enter column title" />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'data_index']}
                        label="Data Index"
                      >
                        <Select
                          showSearch
                          placeholder="Select data index"
                          disabled={!tableName}
                          key={`data_index ${field.name + 1}`}
                        >
                          {columnNames.map(({ id, column_name }) => (
                            <Option key={id} value={column_name}>
                              {column_name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item name={[field.name, 'width']} label="Width">
                        <Input
                          type="number"
                          placeholder="Enter width (default 150)"
                        />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'sorter']}
                        label="Enable Sorting?"
                      >
                        <Select>
                          <Option value="true">Yes</Option>
                          <Option value="false">No</Option>
                        </Select>
                      </Form.Item>

                      <Form.List name={[field.name, 'children']}>
                        {(childFields, childOps) => (
                          <div
                            style={{
                              paddingLeft: '20px',
                              borderLeft: '2px solid #ccc',
                            }}
                          >
                            {childFields.map((child) => (
                              <Card
                                size="small"
                                key={child.key}
                                title="Child Column"
                                extra={
                                  <CloseOutlined
                                    onClick={() => childOps.remove(child.name)}
                                  />
                                }
                              >
                                <Form.Item
                                  name={[child.name, 'title']}
                                  label="Title"
                                  rules={[{ required: true }]}
                                >
                                  <Input placeholder="Enter column title" />
                                </Form.Item>
                                <Form.Item
                                  name={[child.name, 'data_index']}
                                  label="Data Index"
                                >
                                  <Select
                                    showSearch
                                    placeholder="Select data index"
                                    disabled={!tableName}
                                    key={`data_index ${child.name + 1}`}
                                  >
                                    {columnNames.map(({ id, column_name }) => (
                                      <Option key={id} value={column_name}>
                                        {column_name}
                                      </Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                                <Form.Item
                                  name={[child.name, 'width']}
                                  label="Width"
                                >
                                  <Input
                                    type="number"
                                    placeholder="Enter width (default 150)"
                                  />
                                </Form.Item>
                                <Form.Item
                                  name={[child.name, 'sorter']}
                                  label="Enable Sorting?"
                                >
                                  <Select>
                                    <Option value="true">Yes</Option>
                                    <Option value="false">No</Option>
                                  </Select>
                                </Form.Item>

                                <Form.List name={[child.name, 'children']}>
                                  {(subFields, subOps) => (
                                    <div
                                      style={{
                                        paddingLeft: '20px',
                                        borderLeft: '2px solid #ddd',
                                      }}
                                    >
                                      {subFields.map((subChild) => (
                                        <Card
                                          size="small"
                                          key={subChild.key}
                                          title="Sub Child Column"
                                          extra={
                                            <CloseOutlined
                                              onClick={() =>
                                                subOps.remove(subChild.name)
                                              }
                                            />
                                          }
                                        >
                                          <Form.Item
                                            name={[subChild.name, 'title']}
                                            label="Title"
                                            rules={[{ required: true }]}
                                          >
                                            <Input placeholder="Enter column title" />
                                          </Form.Item>
                                          <Form.Item
                                            name={[subChild.name, 'data_index']}
                                            label="Data Index"
                                          >
                                            <Select
                                              showSearch
                                              placeholder="Select data index"
                                              disabled={!tableName}
                                              key={`data_index ${
                                                subChild.name + 1
                                              }`}
                                            >
                                              {columnNames.map(
                                                ({ id, column_name }) => (
                                                  <Option
                                                    key={id}
                                                    value={column_name}
                                                  >
                                                    {column_name}
                                                  </Option>
                                                )
                                              )}
                                            </Select>
                                          </Form.Item>
                                          <Form.Item
                                            name={[subChild.name, 'width']}
                                            label="Width"
                                          >
                                            <Input
                                              type="number"
                                              placeholder="Enter width (default 150)"
                                            />
                                          </Form.Item>
                                          <Form.Item
                                            name={[subChild.name, 'sorter']}
                                            label="Enable Sorting?"
                                          >
                                            <Select>
                                              <Option value="true">Yes</Option>
                                              <Option value="false">No</Option>
                                            </Select>
                                          </Form.Item>
                                        </Card>
                                      ))}
                                      <Button
                                        type="dashed"
                                        onClick={() => subOps.add()}
                                        block
                                        icon={<PlusOutlined />}
                                      >
                                        Add Sub Child
                                      </Button>
                                    </div>
                                  )}
                                </Form.List>

                                <Button
                                  type="dashed"
                                  onClick={() => childOps.add()}
                                  block
                                  icon={<PlusOutlined />}
                                >
                                  Add Child
                                </Button>
                              </Card>
                            ))}
                            <Button
                              type="dashed"
                              onClick={() => childOps.add()}
                              block
                              icon={<PlusOutlined />}
                            >
                              Add Child
                            </Button>
                          </div>
                        )}
                      </Form.List>
                    </Card>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                      setHasHeader(true);
                    }}
                    block
                    icon={<PlusOutlined />}
                    disabled={hasHeader}
                  >
                    Add Column
                  </Button>
                </div>
              )}
            </Form.List>

            <Button
              type="primary"
              htmlType="submit"
              disabled={tableName === null || !hasHeader}
              style={{ marginTop: 30 }}
            >
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default DataViewMapping;
