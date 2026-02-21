import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiX, FiMenu } from 'react-icons/fi';
import NotificationBell from './NotificationBell';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout, isClient, isContractor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-3' : 'py-5'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`glass-card px-4 sm:px-6 py-3 flex justify-between items-center transition-all duration-500 ${isScrolled ? 'bg-gray-900/80' : 'bg-gray-900/40'
          }`}>
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary-500 rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
                <div className="absolute inset-0 bg-white rounded-xl -rotate-6 group-hover:-rotate-12 transition-transform duration-300"></div>
                <div className="relative z-10 bg-gray-900 rounded-lg w-8 h-8 flex items-center justify-center">
                  <span className="text-primary-400 font-black text-xl">B</span>
                </div>
              </div>
              <span className="text-2xl font-black tracking-tighter text-white group-hover:text-primary-400 transition-colors">
                Build<span className="text-primary-500">Connect</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/categories" className={`nav-link ${isActive('/categories') ? 'text-white after:w-full' : ''}`}>
              Services
            </Link>

            <Link to="/contractors" className={`nav-link ${isActive('/contractors') ? 'text-white after:w-full' : ''}`}>
              Contractors
            </Link>

            {isAuthenticated ? (
              <>
                {isClient && (
                  <Link to="/client/dashboard" className={`nav-link ${isActive('/client/dashboard') ? 'text-white after:w-full' : ''}`}>
                    Dashboard
                  </Link>
                )}
                {isContractor && (
                  <Link to="/contractor/dashboard" className={`nav-link ${isActive('/contractor/dashboard') ? 'text-white after:w-full' : ''}`}>
                    Dashboard
                  </Link>
                )}

                <div className="flex items-center pl-4 border-l border-white/10 space-x-6">
                  <NotificationBell />
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-white">{user?.full_name}</span>
                    <span className="text-[10px] uppercase tracking-widest text-primary-500 font-bold">{user?.role}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary !py-2 !px-4 !text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-white font-semibold transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary !py-2 !px-6"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-400 hover:text-white p-2"
            >
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 glass-card p-4 space-y-3 animate-in slide-in-from-top duration-300">
            <Link
              to="/categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 px-4 text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Services
            </Link>

            <Link
              to="/contractors"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 px-4 text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Contractors
            </Link>

            {isAuthenticated ? (
              <>
                {(isClient || isContractor) && (
                  <Link
                    to={isClient ? "/client/dashboard" : "/contractor/dashboard"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-4 text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center justify-between py-2 px-4 bg-white/5 rounded-lg">
                  <span className="text-sm font-semibold text-white">Notifications</span>
                  <NotificationBell />
                </div>
                <div className="border-t border-white/10 pt-3 mt-3">
                  <div className="px-4 py-2 mb-2">
                    <p className="text-sm font-semibold text-white">{user?.full_name}</p>
                    <p className="text-xs text-primary-500 uppercase font-bold">{user?.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full btn-secondary !py-2"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 px-4 text-center text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block btn-primary !py-2 text-center"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
