import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contractorsAPI } from '../services/api';
import type { ContractorProfile } from '../types';

const Contractors: React.FC = () => {
  const [contractors, setContractors] = useState<ContractorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    try {
      const data = await contractorsAPI.getAll();
      setContractors(data);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contractors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Verified Contractors
          </h1>
          <p className="text-xl text-gray-600">
            Browse our network of professional contractors
          </p>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by name, business, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-3xl font-bold text-gray-900">{contractors.length}</div>
            <div className="text-gray-600">Total Contractors</div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-3xl font-bold text-gray-900">
              {contractors.filter((c) => c.is_verified).length}
            </div>
            <div className="text-gray-600">Verified</div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-3xl font-bold text-gray-900">
              {contractors.filter((c) => c.is_available).length}
            </div>
            <div className="text-gray-600">Available Now</div>
          </div>
        </div>

        {filteredContractors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600">No contractors found matching your search</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContractors.map((contractor) => (
              <div
                key={contractor.id}
                className="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-900 hover:shadow-lg transition-all"
              >
                {contractor.is_verified && (
                  <div className="mb-4">
                    <span className="inline-flex items-center bg-gray-900 text-white text-xs px-3 py-1 rounded-full font-medium">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {contractor.business_name}
                  </h3>
                  <p className="text-gray-600">{contractor.full_name}</p>
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-4">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {contractor.location}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-50 rounded p-2 text-center border border-gray-200">
                    <div className="text-lg font-bold text-gray-900">{contractor.rating.toFixed(1)}</div>
                    <div className="text-gray-600 text-xs">Rating</div>
                  </div>
                  <div className="bg-gray-50 rounded p-2 text-center border border-gray-200">
                    <div className="text-lg font-bold text-gray-900">{contractor.total_jobs_completed}</div>
                    <div className="text-gray-600 text-xs">Jobs</div>
                  </div>
                  <div className="bg-gray-50 rounded p-2 text-center border border-gray-200">
                    <div className="text-lg font-bold text-gray-900">{contractor.years_of_experience}</div>
                    <div className="text-gray-600 text-xs">Years</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {contractor.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill.id}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>

                <div className="mb-4">
                  {contractor.is_available ? (
                    <span className="text-gray-900 text-sm font-medium">Available Now</span>
                  ) : (
                    <span className="text-gray-500 text-sm">Currently Busy</span>
                  )}
                </div>

                <Link
                  to={`/contractors/${contractor.id}`}
                  className="block w-full text-center bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  View Profile
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