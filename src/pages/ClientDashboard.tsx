import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { serviceRequestsAPI, walletAPI } from '../services/api';
import type { ServiceRequest, WalletBalance } from '../types';
import Button from '../components/Button';

const ClientDashboard: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [wallet, setWallet] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [requestsData, walletData] = await Promise.all([
        serviceRequestsAPI.getAll(),
        walletAPI.getBalance(),
      ]);
      setRequests(requestsData);
      setWallet(walletData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending_deposit: 'bg-yellow-100 text-yellow-800',
      pending_assignment: 'bg-blue-100 text-blue-800',
      assigned: 'bg-purple-100 text-purple-800',
      in_progress: 'bg-indigo-100 text-indigo-800',
      pending_completion: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your service requests and wallet</p>
        </div>

        {/* Wallet Card */}
        {wallet && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Wallet Balance</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-2xl font-bold text-green-600">
                  KES {wallet.available_balance.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Locked in Escrow</p>
                <p className="text-2xl font-bold text-orange-600">
                  KES {wallet.locked_balance.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  KES {wallet.total_balance.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-6 flex space-x-4">
              <Link to="/wallet/deposit">
                <Button>Deposit Funds</Button>
              </Link>
              <Link to="/wallet/transactions">
                <Button variant="outline">View Transactions</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Service Requests */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Service Requests</h2>
            <Link to="/service-requests/new">
              <Button>New Request</Button>
            </Link>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No service requests yet</p>
              <Link to="/service-requests/new">
                <Button>Create Your First Request</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{request.title}</h3>
                      <p className="text-sm text-gray-600">{request.category.name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{request.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Budget:</span> KES {request.budget.toLocaleString()}
                      {request.deposit_paid && (
                        <span className="ml-4 text-green-600">Deposit Paid</span>
                      )}
                    </div>
                    <Link to={`/service-requests/${request.id}`}>
                      <Button size="sm" variant="outline">View Details</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
