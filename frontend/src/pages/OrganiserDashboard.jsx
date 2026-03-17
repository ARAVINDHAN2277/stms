import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { 
  Trophy, 
  Users, 
  DollarSign, 
  Activity, 
  PlusCircle, 
  LayoutGrid, 
  ChevronRight, 
  Zap,
  Shield,
  Clock
} from "lucide-react";

const OrganiserDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get("http://localhost:5000/api/tournaments/organiser-stats/overview", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (error) {
        console.error("Error fetching organiser stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-purple-500 font-black uppercase tracking-[0.3em] animate-pulse">Initializing Command Center...</p>
      </div>
    </div>
  );

  const { metrics, recentRegistrations, tournaments } = data || {
    metrics: { totalTournaments: 0, totalPlayers: 0, totalRevenue: 0, activeTournaments: 0 },
    recentRegistrations: [],
    tournaments: []
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#0a0a0c] text-white p-6 lg:p-10 font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Organiser Dashboard: Active</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter italic">
              Dashboard <span className="text-purple-500">Hub</span>
            </h1>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={() => navigate("/organise-tournament")}
              className="flex-1 md:flex-none px-6 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
            >
              <PlusCircle className="w-4 h-4" /> Create Tournament
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="glass p-6 rounded-sm border-purple-500/20 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <DollarSign className="w-12 h-12 text-purple-500" />
            </div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Earnings</p>
            <h3 className="text-3xl font-black text-emerald-400">${metrics.totalRevenue}</h3>
          </div>
          
          <div className="glass p-6 rounded-sm border-blue-500/20 relative group overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users className="w-12 h-12 text-blue-500" />
            </div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Players</p>
            <h3 className="text-3xl font-black text-white">{metrics.totalPlayers}</h3>
          </div>

          <div className="glass p-6 rounded-sm border-emerald-500/20 relative group overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity className="w-12 h-12 text-emerald-500" />
            </div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Active Events</p>
            <h3 className="text-3xl font-black text-white">{metrics.activeTournaments}</h3>
          </div>

          <div className="glass p-6 rounded-sm border-white/10 relative group overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">System Health</p>
            <h3 className="text-3xl font-black text-white">100%</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Work Area: Active Deployments */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-end mb-2">
               <div>
                 <h2 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mb-1">Recent Grids</h2>
                 <h3 className="text-2xl font-black uppercase italic">Active Operations</h3>
               </div>
               <Link to="/organiser/tournaments" className="text-[10px] font-black uppercase tracking-widest text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
                 View All Grids <ChevronRight className="w-3 h-3" />
               </Link>
            </div>

            {tournaments.length === 0 ? (
              <div className="glass p-12 text-center rounded-sm border-dashed border-white/5">
                <LayoutGrid className="w-12 h-12 text-gray-800 mx-auto mb-4 opacity-50" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No active tournaments detected in this area.</p>
                <button 
                  onClick={() => navigate("/organise-tournament")}
                  className="mt-6 px-6 py-3 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
                >
                  Create Your First Tournament
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tournaments.map(tournament => (
                  <div key={tournament.id} className="glass group hover:bg-white/[0.03] transition-all p-6 rounded-sm border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
                    
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-2 py-0.5 rounded-[2px] text-[8px] font-black uppercase tracking-widest ${
                        tournament.status === 'Open' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        STATUS: {tournament.status}
                      </span>
                      <span className="text-[10px] text-gray-500 font-bold">{tournament.sportType}</span>
                    </div>

                    <h4 className="text-lg font-black uppercase tracking-tight text-white mb-6 line-clamp-1">{tournament.tournamentName}</h4>
                    
                    <div className="flex items-center justify-between mt-auto">
                       <div className="flex items-center gap-2">
                          <Users className="w-3 h-3 text-purple-400" />
                          <span className="text-xs font-bold text-gray-400">{tournament.registeredPlayers.length} / {tournament.maxPlayers || '∞'}</span>
                       </div>
                       <button 
                         onClick={() => navigate(`/organiser/tournaments/${tournament.id}`)}
                         className="p-2 bg-purple-600/20 border border-purple-500/30 text-purple-400 rounded-sm hover:bg-purple-600 hover:text-white transition-all"
                       >
                         <ChevronRight className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Monitor Side Panel */}
          <div className="space-y-6">
             <div className="flex items-center gap-3 mb-2">
               <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
               <h3 className="text-lg font-black uppercase tracking-tighter">Activity Monitor</h3>
             </div>

             <div className="glass p-6 rounded-sm border-white/5 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/50 via-transparent to-transparent" />
                
                {recentRegistrations.length === 0 ? (
                  <div className="py-12 text-center">
                    <Clock className="w-8 h-8 text-gray-800 mx-auto mb-3 opacity-50" />
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Awaiting Transmissions...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {recentRegistrations.map((reg, idx) => (
                      <div key={idx} className="flex gap-4 animate-slide-in">
                        <div className="w-1 h-8 bg-emerald-500/30 rounded-full mt-1" />
                        <div>
                          <p className="text-[11px] font-bold text-white uppercase tracking-tight">
                            Player <span className="text-emerald-400">{reg.player.username}</span> Joined
                          </p>
                          <p className="text-[9px] text-gray-500 font-medium uppercase tracking-widest mt-0.5 truncate max-w-[180px]">
                            {reg.tournament.tournamentName}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>

             {/* Quick Actions Footer Card */}
             <div className="bg-gradient-to-br from-purple-900/10 to-transparent border border-purple-500/10 p-6 rounded-sm">
                <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-3">Dashboard Tools</p>
                <div className="space-y-2">
                  <button className="w-full py-3 bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-left px-4 flex justify-between items-center group">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Send Announcement</span>
                    <RadioIcon className="w-4 h-4 text-gray-600 group-hover:text-blue-400" />
                  </button>
                  <button onClick={() => navigate("/organiser/tournaments")} className="w-full py-3 bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-left px-4 flex justify-between items-center group">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Tournament History</span>
                    <Clock className="w-4 h-4 text-gray-600 group-hover:text-purple-400" />
                  </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RadioIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export default OrganiserDashboard;
