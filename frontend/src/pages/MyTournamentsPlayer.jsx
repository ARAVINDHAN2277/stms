import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trophy, Calendar, MapPin, ExternalLink, Activity, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyTournamentsPlayer = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchMyTournaments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/tournaments/registrations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRegistrations(res.data);
      } catch (error) {
        console.error('Error fetching registered tournaments', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTournaments();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-28 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 animate-slide-in">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            My <span className="text-blue-500">Deployments</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Status of your active and previous tournament engagements.</p>
        </div>
        <button 
          onClick={() => navigate('/player/explore')}
          className="px-6 py-3 bg-white/5 border border-white/10 rounded-sm text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 hover:border-blue-500 transition-all flex items-center gap-2"
        >
          <Search className="w-4 h-4 text-blue-500" /> Explore New Battles
        </button>
      </div>

      {registrations.length === 0 ? (
        <div className="text-center py-32 glass rounded-sm animate-slide-in [animation-delay:200ms]">
          <Activity className="w-16 h-16 text-gray-700 mx-auto mb-6 opacity-30" />
          <h3 className="text-white font-black text-xl uppercase tracking-widest mb-4">No Active Records</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm">You haven't joined any systems yet. Search the grid to find your first battle.</p>
          <button onClick={() => navigate('/player/explore')} className="text-blue-500 font-bold uppercase text-xs tracking-widest hover:underline">Launch Exploration</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 animate-slide-in [animation-delay:200ms]">
          {registrations.map((reg) => (
            <div key={reg.id} className="glass rounded-sm p-8 flex flex-col lg:flex-row items-center justify-between group hover:border-white/10 transition-all">
              <div className="flex items-center gap-8 w-full lg:w-auto mb-6 lg:mb-0">
                 <div className="w-20 h-20 bg-black/50 border border-white/5 rounded-sm flex flex-col items-center justify-center text-center p-2">
                    <span className="text-blue-500 font-black text-xl uppercase leading-none">{reg.tournament.sportType.substring(0,3)}</span>
                    <span className="text-[8px] text-gray-600 font-bold uppercase mt-1 tracking-tighter">Sector</span>
                 </div>
                 <div>
                    <h3 className="text-white text-2xl font-black uppercase tracking-tighter group-hover:text-blue-400 transition-colors">{reg.tournament.tournamentName}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                       <span className="flex items-center gap-1.5 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                          <MapPin className="w-3 h-3 text-blue-500" /> {reg.tournament.locationName || 'Global'}
                       </span>
                       <span className="flex items-center gap-1.5 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                          <Trophy className="w-3 h-3 text-emerald-500" /> {reg.tournament.type} Mode
                       </span>
                       <span className="flex items-center gap-1.5 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                          <Calendar className="w-3 h-3 text-purple-500" /> Joined {new Date(reg.registeredAt).toLocaleDateString()}
                       </span>
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-white/5 pt-6 lg:pt-0">
                 <div className="text-right">
                    <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Current Status</p>
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full animate-pulse ${
                         reg.tournament.status === 'Open' ? 'bg-blue-500' : 
                         reg.tournament.status === 'Ongoing' ? 'bg-emerald-500' : 'bg-gray-600'
                       }`}></div>
                       <span className="text-white font-bold uppercase text-xs tracking-widest">{reg.tournament.status}</span>
                    </div>
                 </div>
                 <button 
                  onClick={() => navigate(`/matches/${reg.tournamentId}`)}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-blue-600 hover:border-blue-500 transition-all flex items-center gap-2 group/btn shadow-xl"
                 >
                   Bracket Intel <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTournamentsPlayer;
