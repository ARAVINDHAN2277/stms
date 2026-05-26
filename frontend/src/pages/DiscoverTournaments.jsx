import React, { useState, useEffect, useContext } from "react";
import { Search, MapPin, Calendar, Users, ChevronRight, Filter, AlertTriangle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import AuthContext from "../context/AuthContext";

const DiscoverTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState("All");
  const [registrations, setRegistrations] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', actionFn: null, actionText: '', isDanger: false });
  const { user } = useContext(AuthContext);

  const confirmAction = (title, message, actionText, actionFn, isDanger = false) => {
    setConfirmModal({ isOpen: true, title, message, actionText, actionFn, isDanger });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const discoverReq = axios.get("/api/tournaments/discover", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const regReq = user ? axios.get(`/api/tournaments/player/${user.id}/registrations`, {
          headers: { Authorization: `Bearer ${token}` }
        }) : Promise.resolve({ data: [] });

        const [res, regRes] = await Promise.all([discoverReq, regReq]);
        setTournaments(res.data);
        setRegistrations(regRes.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch tournaments", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleRegister = async (tournamentId) => {
    try {
      const token = localStorage.getItem("token");
      if (!user) return;

      const res = await axios.patch(`/api/tournaments/${tournamentId}/register`, 
        { playerId: user.id }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.registration) {
         setRegistrations(prev => [...prev, res.data.registration]);
      } else {
         const regRes = await axios.get(`/api/tournaments/player/${user.id}/registrations`, {
            headers: { Authorization: `Bearer ${token}` }
         });
         setRegistrations(regRes.data);
      }
    } catch (err) {
      console.error(err);
      confirmAction("Error", err.response?.data?.message || "Failed to register. You might already be registered.", "OK", () => {}, true);
    }
  };

  const filteredTournaments = tournaments.filter(t => {
    const matchesSearch = t.tournamentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = selectedSport === "All" || t.sportType === selectedSport;
    return matchesSearch && matchesSport;
  });

  return (
    <div className="p-6 md:p-10 relative">
      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy-dark/40 backdrop-blur-sm"
              onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden border border-warm-border"
            >
              <div className={`h-2 w-full ${confirmModal.isDanger ? 'bg-red-500' : 'bg-primary'}`}></div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  {confirmModal.isDanger ? (
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                      <AlertTriangle size={20} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <CheckCircle size={20} />
                    </div>
                  )}
                  <h3 className="text-xl font-heading font-bold text-navy-dark">{confirmModal.title}</h3>
                </div>
                <p className="text-text-muted mb-8 leading-relaxed">
                  {confirmModal.message}
                </p>
                <div className="flex gap-3 justify-end">
                  <button 
                    onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                    className="px-5 py-2 rounded-lg font-medium text-text-muted hover:bg-warm-surface transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      confirmModal.actionFn();
                      setConfirmModal({ ...confirmModal, isOpen: false });
                    }}
                    className={`px-5 py-2 rounded-lg font-bold text-white transition-colors shadow-sm ${
                      confirmModal.isDanger ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-hover'
                    }`}
                  >
                    {confirmModal.actionText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-heading font-black tracking-tight text-navy-dark mb-4">
            Discover Tournaments
          </h1>
          <p className="text-text-muted text-lg">Find and join active sporting events in your area.</p>
        </header>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-text-muted" />
            </div>
            <input 
              type="text" 
              placeholder="Search tournaments by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Filter size={20} className="text-text-muted" />
            </div>
            <select 
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
            >
              <option value="All">All Sports</option>
              <option value="Football">Football</option>
              <option value="Basketball">Basketball</option>
              <option value="Tennis">Tennis</option>
              <option value="Cricket">Cricket</option>
              <option value="TableTennis">Table Tennis</option>
              <option value="Badminton">Badminton</option>
              <option value="Volleyball">Volleyball</option>
              <option value="Hockey">Hockey</option>
            </select>
          </div>
        </div>

        {/* Tournament Grid */}
        {loading ? (
          <div className="text-center py-20 text-text-muted">Loading available tournaments...</div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-200">
            <p className="text-xl text-red-600 font-bold mb-2">Failed to load tournaments</p>
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map(t => (
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
                        {t.status === 'REGISTRATION_OPEN' ? 'Registration Open' : t.status.replace('_', ' ')}
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
                    {(() => {
                      if (t.status !== 'REGISTRATION_OPEN') {
                        return (
                          <button 
                            disabled
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-50 border border-gray-200 text-gray-500 font-bold rounded-2xl cursor-not-allowed"
                          >
                            {t.status === 'LIVE' ? 'Tournament is Live' : 'Registration Closed'}
                          </button>
                        );
                      }
                      
                      const reg = user ? registrations.find(r => r.tournamentId === t._id) : null;
                      
                      // Registration is open, but check user status
                      if (reg) {
                        if (reg.status === 'PENDING') {
                          return (
                            <button 
                              disabled
                              className="w-full flex items-center justify-center gap-2 py-3.5 bg-yellow-50 border border-yellow-200 text-yellow-700 font-bold rounded-2xl cursor-wait"
                            >
                              Approval Pending
                            </button>
                          );
                        }
                        if (reg.status === 'APPROVED') {
                          return (
                            <button 
                              onClick={() => navigate(`/player/tournaments/${t._id}`)}
                              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary to-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transform hover:-translate-y-0.5 transition-all group/btn"
                            >
                              Enter Hub <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                          );
                        }
                        if (reg.status === 'REJECTED') {
                          return (
                            <button 
                              disabled
                              className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-50 border border-red-200 text-red-600 font-bold rounded-2xl cursor-not-allowed"
                            >
                              Registration Rejected
                            </button>
                          );
                        }
                      }
                      
                      // Can register
                      return (
                        <button 
                          onClick={() => {
                            if (!user) {
                              navigate('/login', { state: { returnUrl: `/explore` } });
                            } else {
                              handleQuickRegister(t._id);
                            }
                          }}
                          disabled={registeringId === t._id}
                          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary to-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transform hover:-translate-y-0.5 transition-all group/btn disabled:opacity-70 disabled:cursor-wait"
                        >
                          {registeringId === t._id ? "Registering..." : (
                            <>Register Now <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" /></>
                          )}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-warm-border">
            <p className="text-xl text-navy-dark font-medium mb-2">No Tournaments Found</p>
            <p className="text-text-muted">Try adjusting your filters or check back later for new events.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverTournaments;
