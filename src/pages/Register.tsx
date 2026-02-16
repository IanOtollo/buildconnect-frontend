import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, categoriesAPI } from '../services/api';
import {
  FiUser,
  FiBriefcase,
  FiMail,
  FiLock,
  FiPhone,
  FiUpload,
  FiDollarSign,
  FiArrowRight,
  FiCheckCircle,
  FiAlertCircle,
  FiShield
} from 'react-icons/fi';

type UserType = 'client' | 'contractor';

const Register: React.FC = () => {
  const [userType, setUserType] = useState<UserType>('client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();

  const [clientData, setClientData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    address: '',
    city: '',
  });

  const [contractorData, setContractorData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    business_name: '',
    bio: '',
    years_of_experience: '',
    hourly_rate: '',
    location: '',
    category: '',
  });

  const [documents, setDocuments] = useState({
    id_document: null as File | null,
    kra_pin_document: null as File | null,
    work_permit_document: null as File | null,
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.registerClient(clientData);
      setSuccess('Registration successful! Welcome to BuildConnect.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleContractorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!contractorData.category) {
      setError('Please select a service category');
      return;
    }

    if (!documents.id_document || !documents.kra_pin_document) {
      setError('ID and KRA PIN documents are required for verification');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(contractorData).forEach(([key, value]) => formData.append(key, value));
      if (documents.id_document) formData.append('id_document', documents.id_document);
      if (documents.kra_pin_document) formData.append('kra_pin_document', documents.kra_pin_document);
      if (documents.work_permit_document) formData.append('work_permit_document', documents.work_permit_document);

      await authAPI.registerContractor(formData);

      setSuccess('Application submitted! Our team will review your credentials shortly.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Application failed. Please check your documents.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof documents) => {
    if (e.target.files && e.target.files[0]) {
      setDocuments({ ...documents, [field]: e.target.files[0] });
    }
  };

  return (
    <div className="min-h-screen relative py-20 px-4 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 bg-[#030712]">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-2xl mx-auto relative">
        <div className="glass-card overflow-hidden">
          {/* Header */}
          <div className="p-8 md:p-10 text-center border-b border-white/5">
            <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Create Account</h2>
            <p className="text-gray-400">Join the future of construction management</p>
          </div>

          {/* Type Selector */}
          <div className="flex p-2 bg-white/5 mx-8 md:mx-10 mt-8 rounded-2xl gap-2">
            <button
              onClick={() => setUserType('client')}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-bold transition-all ${userType === 'client'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <FiUser className="text-xl" />
              I'm a Client
            </button>
            <button
              onClick={() => setUserType('contractor')}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-bold transition-all ${userType === 'contractor'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <FiBriefcase className="text-xl" />
              I'm a Contractor
            </button>
          </div>

          <div className="p-8 md:p-10">
            {error && (
              <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <FiAlertCircle className="text-red-400 mt-1" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                <FiCheckCircle className="text-emerald-400 mt-1" />
                <p className="text-emerald-200 text-sm">{success}</p>
              </div>
            )}

            {userType === 'client' ? (
              <form onSubmit={handleClientSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        required
                        value={clientData.full_name}
                        onChange={(e) => setClientData({ ...clientData, full_name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Phone Number</label>
                    <div className="relative">
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="tel"
                        required
                        value={clientData.phone}
                        onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        placeholder="0712 345 678"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      required
                      value={clientData.email}
                      onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="password"
                      required
                      value={clientData.password}
                      onChange={(e) => setClientData({ ...clientData, password: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 py-4 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleContractorSubmit} className="space-y-8">
                {/* Section 1: Basic Info */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">1</span>
                    Basic Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={contractorData.full_name}
                        onChange={(e) => setContractorData({ ...contractorData, full_name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        placeholder="Ian Otollo"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 ml-1">Business Name</label>
                      <input
                        type="text"
                        required
                        value={contractorData.business_name}
                        onChange={(e) => setContractorData({ ...contractorData, business_name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        placeholder="Otollo Solutions"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={contractorData.email}
                        onChange={(e) => setContractorData({ ...contractorData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        placeholder="ian@otollo.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 ml-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={contractorData.phone}
                        onChange={(e) => setContractorData({ ...contractorData, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        placeholder="0700 000 000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                    <input
                      type="password"
                      required
                      value={contractorData.password}
                      onChange={(e) => setContractorData({ ...contractorData, password: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Section 2: Expertise */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">2</span>
                    Professional Expertise
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 ml-1">Category</label>
                      <select
                        required
                        value={contractorData.category}
                        onChange={(e) => setContractorData({ ...contractorData, category: e.target.value })}
                        className="w-full bg-[#0d121f] border border-white/10 rounded-xl px-6 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 appearance-none cursor-pointer"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 ml-1">Hourly Rate (KES)</label>
                      <div className="relative">
                        <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type="number"
                          required
                          value={contractorData.hourly_rate}
                          onChange={(e) => setContractorData({ ...contractorData, hourly_rate: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 ml-1">Location / Service Area</label>
                      <input
                        type="text"
                        required
                        value={contractorData.location}
                        onChange={(e) => setContractorData({ ...contractorData, location: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        placeholder="Nairobi, Kenya"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 ml-1">Years of Experience</label>
                      <input
                        type="number"
                        required
                        value={contractorData.years_of_experience}
                        onChange={(e) => setContractorData({ ...contractorData, years_of_experience: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        placeholder="5"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Bio / About your services</label>
                    <textarea
                      rows={4}
                      required
                      value={contractorData.bio}
                      onChange={(e) => setContractorData({ ...contractorData, bio: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      placeholder="Describe your skills and experience..."
                    />
                  </div>
                </div>

                {/* Section 3: Verification */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">3</span>
                    Verification & Documents
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 ml-1">ID Document (Front/Back)</label>
                      <div className="relative group cursor-pointer">
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, 'id_document')}
                          className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                        />
                        <div className="w-full bg-white/5 border border-dashed border-white/20 rounded-xl px-6 py-8 text-center group-hover:bg-white/10 transition-all">
                          {React.createElement(FiUpload as any, { className: "mx-auto mb-2 text-blue-400 text-2xl" })}
                          <p className="text-xs text-gray-400">
                            {documents.id_document ? documents.id_document.name : 'Upload National ID'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 ml-1">KRA PIN Certificate</label>
                      <div className="relative group cursor-pointer">
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, 'kra_pin_document')}
                          className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                        />
                        <div className="w-full bg-white/5 border border-dashed border-white/20 rounded-xl px-6 py-8 text-center group-hover:bg-white/10 transition-all">
                          {React.createElement(FiShield as any, { className: "mx-auto mb-2 text-purple-400 text-2xl" })}
                          <p className="text-xs text-gray-400">
                            {documents.kra_pin_document ? documents.kra_pin_document.name : 'Upload KRA PIN'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-8">
                  <div className="flex items-center gap-4 mb-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    {React.createElement(FiShield as any, { className: "text-blue-400 text-xl flex-shrink-0" })}
                    <p className="text-xs text-blue-200">
                      By submitting this application, you agree to our professional code of conduct and verification process.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 py-4 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Submit for Verification</span>
                        {React.createElement(FiArrowRight as any, { className: "group-hover:translate-x-1 transition-transform" })}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-bold hover:text-blue-400 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
