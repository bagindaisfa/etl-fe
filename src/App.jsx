import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import AppLayout from './Layout';
import Login from './page/login';

function HomePage() {
  return <p>Welcome to the Home Page</p>;
}

function ProfilePage() {
  return <p>User Profile</p>;
}

function SettingsPage() {
  return <p>Settings Page</p>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes (Inside Layout) */}
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <HomePage />
            </AppLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          }
        />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
