import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CardProvider } from './context/CardContext';
import Navbar from './components/layout/Navbar';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CardsPage from './pages/CardsPage';
import MakePaymentPage from './pages/MakePaymentPage';
import PaymentHistoryPage from './pages/PaymentHistoryPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import PaymentConfirmationPage from './pages/PaymentConfirmationPage';
import './index.css';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  return (
    <Router>
      <AuthProvider>
        <CardProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/cards" element={
                <ProtectedRoute>
                  <CardsPage />
                </ProtectedRoute>
              } />
              
              <Route path="/payment" element={
                <ProtectedRoute>
                  <MakePaymentPage />
                </ProtectedRoute>
              } />
              
              <Route path="/payment/confirm" element={
                <ProtectedRoute>
                  <PaymentConfirmationPage />
                </ProtectedRoute>
              } />
              
              <Route path="/history" element={
                <ProtectedRoute>
                  <PaymentHistoryPage />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </CardProvider>
      </AuthProvider>
    </Router>
  );
}

function App() {
  return <AppContent />;
}

export default App;