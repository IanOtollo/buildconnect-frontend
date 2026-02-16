import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { serviceRequestsAPI, walletAPI } from '../services/api';
import type { ServiceRequest, WalletBalance } from '../types';
import {
  FiPlus,
  FiBriefcase,
  FiArrowUpRight,
  FiClock,
  FiCheckCircle,
  FiMessageSquare,
  FiBox,
  FiTrendingUp,
  FiChevronRight,
  FiActivity,
  FiUser,
  FiXCircle,
  FiMapPin,
  FiShield
} from 'react-icons/fi';

const ClientDashboard: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [wallet, setWallet] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [requestsRes, walletRes] = await Promise.all([
        serviceRequestsAPI.getAll(),
        walletAPI.getBalance(),
      ]);
      setRequests(Array.isArray(requestsRes.data) ? requestsRes.data : []);
      setWallet(walletRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statuses: Record<string, { label: string; color: string; icon: any }> = {
      pending_deposit: { label: 'Deposit Required', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', icon: FiBriefcase },
      pending_assignment: { label: 'Searching Experts', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: FiActivity },
      assigned: { label: 'Assigned', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20', icon: FiUser },
      in_progress: { label: 'In Progress', color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20', icon: FiTrendingUp },
      pending_completion: { label: 'Awaiting Review', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20', icon: FiClock },
      completed: { label: 'Completed', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: FiCheckCircle },
      cancelled: { label: 'Cancelled', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: FiXCircle },
    };
    return statuses[status] || { label: status, color: 'text-gray-400 bg-gray-400/10 border-gray-400/20', icon: FiBox };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-medium">Loading command center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">Project Control</h1>
            <p className="text-gray-400">Welcome back, here's an overview of your active projects.</p>
          </div>
          <Link to="/service-requests/new" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 group">
            <FiPlus className="text-xl group-hover:rotate-90 transition-transform" />
            New Project Request
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="glass-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                <FiBox className="text-xl" />
              </div>
              <span className="text-gray-400 text-sm font-medium">Total Projects</span>
            </div>
            <p className="text-3xl font-black text-white">{requests.length}</p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                <FiTrendingUp className="text-xl" />
              </div>
              <span className="text-gray-400 text-sm font-medium">Active</span>
            </div>
            <p className="text-3xl font-black text-white">
              {(Array.isArray(requests) ? requests : []).filter(r => !['completed', 'cancelled'].includes(r.status)).length}
            </p>
          </div>

          <div className="glass-card p-6 col-span-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="flex items-center justify-between relative">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                  <FiBriefcase className="text-xl" />
                </div>
                <div>
                  <span className="text-gray-400 text-sm font-medium">Available Balance</span>
                  <p className="text-3xl font-black text-white">
                    KES {wallet?.available_balance?.toLocaleString() ?? '0'}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link to="/wallet/deposit" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10">
                  <FiArrowUpRight className="text-lg" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Requests List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FiActivity className="text-blue-400" />
                Active Projects
              </h2>
            </div>

            {requests.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiBox className="text-3xl text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
                <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                  Start your construction journey by creating your first service request.
                </p>
                <Link to="/service-requests/new" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
                  Create Request Now →
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {requests.map((request) => {
                  const status = getStatusInfo(request.status);
                  const Icon = status.icon;
                  return (
                    <Link
                      key={request.id}
                      to={`/service-requests/${request.id}`}
                      className="glass-card p-6 group hover:bg-white/[0.07] transition-all border border-white/5 hover:border-blue-500/30"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-5">
                          <div className={`p-4 rounded-2xl ${status.color.split(' ')[1]} flex-shrink-0`}>
                            <Icon className="text-2xl" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                                {request.title}
                              </h3>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${status.color}`}>
                                {status.label}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm line-clamp-1 mb-3">
                              {request.description}
                            </p>
                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <FiTrendingUp className="text-blue-400/60" />
                                Budget: <span className="text-gray-300 font-bold">KES {request.budget?.toLocaleString() || '0'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <FiMapPin className="text-purple-400/60" />
                                {request.location}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1a1f2e] bg-gray-800 flex items-center justify-center text-[10px] text-gray-400 font-bold">
                                {request.contractor_name ? request.contractor_name[0] : 'BC'}
                              </div>
                            ))}
                          </div>
                          <div className="p-2 rounded-lg bg-white/5 text-gray-500 group-hover:text-blue-400 transition-colors">
                            <FiChevronRight className="text-xl" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <div className="glass-card p-6 bg-gradient-to-br from-blue-600/10 to-transparent">
              <FiActivity className="text-3xl text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Smart Estimator</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Unsure about costs? Use our AI-powered tool to get professional estimates for your next project.
              </p>
              <Link to="/ai-estimate" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/15 transition-all text-sm">
                Launch AI Tool
              </Link>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Support</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <FiMessageSquare />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">Direct Messages</p>
                    <p className="text-[10px] text-gray-500">2 unread notifications</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <FiShield />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Safety Center</p>
                    <p className="text-[10px] text-gray-500">Escrow protection active</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
