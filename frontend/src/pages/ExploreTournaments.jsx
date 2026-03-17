import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Trophy, Zap, ChevronRight, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExploreTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sport, setSport] = useState('All');
  const navigate = useNavigate();

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      // For now, fetching all and filtering on frontend for UX speed, 
      // but ready for backend integration
      const res = await axios.get('http://localhost:5000/api/tournaments/nearby', {
        params: { sport: sport === 'All' ? '' : sport, locationText: search }
      });
      setTournaments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [sport]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] pt-28 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Search */}
        <div className="mb-12 animate-slide-in">
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic mb-8">
            Global <span className="text-blue-500">Discovery</span>
          </h1>
          
          <div className="flex flex-col lg:flex-row gap-4 items-center glass p-2 rounded-sm shadow-2xl">
            <div className="relative flex-1 w-full lg:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by city, state or tournament name..." 
                className="w-full bg-black/40 border-none px-12 py-4 text-white focus:ring-1 focus:ring-blue-500 rounded-sm uppercase font-bold text-xs tracking-widest"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchTournaments()}
              />
            </div>
            
            <div className="flex items-center gap-2 px-4 border-l border-white/5">
              <Filter className="text-gray-500 w-4 h-4" />
              <select 
                className="bg-transparent text-gray-400 font-bold uppercase text-[10px] tracking-widest focus:outline-none py-4 cursor-pointer"
                value={sport}
                onChange={e => setSport(e.target.value)}
              >
                <option value="All">All Sectors</option>
                <option value="Valorant">Valorant</option>
                <option value="FreeFire">Free Fire</option>
                <option value="BGMI">BGMI</option>
                <option value="CSGO">CS:GO</option>
              </select>
            </div>

            <button 
              onClick={fetchTournaments}
              className="w-full lg:w-auto px-10 py-4 bg-blue-600 text-white font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              SCAN GRID
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="py-32 text-center">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-black uppercase text-[10px] tracking-[0.3em]">Querying Satellites...</p>
          </div>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-32 bg-[#111116] border border-white/5 rounded-sm">
            <Zap className="w-16 h-16 text-gray-700 mx-auto mb-6 opacity-30" />
            <h3 className="text-white font-black text-xl uppercase tracking-widest mb-4">No Signals Detected</h3>
            <p className="text-gray-500 max-w-sm mx-auto text-sm">No tournaments found matching your current coordinates or filters. Expand your search area.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-in [animation-delay:200ms]">
            {tournaments.map(t => (
              <div key={t.id} className="glass rounded-sm overflow-hidden group hover:border-blue-500/30 transition-all shadow-2xl">
                 <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                 <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-[10px] font-black bg-blue-500/10 text-blue-400 px-3 py-1 rounded-sm uppercase tracking-widest">{t.sportType}</span>
                      <span className="text-emerald-400 font-black text-xs">${t.registrationFee}</span>
                    </div>
                    
                    <h3 className="text-white text-xl font-black uppercase tracking-tight mb-4 group-hover:text-blue-400 transition-colors line-clamp-1">{t.tournamentName}</h3>
                    
                    <div className="space-y-3 mb-8">
                       <div className="flex items-center gap-3 text-gray-500">
                          <MapPin className="w-4 h-4 text-blue-500 opacity-50" />
                          <span className="text-[10px] font-black uppercase tracking-widest truncate">{t.locationName || 'TBD'}</span>
                       </div>
                       <div className="flex items-center gap-3 text-gray-500">
                          <Trophy className="w-4 h-4 text-purple-500 opacity-50" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{t.type} Mode • {t.teamSize > 1 ? `Team of ${t.teamSize}` : 'Solo'}</span>
                       </div>
                    </div>

                    <button 
                      onClick={() => navigate(`/tournament/${t.id}`)}
                      className="w-full py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 hover:border-blue-500 transition-all flex items-center justify-between px-6"
                    >
                      Intel & Enrollment <ChevronRight className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ExploreTournaments;
