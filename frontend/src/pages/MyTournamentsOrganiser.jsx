import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Trophy, Calendar, MapPin, Settings } from 'lucide-react';

const MyTournamentsOrganiser = () => {
  const { user } = useContext(AuthContext);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debugError, setDebugError] = useState("");

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!user) {
          setLoading(false);
          return;
        }

        const url = `/api/tournaments/organiser`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTournaments(res.data);
      } catch (error) {
        console.error("Error fetching tournaments", error);
        setDebugError(`Error fetching tournaments: ${error.message} - ${error.response?.data?.message || ''}`);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTournaments();
    }
  }, [user]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-6">
      {debugError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-mono text-xs">
          DEBUG: {debugError}
        </div>
      )}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-heading font-bold text-navy-dark">My Tournaments</h2>
          <p className="text-text-muted mt-1">Manage your active and past events.</p>
        </div>
        <Link 
          to="/organise-tournament" 
          className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover shadow-md transition-colors"
        >
          Create New
        </Link>
      </div>

      {tournaments.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-warm-border">
          <Trophy className="mx-auto text-warm-border mb-4" size={64} />
          <h3 className="text-xl font-bold text-navy-dark mb-2">No Tournaments Yet</h3>
          <p className="text-text-muted mb-6">Start organising your first sports tournament today.</p>
          <Link 
            to="/organise-tournament" 
            className="px-6 py-2 bg-warm-surface border border-warm-border text-navy-dark rounded-lg font-medium hover:text-primary hover:border-primary transition-colors"
          >
            Create Tournament
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((t) => (
            <div key={t._id} className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] transition-all duration-500 group flex flex-col border border-warm-border/50 hover:-translate-y-2">
              {/* Vibrant Header */}
              <div className="h-44 bg-gradient-to-br from-navy-dark via-[#1a2b4c] to-primary/80 flex items-center justify-center p-6 relative overflow-hidden">
                {/* Subtle dot pattern texture */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiLz48L3N2Zz4=')] opacity-50"></div>
                
                {/* Abstract shapes for sporty feel */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-all duration-700 group-hover:scale-110"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl group-hover:bg-secondary/40 transition-all duration-700 group-hover:scale-110"></div>
                
                <h3 className="text-3xl font-heading font-black text-white text-center line-clamp-2 z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500 pb-4">
                  {t.tournamentName}
                </h3>
              </div>
              
              <div className="px-6 pb-6 flex-1 flex flex-col bg-white relative">
                {/* Floating Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 -mt-7 mb-6 relative z-20 w-full">
                  <div className="bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white flex flex-wrap items-center justify-center gap-2 w-[90%] mx-auto">
                    <span className="px-4 py-1.5 bg-primary/10 text-primary font-bold rounded-xl text-xs uppercase tracking-wider">
                      {t.sportType}
                    </span>
                    <span className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm ${
                      t.status === 'LIVE' ? 'bg-green-500 text-white animate-pulse shadow-green-500/30' :
                      t.status === 'REGISTRATION_OPEN' ? 'bg-blue-500 text-white shadow-blue-500/30' :
                      t.status === 'COMPLETED' ? 'bg-amber-500 text-white shadow-amber-500/30' :
                      t.status === 'REGISTRATION_CLOSED' ? 'bg-orange-500 text-white shadow-orange-500/30' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {t.status === 'REGISTRATION_OPEN' ? 'Registration Open' : (t.status ? t.status.replace('_', ' ') : 'DRAFT')}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-4 text-sm bg-warm-surface/40 p-3.5 rounded-2xl border-l-4 border-l-primary/60 border-y border-r border-warm-border/40 transition-colors hover:bg-warm-surface/80 group/row">
                    <MapPin size={18} className="text-primary/70 group-hover/row:scale-110 transition-transform" />
                    <span className="truncate text-navy-dark font-semibold">{[t.venueName, t.stateDistrict].filter(Boolean).join(', ') || "Location TBD"}</span>
                  </div>
                  {t.startDate && (
                    <div className="flex items-center gap-4 text-sm bg-warm-surface/40 p-3.5 rounded-2xl border-l-4 border-l-secondary/60 border-y border-r border-warm-border/40 transition-colors hover:bg-warm-surface/80 group/row">
                      <Calendar size={18} className="text-secondary/70 group-hover/row:scale-110 transition-transform" />
                      <span className="text-navy-dark font-semibold tracking-tight">{new Date(t.startDate).toLocaleDateString('en-GB')}{t.endDate ? ` - ${new Date(t.endDate).toLocaleDateString('en-GB')}` : ''}</span>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-6">
                  <Link 
                    to={`/organiser/tournaments/${t._id}`}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary to-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transform hover:-translate-y-0.5 transition-all group/btn"
                  >
                    <Settings size={18} className="group-hover/btn:rotate-90 transition-transform duration-500" /> Manage Hub
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTournamentsOrganiser;
