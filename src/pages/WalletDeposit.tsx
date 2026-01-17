import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { walletAPI } from '../services/api';
import type { WalletBalance } from '../types';

const WalletDeposit: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [wallet, setWallet] = useState<WalletBalance | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const data = await walletAPI.getBalance();
      setWallet(data);
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
      await walletAPI.depositMpesa(parseFloat(amount), phone);
      setSuccess('M-Pesa payment request sent. Check your phone to complete the payment.');
      setTimeout(() => navigate('/client/dashboard'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [1000, 5000, 10000, 20000, 50000];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Deposit Funds
          </h1>
          <p className="text-xl text-gray-600">
            Add money to your wallet via M-Pesa
          </p>
        </div>

        {wallet && (
          <div className="mb-8 bg-white rounded-lg p-8 border border-gray-200 text-center">
            <p className="text-gray-600 mb-2">Current Balance</p>
            <p className="text-4xl font-bold text-gray-900">
              KES {wallet.available_balance.toLocaleString()}
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quick Select Amount
              </label>
              <div className="grid grid-cols-5 gap-3">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt.toString())}
                    className={`py-3 rounded-lg font-medium transition-colors ${
                      amount === amt.toString()
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {amt / 1000}K
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (KES)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="100"
                placeholder="Enter amount"
                className="w-full px-4 py-4 text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-center font-bold"
              />
              <p className="text-gray-500 text-sm mt-2">Minimum deposit: KES 100</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="07XXXXXXXX"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Deposit KES ${amount || '0'}`}
            </button>
          </form>

          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">How it works</h4>
            <ol className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-start">
                <span className="font-medium mr-2">1.</span>
                Enter the amount you want to deposit
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">2.</span>
                Enter your M-Pesa phone number
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">3.</span>
                You'll receive an M-Pesa prompt on your phone
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">4.</span>
                Enter your M-Pesa PIN to complete the transaction
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">5.</span>
                Funds will be added to your wallet instantly
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDeposit;