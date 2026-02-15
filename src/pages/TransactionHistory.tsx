import React, { useState, useEffect } from 'react';
import { api, getErrorMessage } from '../services/api';

interface Transaction {
  id: number;
  amount: number;
  transaction_type: string;
  status: string;
  reference_number: string;
  description: string;
  created_at: string;
}

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/wallet/transactions');
      setTransactions(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    const types: Record<string, any> = {
      deposit: (
        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      withdrawal: (
        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      ),
      payment: (
        <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      escrow_lock: (
        <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    };
    return types[type] || types.deposit;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-[#030712]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#030712]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-white">Transaction Logs</h1>
            <p className="text-gray-500 font-medium">Detailed history of all financial activities on your account.</p>
          </div>
          <button onClick={fetchTransactions} className="btn-secondary h-11 !text-sm">
            Refresh List
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {transactions.length === 0 ? (
          <div className="glass-card text-center py-32">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 text-gray-600">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No activity recorded</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Your transaction history will be displayed here once you perform deposits or payments.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/[0.04] transition-all group"
              >
                <div className="flex items-center gap-5 w-full md:w-auto">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform">
                    {getTransactionIcon(t.transaction_type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold uppercase tracking-wider text-white">
                        {t.transaction_type.replace(/_/g, ' ')}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${t.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                          t.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                        {t.status}
                      </span>
                    </div>
                    <div className="text-gray-400 text-sm mb-1">{t.description}</div>
                    <div className="text-gray-600 text-[10px] font-bold uppercase tracking-tighter">
                      {new Date(t.created_at).toLocaleString('en-KE', { dateStyle: 'long', timeStyle: 'short' })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                  <div className={`text-2xl font-black ${['deposit', 'refund', 'escrow_release'].includes(t.transaction_type) ? 'text-green-400' : 'text-white'
                    }`}>
                    {['deposit', 'refund', 'escrow_release'].includes(t.transaction_type) ? '+' : '-'}
                    <span className="text-sm mr-1">KES</span>
                    {t.amount.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-bold text-gray-600 uppercase mt-1">Ref: {t.reference_number || 'N/A'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
