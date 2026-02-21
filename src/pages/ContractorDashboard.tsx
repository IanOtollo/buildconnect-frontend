import React, { useState, useEffect, useCallback } from 'react';

import { useAuth } from '../context/AuthContext';
import { contractorsAPI, serviceRequestsAPI, walletAPI } from '../services/api';
import type { WalletBalance } from '../types';
import {
  FiClock, FiTrendingUp, FiMapPin, FiCheck, FiX,
  FiZap, FiShield, FiCheckCircle, FiAlertCircle,
  FiDollarSign, FiEdit
} from 'react-icons/fi';

// ─── Progress Notes Modal ────────────────────────────────────────────────────
const ProgressModal: React.FC<{
  requestId: number;
  requestTitle: string;
  stage: 'midpoint' | 'final';
  onClose: () => void;
  onSubmitted: () => void;
}> = ({ requestId, requestTitle, stage, onClose, onSubmitted }) => {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await serviceRequestsAPI.updateProgress(requestId, stage, notes);
      setMsg('✅ Update submitted! Waiting for client confirmation.');
      setTimeout(() => { onSubmitted(); onClose(); }, 2500);
    } catch (err: any) {
      setMsg('❌ ' + (err.response?.data?.error || 'Failed to submit update.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="glass-card p-8 max-w-md w-full mx-4 space-y-6">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">
            {stage === 'midpoint' ? 'Mark 50% Milestone' : 'Mark Project Complete'}
          </h2>
          <p className="text-gray-400 text-sm">For: <span className="text-white font-semibold">{requestTitle}</span></p>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
          {stage === 'midpoint'
            ? 'Inform the client that the project is halfway done. They will confirm and then pay the remaining 80% balance.'
            : 'Inform the client that the project is fully complete. They will confirm and the escrow funds will be released to you.'}
        </p>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Progress Notes (Optional)</label>
          <textarea
            rows={4} value={notes} onChange={e => setNotes(e.target.value)}
            placeholder={stage === 'midpoint' ? 'Describe what has been completed so far...' : 'Describe what was completed...'}
            className="glass-input w-full py-3 resize-none"
          />
        </div>
        {msg && <p className="text-sm text-center py-2 px-4 rounded-xl bg-white/5">{msg}</p>}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-secondary h-12">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="flex-1 btn-primary h-12">
            {loading ? <span className="animate-spin">⟳</span> : 'Submit Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Contractor Dashboard ───────────────────────────────────────────────
const ContractorDashboard: React.FC = () => {
  const { user } = useAuth() as any;
  const [profile, setProfile] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [wallet, setWallet] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [progressModal, setProgressModal] = useState<{ id: number; title: string; stage: 'midpoint' | 'final' } | null>(null);
  const [respondingId, setRespondingId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [profileRes, reqRes, walletRes] = await Promise.all([
        contractorsAPI.getMe(),
        serviceRequestsAPI.getAll(),
        walletAPI.getBalance(),
      ]);
      setProfile(profileRes.data);
      setRequests(Array.isArray(reqRes.data) ? reqRes.data : []);
      setWallet(walletRes.data);
    } catch (e) {
      console.error('Contractor dashboard error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleRespond = async (requestId: number, action: 'accept' | 'reject') => {
    setRespondingId(requestId);
    try {
      await serviceRequestsAPI.respond(requestId, action);
      fetchData();
    } catch (e) {
      console.error('Respond error:', e);
    } finally {
      setRespondingId(null);
    }
  };

  const toggleAvailability = async () => {
    if (!profile) return;
    try {
      await contractorsAPI.updateAvailability(!profile.is_available);
      setProfile({ ...profile, is_available: !profile.is_available });
    } catch (e) {
      console.error('Availability error:', e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const pending = requests.filter(r => r.status === 'pending');
  const inProgress = requests.filter(r => ['accepted', 'deposit_paid', 'pending_midpoint_approval', 'midpoint_approved', 'balance_paid', 'pending_final_approval'].includes(r.status));
  const completed = requests.filter(r => r.status === 'completed');

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      accepted: { label: 'Awaiting Client Deposit', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
      deposit_paid: { label: 'Deposit Paid – Begin Work', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
      pending_midpoint_approval: { label: 'Midpoint Pending Approval', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
      midpoint_approved: { label: 'Midpoint Approved', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
      balance_paid: { label: 'Balance Paid – Finish the Job', color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20' },
      pending_final_approval: { label: 'Completion Pending Approval', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
      completed: { label: 'Completed & Paid', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
    };
    return map[status] || { label: status, color: 'text-gray-400 bg-gray-400/10 border-gray-400/20' };
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8">
      {progressModal && (
        <ProgressModal
          requestId={progressModal.id}
          requestTitle={progressModal.title}
          stage={progressModal.stage}
          onClose={() => setProgressModal(null)}
          onSubmitted={fetchData}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-1">Pro Dashboard</h1>
            <p className="text-gray-400">Hello, <span className="text-white font-semibold">{profile?.business_name || user?.full_name}</span></p>
          </div>
          <div className="flex items-center gap-3">
            {profile?.status === 'approved' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <FiShield /> Verified Pro
              </span>
            )}
            <button
              onClick={toggleAvailability}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${profile?.is_available ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
            >
              {profile?.is_available ? '🟢 Available' : '🔴 Unavailable'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'New Requests', value: pending.length, icon: FiAlertCircle, color: 'text-yellow-400' },
            { label: 'In Progress', value: inProgress.length, icon: FiTrendingUp, color: 'text-blue-400' },
            { label: 'Completed', value: completed.length, icon: FiCheckCircle, color: 'text-emerald-400' },
            { label: 'Wallet (KES)', value: wallet?.available_balance ? Number(wallet.available_balance).toLocaleString() : '0', icon: FiDollarSign, color: 'text-purple-400' },
          ].map(s => (
            <div key={s.label} className="glass-card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{s.label}</span>
                <s.icon className={`${s.color} text-lg`} />
              </div>
              <p className="text-2xl font-black text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Pending Requests */}
        {pending.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FiAlertCircle className="text-yellow-400" /> New Service Requests</h2>
            <div className="space-y-4">
              {pending.map(req => (
                <div key={req.id} className="glass-card p-6 border-yellow-500/10">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-lg mb-1 truncate">{req.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-2">{req.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        {req.location && <span className="flex items-center gap-1"><FiMapPin /> {req.location}</span>}
                        {req.budget > 0 && <span className="flex items-center gap-1 text-emerald-400 font-semibold"><FiDollarSign /> Budget: KES {req.budget?.toLocaleString()}</span>}
                        {req.estimated_duration && <span className="flex items-center gap-1"><FiClock /> {req.estimated_duration}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <button
                        onClick={() => handleRespond(req.id, 'reject')}
                        disabled={respondingId === req.id}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all"
                      >
                        <FiX /> Decline
                      </button>
                      <button
                        onClick={() => handleRespond(req.id, 'accept')}
                        disabled={respondingId === req.id}
                        className="btn-primary flex items-center gap-1.5 !py-2.5 !px-5 text-sm"
                      >
                        <FiCheck /> Accept
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Projects */}
        {inProgress.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FiTrendingUp className="text-blue-400" /> Active Projects</h2>
            <div className="space-y-4">
              {inProgress.map(req => {
                const badge = getStatusBadge(req.status);
                const canMarkMidpoint = req.status === 'deposit_paid';
                const canMarkFinal = req.status === 'balance_paid';
                const isPendingApproval = ['pending_midpoint_approval', 'pending_final_approval'].includes(req.status);
                return (
                  <div key={req.id} className="glass-card p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-white font-bold text-lg truncate">{req.title}</h3>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          {req.location && <span className="flex items-center gap-1"><FiMapPin /> {req.location}</span>}
                          {req.budget > 0 && <span className="flex items-center gap-1"><FiDollarSign /> KES {req.budget?.toLocaleString()}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {isPendingApproval && (
                          <span className="text-xs text-orange-400 font-semibold flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                            <FiClock /> Waiting for client confirmation...
                          </span>
                        )}
                        {canMarkMidpoint && (
                          <button
                            onClick={() => setProgressModal({ id: req.id, title: req.title, stage: 'midpoint' })}
                            className="btn-primary flex items-center gap-1.5 !py-2.5 !px-5 text-sm bg-blue-600 border-blue-600"
                          >
                            <FiEdit /> Mark 50% Done
                          </button>
                        )}
                        {canMarkFinal && (
                          <button
                            onClick={() => setProgressModal({ id: req.id, title: req.title, stage: 'final' })}
                            className="btn-primary flex items-center gap-1.5 !py-2.5 !px-5 text-sm bg-emerald-600 border-emerald-600"
                          >
                            <FiCheckCircle /> Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Projects */}
        {completed.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FiCheckCircle className="text-emerald-400" /> Completed Projects</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {completed.map(req => (
                <div key={req.id} className="glass-card p-5 opacity-80 hover:opacity-100 transition-opacity">
                  <div className="flex items-start gap-3">
                    <FiCheckCircle className="text-emerald-400 text-xl mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate">{req.title}</h3>
                      {req.budget > 0 && <p className="text-emerald-400 text-sm font-semibold">KES {req.budget?.toLocaleString()} earned</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {requests.length === 0 && (
          <div className="glass-card p-16 text-center">
            <FiZap className="text-5xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Requests Yet</h3>
            <p className="text-gray-500">Service requests assigned to you will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractorDashboard;
