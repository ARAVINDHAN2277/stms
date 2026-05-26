import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Swords, Activity, Clock, LogOut, Search, Trophy } from "lucide-react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const PlayerDashboard = () => {
  const navigate = useNavigate();
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!user.id) return;

        // Fetch upcoming matches
        const matchesRes = await axios.get(`/api/match/player/${user.id}/upcoming`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUpcomingMatches(matchesRes.data);

        // Fetch active registrations
        const regRes = await axios.get(`/api/tournaments/player/${user.id}/registrations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRegistrations(regRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
          <div className="text-center py-12 text-text-muted">Loading dashboard...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (Wider) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Next Match Up Card */}
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Swords className="text-primary" size={20}/> Next Match Up
                </h2>
                {upcomingMatches.length > 0 ? (
                  <div className="bg-navy-dark text-white rounded-3xl p-8 relative overflow-hidden shadow-lg border border-navy-surface">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <span className="px-3 py-1 bg-white/10 rounded-lg text-sm font-bold backdrop-blur-sm">Match {upcomingMatches[0].round}</span>
                        <span className="text-sm font-medium text-white/70">{upcomingMatches[0].tournament?.tournamentName}</span>
                      </div>
                      <div className="flex items-center justify-between mt-8">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold mb-3 mx-auto">
                            {upcomingMatches[0].homeTeam?.username?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <p className="font-bold text-lg">{upcomingMatches[0].homeTeam?.username || 'TBD'}</p>
                        </div>
                        <div className="text-primary font-black text-2xl px-4">VS</div>
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold mb-3 mx-auto">
                            {upcomingMatches[0].awayTeam?.username?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <p className="font-bold text-lg">{upcomingMatches[0].awayTeam?.username || 'TBD'}</p>
                        </div>
                      </div>
                      <div className="mt-8 pt-6 border-t border-white/10 flex justify-between text-sm text-white/70">
                        <div className="flex items-center gap-2"><Calendar size={16}/> {upcomingMatches[0].matchDate ? new Date(upcomingMatches[0].matchDate).toLocaleDateString('en-GB') : 'TBD'}</div>
                        <div className="flex items-center gap-2"><MapPin size={16}/> {upcomingMatches[0].venueName || 'TBD'}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-warm-border p-8 text-center shadow-sm">
                    <div className="w-16 h-16 bg-warm-surface rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock size={24} className="text-text-muted" />
                    </div>
                    <p className="text-lg font-bold text-navy-dark mb-1">No upcoming matches</p>
                    <p className="text-text-muted mb-4">You don't have any scheduled matches at the moment.</p>
                    <Link to="/discover" className="text-primary font-bold hover:underline">Browse Tournaments</Link>
                  </div>
                )}
              </section>

              {/* Tournament Registrations */}
              <section>
                <h2 className="text-xl font-heading font-bold text-navy-dark mb-4">Recent Registrations</h2>
                <div className="bg-white rounded-3xl border border-warm-border/50 overflow-hidden shadow-sm relative group">
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
                  {registrations.length > 0 ? (
                    <div className="divide-y divide-warm-border/50 relative z-10">
                      {registrations.map(reg => (
                        <div key={reg.id} className="p-5 flex items-center justify-between hover:bg-warm-surface/50 transition-colors">
                          <div className="flex gap-4 items-center">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center shrink-0 border border-primary/10">
                              <Trophy size={18} />
                            </div>
                            <div>
                              <p className="font-bold text-navy-dark">{reg.tournament?.tournamentName}</p>
                              <p className="text-sm text-text-muted font-medium mt-0.5">{reg.tournament?.sportType} • Applied {new Date(reg.createdAt).toLocaleDateString('en-GB')}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide shadow-sm ${getStatusColor(reg.status)}`}>
                            {reg.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 text-center relative z-10">
                      <div className="w-16 h-16 bg-warm-surface rounded-full flex items-center justify-center mx-auto mb-4 border border-warm-border">
                        <Activity size={24} className="text-text-muted" />
                      </div>
                      <p className="text-lg font-bold text-navy-dark mb-1">No Registrations Yet</p>
                      <p className="text-text-muted">You haven't registered for any tournaments.</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Right Column (Narrower) */}
            <div className="space-y-8">
              
              {/* Quick Stats */}
              <section>
                <h2 className="text-xl font-heading font-bold text-navy-dark mb-4">My Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-warm-border/50 shadow-sm text-center relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/20 transition-all duration-500"></div>
                    <p className="text-3xl font-bold text-navy-dark mb-1 relative z-10">{registrations.filter(r => r.status === 'APPROVED').length}</p>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider relative z-10">Active Events</p>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-warm-border/50 shadow-sm text-center relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-secondary/10 rounded-full blur-xl group-hover:bg-secondary/20 transition-all duration-500"></div>
                    <p className="text-3xl font-bold text-navy-dark mb-1 relative z-10">{upcomingMatches.length}</p>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider relative z-10">Matches Left</p>
                  </div>
                </div>
              </section>
              
              {/* Next Events List */}
              {upcomingMatches.length > 1 && (
                <section>
                  <h2 className="text-xl font-bold mb-4">Looking Ahead</h2>
                  <div className="space-y-3">
                    {upcomingMatches.slice(1, 4).map(match => (
                      <div key={match.id} className="bg-white p-4 rounded-xl border border-warm-border shadow-sm flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-navy-dark truncate w-32">vs {match.homeTeamId === user.id ? match.awayTeam?.username : match.homeTeam?.username}</p>
                          <p className="text-xs text-text-muted">{new Date(match.matchDate).toLocaleDateString('en-GB')}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">M{match.round}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
            
          </div>
        )}
    </div>
  );
};

export default PlayerDashboard;
