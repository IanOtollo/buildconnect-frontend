import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { categoriesAPI, serviceRequestsAPI, getErrorMessage, api } from '../services/api';
import type { ServiceCategory } from '../types';
import { FiPlus, FiMapPin, FiClock, FiDollarSign, FiInfo, FiChevronRight, FiGrid, FiEdit3, FiZap, FiShield } from 'react-icons/fi';

const NewServiceRequest: React.FC = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedContractor = searchParams.get('contractor_id');
  const [aiEstimate, setAiEstimate] = useState<any>(null);
  const [estimating, setEstimating] = useState(false);

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    location: '',
    budget: '',
    estimated_duration: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await serviceRequestsAPI.create({
        category: parseInt(formData.category),
        title: formData.title,
        description: formData.description,
        location: formData.location,
        budget: parseFloat(formData.budget),
        estimated_duration: formData.estimated_duration,
        urgency: formData.urgency,
        contractor_id: preSelectedContractor ? parseInt(preSelectedContractor) : undefined,
      } as any);

      navigate('/client/dashboard');
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEstimate = async () => {
    if (!formData.description || !formData.location) {
      setError('Please provide description and location to get an AI estimate.');
      return;
    }
    setError('');
    setEstimating(true);
    try {
      const response = await api.post('/ai/estimate', {
        description: formData.description,
        location: formData.location
      });
      setAiEstimate(response.data.estimate);
    } catch (err: any) {
      setError(getErrorMessage(err) || 'Failed to get AI estimate.');
    } finally {
      setEstimating(false);
    }
  };

  const urgencyLevels = [
    { value: 'low', label: 'Standard', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    { value: 'medium', label: 'Urgent', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
    { value: 'high', label: 'Emergency', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#030712]">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 mb-4">
              <FiPlus className="text-primary-400 text-xs" />
              <span className="text-primary-400 text-xs font-bold uppercase tracking-widest">New Project Listing</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Request a Service</h1>
            <p className="text-gray-500 font-medium">Define your project details and find the perfect expert.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-8">
              {error && (
                <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <FiGrid className="text-primary-500" /> Service Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className="glass-input w-full h-14 appearance-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <FiEdit3 className="text-primary-500" /> Project Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="e.g. Modern Kitchen Design"
                      className="glass-input w-full h-14"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FiInfo className="text-primary-500" /> Project Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={5}
                    placeholder="Provide a detailed description of the work required..."
                    className="glass-input w-full py-4 resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <FiMapPin className="text-primary-500" /> Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                      placeholder="e.g. Westlands, Nairobi"
                      className="glass-input w-full h-14"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <FiDollarSign className="text-primary-500" /> Estimated Budget (KES)
                    </label>
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      required
                      placeholder="e.g. 150000"
                      className="glass-input w-full h-14"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <FiClock className="text-primary-500" /> Estimated Duration
                    </label>
                    <input
                      type="text"
                      value={formData.estimated_duration}
                      onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
                      required
                      placeholder="e.g. 2 Weeks"
                      className="glass-input w-full h-14"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                      Priority Level
                    </label>
                    <div className="flex gap-2">
                      {urgencyLevels.map((lvl) => (
                        <button
                          key={lvl.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, urgency: lvl.value as any })}
                          className={`flex-1 h-14 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${formData.urgency === lvl.value
                            ? `${lvl.color} shadow-lg`
                            : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'
                            }`}
                        >
                          {lvl.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {!aiEstimate ? (
                  <button
                    type="button"
                    onClick={handleEstimate}
                    disabled={estimating}
                    className="btn-primary w-full h-16 text-lg bg-gradient-to-r from-purple-500 to-indigo-500 border-none hover:shadow-purple-500/50"
                  >
                    {estimating ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Calculating Estimate...</span>
                      </div>
                    ) : (
                      <>
                        <FiZap className="text-xl mr-2" />
                        <span>Get AI Cost Estimate</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-6">
                    <div className="p-6 bg-white/5 border border-primary-500/30 rounded-2xl">
                      <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                        <FiInfo className="text-primary-500" /> AI Estimate Results
                      </h4>
                      <p className="text-sm text-gray-300 mb-2"><strong>Total Cost:</strong> {aiEstimate.total_cost}</p>
                      <p className="text-sm text-gray-300 mb-4"><strong>Timeline:</strong> {aiEstimate.timeline}</p>
                      <div className="mb-4">
                        <strong className="text-sm text-gray-300">Materials:</strong>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          {aiEstimate.materials?.map((m: any, i: number) => (
                            <li key={i} className="text-xs text-gray-400">{m.item} ({m.quantity}) - {m.estimated_cost}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full h-16 text-lg"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Publishing Request...</span>
                        </div>
                      ) : (
                        <>
                          <span>Submit Project Request</span>
                          <FiChevronRight className="text-xl ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6 bg-gradient-to-br from-primary-500/5 to-transparent">
              <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                <FiZap className="text-primary-500" />
                BuildConnect Steps
              </h3>
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Smart Matching', desc: 'Our AI analyzes your request and notifies top-rated experts.' },
                  { step: '02', title: 'Compare Bids', desc: 'Receive competitive proposals and examine contractor profiles.' },
                  { step: '03', title: 'Secure Escrow', desc: 'Pay the deposit via M-Pesa. Funds stay safe in escrow.' },
                  { step: '04', title: 'Release Funds', desc: 'Release payments as milestones are verified and completed.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <span className="text-xs font-black text-primary-500/40 group-hover:text-primary-500 transition-colors">{item.step}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 border-dashed border-white/10 text-center py-10">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <FiShield className="text-2xl text-emerald-400" />
              </div>
              <h4 className="font-bold text-white mb-2">Verified Professional Only</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Your project will only be visible to contractors who have passed our rigorous verification process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewServiceRequest;