import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout, isClient, isContractor } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded"></div>
              <span className="text-xl font-bold text-gray-900">BuildConnect</span>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link to="/categories" className="text-gray-700 hover:text-primary-600 transition">
                  Services
                </Link>
                {isClient && (
                  <Link to="/client/dashboard" className="text-gray-700 hover:text-primary-600 transition">
                    Dashboard
                  </Link>
                )}
                {isContractor && (
                  <Link to="/contractor/dashboard" className="text-gray-700 hover:text-primary-600 transition">
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">{user?.full_name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/categories" className="text-gray-700 hover:text-primary-600 transition">
                  Services
                </Link>
                <Link to="/contractors" className="text-gray-700 hover:text-primary-600 transition">
                  Find Contractors
                </Link>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
