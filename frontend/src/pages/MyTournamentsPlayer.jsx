import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, Search, Swords, LogOut, ChevronRight, MapPin, Calendar } from "lucide-react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const MyTournamentsPlayer = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!user.id) return;

        const res = await axios.get(`/api/tournaments/player/${user.id}/registrations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRegistrations(res.data);
      } catch (err) {
        console.error("Failed to fetch registrations", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, [user.id]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="p-6 md:p-10">
      {loading ? (
          <div className="text-center py-12 text-text-muted">Loading your tournaments...</div>
        ) : registrations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {registrations.map(reg => (
              <div key={reg.id} className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] transition-all duration-500 group flex flex-col border border-warm-border/50 hover:-translate-y-2">
                {/* Vibrant Header */}
                <div className="h-44 bg-gradient-to-br from-navy-dark via-[#1a2b4c] to-primary/80 flex items-center justify-center p-6 relative overflow-hidden">
                  {/* Subtle dot pattern texture */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiLz48L3N2Zz4=')] opacity-50"></div>
                  
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-all duration-700 group-hover:scale-110"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl group-hover:bg-secondary/40 transition-all duration-700 group-hover:scale-110"></div>
                  
                  <h3 className="text-3xl font-heading font-black text-white text-center line-clamp-2 z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500 pb-4">
                    {reg.tournament?.tournamentName}
                  </h3>
                </div>

                <div className="px-6 pb-6 flex-1 flex flex-col bg-white relative">
                  {/* Floating Badges */}
                  <div className="flex flex-wrap items-center justify-center gap-2 -mt-7 mb-6 relative z-20 w-full">
                    <div className="bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white flex flex-wrap items-center justify-center gap-2 w-[90%] mx-auto">
                      <span className="px-4 py-1.5 bg-primary/10 text-primary font-bold rounded-xl text-xs uppercase tracking-wider">
                        {reg.tournament?.sportType}
                      </span>
                      <span className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm ${
                        reg.status === 'APPROVED' ? 'bg-green-500 text-white shadow-green-500/30' :
                        reg.status === 'REJECTED' ? 'bg-red-500 text-white shadow-red-500/30' :
                        'bg-yellow-500 text-white shadow-yellow-500/30'
                      }`}>
                        {reg.status}
                      </span>
                      {reg.tournament?.status === 'LIVE' && (
                        <span className="px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm bg-green-500 text-white animate-pulse shadow-green-500/30">
                          LIVE
                        </span>
                      )}
                      {reg.tournament?.status === 'COMPLETED' && (
                        <span className="px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm bg-amber-500 text-white shadow-amber-500/30">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-4 text-sm bg-warm-surface/40 p-3.5 rounded-2xl border-l-4 border-l-primary/60 border-y border-r border-warm-border/40 transition-colors hover:bg-warm-surface/80 group/row">
                      <MapPin size={18} className="text-primary/70 group-hover/row:scale-110 transition-transform" />
                      <span className="truncate text-navy-dark font-semibold">{[reg.tournament?.venueName, reg.tournament?.stateDistrict].filter(Boolean).join(', ') || "Location TBD"}</span>
                    </div>
                    {reg.tournament?.startDate && (
                      <div className="flex items-center gap-4 text-sm bg-warm-surface/40 p-3.5 rounded-2xl border-l-4 border-l-secondary/60 border-y border-r border-warm-border/40 transition-colors hover:bg-warm-surface/80 group/row">
                        <Calendar size={18} className="text-secondary/70 group-hover/row:scale-110 transition-transform" />
                        <span className="text-navy-dark font-semibold tracking-tight">{new Date(reg.tournament.startDate).toLocaleDateString('en-GB')}{reg.tournament.endDate ? ` - ${new Date(reg.tournament.endDate).toLocaleDateString('en-GB')}` : ''}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-6">
                    <Link 
                      to={`/player/tournaments/${reg.tournament?.id}`}
                      className={`w-full flex items-center justify-center gap-2 py-3.5 font-bold rounded-2xl shadow-lg transition-all duration-300 group/btn ${
                        reg.status === 'APPROVED' 
                          ? 'bg-gradient-to-r from-primary to-orange-600 text-white shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5' 
                          : 'bg-gray-100 text-gray-500 shadow-none pointer-events-none'
                      }`}
                    >
                      {reg.status === 'APPROVED' ? <>Enter Hub <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" /></> : 'Waiting for Approval'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-warm-border">
            <Swords className="mx-auto text-warm-border mb-4" size={48} />
            <p className="text-xl text-navy-dark font-medium mb-2">No Tournaments Yet</p>
            <p className="text-text-muted mb-6">You haven't applied to any tournaments. Head over to the Discover page to find events.</p>
            <Link to="/discover" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover shadow-md transition-all">
              <Search size={18} /> Discover Events
            </Link>
          </div>
        )}
    </div>
  );
};

export default MyTournamentsPlayer;
