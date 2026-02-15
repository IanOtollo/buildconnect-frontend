import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#030712] overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span className="text-primary-400 text-xs font-bold uppercase tracking-widest">Next-Gen Construction Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-none tracking-tight">
            Build the Future with <br />
            <span className="text-gradient">AI-Powered</span> Precision
          </h1>

          <p className="text-xl md:text-2xl mb-12 text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing Kenya's construction landscape. Connect with verified experts,
            get instant AI project estimates, and secure your payments with M-Pesa.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto">
              <button className="btn-primary w-full sm:w-auto h-14 px-10 text-lg">
                Start Your Project
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </Link>
            <Link to="/contractors" className="w-full sm:w-auto">
              <button className="btn-secondary w-full sm:w-auto h-14 px-10 text-lg">
                View Experts
              </button>
            </Link>
          </div>

          {/* Stats/Trust Bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-white/5">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Verified Experts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">1.2K+</div>
              <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">AI 2.0</div>
              <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Smart Estimation</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">99.9%</div>
              <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Secure Payments</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <div className="inline-block px-3 py-1 rounded-lg bg-secondary-500/10 border border-secondary-500/20 mb-4">
                <span className="text-secondary-400 text-xs font-bold uppercase tracking-widest">Powered by Gemini AI</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Smart Project <br />
                <span className="text-gradient">Intelligence</span>
              </h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                No more guesswork. Our advanced AI analyzes your project requirements in seconds
                to provide highly accurate cost estimates, material lists, and timelines based
                on real-time Kenyan market data.
              </p>

              <ul className="space-y-4">
                {[
                  'Instant Cost Estimations',
                  'Smart Material Sourcing',
                  'Predictive Timelines',
                  'Location-Specific Insights'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white font-medium">
                    <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 relative">
              <div className="glass-card p-8 relative z-10">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold">AI Estimation Tool</div>
                      <div className="text-[10px] text-gray-500 uppercase">Interactive Demo</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-500 font-bold uppercase block mb-2">Project Type</label>
                    <div className="glass-input !py-2">Three-Bedroom Home</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-bold uppercase block mb-2">Location</label>
                    <div className="glass-input !py-2">Syokimau, Nairobi</div>
                  </div>
                  <button className="btn-primary w-full !text-sm">Generate AI Estimate</button>
                </div>
              </div>
              {/* Decorative Blur */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary-500/10 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Security/M-Pesa Section */}
      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Enterprise-Grade Security</h2>
            <p className="text-gray-400">Integrated with Safaricom M-Pesa for total payment peace of mind.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 hover:bg-white/5 transition-colors group">
              <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 border border-green-500/20 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 20c4.083 0 7.723-2.43 9.356-6m-9.356-8a9.963 9.963 0 00-8.534 4.735m8.718-3.12a2.635 2.635 0 013.44 2.04" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Verified Escrow</h3>
              <p className="text-gray-400 leading-relaxed">
                Funds are held in a secure escrow account and only released when you authorize
                project completion milestones.
              </p>
            </div>

            <div className="glass-card p-8 hover:bg-white/5 transition-colors group">
              <div className="w-14 h-14 bg-primary-500/10 rounded-2xl flex items-center justify-center mb-6 border border-primary-500/20 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">M-Pesa Express</h3>
              <p className="text-gray-400 leading-relaxed">
                Direct STK-Push integration makes deposits and payments seamless, fast, and
                directly from your mobile device.
              </p>
            </div>

            <div className="glass-card p-8 hover:bg-white/5 transition-colors group">
              <div className="w-14 h-14 bg-secondary-500/10 rounded-2xl flex items-center justify-center mb-6 border border-secondary-500/20 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Vetted Experts</h3>
              <p className="text-gray-400 leading-relaxed">
                Every contractor undergoes a multi-layer verification process, including ID, KRA,
                and previous work verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-[#030712]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-xl">B</span>
                </div>
                <span className="text-2xl font-black text-white">BuildConnect</span>
              </div>
              <p className="text-gray-500 max-w-sm mb-6">
                The leading professional marketplace for verified construction experts in Kenya.
                Building trust, one project at a time.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Services</h4>
              <ul className="space-y-4 text-gray-500">
                <li><Link to="/categories" className="hover:text-primary-400 transition-colors">Find Pros</Link></li>
                <li><Link to="/register" className="hover:text-primary-400 transition-colors">Post Project</Link></li>
                <li><Link to="/contractors" className="hover:text-primary-400 transition-colors">Browse Experts</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Platform</h4>
              <ul className="space-y-4 text-gray-500">
                <li><Link to="/about" className="hover:text-primary-400 transition-colors">Our Vision</Link></li>
                <li><Link to="/privacy" className="hover:text-primary-400 transition-colors">Safety First</Link></li>
                <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Help Center</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">&copy; 2026 BuildConnect. All rights reserved.</p>
            <div className="flex space-x-6">
              <span className="text-gray-600 text-sm hover:text-white cursor-pointer transition-colors">Twitter</span>
              <span className="text-gray-600 text-sm hover:text-white cursor-pointer transition-colors">LinkedIn</span>
              <span className="text-gray-600 text-sm hover:text-white cursor-pointer transition-colors">Facebook</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
