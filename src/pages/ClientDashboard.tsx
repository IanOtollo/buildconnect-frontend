import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { serviceRequestsAPI, walletAPI, paymentsAPI } from '../services/api';
import type { ServiceRequest, WalletBalance } from '../types';
import {
  FiPlus, FiBriefcase, FiClock, FiCheckCircle, FiXCircle, FiBox,
  FiTrendingUp, FiActivity, FiUser, FiMapPin, FiShield, FiDollarSign,
  FiAlertCircle, FiThumbsUp, FiThumbsDown
} from 'react-icons/fi';

// ─── Status Configuration ───────────────────────────────────────────────────
const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Awaiting Contractor', color: 'text-gray-400 bg-gray-400/10 border-gray-400/20', icon: FiClock },
  accepted: { label: 'Accepted – Pay 20% Deposit', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', icon: FiDollarSign },
  rejected: { label: 'Rejected', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: FiXCircle },
  deposit_paid: { label: 'Deposit Paid – In Progress', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: FiTrendingUp },
  pending_midpoint_approval: { label: 'Confirm Midpoint Progress', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20', icon: FiAlertCircle },
  midpoint_approved: { label: 'Midpoint Done – Pay 80%', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20', icon: FiDollarSign },
  balance_paid: { label: 'Balance Paid – Finishing Up', color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20', icon: FiActivity },
  pending_final_approval: { label: 'Confirm Completion', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20', icon: FiAlertCircle },
  completed: { label: 'Completed', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: FiCheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: FiXCircle },
};

// ─── Payment Modal ───────────────────────────────────────────────────────────
const PaymentModal: React.FC<{
  request: ServiceRequest;
  stage: 'deposit' | 'balance';
  onClose: () => void;
  onPaid: () => void;
}> = ({ request, stage, onClose, onPaid }) => {
  const { user } = useAuth() as any;
  const amount = stage === 'deposit' ? ((request.budget ?? 0) * 0.20) : ((request.budget ?? 0) * 0.80);
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handlePay = async () => {
    if (!phone) { setMsg('Please enter your M-Pesa phone number.'); return; }
    setLoading(true);
    try {
      const fn = stage === 'deposit' ? paymentsAPI.payDeposit : paymentsAPI.payBalance;
      await fn({ phone, amount, service_request_id: request.id });
      setMsg('✅ M-Pesa prompt sent! Check your phone and enter your PIN.');
      setTimeout(() => { onPaid(); onClose(); }, 3000);
    } catch (err: any) {
      setMsg('❌ ' + (err.response?.data?.error || 'Payment failed. Try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="glass-card p-8 max-w-md w-full mx-4 space-y-6">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">
            {stage === 'deposit' ? 'Pay 20% Deposit' : 'Pay 80% Balance'}
          </h2>
          <p className="text-gray-400 text-sm">For: <span className="text-white font-semibold">{request.title}</span></p>
        </div>
        <div className="p-4 rounded-xl bg-primary-500/10 border border-primary-500/20 text-center">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Amount Due</p>
          <p className="text-4xl font-black text-white">KES {amount.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{stage === 'deposit' ? '20%' : '80%'} of KES {request.budget?.toLocaleString()}</p>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">M-Pesa Phone Number</label>
          <input
            type="tel" value={phone} onChange={e => setPhone(e.target.value)}
            placeholder="e.g. 0712345678"
            className="glass-input w-full h-12"
          />
        </div>
        {msg && <p className="text-sm text-center py-2 px-4 rounded-xl bg-white/5">{msg}</p>}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-secondary h-12">Cancel</button>
          <button onClick={handlePay} disabled={loading || !!msg.startsWith('✅')} className="flex-1 btn-primary h-12">
            {loading ? <span className="animate-spin">⟳</span> : `Pay KES ${amount.toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Confirm Modal ───────────────────────────────────────────────────────────
const ConfirmModal: React.FC<{
  request: ServiceRequest;
  stage: 'midpoint' | 'final';
  onClose: () => void;
  onConfirmed: () => void;
}> = ({ request, stage, onClose, onConfirmed }) => {
  const [action, setAction] = useState<'approve' | 'decline' | null>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async () => {
    if (!action) { setMsg('Please choose Approve or Decline.'); return; }
    if (action === 'decline' && !reason.trim()) { setMsg('Please provide a reason for declining.'); return; }
    setLoading(true);
    try {
      await serviceRequestsAPI.confirmProgress(request.id, stage, action, reason);
      setMsg(action === 'approve' ? '✅ Confirmed successfully!' : '✅ Declined and contractor notified.');
      setTimeout(() => { onConfirmed(); onClose(); }, 2000);
    } catch (err: any) {
      setMsg('❌ ' + (err.response?.data?.error || 'Failed. Try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="glass-card p-8 max-w-lg w-full mx-4 space-y-6">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">
            {stage === 'midpoint' ? 'Confirm Midpoint Progress' : 'Confirm Project Completion'}
          </h2>
          <p className="text-gray-400 text-sm">For: <span className="text-white font-semibold">{request.title}</span></p>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
          {stage === 'midpoint'
            ? 'Your contractor says the project is 50% done. If you approve, you\'ll be asked to pay the remaining 80% balance.'
            : 'Your contractor says the project is fully complete. Approving will release the full escrowed amount to them.'}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => { setAction('approve'); setMsg(''); }}
            className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-bold border transition-all ${action === 'approve' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-400 hover:border-emerald-500/30'}`}
          >
            <FiThumbsUp /> Approve
          </button>
          <button
            onClick={() => { setAction('decline'); setMsg(''); }}
            className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-bold border transition-all ${action === 'decline' ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-white/5 border-white/10 text-gray-400 hover:border-red-500/30'}`}
          >
            <FiThumbsDown /> Decline
          </button>
        </div>
        {action === 'decline' && (
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Reason for Declining *</label>
            <textarea
              rows={3} value={reason} onChange={e => setReason(e.target.value)}
              placeholder="Describe what still needs to be done..."
              className="glass-input w-full py-3 resize-none"
            />
          </div>
        )}
        {msg && <p className="text-sm text-center py-2 px-4 rounded-xl bg-white/5">{msg}</p>}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-secondary h-12">Cancel</button>
          <button onClick={handleSubmit} disabled={loading || !action} className="flex-1 btn-primary h-12">
            {loading ? <span className="animate-spin">⟳</span> : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Client Dashboard ───────────────────────────────────────────────────
const ClientDashboard: React.FC = () => {
  const { user } = useAuth() as any;
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [wallet, setWallet] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState<{ request: ServiceRequest; stage: 'deposit' | 'balance' } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ request: ServiceRequest; stage: 'midpoint' | 'final' } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [reqRes, walletRes] = await Promise.all([serviceRequestsAPI.getAll(), walletAPI.getBalance()]);
      setRequests(Array.isArray(reqRes.data) ? reqRes.data : []);
      setWallet(walletRes.data);
    } catch (e) {
      console.error('Client dashboard fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getStatusInfo = (status: string) => STATUS_MAP[status] || { label: status, color: 'text-gray-400 bg-gray-400/10 border-gray-400/20', icon: FiBox };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-medium">Loading your projects...</p>
        </div>
      </div>
    );
  }

  const active = requests.filter(r => !['completed', 'cancelled', 'rejected'].includes(r.status));
  const done = requests.filter(r => ['completed', 'cancelled', 'rejected'].includes(r.status));

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8">
      {paymentModal && (
        <PaymentModal
          request={paymentModal.request}
          stage={paymentModal.stage}
          onClose={() => setPaymentModal(null)}
          onPaid={fetchData}
        />
      )}
      {confirmModal && (
        <ConfirmModal
          request={confirmModal.request}
          stage={confirmModal.stage}
          onClose={() => setConfirmModal(null)}
          onConfirmed={fetchData}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-1">Project Hub</h1>
            <p className="text-gray-400">Welcome back, <span className="text-white font-semibold">{user?.full_name}</span></p>
          </div>
          <Link to="/service-requests/new" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 group">
            <FiPlus className="text-xl group-hover:rotate-90 transition-transform" />
            New Project Request
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Projects', value: requests.length, icon: FiBriefcase, color: 'text-blue-400' },
            { label: 'Active', value: active.length, icon: FiActivity, color: 'text-indigo-400' },
            { label: 'Completed', value: done.filter(r => r.status === 'completed').length, icon: FiCheckCircle, color: 'text-emerald-400' },
            { label: 'Wallet (KES)', value: wallet?.available_balance ? Number(wallet.available_balance).toLocaleString() : '0', icon: FiDollarSign, color: 'text-yellow-400' },
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

        {/* Active Projects */}
        {active.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FiActivity className="text-blue-400" /> Active Projects</h2>
            <div className="space-y-4">
              {active.map(req => {
                const info = getStatusInfo(req.status);
                const Icon = info.icon;
                const depositAmt = (req.budget || 0) * 0.20;
                const balanceAmt = (req.budget || 0) * 0.80;
                return (
                  <div key={req.id} className="glass-card p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-white font-bold text-lg truncate">{req.title}</h3>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${info.color}`}>
                            <Icon className="text-xs" />{info.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                          {req.location && <span className="flex items-center gap-1"><FiMapPin /> {req.location}</span>}
                          {req.budget > 0 && <span className="flex items-center gap-1"><FiDollarSign /> Budget: KES {req.budget?.toLocaleString()}</span>}
                          {req.urgency && <span className={`capitalize font-semibold ${req.urgency === 'high' ? 'text-red-400' : req.urgency === 'medium' ? 'text-yellow-400' : 'text-emerald-400'}`}>{req.urgency} priority</span>}
                        </div>
                      </div>
                      {/* Action Buttons based on status */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {req.status === 'accepted' && (
                          <button
                            onClick={() => setPaymentModal({ request: req, stage: 'deposit' })}
                            className="btn-primary flex items-center gap-2 !py-2.5 !px-5 text-sm"
                          >
                            <FiDollarSign /> Pay 20% Deposit (KES {depositAmt.toLocaleString()})
                          </button>
                        )}
                        {req.status === 'pending_midpoint_approval' && (
                          <button
                            onClick={() => setConfirmModal({ request: req, stage: 'midpoint' })}
                            className="btn-primary flex items-center gap-2 !py-2.5 !px-5 text-sm bg-orange-500 border-orange-500"
                          >
                            <FiAlertCircle /> Review Midpoint
                          </button>
                        )}
                        {req.status === 'midpoint_approved' && (
                          <button
                            onClick={() => setPaymentModal({ request: req, stage: 'balance' })}
                            className="btn-primary flex items-center gap-2 !py-2.5 !px-5 text-sm"
                          >
                            <FiDollarSign /> Pay 80% Balance (KES {balanceAmt.toLocaleString()})
                          </button>
                        )}
                        {req.status === 'pending_final_approval' && (
                          <button
                            onClick={() => setConfirmModal({ request: req, stage: 'final' })}
                            className="btn-primary flex items-center gap-2 !py-2.5 !px-5 text-sm bg-emerald-600 border-emerald-600"
                          >
                            <FiCheckCircle /> Confirm Completion
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

        {/* Past Projects */}
        {done.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FiCheckCircle className="text-emerald-400" /> Past Projects</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {done.map(req => {
                const info = getStatusInfo(req.status);
                const Icon = info.icon;
                return (
                  <div key={req.id} className="glass-card p-5 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold truncate mb-1">{req.title}</h3>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold border ${info.color}`}>
                          <Icon className="text-xs" />{info.label}
                        </span>
                      </div>
                      {req.budget > 0 && <span className="text-sm text-gray-400 font-semibold">KES {req.budget?.toLocaleString()}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {requests.length === 0 && (
          <div className="glass-card p-16 text-center">
            <FiShield className="text-5xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Projects Yet</h3>
            <p className="text-gray-500 mb-6">Post your first project and get matched with verified professionals.</p>
            <Link to="/service-requests/new" className="btn-primary inline-flex items-center gap-2">
              <FiPlus /> Start Your First Project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
