import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentsAPI, api, getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

const WalletDeposit: React.FC = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await api.get('/auth/me');
      setWalletBalance(response.data.user.wallet_balance);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await paymentsAPI.initiateSTKPush({
        amount: parseFloat(amount),
        phone,
        description: 'Wallet Deposit'
      });
      setSuccess('M-Pesa prompt sent! Enter your PIN on your phone to complete the deposit.');
      setTimeout(() => navigate('/client/dashboard'), 5000);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [500, 1000, 2500, 5000, 10000];

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#030712]">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
            <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Secure Payments</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Deposit Funds</h1>
          <p className="text-gray-400">Add money to your BuildConnect wallet via M-Pesa Express.</p>
        </div>

        {walletBalance !== null && (
          <div className="glass-card p-8 mb-8 text-center bg-gradient-to-br from-primary-500/5 to-transparent border-primary-500/10">
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Available Balance</div>
            <div className="text-5xl font-black text-white">
              <span className="text-primary-500 text-2xl mr-2">KES</span>
              {walletBalance.toLocaleString()}
            </div>
          </div>
        )}

        <div className="glass-card p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                Select Amount (KES)
              </label>
              <div className="grid grid-cols-5 gap-3">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt.toString())}
                    className={`py-3 rounded-xl font-bold transition-all text-sm border ${amount === amt.toString()
                        ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/20'
                        : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10 hover:bg-white/[0.08]'
                      }`}
                  >
                    {amt >= 1000 ? `${amt / 1000}K` : amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="10"
                placeholder="Custom Amount"
                className="glass-input w-full !text-4xl h-24 text-center font-black !pr-4 !pl-4 focus:!border-primary-500 transition-all"
              />
              <div className="absolute top-2 left-4 text-[10px] font-bold text-gray-500 uppercase">Input Amount</div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="2547XXXXXXXX"
                className="glass-input w-full h-14"
              />
              <p className="text-[10px] text-gray-500 mt-2 italic px-1">Ensure format is 2547XXXXXXXX or 07XXXXXXXX</p>
            </div>

            <button
              type="submit"
              disabled={loading || !amount}
              className="btn-primary w-full h-16 text-lg shadow-xl shadow-primary-500/10"
            >
              {loading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Requesting Payment...</span>
                </div>
              ) : (
                `Deposit KES ${parseFloat(amount || '0').toLocaleString()}`
              )}
            </button>
          </form>

          <div className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Standard Procedure
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500 leading-relaxed">
              <div className="flex gap-2">
                <span className="text-primary-500 font-bold">01.</span>
                <span>Initiate the deposit with your phone number.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-primary-500 font-bold">02.</span>
                <span>Wait for the M-Pesa popup on your phone.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-primary-500 font-bold">03.</span>
                <span>Enter your PIN to authorize the transaction.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-primary-500 font-bold">04.</span>
                <span>Balance updates automatically upon confirmation.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDeposit;
