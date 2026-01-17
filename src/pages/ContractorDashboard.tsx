import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contractorsAPI, assignmentsAPI, walletAPI } from '../services/api';
import type { ContractorProfile, Assignment, WalletBalance } from '../types';
import Button from '../components/Button';

const ContractorDashboard: React.FC = () => {
  const [profile, setProfile] = useState<ContractorProfile | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [wallet, setWallet] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileData, assignmentsData, walletData] = await Promise.all([
        contractorsAPI.getMe(),
        assignmentsAPI.getPending(),
        walletAPI.getBalance(),
      ]);
      setProfile(profileData);
      setAssignments(assignmentsData);
      setWallet(walletData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAssignment = async (assignmentId: number) => {
    try {
      await assignmentsAPI.accept(assignmentId);
      fetchData();
    } catch (error) {
      console.error('Error accepting assignment:', error);
    }
  };

  const handleDeclineAssignment = async (assignmentId: number) => {
    try {
      await assignmentsAPI.decline(assignmentId);
      fetchData();
    } catch (error) {
      console.error('Error declining assignment:', error);
    }
  };

  const toggleAvailability = async () => {
    if (profile) {
      try {
        await contractorsAPI.updateAvailability(!profile.is_available);
        setProfile({ ...profile, is_available: !profile.is_available });
      } catch (error) {
        console.error('Error updating availability:', error);
      }
    }
  };

  const getVerificationBadge = () => {
    if (!profile) return null;

    const badges: Record<string, { color: string; text: string }> = {
      approved: { color: 'bg-green-100 text-green-800', text: 'Verified' },
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending Verification' },
      under_review: { color: 'bg-blue-100 text-blue-800', text: 'Under Review' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Verification Failed' },
    };

    const badge = badges[profile.verification_status];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
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
          <h1 className="text-3xl font-bold text-gray-900">Contractor Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your assignments and profile</p>
        </div>

        {/* Profile Card */}
        {profile && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{profile.business_name}</h2>
                <p className="text-gray-600">{profile.full_name}</p>
              </div>
              {getVerificationBadge()}
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-yellow-600">{profile.rating.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Jobs Completed</p>
                <p className="text-2xl font-bold text-green-600">{profile.total_jobs_completed}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Hourly Rate</p>
                <p className="text-2xl font-bold text-gray-900">KES {profile.hourly_rate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <div className="mt-2">
                  <button
                    onClick={toggleAvailability}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      profile.is_available
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {profile.is_available ? 'Available' : 'Unavailable'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wallet Card */}
        {wallet && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Earnings</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-2xl font-bold text-green-600">
                  KES {wallet.available_balance.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Completion</p>
                <p className="text-2xl font-bold text-orange-600">
                  KES {wallet.locked_balance.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  KES {wallet.total_balance.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Link to="/wallet/withdraw">
                <Button>Withdraw Funds</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Pending Assignments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Pending Assignments</h2>

          {assignments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No pending assignments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="border rounded-lg p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold text-lg">{assignment.service_request.title}</h3>
                    <p className="text-sm text-gray-600">{assignment.service_request.category.name}</p>
                  </div>
                  <p className="text-gray-700 mb-3">{assignment.service_request.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Budget:</span> KES {assignment.service_request.budget.toLocaleString()}
                      <span className="ml-4">
                        <span className="font-medium">Location:</span> {assignment.service_request.location}
                      </span>
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        size="sm"
                        onClick={() => handleAcceptAssignment(assignment.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeclineAssignment(assignment.id)}
                      >
                        Decline
                      </Button>
                    </div>
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

export default ContractorDashboard;
