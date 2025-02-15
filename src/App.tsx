import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/auth/login';
import RoleBasedDashboard from './components/RoleBasedDashboard';
import VendorList from './pages/VendorList';
import DriverList from './pages/DriverList';
import VehicleList from './pages/VehicleList';
import OrgChart from './components/OrgChart';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<RoleBasedDashboard />} />
            <Route path="/hierarchy" element={<OrgChart />} />
            <Route path="vendors" element={<VendorList />} />
            <Route path="drivers" element={<DriverList />} />
            <Route path="vehicles" element={<VehicleList />} />
          </Route>

          {/* Catch all route - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;