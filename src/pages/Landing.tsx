import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Connect with Trusted Contractors
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Find verified professionals for your construction and service needs
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/register">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                  Get Started
                </Button>
              </Link>
              <Link to="/contractors">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-primary-700">
                  Find Contractors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How BuildConnect Works
            </h2>
            <p className="text-lg text-gray-600">
              A streamlined process for finding and hiring contractors
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-600 rounded-lg mb-4"></div>
              <h3 className="text-xl font-semibold mb-3">Post Your Request</h3>
              <p className="text-gray-600">
                Describe your project requirements and receive AI-powered price estimates
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-600 rounded-lg mb-4"></div>
              <h3 className="text-xl font-semibold mb-3">Get Matched</h3>
              <p className="text-gray-600">
                Our system matches you with verified contractors based on expertise and availability
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-600 rounded-lg mb-4"></div>
              <h3 className="text-xl font-semibold mb-3">Secure Payment</h3>
              <p className="text-gray-600">
                Pay securely through our escrow system. Funds released upon job completion
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose BuildConnect
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h4 className="font-semibold mb-1">Verified Contractors</h4>
                    <p className="text-gray-600">
                      All contractors undergo AI-powered verification and document screening
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h4 className="font-semibold mb-1">Secure Payments</h4>
                    <p className="text-gray-600">
                      Integrated M-Pesa payments with escrow protection
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h4 className="font-semibold mb-1">Fair Pricing</h4>
                    <p className="text-gray-600">
                      ML-powered price estimation ensures fair market rates
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h4 className="font-semibold mb-1">Quality Assurance</h4>
                    <p className="text-gray-600">
                      Review system and performance tracking for accountability
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 h-96 rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of satisfied clients and contractors
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
              Create Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">BuildConnect</h3>
              <p className="text-gray-400">
                Connecting clients with trusted contractors across Kenya
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/categories" className="hover:text-white transition">Browse Services</Link></li>
                <li><Link to="/contractors" className="hover:text-white transition">Find Contractors</Link></li>
                <li><Link to="/register" className="hover:text-white transition">Post a Job</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Contractors</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/register?type=contractor" className="hover:text-white transition">Join as Contractor</Link></li>
                <li><Link to="/login" className="hover:text-white transition">Contractor Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 BuildConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
