import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Trophy, Calendar, MapPin, Settings } from 'lucide-react';

const MyTournamentsOrganiser = () => {
  const { user } = useContext(AuthContext);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/tournaments/organiser/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTournaments(res.data);
      } catch (error) {
        console.error("Error fetching tournaments", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchTournaments();
  }, [user]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-6">
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
          {tournaments.map((tournament) => (
            <div key={tournament._id} className="bg-white rounded-2xl border border-warm-border shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
              <div className="h-2 bg-primary w-full group-hover:bg-primary-hover transition-colors"></div>
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-navy-dark line-clamp-1">{tournament.tournamentName}</h3>
                  <span className="px-2 py-1 bg-warm-surface border border-warm-border text-xs font-semibold rounded text-text-muted">
                    {tournament.status || "DRAFT"}
                  </span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-text-muted text-sm">
                    <Trophy size={16} className="text-primary/70" />
                    <span>{tournament.sportType}</span>
                  </div>
                  <div className="flex items-center gap-3 text-text-muted text-sm">
                    <MapPin size={16} className="text-primary/70" />
                    <span className="line-clamp-1">
                      {[tournament.venueName, tournament.stateDistrict].filter(Boolean).join(', ') || 'Location TBD'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-text-muted text-sm">
                    <Calendar size={16} className="text-primary/70" />
                    <span>Fee: ₹{tournament.registrationFee}</span>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-warm-bg border-t border-warm-border mt-auto">
                <Link 
                  to={`/organiser/tournaments/${tournament._id}`}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-warm-border rounded-lg text-navy-dark font-medium hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                >
                  <Settings size={18} /> Manage Hub
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTournamentsOrganiser;
