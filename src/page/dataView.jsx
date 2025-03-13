import React, { useState, useEffect } from 'react';
import { Table, Select, Pagination, Form, Button, DatePicker } from 'antd';
import api from '../services/axiosService';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

const DataView = () => {
  const [tableName, setTableName] = useState(null);
  const [tableOptions, setTableOptions] = useState([]);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    inserted_by: null,
    start_date: null,
    end_date: null,
  });

  // Fetch table names
  useEffect(() => {
    api
      .get('/table_name')
      .then((res) => setTableOptions(res.data))
      .catch((err) => console.error('Error fetching table names:', err));
  }, []);

  // Fetch table headers when table name changes
  useEffect(() => {
    if (tableName) {
      api
        .get(`/table_headers/${tableName}`)
        .then((res) => {
          const formattedColumns = res.data.map((col) => ({
            title: col.title,
            dataIndex: col.dataIndex,
            width: col.width || 150,
            sorter: col.sorter === 'true',
          }));
          setColumns(formattedColumns);
          fetchTableData(1, pagination.pageSize, filters); // Fetch data after columns update
        })
        .catch((err) => console.error('Error fetching headers:', err));
    }
  }, [tableName]);

  // Fetch user options for filtering
  useEffect(() => {
    api
      .get('/get_users')
      .then((res) => setUsers(res.data))
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  // Fetch paginated table data
  const fetchTableData = (page, limit, filters) => {
    api
      .get('/master_data', {
        params: { table_name: tableName, page, limit, ...filters },
      })
      .then((res) => {
        setData(res.data.rows);
        setPagination((prev) => ({
          ...prev,
          total: res.data.total,
          current: page,
        }));
      })
      .catch((err) => console.error('Error fetching data:', err));
  };

  // Handle table change (pagination, sorting)
  const handleTableChange = (pagination) => {
    setPagination(pagination);
    fetchTableData(pagination.current, pagination.pageSize, filters);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    fetchTableData(1, pagination.pageSize, updatedFilters); // Reset to page 1 when filtering
  };

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    if (dates) {
      handleFilterChange('start_date', dayjs(dates[0]).format('YYYY-MM-DD'));
      handleFilterChange('end_date', dayjs(dates[1]).format('YYYY-MM-DD'));
    } else {
      handleFilterChange('start_date', null);
      handleFilterChange('end_date', null);
    }
  };

  return (
    <div>
      {/* Table Selection & Filters */}
      <Form layout="inline" style={{ marginBottom: 20 }}>
        <Form.Item label="Select Table">
          <Select
            value={tableName}
            onChange={setTableName}
            placeholder="Choose a table"
            style={{ width: 200 }}
          >
            {tableOptions.map((table) => (
              <Option key={table.id} value={table.table_name}>
                {table.table_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Inserted By Filter */}
        <Form.Item label="Inserted By">
          <Select
            onChange={(value) => handleFilterChange('inserted_by', value)}
            placeholder="Filter by user"
            style={{ width: 200 }}
          >
            {users.map((user) => (
              <Option key={user.id} value={user.username}>
                {user.username}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Date Range Filter */}
        <Form.Item label="Date Range">
          <RangePicker onChange={handleDateRangeChange} format="YYYY-MM-DD" />
        </Form.Item>
      </Form>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        pagination={pagination}
        onChange={handleTableChange}
        bordered
      />
    </div>
  );
};

export default DataView;
