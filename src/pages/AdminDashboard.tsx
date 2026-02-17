import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    FiUsers, FiBriefcase, FiActivity, FiShield, FiCheckCircle,
    FiXCircle, FiSearch, FiDollarSign, FiClock, FiGrid,
    FiUser, FiSettings, FiPlus, FiMoreVertical,
    FiEdit2, FiTrash2, FiAlertCircle
} from 'react-icons/fi';
import { adminAPI, getErrorMessage } from '../services/api';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState<any>({});
    const [pendingContractors, setPendingContractors] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [activity, setActivity] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    // Add Manual User Modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        full_name: '',
        phone: '',
        role: 'client'
    });
    const [submitting, setSubmitting] = useState(false);

    // Edit User Modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [editUser, setEditUser] = useState<any>(null);

    // Delete Confirmation
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any>(null);

    // Operations dropdown
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await adminAPI.createUser(newUser);
            setShowAddModal(false);
            setNewUser({ email: '', password: '', full_name: '', phone: '', role: 'client' });
            fetchAdminData();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to create user');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await adminAPI.updateUser(editUser.id, {
                email: editUser.email,
                full_name: editUser.full_name,
                phone: editUser.phone,
                role: editUser.role
            });
            setShowEditModal(false);
            setEditUser(null);
            fetchAdminData();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to update user');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        setSubmitting(true);
        try {
            await adminAPI.deleteUser(userToDelete.id);
            setShowDeleteModal(false);
            setUserToDelete(null);
            fetchAdminData();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to delete user');
        } finally {
            setSubmitting(false);
        }
    };

    const fetchAdminData = async () => {
        try {
            const response = await adminAPI.getDashboard();
            const data = response.data;

            setStats(data.stats || {});
            setPendingContractors(data.pending_contractors || []);
            setActivity(data.activity || []);
            setUsers(data.users || []);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const handleApprove = async (id: number) => {
        try {
            await adminAPI.verifyContractor({ contractor_id: id, action: 'approve' });
            setPendingContractors(prev => prev.filter(c => c.id !== id));
            fetchAdminData(); // Refresh all stats
        } catch (error) {
            alert(getErrorMessage(error));
        }
    };

    const handleReject = async (id: number) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const reason = prompt("Reason:") || "Rejected";
            await adminAPI.verifyContractor({ contractor_id: id, action: 'reject', reason });
            setPendingContractors(prev => prev.filter(c => c.id !== id));
            fetchAdminData();
        } catch (error) {
            alert(getErrorMessage(error));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030712] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: FiActivity },
        { id: 'approvals', label: 'Partners', icon: FiShield, badge: pendingContractors.length },
        { id: 'users', label: 'User Hub', icon: FiUsers },
        { id: 'categories', label: 'System', icon: FiGrid },
    ];

    return (
        <div className="min-h-screen pt-20 bg-[#030712] flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-gray-900/40 border-r border-white/5 p-6 space-y-8">
                <div>
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                        <FiShield className="text-purple-400 text-[10px]" />
                        <span className="text-purple-400 text-[10px] font-bold uppercase tracking-widest">Admin Control</span>
                    </div>
                    <div className="space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w - full flex items - center justify - between px - 4 py - 3 rounded - xl text - sm font - semibold transition - all ${activeTab === tab.id
                                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    } `}
                            >
                                <div className="flex items-center gap-3">
                                    <tab.icon size={18} />
                                    {tab.label}
                                </div>
                                {tab.badge ? (
                                    <span className={`px - 2 py - 0.5 rounded - md text - [10px] ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-purple-500/20 text-purple-400'
                                        } `}>
                                        {tab.badge}
                                    </span>
                                ) : null}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-4">
                    <div className="flex items-center gap-3 px-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-white font-bold">
                            {user?.full_name?.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{user?.full_name}</p>
                            <p className="text-[10px] text-gray-500 font-medium">System Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-400/5 transition-colors"
                    >
                        <FiXCircle size={18} />
                        Terminate Session
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen pb-20">
                {activeTab === 'overview' && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Summary Header */}
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tight mb-2">Performance Center</h2>
                            <p className="text-gray-400">Real-time telemetry and system health overview.</p>
                        </div>

                        {/* Bento Grid Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="glass-card p-6 bg-gradient-to-br from-blue-600/10 to-transparent">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                                        <FiUsers size={24} />
                                    </div>
                                    <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded-lg">+12% growth</span>
                                </div>
                                <h3 className="text-4xl font-black text-white mb-1">{stats.total_clients || 0}</h3>
                                <p className="text-sm text-gray-500 font-medium">Verified Clients</p>
                            </div>

                            <div className="glass-card p-6 bg-gradient-to-br from-emerald-600/10 to-transparent">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                                        <FiBriefcase size={24} />
                                    </div>
                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">High quality</span>
                                </div>
                                <h3 className="text-4xl font-black text-white mb-1">{stats.approved_contractors || 0}</h3>
                                <p className="text-sm text-gray-500 font-medium">Active Partners</p>
                            </div>

                            <div className="glass-card p-6 bg-gradient-to-br from-amber-600/10 to-transparent">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
                                        <FiActivity size={24} />
                                    </div>
                                    <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-lg">Ops load</span>
                                </div>
                                <h3 className="text-4xl font-black text-white mb-1">{stats.total_requests || 0}</h3>
                                <p className="text-sm text-gray-500 font-medium">Total Projects</p>
                            </div>

                            <div className="glass-card p-6 bg-gradient-to-br from-purple-600/10 to-transparent">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                                        <FiDollarSign size={24} />
                                    </div>
                                    <span className="text-[10px] font-bold text-purple-400 bg-purple-400/10 px-2 py-1 rounded-lg">M-Pesa Flow</span>
                                </div>
                                <h3 className="text-4xl font-black text-white mb-1">KES {stats.total_revenue?.toLocaleString()}</h3>
                                <p className="text-sm text-gray-500 font-medium">Platform Volume</p>
                            </div>
                        </div>

                        {/* Activity and Status distribution */}
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 glass-card">
                                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-white">Global Activity</h3>
                                    <button className="text-xs text-purple-400 font-bold hover:underline">Full Log</button>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-8">
                                        {activity.map((item, idx) => (
                                            <div key={idx} className="flex gap-4 group">
                                                <div className="relative">
                                                    <div className={`w - 10 h - 10 rounded - xl flex items - center justify - center ${item.type === 'user' ? 'bg-blue-500/10 text-blue-400' :
                                                        item.type === 'request' ? 'bg-purple-500/10 text-purple-400' :
                                                            'bg-amber-500/10 text-amber-400'
                                                        } `}>
                                                        {item.type === 'user' ? <FiUser /> : item.type === 'request' ? <FiGrid /> : <FiShield />}
                                                    </div>
                                                    {idx !== activity.length - 1 && (
                                                        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-px h-10 bg-white/5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="text-sm font-bold text-white">{item.title}</p>
                                                        <span className="text-[10px] text-gray-500">{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500">{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="glass-card p-6">
                                    <h3 className="text-lg font-bold text-white mb-6">Service Health</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between text-xs mb-2">
                                                <span className="text-gray-400 font-medium">Database Latency</span>
                                                <span className="text-emerald-400 font-bold">12ms</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full w-[12%] bg-emerald-500" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs mb-2">
                                                <span className="text-gray-400 font-medium">Memory Usage</span>
                                                <span className="text-blue-400 font-bold">42%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full w-[42%] bg-blue-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass-card p-6 bg-purple-600/5 border-purple-500/20">
                                    <FiSettings className="text-purple-400 mb-4 animate-[spin_5s_linear_infinite]" size={24} />
                                    <h3 className="text-lg font-bold text-white mb-2">Automated Tasks</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed mb-4">AI model for project estimation is currently running scheduled re-training.</p>
                                    <div className="flex items-center gap-2 text-[10px] text-purple-400 font-black uppercase tracking-widest">
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                                        In Progress
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'approvals' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-black text-white">Partner Applications</h2>
                                <p className="text-sm text-gray-400">Validate and onboard professionals into the system.</p>
                            </div>
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input type="text" placeholder="Filter by name or specialty..." className="glass-input pl-10 w-full md:w-80" />
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {pendingContractors.length > 0 ? (
                                pendingContractors.map(c => (
                                    <div key={c.id} className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-purple-500/30 transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5 flex items-center justify-center text-white text-xl font-black shadow-xl group-hover:scale-110 transition-transform">
                                                {c.business_name.substring(0, 1).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-xl font-bold text-white">{c.business_name}</h3>
                                                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase">{c.category}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1.5"><FiUser size={14} /> {c.user?.full_name}</span>
                                                    <span className="flex items-center gap-1.5"><FiClock size={14} /> {new Date(c.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleReject(c.id)}
                                                className="p-3 rounded-xl bg-red-400/5 text-red-400 border border-red-400/10 hover:bg-red-400 hover:text-white transition-all shadow-lg"
                                            >
                                                <FiXCircle size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleApprove(c.id)}
                                                className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                                            >
                                                <FiCheckCircle size={20} />
                                                Approve
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-20 text-center glass-card border-dashed border-white/5 opacity-50">
                                    <FiCheckCircle className="mx-auto mb-4 text-4xl" />
                                    <p className="font-bold text-white">Inbox Zero</p>
                                    <p className="text-sm text-gray-500">All applications have been processed.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-white">User Infrastructure</h2>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500 text-white text-sm font-bold border border-purple-500/20 hover:bg-purple-400 transition-all shadow-lg shadow-purple-500/20"
                            >
                                <FiPlus /> Add Manual User
                            </button>
                        </div>
                        <div className="glass-card overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-wider">Identity</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-wider">System Role</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-wider">Date Joined</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-wider text-right">Operations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users.map(u => (
                                        <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black text-white group-hover:bg-purple-500 transition-colors">
                                                        {u.full_name?.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white leading-none mb-1">{u.full_name}</p>
                                                        <p className="text-xs text-gray-500">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px - 2 py - 1 rounded - md text - [10px] font - black uppercase tracking - tighter ${u.role === 'admin' ? 'bg-amber-400/10 text-amber-400' :
                                                    u.role === 'contractor' ? 'bg-purple-400/10 text-purple-400' :
                                                        'bg-blue-400/10 text-blue-400'
                                                    } `}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setOpenDropdown(openDropdown === u.id ? null : u.id)}
                                                        className="text-gray-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
                                                    >
                                                        <FiMoreVertical />
                                                    </button>
                                                    {openDropdown === u.id && (
                                                        <div className="absolute right-0 top-full mt-2 w-48 glass-card border border-white/10 shadow-xl z-10">
                                                            <button
                                                                onClick={() => {
                                                                    setEditUser(u);
                                                                    setShowEditModal(true);
                                                                    setOpenDropdown(null);
                                                                }}
                                                                className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                                            >
                                                                <FiEdit2 className="text-blue-400" /> Edit User
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setUserToDelete(u);
                                                                    setShowDeleteModal(true);
                                                                    setOpenDropdown(null);
                                                                }}
                                                                className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-400/10 transition-colors flex items-center gap-2"
                                                            >
                                                                <FiTrash2 /> Delete User
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Modal */}
                        {showAddModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                                <div className="glass-card w-full max-w-lg p-8 animate-in zoom-in duration-300">
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="text-2xl font-bold text-white">Manual Enrollment</h3>
                                        <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-white"><FiXCircle size={24} /></button>
                                    </div>
                                    <form onSubmit={handleCreateUser} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-2">Full Name</label>
                                                <input required value={newUser.full_name} onChange={e => setNewUser({ ...newUser, full_name: e.target.value })} className="glass-input w-full h-12" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-2">Phone</label>
                                                <input required value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value })} className="glass-input w-full h-12" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-2">Email Address</label>
                                            <input required type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="glass-input w-full h-12" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-2">Password</label>
                                                <input required type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} className="glass-input w-full h-12" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-2">System Role</label>
                                                <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className="glass-input w-full h-12">
                                                    <option value="client">Client</option>
                                                    <option value="contractor">Contractor</option>
                                                    <option value="admin">Administrator</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button disabled={submitting} type="submit" className="w-full h-14 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-400 transition-all flex items-center justify-center gap-2">
                                            {submitting ? "Processing..." : <><FiCheckCircle /> Create Identity</>}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Edit User Modal */}
                        {showEditModal && editUser && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                                <div className="glass-card w-full max-w-lg p-8 animate-in zoom-in duration-300">
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="text-2xl font-bold text-white">Edit User</h3>
                                        <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-white"><FiXCircle size={24} /></button>
                                    </div>
                                    <form onSubmit={handleEditUser} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-2">Full Name</label>
                                                <input required value={editUser.full_name} onChange={e => setEditUser({ ...editUser, full_name: e.target.value })} className="glass-input w-full h-12" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-2">Phone</label>
                                                <input required value={editUser.phone} onChange={e => setEditUser({ ...editUser, phone: e.target.value })} className="glass-input w-full h-12" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-2">Email Address</label>
                                            <input required type="email" value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} className="glass-input w-full h-12" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-2">System Role</label>
                                            <select value={editUser.role} onChange={e => setEditUser({ ...editUser, role: e.target.value })} className="glass-input w-full h-12">
                                                <option value="client">Client</option>
                                                <option value="contractor">Contractor</option>
                                                <option value="admin">Administrator</option>
                                            </select>
                                        </div>
                                        <button disabled={submitting} type="submit" className="w-full h-14 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400 transition-all flex items-center justify-center gap-2">
                                            {submitting ? "Updating..." : <><FiCheckCircle /> Update User</>}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Delete Confirmation Modal */}
                        {showDeleteModal && userToDelete && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                                <div className="glass-card w-full max-w-md p-8 animate-in zoom-in duration-300">
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                                            <FiAlertCircle className="text-red-500" size={32} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Delete User?</h3>
                                        <p className="text-gray-400 mb-6">Are you sure you want to delete <span className="text-white font-bold">{userToDelete.full_name}</span>? This action cannot be undone.</p>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setShowDeleteModal(false)}
                                                className="flex-1 h-12 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleDeleteUser}
                                                disabled={submitting}
                                                className="flex-1 h-12 bg-red-500 text-white font-bold rounded-xl hover:bg-red-400 transition-all"
                                            >
                                                {submitting ? "Deleting..." : "Delete"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'categories' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-white">System Taxonomy</h2>
                            <p className="text-sm text-gray-500">Standardized professional niches.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { name: 'Plumbing', count: stats.approved_contractors || 0, icon: 'FiDroplet' },
                                { name: 'Electrical', count: 0, icon: 'FiZap' },
                                { name: 'Carpentry', count: 0, icon: 'FiHome' },
                                { name: 'Masonry', count: 0, icon: 'FiLayers' },
                                { name: 'Painting', count: 0, icon: 'FiEdit3' },
                                { name: 'HVAC', count: 0, icon: 'FiWind' },
                            ].map((cat, i) => (
                                <div key={i} className="glass-card p-6 border-l-2 border-l-purple-500 hover:-translate-y-1 transition-all duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-white">{cat.name}</h3>
                                        <span className="text-[10px] font-black text-purple-400 bg-purple-400/10 px-2 py-1 rounded-md">{cat.count} PROS</span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed">Standard maintenance and installation services for {cat.name.toLowerCase()} infrastructure.</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
