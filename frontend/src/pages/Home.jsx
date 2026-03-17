import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import LiveTicker from '../components/LiveTicker';
import MiniBracketPreview from '../components/MiniBracketPreview';
import { Trophy, Zap, Target, Shield, ChevronRight, Activity, Users } from 'lucide-react';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans overflow-x-hidden selection:bg-purple-500 selection:text-white">
      <Navbar />

      {/* Hero Section with Tactical Background */}
      <div className="relative pt-32 pb-20 sm:pt-48 sm:pb-32 lg:pb-48 overflow-hidden">
        {/* Animated Scanline Overlay */}
        <div className="scanline" />
        
        {/* Advanced Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pulse-glow"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pulse-glow" style={{ animationDelay: '2s' }}></div>
           
           {/* Decorative Grid Lines */}
           <div className="absolute inset-0 opacity-10" 
                style={{ backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center animate-slide-in">
          {/* Tactical Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-sm">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">System Status: Optimal</span>
          </div>

          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter uppercase mb-8 leading-[0.85] italic">
            <span className="block text-white opacity-90">
              Rule The
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-400 to-blue-500 mt-2 filter drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              Grid
            </span>
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed">
            The ultimate command center for elite organizers and hardcore competitors. 
            Experience <span className="text-white font-bold">real-time match telemetry</span>, <span className="text-white font-bold">automated brackets</span>, and <span className="text-white font-bold">global scale</span>.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to={user ? (user.role === 'organiser' ? '/organiser-dashboard' : '/player-dashboard') : '/signup'}
              className="group relative w-full sm:w-auto overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transition-transform group-hover:scale-105" />
              <div className="relative px-10 py-5 flex items-center justify-center gap-3 text-white font-black uppercase tracking-widest text-xs border border-white/10">
                Authorize Deployment <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <a 
              href="#features" 
              className="w-full sm:w-auto px-10 py-5 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all rounded-sm backdrop-blur-sm"
            >
              Examine Features
            </a>
          </div>

          {/* Mini Bracket Preview Integration */}
          <div className="mt-20 max-w-lg mx-auto transform hover:scale-[1.02] transition-transform cursor-pointer">
             <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-4">Simulation: Live Grid Advancement</div>
             <MiniBracketPreview />
          </div>
        </div>
      </div>

      {/* Live Intelligence Bar */}
      <LiveTicker />

      {/* Features Bento Grid */}
      <div id="features" className="py-32 bg-black/30 relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Core Protocols</h2>
            <h3 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white italic leading-none">Designed for <br/><span className="text-purple-500">Performance.</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
            {/* Large Feature: Real-time Brackets */}
            <div className="md:col-span-6 lg:col-span-8 glass p-10 rounded-sm relative group overflow-hidden border-purple-500/20">
               <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 opacity-50 transition-all group-hover:w-full group-hover:opacity-5"></div>
               <Zap className="w-10 h-10 text-purple-500 mb-8" />
               <h4 className="text-2xl font-black uppercase tracking-tight text-white mb-4">Neural Bracket Matrix</h4>
               <p className="text-gray-400 leading-relaxed max-w-md">
                 Our proprietary single-elimination engine generates dynamic brackets instantly. Track progression with millisecond accuracy as players advance through the grid.
               </p>
            </div>

            {/* Medium Feature: Live Scoring */}
            <div className="md:col-span-6 lg:col-span-4 glass p-10 rounded-sm relative group overflow-hidden border-blue-500/20">
               <Activity className="w-10 h-10 text-blue-500 mb-8" />
               <h4 className="text-xl font-black uppercase tracking-tight text-white mb-4">Match Telemetry</h4>
               <p className="text-gray-400 text-sm leading-relaxed">
                 Real-time score synching via Socket.io. One update from the organiser mirrors instantly to every connected dashboard.
               </p>
            </div>

            {/* Small Features */}
            <div className="md:col-span-3 lg:col-span-4 glass p-10 rounded-sm border-emerald-500/20">
               <Target className="w-8 h-8 text-emerald-500 mb-6" />
               <h4 className="text-lg font-black uppercase tracking-tight text-white mb-3">Tactical Geolocation</h4>
               <p className="text-gray-400 text-xs leading-relaxed">
                 Discover local LANs and tournaments within your range using our integrated Haversine proximity engine.
               </p>
            </div>

            <div className="md:col-span-3 lg:col-span-4 glass p-10 rounded-sm border-indigo-500/20">
               <Users className="w-8 h-8 text-indigo-500 mb-6" />
               <h4 className="text-lg font-black uppercase tracking-tight text-white mb-3">Squad Recruitment</h4>
               <p className="text-gray-400 text-xs leading-relaxed">
                 Forge competitive teams, recruit top operators via email, and register for Squad-only deployments.
               </p>
            </div>

            <div className="md:col-span-6 lg:col-span-4 glass p-10 rounded-sm border-white/10 bg-gradient-to-br from-white/5 to-white/0">
               <Shield className="w-8 h-8 text-white/50 mb-6" />
               <h4 className="text-lg font-black uppercase tracking-tight text-white mb-3">Secure Operations</h4>
               <p className="text-gray-400 text-xs leading-relaxed">
                 Advanced JWT-based identity protection and role-bound access control for every operator.
               </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-16 bg-[#0a0a0c] border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto px-6">
           <div className="mb-8">
              <span className="text-xl font-black tracking-tighter text-white uppercase">
                Tourney<span className="text-purple-500">Grid</span>
              </span>
           </div>
           <p className="text-gray-600 font-bold text-[9px] tracking-[0.5em] uppercase">
             V2.6.0 Protocol // Finalized for the Compete State
           </p>
        </div>
      </footer>

    </div>
  );
};

export default Home;
