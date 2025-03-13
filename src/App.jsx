import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import AppLayout from './Layout';
import Login from './page/login';
import UserManagement from './page/userManagement';
import Import from './page/import';
import ExcelMapping from './page/excelMapping';
import DataViewMapping from './page/dataViewMapping';
import DataView from './page/dataView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes (Inside Layout) */}
        <Route
          path="/data-view"
          element={
            <AppLayout>
              <DataView />
            </AppLayout>
          }
        />
        <Route path="/data-mapping" element={<AppLayout></AppLayout>} />
        <Route
          path="/data-mapping/excel_mapping"
          element={
            <AppLayout>
              <ExcelMapping />
            </AppLayout>
          }
        />
        <Route
          path="/data-mapping/data-view-mapping"
          element={
            <AppLayout>
              <DataViewMapping />
            </AppLayout>
          }
        />

        <Route
          path="/import"
          element={
            <AppLayout>
              <Import />
            </AppLayout>
          }
        />
        <Route
          path="/user"
          element={
            <AppLayout>
              <UserManagement />
            </AppLayout>
          }
        />
        <Route path="/logout" element={<AppLayout></AppLayout>} />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
