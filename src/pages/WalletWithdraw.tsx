import React from 'react';
import { FiDollarSign, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const WalletWithdraw: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 bg-[#030712]">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
                >
                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </button>

                <div className="glass-card p-8 md:p-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                            <FiDollarSign className="text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Withdraw Funds</h1>
                            <p className="text-gray-400 text-sm">Transfer your earnings to M-Pesa</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-8 border-2 border-dashed border-white/5 rounded-2xl text-center">
                            <p className="text-gray-500 mb-0">Withdrawal functionality is being integrated with M-Pesa B2C.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletWithdraw;
