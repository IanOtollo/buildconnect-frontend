import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api, getErrorMessage } from '../services/api';
import { FiArrowLeft, FiShield, FiDollarSign, FiClock, FiMapPin, FiCheckCircle } from 'react-icons/fi';

const ServiceRequestDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [request, setRequest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [paying, setPaying] = useState(false);
    const [phone, setPhone] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        fetchRequestDetails();
    }, [id]);

    const fetchRequestDetails = async () => {
        try {
            const response = await api.get(`/service-requests`);
            // Simulating a fetching by ID since we don't have a specific GET endpoint
            const req = response.data.find((r: any) => r.id === parseInt(id!));
            if (req) {
                setRequest(req);
            } else {
                setError('Service request not found');
            }
        } catch (err: any) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const handleEscrowPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone) {
            setError('Please provide M-Pesa phone number');
            return;
        }
        setError('');
        setPaying(true);

        try {
            await api.post('/payments/stkpush', {
                phone: phone,
                amount: request.budget,
                service_request_id: request.id
            });
            setPaymentSuccess(true);
        } catch (err: any) {
            setError(getErrorMessage(err));
            setPaying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030712] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (error || !request) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-[#030712] flex justify-center">
                <div className="glass-card p-8 max-w-lg text-center">
                    <p className="text-red-400 mb-4">{error || 'Not found'}</p>
                    <Link to="/client/dashboard" className="text-primary-500 hover:text-primary-400">Return to Dashboard</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-[#030712]">
            <div className="max-w-4xl mx-auto px-4">
                <Link to="/client/dashboard" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8">
                    <FiArrowLeft className="mr-2" /> Back to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-2/3 space-y-6">
                        <div className="glass-card p-8">
                            <div className="mb-6">
                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-primary-500/10 text-primary-400 uppercase tracking-wider mb-4 border border-primary-500/20">
                                    {request.status.replace('_', ' ')}
                                </span>
                                <h1 className="text-3xl font-black text-white mb-2">{request.title}</h1>
                                <p className="text-gray-400">{request.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <FiDollarSign className="text-primary-500" /> Budget
                                    </div>
                                    <p className="text-xl font-bold text-white">KES {request.budget?.toLocaleString()}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <FiClock className="text-primary-500" /> Duration
                                    </div>
                                    <p className="text-xl font-bold text-white">{request.estimated_duration || 'Not specified'}</p>
                                </div>
                                <div className="col-span-2 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <FiMapPin className="text-primary-500" /> Location
                                    </div>
                                    <p className="text-lg font-bold text-white">{request.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-1/3">
                        {request.status === 'pending_deposit' && (
                            <div className="glass-card p-6 border-primary-500/30">
                                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                    <FiShield className="text-emerald-400" /> Fund Escrow
                                </h3>
                                <p className="text-sm text-gray-400 mb-6">
                                    Secure your project by funding the escrow account. Funds are only released when you approve the completed work.
                                </p>

                                {paymentSuccess ? (
                                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                                        <FiCheckCircle className="text-3xl text-emerald-400 mx-auto mb-2" />
                                        <p className="text-emerald-400 font-bold mb-2">Check your phone</p>
                                        <p className="text-sm text-emerald-200">Enter your M-Pesa PIN to complete the transaction.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleEscrowPayment} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">M-Pesa Phone Number</label>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="2547XXXXXXXX"
                                                required
                                                className="glass-input w-full h-12 text-sm"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={paying}
                                            className="btn-primary w-full h-12"
                                        >
                                            {paying ? 'Initiating...' : `Pay KES ${request.budget}`}
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}

                        {request.status === 'paid_escrow' && (
                            <div className="glass-card p-6 bg-emerald-500/5 border-emerald-500/20">
                                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                    <FiCheckCircle className="text-emerald-400" /> Escrow Funded
                                </h3>
                                <p className="text-sm text-gray-400">
                                    Your funds are securely held in escrow. The contractor will begin work shortly.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceRequestDetails;
