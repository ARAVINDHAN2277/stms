import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, Swords, Activity, Settings, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

const TournamentManagement = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState({});

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/tournaments/${id}`, {
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
      await axios.patch(`http://localhost:5000/api/tournaments/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTournament({ ...tournament, status: newStatus });
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const handleParticipantStatus = async (regId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/tournaments/${id}/participants/${regId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTournament(prev => {
        const updatedRegs = prev.registrations.map(reg => 
          reg.id === regId ? { ...reg, status: newStatus } : reg
        );
        return { ...prev, registrations: updatedRegs };
      });
    } catch (err) {
      console.error(err);
      alert("Failed to update participant status");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("WARNING: Are you sure you want to completely delete this tournament? This action is permanent.")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/tournaments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        window.location.href = "/organiser/tournaments";
      } catch (err) {
        console.error(err);
        alert("Failed to delete tournament");
      }
    }
  };

  const handleGenerateSchedule = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/tournaments/${id}/schedule`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Schedule generated successfully!");
      // Re-fetch to get matches
      const res = await axios.get(`http://localhost:5000/api/tournaments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTournament(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to generate schedule. Make sure players are registered.");
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
      alert("Please enter both scores before saving.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:5000/api/tournaments/${id}/matches/${matchId}`, {
        homeTeamScore: matchScores.home,
        awayTeamScore: matchScores.away
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Score saved successfully!");
      // re-fetch to update
      const res = await axios.get(`http://localhost:5000/api/tournaments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTournament(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to save score");
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

  return (
    <div className="max-w-6xl mx-auto py-6">
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
        {activeTab === "overview" && (
          <div className="p-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-navy-dark mb-4">Tournament Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-warm-surface rounded-xl border border-warm-border">
                <p className="text-sm text-text-muted">Total Registrations</p>
                <p className="text-3xl font-bold text-navy-dark mt-1">{tournament.registrations?.length || 0}</p>
              </div>
              <div className="p-4 bg-warm-surface rounded-xl border border-warm-border">
                <p className="text-sm text-text-muted">Matches Scheduled</p>
                <p className="text-3xl font-bold text-navy-dark mt-1">0</p>
              </div>
              <div className="p-4 bg-warm-surface rounded-xl border border-warm-border">
                <p className="text-sm text-text-muted">Revenue Generated</p>
                <p className="text-3xl font-bold text-navy-dark mt-1">₹{(tournament.registrations?.length || 0) * (tournament.registrationFee || 0)}</p>
              </div>
            </div>
          </div>
        )}

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
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-navy-dark">
                  {tournament.registrations?.length > 0 ? tournament.registrations.map((reg) => (
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
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          reg.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {reg.paymentStatus || "PENDING"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        {reg.status !== 'APPROVED' && (
                          <button 
                            onClick={() => handleParticipantStatus(reg.id, 'APPROVED')}
                            title="Approve"
                            className="text-green-600 hover:text-green-800"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {reg.status !== 'REJECTED' && (
                          <button 
                            onClick={() => handleParticipantStatus(reg.id, 'REJECTED')}
                            title="Reject"
                            className="text-red-500 hover:text-red-700"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-text-muted">No participants registered yet.</td>
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
                  onClick={handleGenerateSchedule}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover shadow-md transition-colors"
                >
                  Generate Schedule
                </button>
              )}
            </div>
            {tournament.matches && tournament.matches.length > 0 ? (
              <div className="space-y-4">
                {tournament.matches.map(match => (
                  <div key={match.id} className="p-4 bg-warm-surface border border-warm-border rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-navy-dark">Round {match.round}</p>
                      <p className="text-xs text-text-muted">{new Date(match.matchDate).toLocaleDateString()} @ {match.venueName}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">{match.homeTeamScore !== null ? match.homeTeamScore : '-'}</span>
                      <span className="text-text-muted">vs</span>
                      <span className="font-bold">{match.awayTeamScore !== null ? match.awayTeamScore : '-'}</span>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs rounded-md ${
                        match.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {match.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
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
            {tournament.matches && tournament.matches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tournament.matches.filter(m => m.status !== "COMPLETED").map(match => (
                  <div key={match.id} className="p-5 border border-warm-border rounded-xl bg-warm-surface flex flex-col gap-4">
                    <div className="flex justify-between text-sm text-text-muted font-medium">
                      <span>Round {match.round}</span>
                      <span>{match.venueName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-center w-[40%]">
                        <p className="font-bold text-navy-dark mb-2 truncate">{match.homeTeam?.username}</p>
                        <input 
                          type="number" 
                          placeholder={match.homeTeamScore !== null ? match.homeTeamScore : "0"}
                          value={scores[match.id]?.home || ''}
                          onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                          className="w-16 text-center p-2 rounded border focus:ring-2 focus:ring-primary outline-none font-bold text-lg bg-white" 
                        />
                      </div>
                      <div className="font-bold text-text-muted">VS</div>
                      <div className="text-center w-[40%]">
                        <p className="font-bold text-navy-dark mb-2 truncate">{match.awayTeam?.username}</p>
                        <input 
                          type="number" 
                          placeholder={match.awayTeamScore !== null ? match.awayTeamScore : "0"}
                          value={scores[match.id]?.away || ''}
                          onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                          className="w-16 text-center p-2 rounded border focus:ring-2 focus:ring-primary outline-none font-bold text-lg bg-white" 
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => handleSaveScore(match.id)}
                      className="w-full mt-2 py-2 bg-navy-dark text-white rounded-lg font-medium hover:bg-navy-surface transition-colors"
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
                  onClick={() => handleUpdateStatus("REGISTRATION_OPEN")}
                  className="w-full text-left px-4 py-3 rounded-lg border border-primary text-primary font-medium hover:bg-primary hover:text-white transition-colors"
                >
                  Open Registration
                </button>
              )}
              {tournament.status === "REGISTRATION_OPEN" && (
                <button 
                  onClick={() => handleUpdateStatus("REGISTRATION_CLOSED")}
                  className="w-full text-left px-4 py-3 rounded-lg border border-warm-border font-medium hover:border-primary hover:text-primary transition-colors"
                >
                  Close Registration
                </button>
              )}
              {tournament.status === "REGISTRATION_CLOSED" && (
                <button 
                  onClick={() => handleUpdateStatus("LIVE")}
                  className="w-full text-left px-4 py-3 rounded-lg border border-primary text-primary font-medium hover:bg-primary hover:text-white transition-colors"
                >
                  Start Tournament (Go Live)
                </button>
              )}
              <button 
                onClick={handleDelete}
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
