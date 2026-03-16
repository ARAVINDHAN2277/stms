import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDashboardRedirect = () => {
    if (user?.role === 'organiser') navigate('/organiser-dashboard');
    else if (user?.role === 'player') navigate('/player-dashboard');
    else navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans overflow-x-hidden selection:bg-purple-500 selection:text-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
        {/* Abstract Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter uppercase mb-6 leading-[1.1]">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              Dominate The
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mt-2 filter drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              Competition
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto font-medium">
            The ultimate tournament management platform built for hardcore competitors and elite organizers. Live brackets, instant scoring, and global scale.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to={user ? (user.role === 'organiser' ? '/organiser-dashboard' : '/player-dashboard') : '/signup'}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors rounded-sm"
            >
              Start Competing
            </Link>
            <a 
              href="#features" 
              className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-sm hover:bg-white/5 transition-colors rounded-sm backdrop-blur-sm"
            >
              View Features
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-black/50 border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">Forged for the Elite</h2>
            <div className="w-24 h-1 bg-purple-500 mx-auto mt-6 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#111116] border border-white/5 p-8 rounded-sm hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wide text-white mb-3">Instant Brackets</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Automatically generate single-elimination brackets from your registered players. No more manual spreadsheets.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#111116] border border-white/5 p-8 rounded-sm hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wide text-white mb-3">Live Scoring</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Update match results in real-time. Players instantly see who advances to the next round via the dashboard.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#111116] border border-white/5 p-8 rounded-sm hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wide text-white mb-3">Location Discovery</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Find local LANs or sports tournaments near you using our integrated Haversine proximity engine.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-[#0a0a0c] border-t border-white/10 text-center">
        <p className="text-gray-500 font-medium text-sm tracking-widest uppercase">
          &copy; 2026 TourneyGrid. All systems operational.
        </p>
      </footer>
    </div>
  );
};

export default Home;
