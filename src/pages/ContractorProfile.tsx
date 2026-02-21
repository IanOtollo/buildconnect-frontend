import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { contractorsAPI, getErrorMessage } from '../services/api';
import type { ContractorProfile } from '../types';
import {
    FiStar,
    FiMapPin,
    FiBriefcase,
    FiShield,
    FiZap,
    FiClock,
    FiCheckCircle,
    FiInfo,
    FiArrowLeft
} from 'react-icons/fi';

const ContractorProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [contractor, setContractor] = useState<ContractorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchContractor = async () => {
            try {
                const response = await contractorsAPI.getById(id!);
                setContractor(response.data);
            } catch (err: any) {
                setError(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchContractor();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center bg-[#030712]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (error || !contractor) {
        return (
            <div className="min-h-screen pt-32 bg-[#030712] px-4">
                <div className="max-w-xl mx-auto glass-card p-12 text-center">
                    <FiInfo className="text-4xl text-red-400 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
                    <p className="text-gray-500 mb-8">{error || "Could not find the requested professional profile."}</p>
                    <Link to="/contractors" className="btn-primary inline-flex items-center gap-2">
                        <FiArrowLeft /> Back to Directory
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-[#030712]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    to="/contractors"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors font-medium"
                >
                    <FiArrowLeft /> Back to Directory
                </Link>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Info Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-card p-8">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-32 h-32 rounded-3xl bg-white/5 flex items-center justify-center border border-white/5 text-4xl font-black text-primary-400 shadow-xl">
                                    {contractor.business_name?.charAt(0) || contractor.full_name?.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                        <h1 className="text-4xl font-bold text-white tracking-tight">
                                            {contractor.business_name || contractor.full_name}
                                        </h1>
                                        {contractor.is_verified && (
                                            <div className="bg-emerald-500/10 text-emerald-500 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1.5 h-6">
                                                <FiShield /> Verified Pro
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center text-gray-400 gap-4 mb-6">
                                        <div className="flex items-center gap-1.5">
                                            <FiMapPin className="text-primary-500" /> {contractor.location}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <FiBriefcase className="text-primary-500" /> {contractor.category}
                                        </div>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed text-lg">
                                        {contractor.bio || `${contractor.business_name || contractor.full_name} is a dedicated professional providing elite ${contractor.category} services across ${contractor.location}.`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="glass-card p-6 text-center">
                                <FiStar className="text-3xl text-yellow-500 mx-auto mb-3" />
                                <p className="text-2xl font-black text-white">{contractor.rating?.toFixed(1) || '0.0'}</p>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Avg Rating</p>
                            </div>
                            <div className="glass-card p-6 text-center">
                                <FiCheckCircle className="text-3xl text-emerald-500 mx-auto mb-3" />
                                <p className="text-2xl font-black text-white">{contractor.total_jobs_completed || 0}</p>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Jobs Completed</p>
                            </div>
                            <div className="glass-card p-6 text-center">
                                <FiClock className="text-3xl text-blue-500 mx-auto mb-3" />
                                <p className="text-2xl font-black text-white">{contractor.years_of_experience}+</p>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Years Exp</p>
                            </div>
                        </div>

                        <div className="glass-card p-8">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <FiZap className="text-primary-500" /> Professional Skills
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {contractor.skills && contractor.skills.length > 0 ? (
                                    contractor.skills.map((skill) => (
                                        <span
                                            key={skill.id}
                                            className="bg-primary-500/10 text-primary-400 px-4 py-2 rounded-xl font-bold border border-primary-500/20 text-sm"
                                        >
                                            {skill.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 italic">No specific skills listed yet.</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Column */}
                    <div className="space-y-8">
                        <div className="glass-card p-8 bg-gradient-to-br from-primary-500/5 to-transparent border-primary-500/20">
                            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Need this Service?</h3>
                            <p className="text-gray-500 mb-8 text-sm">Get an instant quote and book {contractor.business_name || contractor.full_name} for your next project.</p>

                            <Link
                                to={`/service-requests/new?contractor_id=${contractor.id}`}
                                className="btn-primary w-full py-4 text-center text-lg font-black tracking-wide flex items-center justify-center gap-2"
                            >
                                Hire Professional <FiZap />
                            </Link>

                            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <FiShield className="text-emerald-500" /> Secured by Escrow
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <FiCheckCircle className="text-emerald-500" /> AI Verified Pro
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <FiClock className="text-emerald-500" /> Quick Response Time
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-8">
                            <h3 className="text-lg font-bold text-white mb-4">Availability</h3>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest ${contractor.is_available
                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                                }`}>
                                <div className={`w-2 h-2 rounded-full ${contractor.is_available ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                                {contractor.is_available ? 'Accepting Projects' : 'Currently Busy'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractorProfilePage;
