import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contractorsAPI, assignmentsAPI, walletAPI } from '../services/api';
import type { ContractorProfile, Assignment, WalletBalance } from '../types';
import {
  FiBriefcase,
  FiStar,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiWallet,
  FiMapPin,
  FiCheck,
  FiX,
  FiChevronRight,
  FiActivity,
  FiZap,
  FiShield
} from 'react-icons/fi';

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
      const [profileRes, assignmentsRes, walletRes] = await Promise.all([
        contractorsAPI.getMe(),
        assignmentsAPI.getPending(),
        walletAPI.getBalance(),
      ]);
      setProfile(profileRes.data);
      setAssignments(assignmentsRes.data);
      setWallet(walletRes.data);
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

  const getVerificationStatus = () => {
    if (!profile) return null;
    const statuses: Record<string, { label: string; color: string; icon: any }> = {
      approved: { label: 'Verified Pro', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: FiShield },
      pending: { label: 'Pending Review', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', icon: FiClock },
      under_review: { label: 'Under Review', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: FiActivity },
      rejected: { label: 'Action Required', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: FiX },
    };
    return statuses[profile.verification_status] || { label: profile.verification_status, color: 'text-gray-400 bg-gray-400/10 border-gray-400/20', icon: FiZap };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-medium">Loading professional dashboard...</p>
        </div>
      </div>
    );
  }

  const verif = getVerificationStatus();

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 bg-[#030712]">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-black text-white tracking-tight">{profile?.business_name || 'Pro Center'}</h1>
              {verif && (
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${verif.color}`}>
                  <verif.icon className="text-xs" />
                  {verif.label}
                </div>
              )}
            </div>
            <p className="text-gray-400">Welcome back, {profile?.full_name}. Here is your operations overview.</p>
          </div>
          <button
            onClick={toggleAvailability}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${profile?.is_available
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-emerald-500/5'
                : 'bg-white/5 text-gray-400 border border-white/10 shadow-none'
              } group`}
          >
            <div className={`w-2 h-2 rounded-full ${profile?.is_available ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
            {profile?.is_available ? 'Available for Work' : 'Going Offline'}
          </button>
        </div>

        {/* Core Metrics grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="glass-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-500">
                <FiStar className="text-xl" />
              </div>
              <span className="text-gray-400 text-sm font-medium">Performance Rating</span>
            </div>
            <p className="text-3xl font-black text-white">{profile?.rating.toFixed(1)} <span className="text-xs text-gray-500 font-normal">/ 5.0</span></p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                <FiBriefcase className="text-xl" />
              </div>
              <span className="text-gray-400 text-sm font-medium">Projects Done</span>
            </div>
            <p className="text-3xl font-black text-white">{profile?.total_jobs_completed}</p>
          </div>

          <div className="glass-card p-6 col-span-2 relative overflow-hidden bg-gradient-to-br from-indigo-600/5 to-transparent">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="flex items-center justify-between relative">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <FiWallet className="text-xl" />
                </div>
                <div>
                  <span className="text-gray-400 text-sm font-medium">Withdrawable Income</span>
                  <p className="text-3xl font-black text-white">
                    KES {wallet?.available_balance.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
              <Link to="/wallet/withdraw" className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10 text-sm">
                Withdraw
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Assignments List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FiZap className="text-blue-400" />
                New Opportunities
              </h2>
              <span className="text-xs text-gray-500 font-medium">{assignments.length} pending requests</span>
            </div>

            {assignments.length === 0 ? (
              <div className="glass-card p-12 text-center border-dashed border-white/5 bg-transparent">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiBriefcase className="text-3xl text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No new assignments</h3>
                <p className="text-gray-400 mb-0 max-w-sm mx-auto">
                  Stay active! Clients will see your profile when they post matching jobs.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="glass-card p-6 group hover:bg-white/[0.07] transition-all border border-white/5 hover:border-blue-500/30">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                            {assignment.service_request.title}
                          </h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-gray-400 font-bold uppercase tracking-wider border border-white/10">
                            {assignment.service_request.category.name}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2">
                          {assignment.service_request.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-6">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FiTrendingUp className="text-emerald-400/60" />
                            Job Budget: <span className="text-gray-200 font-bold">KES {assignment.service_request.budget.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FiMapPin className="text-purple-400/60" />
                            {assignment.service_request.location}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FiClock className="text-blue-400/60" />
                            2 hours ago
                          </div>
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-3 flex-shrink-0">
                        <button
                          onClick={() => handleAcceptAssignment(assignment.id)}
                          className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/10"
                        >
                          <FiCheck /> Accept
                        </button>
                        <button
                          onClick={() => handleDeclineAssignment(assignment.id)}
                          className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-gray-400 px-6 py-2.5 rounded-xl font-bold transition-all border border-white/10 hover:border-red-500/20"
                        >
                          <FiX /> Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dashboard Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-6 bg-gradient-to-br from-purple-600/10 to-transparent">
              <FiActivity className="text-3xl text-purple-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Revenue Growth</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                You've earned <span className="text-white font-bold">KES 12,400</span> more than last week. Keep up the great work!
              </p>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[65%] rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              </div>
            </div>

            <div className="glass-card p-6 overflow-hidden relative">
              <div className="absolute -right-10 -top-10 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/profile/edit" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <FiZap className="text-sm" />
                    </div>
                    <span className="text-sm font-bold text-gray-300 group-hover:text-white">Update Services</span>
                  </div>
                  <FiChevronRight className="text-gray-500 group-hover:text-blue-400" />
                </Link>
                <Link to="/wallet/history" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <FiTrendingUp className="text-sm" />
                    </div>
                    <span className="text-sm font-bold text-gray-300 group-hover:text-white">Tax Reports</span>
                  </div>
                  <FiChevronRight className="text-gray-500 group-hover:text-emerald-400" />
                </Link>
                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                      <FiShield className="text-sm" />
                    </div>
                    <span className="text-sm font-bold text-gray-300 group-hover:text-white">Security Center</span>
                  </div>
                  <FiChevronRight className="text-gray-500 group-hover:text-orange-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorDashboard;
