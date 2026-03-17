import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Trophy, Users, Crosshair, Zap, Calendar, Target, ChevronRight, Activity, Plus } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import LiveActivityFeed from "../components/LiveActivityFeed";

const PlayerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const socket = useSocket();

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (socket) {
      // Refresh stats when a match is updated in a tournament we follow
      // (Simplified: refresh on any match update for now, or we could filter)
      socket.on('match_update', () => fetchStats());
      socket.on('new_announcement', () => fetchStats());

      return () => {
        socket.off('match_update');
        socket.off('new_announcement');
      };
    }
  }, [socket]);

  const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch player stats", err);
      } finally {
        setLoading(false);
      }
    };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!stats) return (
    <div className="min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center p-6 text-center">
      <Zap className="w-16 h-16 text-gray-700 mb-6 opacity-30" />
      <h2 className="text-white font-black uppercase tracking-widest text-xl mb-4">Connection Failed</h2>
      <p className="text-gray-500 max-w-sm mx-auto text-sm mb-8">We couldn't synchronize with the grid satellites. Please check your uplink.</p>
      <button onClick={() => window.location.reload()} className="px-8 py-3 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all">Retry Uplink</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] pt-28 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Identity & Stats Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10 animate-slide-in">
          <div className="lg:col-span-1 glass p-8 rounded-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-sm bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <Crosshair className="text-blue-500 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-black uppercase tracking-tighter italic text-xl">Active</h3>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Operator Status</p>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-sm flex items-center justify-between hover:border-blue-500/30 transition-all group">
            <div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Total Squads</p>
              <h4 className="text-white text-3xl font-black italic">{stats?.squadCount || 0}</h4>
            </div>
            <Users className="text-gray-700 group-hover:text-blue-500 transition-colors w-8 h-8" />
          </div>

          <div className="glass p-6 rounded-sm flex items-center justify-between hover:border-purple-500/30 transition-all group">
            <div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Deployments</p>
              <h4 className="text-white text-3xl font-black italic">{stats?.registrationCount || 0}</h4>
            </div>
            <Target className="text-gray-700 group-hover:text-purple-500 transition-colors w-8 h-8" />
          </div>

          <div className="glass p-6 rounded-sm flex items-center justify-between hover:border-emerald-500/30 transition-all group">
            <div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Victories</p>
              <h4 className="text-white text-3xl font-black italic">{stats?.winCount || 0}</h4>
            </div>
            <Trophy className="text-gray-700 group-hover:text-emerald-500 transition-colors w-8 h-8" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-in [animation-delay:200ms]">
          
          {/* Main Content: Deployments */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-sm p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                <h2 className="text-white font-black uppercase tracking-widest text-lg flex items-center gap-3">
                  <Activity className="w-5 h-5 text-blue-500" /> Active Deployments
                </h2>
                <button onClick={() => navigate('/player/explore')} className="text-blue-500 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1">
                  Find New <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {stats.activeRegistrations?.length === 0 ? (
                <div className="py-20 text-center">
                  <Zap className="w-12 h-12 text-gray-700 mx-auto mb-4 opacity-30" />
                  <p className="text-gray-500 uppercase font-bold text-xs tracking-widest">No active deployments detected.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stats.activeRegistrations.map(reg => (
                    <div key={reg.id} className="bg-black/40 border border-white/5 p-5 rounded-sm group hover:border-blue-500/30 transition-all cursor-pointer" onClick={() => navigate(`/tournament/${reg.tournamentId}`)}>
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black bg-blue-500/10 text-blue-400 px-2 py-1 rounded-sm uppercase tracking-widest">{reg.tournament.sportType}</span>
                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{reg.tournament.status}</span>
                      </div>
                      <h3 className="text-white font-bold uppercase tracking-tight mb-4 group-hover:text-blue-400 transition-colors">{reg.tournament.tournamentName}</h3>
                      <div className="flex items-center justify-between text-[10px]">
                         <span className="text-gray-500 font-bold uppercase tracking-widest">Mode: {reg.tournament.type}</span>
                         <span className="text-emerald-400 font-black tracking-widest">IN-GRID</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => navigate('/squads/create')} className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 rounded-sm shadow-xl hover:scale-[1.02] transition-all flex items-center justify-between group">
                  <div>
                    <h3 className="text-white font-black uppercase tracking-tighter italic text-2xl mb-1">New Squad</h3>
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Forge a competitive team</p>
                  </div>
                  <Plus className="w-10 h-10 text-white/50 group-hover:text-white transition-colors" />
               </button>
               <button onClick={() => navigate('/player/squads')} className="bg-[#111116] border border-white/5 p-8 rounded-sm shadow-xl hover:border-purple-500/50 transition-all flex items-center justify-between group">
                  <div>
                    <h3 className="text-white font-black uppercase tracking-tighter italic text-2xl mb-1">Squad Command</h3>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Manage your rosters</p>
                  </div>
                  <Users className="w-10 h-10 text-gray-700 group-hover:text-purple-500 transition-colors" />
               </button>
            </div>
          </div>

          {/* Sidebar: Upcoming Matches */}
          <div className="space-y-8">
            <div className="glass rounded-sm p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full"></div>
               <h2 className="text-white font-black uppercase tracking-widest text-lg flex items-center gap-3 mb-8">
                  <Calendar className="w-5 h-5 text-purple-500" /> Incoming Intel
               </h2>

               {stats.upcomingMatches?.length === 0 ? (
                 <div className="py-12 text-center bg-black/20 border border-dashed border-white/5 rounded-sm">
                    <p className="text-gray-600 uppercase font-bold text-[10px] tracking-widest">No pending match data.</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                   {stats.upcomingMatches.map(match => (
                     <div key={match.id} className="bg-black/50 border border-white/5 p-4 rounded-sm border-l-2 border-l-purple-500">
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">{match.tournament.tournamentName}</p>
                        <div className="flex items-center justify-between gap-4">
                           <div className="flex-1 text-center">
                              <p className="text-white text-xs font-black uppercase truncate">{match.squad1?.name || match.player1?.username || 'TBD'}</p>
                           </div>
                           <span className="text-purple-500 font-black text-[10px]">VS</span>
                           <div className="flex-1 text-center">
                              <p className="text-white text-xs font-black uppercase truncate">{match.squad2?.name || match.player2?.username || 'TBD'}</p>
                           </div>
                        </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>

            <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-sm">
               <h4 className="text-blue-400 font-black uppercase tracking-widest text-[11px] mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Tactical Tip
               </h4>
               <p className="text-gray-400 text-xs leading-relaxed">
                  Always ensure your squad is synchronized before entering the Grid. Communication is the difference between victory and deletion.
               </p>
            </div>

            <LiveActivityFeed />
          </div>

        </div>
      </div>
    </div>
  );
};

export default PlayerDashboard;
