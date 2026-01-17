import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/ClientDashboard';
import ContractorDashboard from './pages/ContractorDashboard';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactElement; requireClient?: boolean; requireContractor?: boolean }> = ({ 
  children, 
  requireClient, 
  requireContractor 
}) => {
  const { isAuthenticated, isClient, isContractor, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireClient && !isClient) {
    return <Navigate to="/" />;
  }

  if (requireContractor && !isContractor) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route
              path="/client/dashboard"
              element={
                <ProtectedRoute requireClient>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/contractor/dashboard"
              element={
                <ProtectedRoute requireContractor>
                  <ContractorDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
