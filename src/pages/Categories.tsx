import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriesAPI } from '../services/api';
import type { ServiceCategory } from '../types';
import { FiLayout, FiChevronRight, FiMap, FiLayers } from 'react-icons/fi';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

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
              <FiLayout className="text-primary-400 text-xs" />
              <span className="text-primary-400 text-xs font-bold uppercase tracking-widest">Marketplace Directory</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Service Categories</h1>
            <p className="text-gray-500 font-medium">Browse specialized construction services by industry sector.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              className="group glass-card p-6 hover:bg-white/[0.04] transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <FiLayers className="text-6xl text-primary-500" />
              </div>

              <div className="mb-6">
                <div className="w-14 h-14 bg-primary-500/10 rounded-2xl flex items-center justify-center border border-primary-500/20 group-hover:scale-110 transition-transform">
                  <FiMap className="text-2xl text-primary-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                {category.name}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {category.description}
              </p>
              <div className="flex items-center text-primary-500 text-sm font-black uppercase tracking-widest">
                <span>View Pros</span>
                <FiChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
