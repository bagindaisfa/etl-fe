import React, { useState, useEffect } from 'react';
import {
  Table,
  Select,
  Pagination,
  Form,
  Button,
  DatePicker,
  message,
} from 'antd';
import api from '../services/axiosService';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

const DataView = () => {
  const [messageApi, contextHolder] = message.useMessage();
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
  const dateFormat = 'YYYY-MM-DD';

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
          const formatColumns = (headers) => {
            return headers.map((col) => {
              const formattedColumn = {
                title: col.title,
                dataIndex: col.data_index || undefined, // Only set dataIndex if it's defined
                width: col.width ? Number(col.width) : 150, // Ensure width is a number
                sorter:
                  col.sorter === 'true'
                    ? (a, b) => a[col.data_index] - b[col.data_index]
                    : null,
              };
              console.log('formattedColumn :', formattedColumn);

              // If the column has children, process them recursively
              if (col.children) {
                formattedColumn.children = formatColumns(col.children);
              }

              return formattedColumn;
            });
          };

          // Process the headers structure
          const formattedColumns = res.data.flatMap((item) =>
            formatColumns(item.headers)
          );

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
  const fetchTableData = (page = 1, limit = 10, filters = {}) => {
    const username = sessionStorage.getItem('username') || ''; // Default username
    const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');
    const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD');

    const params = {
      table_name: tableName,
      page,
      limit,
      inserted_by: filters.inserted_by ?? username, // Use username if not provided
      start_date: filters.start_date ?? startOfMonth, // Default to month start
      end_date: filters.end_date ?? endOfMonth, // Default to month end
    };

    api
      .get('/master_data', { params })
      .then((res) => {
        const formattedData = res.data.data.map((row) => ({
          ...row,
          date: row.date ? new Date(row.date).toDateString() : null, // Convert to YYYY-MM-DD
        }));
        setData(formattedData);
        setPagination((prev) => ({
          ...prev,
          total: res.data.totalRows,
          current: page,
        }));
      })
      .catch((err) => error('Error fetching data:', err));
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
      const updatedFilters = {
        ...filters,
        start_date: dayjs(dates[0]).format('YYYY-MM-DD'),
        end_date: dayjs(dates[1]).format('YYYY-MM-DD'),
      };
      setFilters(updatedFilters);
      fetchTableData(1, pagination.pageSize, updatedFilters);
    } else {
      const updatedFilters = { ...filters, start_date: null, end_date: null };
      setFilters(updatedFilters);
      fetchTableData(1, pagination.pageSize, updatedFilters);
    }
  };

  return (
    <div>
      {contextHolder}
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
            disabled={!tableName}
            defaultValue={sessionStorage.getItem('username')}
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
          <RangePicker
            onChange={handleDateRangeChange}
            format="YYYY-MM-DD"
            defaultValue={[
              dayjs(dayjs().startOf('month'), dateFormat),
              dayjs(dayjs().endOf('month'), dateFormat),
            ]}
            disabled={!tableName}
          />
        </Form.Item>
      </Form>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{
          y: 55 * 5,
        }}
        showSorterTooltip={{
          target: 'sorter-icon',
        }}
        bordered
      />
    </div>
  );
};

export default DataView;
