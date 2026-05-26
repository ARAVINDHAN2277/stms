import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, Swords, Activity, Settings, CheckCircle, XCircle, AlertTriangle, Trophy } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';
import BracketTree from "../components/BracketTree";

const TournamentManagement = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState({});
  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', actionFn: null, actionText: '', isDanger: false });

  const confirmAction = (title, message, actionText, actionFn, isDanger = false) => {
    setConfirmModal({ isOpen: true, title, message, actionText, actionFn, isDanger });
  };

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/tournaments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTournament(res.data);
      } catch (err) {
        console.error("Error fetching tournament:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTournament();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`/api/tournaments/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTournament({ ...tournament, status: newStatus });
    } catch (err) {
      console.error(err);
      confirmAction("Error", "Failed to update status", "OK", () => {}, true);
    }
  };

  const handleParticipantStatus = async (regId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/tournaments/${id}/participants/${regId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      let newApprovedCount = 0;
      let maxPlayers = tournament.maxParticipants;
      
      setTournament(prev => {
        const updatedRegs = prev.registrations.map(reg => 
          reg.id === regId ? { ...reg, status: newStatus } : reg
        );
        newApprovedCount = updatedRegs.filter(r => r.status === 'APPROVED').length;
        return { ...prev, registrations: updatedRegs };
      });

      if (newStatus === 'APPROVED' && maxPlayers && newApprovedCount >= maxPlayers) {
        setTimeout(() => {
          confirmAction(
            "Max Capacity Reached!",
            `You have just approved ${newApprovedCount} players, hitting your maximum set capacity of ${maxPlayers}. Do you want to officially Close Registration now to prevent further signups?`,
            "Close Registration",
            () => handleUpdateStatus("REGISTRATION_CLOSED")
          );
        }, 300);
      }
    } catch (err) {
      console.error(err);
      confirmAction("Error", "Failed to update participant status", "OK", () => {}, true);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/tournaments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.href = "/organiser/tournaments";
    } catch (err) {
      console.error(err);
      confirmAction("Error", "Failed to delete tournament", "OK", () => {}, true);
    }
  };

  const handleGenerateSchedule = async (format) => {
    try {
      const token = localStorage.getItem("token");
      setIsFormatModalOpen(false);
      await axios.post(`/api/tournaments/${id}/schedule`, { format }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      confirmAction("Success", "Schedule generated successfully!", "OK", () => {});
      // Re-fetch to get matches
      const res = await axios.get(`/api/tournaments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTournament(res.data);
    } catch (err) {
      console.error(err);
      confirmAction("Error", "Failed to generate schedule. Make sure players are registered.", "OK", () => {}, true);
    }
  };

  const handleScoreChange = (matchId, team, value) => {
    setScores(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: value
      }
    }));
  };

  const handleSaveScore = async (matchId) => {
    const matchScores = scores[matchId];
    if (!matchScores || matchScores.home === undefined || matchScores.away === undefined) {
      confirmAction("Attention", "Please enter both scores before saving.", "OK", () => {});
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`/api/tournaments/${id}/matches/${matchId}`, {
        homeTeamScore: matchScores.home,
        awayTeamScore: matchScores.away
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      confirmAction("Success", "Score saved successfully!", "OK", () => {});
      // re-fetch to update
      const res = await axios.get(`/api/tournaments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTournament(res.data);
    } catch (err) {
      console.error(err);
      confirmAction("Error", "Failed to save score", "OK", () => {}, true);
    }
  };

  if (loading) return <div className="p-8 text-center text-text-muted">Loading tournament data...</div>;
  if (!tournament) return <div className="p-8 text-center text-red-500">Tournament not found</div>;

  const tabs = [
    { id: "overview", label: "Overview", icon: <Activity size={18} /> },
    { id: "participants", label: "Participants", icon: <Users size={18} /> },
    { id: "matches", label: "Matches", icon: <Swords size={18} /> },
    { id: "scoring", label: "Scoring", icon: <CheckCircle size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  // Calculate Standings if ROUND_ROBIN
  let standings = [];
  if (tournament.format === 'ROUND_ROBIN' && tournament.matches) {
    const standingsMap = {};
    const approvedPlayers = tournament.registrations?.filter(r => r.status === 'APPROVED' && r.user).map(r => r.user) || [];
    
    approvedPlayers.forEach(player => {
      if (!player) return;
      standingsMap[player.id] = {
        player: player,
        played: 0,
        won: 0,
        lost: 0,
        points: 0
      };
    });

    tournament.matches.filter(m => m.status === 'COMPLETED' && m.roundName !== 'Final').forEach(m => {
      if (standingsMap[m.homeTeamId] && standingsMap[m.awayTeamId]) {
        standingsMap[m.homeTeamId].played += 1;
        standingsMap[m.awayTeamId].played += 1;
        
        if (m.homeTeamScore > m.awayTeamScore) {
          standingsMap[m.homeTeamId].won += 1;
          standingsMap[m.homeTeamId].points += 3;
          standingsMap[m.awayTeamId].lost += 1;
        } else if (m.homeTeamScore < m.awayTeamScore) {
          standingsMap[m.awayTeamId].won += 1;
          standingsMap[m.awayTeamId].points += 3;
          standingsMap[m.homeTeamId].lost += 1;
        } else {
          standingsMap[m.homeTeamId].points += 1;
          standingsMap[m.awayTeamId].points += 1;
        }
      }
    });
    standings = Object.values(standingsMap).sort((a, b) => b.points - a.points || b.won - a.won);
  }

  // Determine Overall Winner if COMPLETED
  let tournamentWinner = null;
  if (tournament.status === 'COMPLETED' && tournament.matches) {
    const finalMatch = tournament.matches.find(m => m.roundName === 'Final' || (tournament.format === 'KNOCKOUT' && m.roundName === 'Final'));
    if (finalMatch && finalMatch.status === 'COMPLETED') {
      tournamentWinner = finalMatch.winnerId === finalMatch.homeTeamId ? finalMatch.homeTeam?.username : finalMatch.awayTeam?.username;
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-6">
      
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

      {/* Format Selection Modal */}
      <AnimatePresence>
        {isFormatModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy-dark/40 backdrop-blur-sm"
              onClick={() => setIsFormatModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 overflow-hidden border border-warm-border"
            >
              <div className="p-8">
                <h3 className="text-2xl font-heading font-black text-navy-dark mb-2 text-center">Choose Tournament Format</h3>
                <p className="text-text-muted text-center mb-8">Select how you want the matches to be scheduled.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleGenerateSchedule("ROUND_ROBIN")}
                    className="p-6 rounded-xl border-2 border-warm-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                      <Activity size={24} />
                    </div>
                    <h4 className="text-lg font-bold text-navy-dark mb-2">Round Robin</h4>
                    <p className="text-sm text-text-muted">Every player plays against everyone else in the league. Standings determine the finalists.</p>
                  </button>

                  <button 
                    onClick={() => handleGenerateSchedule("KNOCKOUT")}
                    className="p-6 rounded-xl border-2 border-warm-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                      <Swords size={24} />
                    </div>
                    <h4 className="text-lg font-bold text-navy-dark mb-2">Knockout Bracket</h4>
                    <p className="text-sm text-text-muted">Single elimination. Losers go home, winners advance through the brackets.</p>
                  </button>
                </div>

                <div className="mt-8 text-center">
                  <button 
                    onClick={() => setIsFormatModalOpen(false)}
                    className="text-text-muted hover:text-navy-dark font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/organiser/tournaments" className="p-2 bg-white rounded-full border border-warm-border hover:bg-warm-surface transition-colors">
          <ArrowLeft size={20} className="text-navy-dark" />
        </Link>
        <div>
          <h2 className="text-2xl font-heading font-bold text-navy-dark">{tournament.tournamentName}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="px-2 py-1 text-xs font-medium rounded-md bg-green-100 text-green-700">
              {tournament.status?.replace("_", " ") || "DRAFT"}
            </span>
            <span className="text-sm text-text-muted">{tournament.sportType}</span>
          </div>
        </div>
      </div>

      {tournamentWinner && (
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-yellow-50 to-amber-100 border border-amber-200 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-amber-400 flex items-center justify-center text-white shadow-inner">
            <Trophy size={32} />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-700 uppercase tracking-widest mb-1">Tournament Winner</p>
            <p className="text-3xl font-black font-heading text-navy-dark">{tournamentWinner}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-warm-border mb-6 no-scrollbar pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-text-muted hover:text-navy-dark hover:border-warm-border"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Areas */}
      <div className="bg-white rounded-2xl border border-warm-border shadow-sm min-h-[400px]">
        {activeTab === "overview" && (() => {
          const approvedCount = tournament.registrations?.filter(r => r.status === 'APPROVED').length || 0;
          const pendingCount = tournament.registrations?.filter(r => r.status === 'PENDING').length || 0;
          
          return (
            <div className="p-6 animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-navy-dark mb-4">Tournament Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-warm-surface rounded-xl border border-warm-border">
                  <p className="text-sm text-text-muted">Approved Players</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-3xl font-bold text-navy-dark">{approvedCount}</p>
                    {pendingCount > 0 && (
                      <span className="text-sm font-medium text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-md">
                        {pendingCount} pending
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 bg-warm-surface rounded-xl border border-warm-border">
                  <p className="text-sm text-text-muted">Matches Scheduled</p>
                  <p className="text-3xl font-bold text-navy-dark mt-1">{tournament.matches?.length || 0}</p>
                </div>
                <div className="p-4 bg-warm-surface rounded-xl border border-warm-border">
                  <p className="text-sm text-text-muted">Expected Revenue</p>
                  <p className="text-3xl font-bold text-navy-dark mt-1">₹{approvedCount * (tournament.registrationFee || 0)}</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-navy-dark mb-4">Tournament Details</h3>
              <div className="bg-warm-surface rounded-xl border border-warm-border p-5">
                <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
                  <div>
                    <dt className="text-sm font-medium text-text-muted">Tournament Name</dt>
                    <dd className="mt-1 text-base text-navy-dark font-medium">{tournament.tournamentName || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-text-muted">Sport</dt>
                    <dd className="mt-1 text-base text-navy-dark font-medium">{tournament.sportType || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-text-muted">Registration Fee</dt>
                    <dd className="mt-1 text-base text-navy-dark font-medium">₹{tournament.registrationFee || "0"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-text-muted">Max Participants</dt>
                    <dd className="mt-1 text-base text-navy-dark font-medium">{tournament.maxParticipants || "Unlimited"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-text-muted">Venue</dt>
                    <dd className="mt-1 text-base text-navy-dark font-medium">
                      {tournament.venueName ? `${tournament.venueName}${tournament.stateDistrict ? `, ${tournament.stateDistrict}` : ''}` : "TBD"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-text-muted">Dates</dt>
                    <dd className="mt-1 text-base text-navy-dark font-medium">
                      {tournament.startDate ? (
                        tournament.startDate === tournament.endDate 
                          ? new Date(tournament.startDate).toLocaleDateString('en-GB') 
                          : `${new Date(tournament.startDate).toLocaleDateString('en-GB')} to ${tournament.endDate ? new Date(tournament.endDate).toLocaleDateString('en-GB') : "TBD"}`
                      ) : "TBD"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-text-muted">Registration Deadline</dt>
                    <dd className="mt-1 text-base text-navy-dark font-medium">
                      {tournament.deadline ? new Date(tournament.deadline).toLocaleDateString('en-GB') : "TBD"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          );
        })()}

        {activeTab === "participants" && (
          <div className="p-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-navy-dark">Manage Participants</h3>
            </div>
            
            {/* Mock Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-warm-border text-sm text-text-muted">
                    <th className="py-3 px-4 font-medium">Player</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Payment</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-text-muted uppercase tracking-wider">Date Joined</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-navy-dark">
                  {tournament.registrations?.length > 0 ? tournament.registrations.map(reg => {
                    let isEliminated = false;
                    if (tournament.format === 'KNOCKOUT' && tournament.matches && reg.user?.id) {
                      isEliminated = tournament.matches.some(m => 
                        m.status === 'COMPLETED' && m.winnerId && 
                        (m.homeTeamId === reg.user.id || m.awayTeamId === reg.user.id) && 
                        m.winnerId !== reg.user.id
                      );
                    }

                    return (
                      <tr key={reg.id} className="border-b border-warm-surface hover:bg-warm-bg/50 transition-colors">
                        <td className="py-4 px-4 font-medium">{reg.user?.username || "Unknown"}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            reg.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            reg.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {reg.status || "PENDING"}
                          </span>
                          {isEliminated && (
                            <span className="ml-2 px-2 py-1 text-xs font-bold rounded-md bg-gray-200 text-gray-700 uppercase">
                              Eliminated
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            reg.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {reg.paymentStatus || "PENDING"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-text-muted">{new Date(reg.createdAt).toLocaleDateString('en-GB')}</td>
                        <td className="py-4 px-4 text-right space-x-2">
                          {reg.status !== 'APPROVED' && (
                            <button 
                              onClick={() => handleParticipantStatus(reg.id, 'APPROVED')}
                              title="Approve"
                              className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 font-medium text-xs transition-colors"
                            >
                              Approve
                            </button>
                          )}
                          {reg.status !== 'REJECTED' && (
                            <button 
                              onClick={() => handleParticipantStatus(reg.id, 'REJECTED')}
                              title="Reject"
                              className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 font-medium text-xs transition-colors"
                            >
                              Reject
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-text-muted">No participants registered yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "matches" && (
          <div className="p-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-navy-dark">Schedule & Logistics</h3>
              {(!tournament.matches || tournament.matches.length === 0) && tournament.status === "REGISTRATION_CLOSED" && (
                <button 
                  onClick={() => setIsFormatModalOpen(true)}
                  className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover shadow-md transition-colors flex items-center gap-2"
                >
                  <Activity size={16} /> Generate Schedule
                </button>
              )}
            </div>
            {tournament.matches && tournament.matches.length > 0 ? (
              tournament.format === 'KNOCKOUT' ? (
                <div className="bg-warm-surface rounded-xl border border-warm-border p-4">
                  <BracketTree matches={tournament.matches} />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <h4 className="font-bold text-navy-dark mb-4 border-b border-warm-border pb-2">Schedule</h4>
                    {tournament.matches.map(match => (
                      <div key={match.id} className={`p-4 border rounded-xl flex justify-between items-center ${match.roundName === 'Final' ? 'bg-amber-50 border-amber-200' : 'bg-warm-surface border-warm-border'}`}>
                        <div>
                          <p className="text-sm font-bold text-navy-dark">{match.roundName || `Match ${match.round}`}</p>
                          <p className="text-xs text-text-muted">{new Date(match.matchDate).toLocaleDateString('en-GB')}</p>
                        </div>
                        <div className="flex flex-col items-center flex-1 mx-4">
                          <div className="flex items-center gap-4">
                            <span className={`font-bold w-24 text-right truncate ${match.winnerId && match.winnerId === match.homeTeamId ? 'text-primary' : 'text-navy-dark'}`}>{match.homeTeam?.username || 'TBD'}</span>
                            <div className="flex items-center gap-2">
                              <span className="w-8 h-8 rounded bg-white border border-warm-border flex items-center justify-center font-bold text-sm">
                                {match.homeTeamScore !== null ? match.homeTeamScore : '-'}
                              </span>
                              <span className="text-xs text-text-muted font-medium mx-1">VS</span>
                              <span className="w-8 h-8 rounded bg-white border border-warm-border flex items-center justify-center font-bold text-sm">
                                {match.awayTeamScore !== null ? match.awayTeamScore : '-'}
                              </span>
                            </div>
                            <span className={`font-bold w-24 text-left truncate ${match.winnerId && match.winnerId === match.awayTeamId ? 'text-primary' : 'text-navy-dark'}`}>{match.awayTeam?.username || 'TBD'}</span>
                          </div>
                        </div>
                        <div>
                          <span className={`px-2 py-1 text-xs rounded-md font-semibold ${
                            match.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {match.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Standings Table */}
                  <div className="bg-white rounded-xl border border-warm-border shadow-sm p-4 h-fit">
                    <h4 className="font-bold text-navy-dark mb-4 border-b border-warm-border pb-2">League Standings</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-text-muted uppercase border-b border-warm-border">
                          <tr>
                            <th className="px-2 py-2">#</th>
                            <th className="px-2 py-2">Player</th>
                            <th className="px-2 py-2 text-center">W-L</th>
                            <th className="px-2 py-2 text-center text-primary font-black">Pts</th>
                          </tr>
                        </thead>
                        <tbody>
                          {standings.map((s, idx) => (
                            <tr key={s.player.id} className="border-b border-warm-border/50 last:border-0 hover:bg-warm-surface/50">
                              <td className="px-2 py-3 font-bold text-navy-dark/50">{idx + 1}</td>
                              <td className="px-2 py-3 font-bold text-navy-dark truncate max-w-[100px]">{s.player.username}</td>
                              <td className="px-2 py-3 text-center font-medium text-text-muted">
                                {s.won}-{s.lost}
                              </td>
                              <td className="px-2 py-3 text-center text-primary font-black text-base">{s.points}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <Swords className="mx-auto text-warm-border mb-3" size={48} />
                <p className="text-text-muted">No matches scheduled yet. Close registration to generate bracket.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "scoring" && (
          <div className="p-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-navy-dark mb-6">Live Match Scoring</h3>
            {tournament.status !== "LIVE" && tournament.status !== "COMPLETED" ? (
              <div className="text-center py-12 text-text-muted bg-warm-surface rounded-xl border border-warm-border">
                <p className="text-lg font-bold text-navy-dark mb-2">Tournament Not Started</p>
                <p>Please start the tournament in the Settings tab to begin entering live scores.</p>
              </div>
            ) : tournament.matches && tournament.matches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tournament.matches.filter(m => m.status !== "COMPLETED").map(match => (
                  <div key={match.id} className="p-5 border border-warm-border rounded-xl bg-warm-surface flex flex-col gap-4">
                    <div className="flex justify-between text-sm text-text-muted font-medium mb-2">
                      <span>{match.roundName || `Match ${match.round}`}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-center w-[40%]">
                        <p className="font-bold text-navy-dark mb-2 truncate">{match.homeTeam?.username || 'TBD'}</p>
                        <input 
                          type="number" 
                          placeholder={match.homeTeamScore !== null ? match.homeTeamScore : "0"}
                          value={scores[match.id]?.home || ''}
                          onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                          className="w-16 text-center p-2 rounded border focus:ring-2 focus:ring-primary outline-none font-bold text-lg bg-white" 
                          disabled={!match.homeTeamId || !match.awayTeamId}
                        />
                      </div>
                      <div className="font-bold text-text-muted">VS</div>
                      <div className="text-center w-[40%]">
                        <p className="font-bold text-navy-dark mb-2 truncate">{match.awayTeam?.username || 'TBD'}</p>
                        <input 
                          type="number" 
                          placeholder={match.awayTeamScore !== null ? match.awayTeamScore : "0"}
                          value={scores[match.id]?.away || ''}
                          onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                          className="w-16 text-center p-2 rounded border focus:ring-2 focus:ring-primary outline-none font-bold text-lg bg-white" 
                          disabled={!match.homeTeamId || !match.awayTeamId}
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => handleSaveScore(match.id)}
                      disabled={!match.homeTeamId || !match.awayTeamId}
                      className="w-full mt-2 py-2 bg-navy-dark text-white rounded-lg font-medium hover:bg-navy-surface transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Save Score
                    </button>
                  </div>
                ))}
                {tournament.matches.filter(m => m.status !== "COMPLETED").length === 0 && (
                   <div className="col-span-full text-center py-12 text-text-muted">
                     All matches have been scored!
                   </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-text-muted">
                No active matches to score.
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="p-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-navy-dark mb-6">Tournament Settings</h3>
            <div className="max-w-md space-y-4">
              {tournament.status === "DRAFT" && (
                <button 
                  onClick={() => confirmAction(
                    "Open Registration?",
                    "Players will now be able to discover this tournament and apply to join. You can close registration at any time.",
                    "Open Registration",
                    () => handleUpdateStatus("REGISTRATION_OPEN")
                  )}
                  className="w-full text-left px-4 py-3 rounded-lg border border-primary text-primary font-medium hover:bg-primary hover:text-white transition-colors"
                >
                  Open Registration
                </button>
              )}
              {tournament.status === "REGISTRATION_OPEN" && (
                <button 
                  onClick={() => confirmAction(
                    "Close Registration?",
                    "Players will no longer be able to apply. You can then review pending participants and generate the schedule.",
                    "Close Registration",
                    () => handleUpdateStatus("REGISTRATION_CLOSED")
                  )}
                  className="w-full text-left px-4 py-3 rounded-lg border border-warm-border font-medium hover:border-primary hover:text-primary transition-colors"
                >
                  Close Registration
                </button>
              )}
              {tournament.status === "REGISTRATION_CLOSED" && (
                <button 
                  onClick={() => confirmAction(
                    "Start Tournament?",
                    "Are you ready to go LIVE? This will notify players that the tournament has officially begun.",
                    "Go Live",
                    () => handleUpdateStatus("LIVE")
                  )}
                  className="w-full text-left px-4 py-3 rounded-lg border border-primary text-primary font-medium hover:bg-primary hover:text-white transition-colors"
                >
                  Start Tournament (Go Live)
                </button>
              )}
              {tournament.status === "LIVE" && (
                <button 
                  onClick={() => confirmAction(
                    "Complete Tournament?",
                    "Are you sure you want to mark this tournament as COMPLETED? This will freeze all scores and declare the final winner.",
                    "Complete Tournament",
                    () => handleUpdateStatus("COMPLETED")
                  )}
                  className="w-full text-left px-4 py-3 rounded-lg border border-primary bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
                >
                  Complete Tournament
                </button>
              )}
              <button 
                onClick={() => confirmAction(
                  "Delete Tournament?",
                  "This action is permanent and cannot be undone. All registrations, matches, and data associated with this tournament will be destroyed.",
                  "Yes, Delete Tournament",
                  handleDelete,
                  true // isDanger
                )}
                className="w-full text-left px-4 py-3 rounded-lg border border-red-500 bg-red-50 text-red-600 font-bold hover:bg-red-500 hover:text-white transition-colors"
              >
                Delete Tournament
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TournamentManagement;
