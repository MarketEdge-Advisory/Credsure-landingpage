import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import CarManagement from './pages/admin/CarManagement';
import InterestRateManagement from './pages/admin/InterestRateManagement';
import CalculatorInputMgt from './pages/admin/CalculatorInputMgt';
import LoanTermManagement from './pages/admin/LoanTermManagement';
import PlatformSettings from './pages/admin/PlatformSettings';
import AdminLogin from './pages/admin/AdminLogin';
import { useAuth } from './context/AuthContext';

/** Redirect to login if not authenticated. Optionally restrict to a specific role. */
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/admin/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/admin/dashboard" replace />;
  return children;
};

function App() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin routes – all require authentication */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Shared by both roles */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<PlatformSettings />} />

          {/* Suzuki admin only */}
          <Route
            path="car-management"
            element={
              <ProtectedRoute allowedRole="suzuki">
                <CarManagement />
              </ProtectedRoute>
            }
          />

          {/* Credsure admin only */}
          <Route
            path="interest-rate"
            element={
              <ProtectedRoute allowedRole="credsure">
                <InterestRateManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="calculator-input"
            element={
              <ProtectedRoute allowedRole="credsure">
                <CalculatorInputMgt />
              </ProtectedRoute>
            }
          />
          <Route
            path="loan-term"
            element={
              <ProtectedRoute allowedRole="credsure">
                <LoanTermManagement />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </main>
  );
}

export default App;