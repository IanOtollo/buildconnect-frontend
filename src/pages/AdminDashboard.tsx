import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiBriefcase, FiActivity, FiShield, FiCheckCircle, FiXCircle, FiSearch } from 'react-icons/fi';
import { contractorsAPI } from '../services/api';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeContractors: 0,
        pendingApprovals: 0,
        totalProjects: 0
    });
    const [pendingContractors, setPendingContractors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock data fetching for now, or real if API exists
    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                // In a real app, we'd have specific admin endpoints
                // For now, we'll try to fetch pending contractors using the existing list endpoint if it supports it
                // or just mock it for the UI demonstration since we only realized admin user exists

                // Simulating data fetch
                setTimeout(() => {
                    setStats({
                        totalUsers: 154,
                        activeContractors: 42,
                        pendingApprovals: 5,
                        totalProjects: 89
                    });

                    setPendingContractors([
                        { id: 1, business_name: 'BuildRight Construction', user: { full_name: 'John Doe', email: 'john@example.com' }, category: 'General', created_at: '2024-03-10' },
                        { id: 2, business_name: 'Spark Electric', user: { full_name: 'Mike Smith', email: 'mike@example.com' }, category: 'Electrical', created_at: '2024-03-11' }
                    ]);
                    setLoading(false);
                }, 1000);

            } catch (error) {
                console.error("Failed to fetch admin data", error);
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    const handleApprove = (id: number) => {
        // API call would go here
        setPendingContractors(prev => prev.filter(c => c.id !== id));
        // toast success
    };

    const handleReject = (id: number) => {
        // API call would go here
        setPendingContractors(prev => prev.filter(c => c.id !== id));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030712] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 bg-[#030712]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                            <FiShield className="text-purple-400 text-xs" />
                            <span className="text-purple-400 text-xs font-bold uppercase tracking-widest">Admin Control</span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight mb-2">System Overview</h1>
                        <p className="text-gray-400">Welcome back, {user?.full_name}. Here's what's happening today.</p>
                    </div>
                    <button
                        onClick={() => logout()}
                        className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 font-medium transition-colors"
                    >
                        Sign Out
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-4 gap-6 mb-10">
                    <div className="glass-card p-6 border-l-4 border-l-blue-500">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">Total Users</p>
                                <h3 className="text-3xl font-black text-white">{stats.totalUsers}</h3>
                            </div>
                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                                <FiUsers className="text-xl" />
                            </div>
                        </div>
                        <div className="text-xs text-green-400 flex items-center gap-1">
                            <FiActivity /> +12% from last month
                        </div>
                    </div>

                    <div className="glass-card p-6 border-l-4 border-l-emerald-500">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">Active Contractors</p>
                                <h3 className="text-3xl font-black text-white">{stats.activeContractors}</h3>
                            </div>
                            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                                <FiBriefcase className="text-xl" />
                            </div>
                        </div>
                        <div className="text-xs text-emerald-400 flex items-center gap-1">
                            <FiCheckCircle /> 98% verified
                        </div>
                    </div>

                    <div className="glass-card p-6 border-l-4 border-l-amber-500">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">Pending Approvals</p>
                                <h3 className="text-3xl font-black text-white">{stats.pendingApprovals}</h3>
                            </div>
                            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                                <FiShield className="text-xl" />
                            </div>
                        </div>
                        <div className="text-xs text-amber-400 flex items-center gap-1">
                            Action required
                        </div>
                    </div>

                    <div className="glass-card p-6 border-l-4 border-l-purple-500">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">Total Projects</p>
                                <h3 className="text-3xl font-black text-white">{stats.totalProjects}</h3>
                            </div>
                            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                                <FiActivity className="text-xl" />
                            </div>
                        </div>
                        <div className="text-xs text-purple-400 flex items-center gap-1">
                            24 active now
                        </div>
                    </div>
                </div>

                {/* Pending Approvals Section */}
                <div className="glass-card overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Contractor Applications</h3>
                            <p className="text-sm text-gray-400">Review and approve new contractor join requests</p>
                        </div>
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search requests..."
                                className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors w-full md:w-64"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Business / Applicant</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date Applied</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {pendingContractors.length > 0 ? (
                                    pendingContractors.map((contractor) => (
                                        <tr key={contractor.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                                                        {contractor.business_name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-white">{contractor.business_name}</div>
                                                        <div className="text-sm text-gray-400">{contractor.user.full_name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    {contractor.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                {contractor.created_at}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="flex items-center text-amber-400 text-sm">
                                                    <span className="w-2 h-2 rounded-full bg-amber-400 mr-2 animate-pulse"></span>
                                                    Pending Review
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleApprove(contractor.id)}
                                                        className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 transition-all hover:scale-105"
                                                        title="Approve"
                                                    >
                                                        <FiCheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(contractor.id)}
                                                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all hover:scale-105"
                                                        title="Reject"
                                                    >
                                                        <FiXCircle size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            <FiCheckCircle className="mx-auto text-4xl mb-3 text-white/10" />
                                            No pending applications at the moment
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
