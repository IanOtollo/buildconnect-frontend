import React, { useState } from 'react';
import { aiAPI, getErrorMessage } from '../services/api';

interface AIResponse {
    estimate: {
        total_cost: string;
        materials: Array<{ item: string; quantity: string; estimated_cost: string }>;
        timeline: string;
        recommendations: string[];
    };
}

const AIEstimation: React.FC = () => {
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AIResponse | null>(null);
    const [error, setError] = useState('');

    const handleEstimate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await aiAPI.getEstimate({ description, location });
            setResult(response.data);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-[#030712]">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 mb-4">
                        <span className="text-primary-400 text-xs font-bold uppercase tracking-widest">Powered by Gemini Pro</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">AI Project Estimator</h1>
                    <p className="text-gray-400">Describe your project and get instant market-accurate estimates.</p>
                </div>

                <div className="glass-card p-8 mb-12">
                    <form onSubmit={handleEstimate} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Project Location</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Syokimau, Nairobi"
                                    className="glass-input w-full"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Project Description</label>
                            <textarea
                                placeholder="e.g. A 3-bedroom bungalow with modern finishes, approximately 150sqm..."
                                className="glass-input w-full min-h-[150px]"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full h-14"
                        >
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Thinking...</span>
                                </div>
                            ) : (
                                <>
                                    <span>Generate Complete Estimate</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                </div>

                {result && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Summary Card */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="glass-card p-6 border-l-4 border-l-primary-500">
                                <div className="text-sm text-gray-500 font-bold uppercase mb-1">Estimated Total Cost</div>
                                <div className="text-3xl font-black text-white">{result.estimate?.total_cost || 'N/A'}</div>
                            </div>
                            <div className="glass-card p-6 border-l-4 border-l-secondary-500">
                                <div className="text-sm text-gray-500 font-bold uppercase mb-1">Projected Timeline</div>
                                <div className="text-3xl font-black text-white">{result.estimate?.timeline || 'N/A'}</div>
                            </div>
                        </div>

                        {/* Materials Table */}
                        <div className="glass-card overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h3 className="text-lg font-bold">Key Material Requirements</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-white/5">
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Material Item</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Quantity</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Est. Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {result.estimate?.materials?.map((m, i) => (
                                            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4 text-white font-medium">{m.item}</td>
                                                <td className="px-6 py-4 text-gray-400">{m.quantity}</td>
                                                <td className="px-6 py-4 text-primary-400 font-bold">{m.estimated_cost}</td>
                                            </tr>
                                        )) || (
                                                <tr>
                                                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500 italic">No material breakdown available</td>
                                                </tr>
                                            )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-bold mb-6">Expert AI Recommendations</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {result.estimate?.recommendations?.map((rec, i) => (
                                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-gray-300 leading-relaxed">{rec}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="text-center p-12 glass-card bg-gradient-to-br from-primary-500/10 to-secondary-500/10">
                            <h3 className="text-2xl font-bold mb-4">Ready to build?</h3>
                            <p className="text-gray-400 mb-8">Post this project to our marketplace and get real bids from verified contractors.</p>
                            <button className="btn-primary">Post Project Now</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIEstimation;
