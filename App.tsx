import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ExpertProvider } from './context/ExpertContext';
import MainLayout from './components/MainLayout';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import HistoryPage from './pages/History';
import ProfilePage from './pages/Profile';
import RequestDetailsPage from './pages/RequestDetails';

const App: React.FC = () => {
  return (
    <ExpertProvider>
      <HashRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes Wrapper */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="request/:requestId" element={<RequestDetailsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ExpertProvider>
  );
};

export default App;