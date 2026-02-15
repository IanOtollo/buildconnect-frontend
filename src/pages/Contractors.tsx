import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contractorsAPI } from '../services/api';
import type { ContractorProfile } from '../types';
import { FiUsers, FiSearch, FiStar, FiShield, FiMapPin, FiChevronRight } from 'react-icons/fi';

const Contractors: React.FC = () => {
  const [contractors, setContractors] = useState<ContractorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    try {
      const response = await contractorsAPI.getAll();
      setContractors(response.data);
    } catch (error) {
      console.error('Error fetching contractors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContractors = contractors.filter(
    (contractor) =>
      contractor.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-[#030712]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#030712]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 mb-4">
              <FiUsers className="text-primary-400 text-xs" />
              <span className="text-primary-400 text-xs font-bold uppercase tracking-widest">Verified Experts</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">BuildConnect Professionals</h1>
            <p className="text-gray-500 font-medium">Browse our elite network of verified contractors.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-3">
            <div className="relative group">
              <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 text-xl group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by name, business, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input w-full h-16 !pl-16 text-lg"
              />
            </div>
          </div>
          <div className="glass-card flex items-center justify-between px-6 h-16">
            <span className="text-gray-500 text-sm font-bold uppercase">Total Pros</span>
            <span className="text-2xl font-black text-white">{contractors.length}</span>
          </div>
        </div>

        {filteredContractors.length === 0 ? (
          <div className="glass-card text-center py-32">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 text-gray-600">
              <FiSearch className="text-4xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No pros found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Try adjusting your search terms or view all categories.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContractors.map((contractor) => (
              <div
                key={contractor.id}
                className="glass-card p-6 hover:bg-white/[0.04] transition-all group border border-white/5 hover:border-primary-500/30"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform">
                    {contractor.business_name.charAt(0)}
                  </div>
                  {contractor.is_verified && (
                    <div className="bg-emerald-500/10 text-emerald-500 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1">
                      <FiShield /> Verified
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
                    {contractor.business_name}
                  </h3>
                  <div className="flex items-center text-gray-500 text-sm gap-2">
                    <FiMapPin className="text-xs" /> {contractor.location}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                    <div className="text-white font-black flex items-center justify-center gap-1">
                      <FiStar className="text-yellow-500 text-xs" /> {contractor.rating?.toFixed(1) || '0.0'}
                    </div>
                    <div className="text-[9px] text-gray-500 font-bold uppercase mt-1">Rating</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                    <div className="text-white font-black">{contractor.total_jobs_completed}</div>
                    <div className="text-[9px] text-gray-500 font-bold uppercase mt-1">Jobs</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                    <div className="text-white font-black">{contractor.years_of_experience}+</div>
                    <div className="text-[9px] text-gray-500 font-bold uppercase mt-1">Years</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8 h-12 overflow-hidden">
                  {contractor.skills?.slice(0, 3).map((skill) => (
                    <span
                      key={skill.id}
                      className="bg-primary-500/10 text-primary-400 text-[10px] px-2 py-1 rounded-lg font-bold border border-primary-500/20"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/contractors/${contractor.id}`}
                  className="btn-secondary w-full group/btn"
                >
                  View Profile
                  <FiChevronRight className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contractors;
