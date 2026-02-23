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

function App() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="car-management" element={<CarManagement />} />
          <Route path="interest-rate" element={<InterestRateManagement />} />
          <Route path="calculator-input" element={<CalculatorInputMgt />} />
          <Route path="loan-term" element={<LoanTermManagement />} />
          <Route path="settings" element={<PlatformSettings />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;