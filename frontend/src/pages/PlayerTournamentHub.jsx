import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Swords, Calendar, MapPin, Trophy, Users } from "lucide-react";
import axios from "axios";
import BracketTree from "../components/BracketTree";
import AuthContext from "../context/AuthContext";

const PlayerTournamentHub = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTournamentDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/tournaments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTournament(res.data);
      } catch (err) {
        console.error("Error fetching tournament details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTournamentDetails();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center text-text-muted">Loading tournament hub...</div>;
  }

  if (!tournament) {
    return <div className="p-10 text-center text-red-500">Tournament not found</div>;
  }

  // Filter matches involving this player
  const playerMatches = tournament.matches?.filter(m => m.homeTeamId === user.id || m.awayTeamId === user.id) || [];
  
  // Calculate standings based on matches
  const standingsMap = {};
  tournament.registrations?.filter(r => r.status === 'APPROVED').forEach(r => {
    standingsMap[r.user.id] = {
      id: r.user.id,
      username: r.user.username,
      played: 0,
      won: 0,
      lost: 0,
      points: 0
    };
  });

  tournament.matches?.filter(m => m.status === 'COMPLETED' && m.roundName !== 'Final').forEach(m => {
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
        // Draw
        standingsMap[m.homeTeamId].points += 1;
        standingsMap[m.awayTeamId].points += 1;
      }
    }
  });

  const standings = Object.values(standingsMap).sort((a, b) => b.points - a.points || b.won - a.won);

  // Determine Overall Winner if COMPLETED
  let tournamentWinner = null;
  if (tournament.status === 'COMPLETED' && tournament.matches) {
    const finalMatch = tournament.matches.find(m => m.roundName === 'Final' || (tournament.format === 'KNOCKOUT' && m.roundName === 'Final'));
    if (finalMatch && finalMatch.status === 'COMPLETED') {
      tournamentWinner = finalMatch.winnerId === finalMatch.homeTeamId ? finalMatch.homeTeam?.username : finalMatch.awayTeam?.username;
    }
  }

  // Determine if current player is eliminated (for KNOCKOUT)
  let isEliminated = false;
  if (tournament.format === 'KNOCKOUT' && tournament.matches) {
    isEliminated = tournament.matches.some(m => 
      m.status === 'COMPLETED' && m.winnerId && 
      (m.homeTeamId === user.id || m.awayTeamId === user.id) && 
      m.winnerId !== user.id
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <Link to="/my-tournaments" className="inline-flex items-center gap-2 text-text-muted hover:text-navy-dark transition-colors mb-6 font-medium">
        <ArrowLeft size={16} /> Back to My Tournaments
      </Link>

      <div className="bg-navy-dark rounded-3xl p-8 md:p-12 text-white relative overflow-hidden mb-10 shadow-lg border border-navy-surface">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-white/10 rounded-lg text-sm font-bold tracking-wide uppercase inline-block">
              {tournament.sportType}
            </span>
            {isEliminated && (
              <span className="px-3 py-1 bg-red-500/20 text-red-200 border border-red-500/30 rounded-lg text-sm font-bold tracking-wide uppercase inline-block shadow-sm">
                Eliminated
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight mb-4">
            {tournament.tournamentName}
          </h1>
          <div className="flex flex-wrap gap-6 text-white/70 text-sm font-medium">
            <div className="flex items-center gap-2"><MapPin size={18} /> {tournament.venueName || tournament.stateDistrict}</div>
            <div className="flex items-center gap-2"><Calendar size={18} /> {new Date(tournament.startDate).toLocaleDateString('en-GB')}</div>
            <div className="flex items-center gap-2"><Users size={18} /> {tournament.registrations?.filter(r => r.status === 'APPROVED').length} Players</div>
          </div>
        </div>
      </div>

      {tournamentWinner && (
        <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-yellow-50 to-amber-100 border border-amber-200 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-amber-400 flex items-center justify-center text-white shadow-inner">
            <Trophy size={32} />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-700 uppercase tracking-widest mb-1">Tournament Winner</p>
            <p className="text-3xl font-black font-heading text-navy-dark">{tournamentWinner}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: My Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-navy-dark flex items-center gap-2">
            <Calendar className="text-primary" size={24} /> My Schedule
          </h2>
          
          <div className="bg-white rounded-2xl border border-warm-border shadow-sm overflow-hidden">
            {tournament.format === 'KNOCKOUT' ? (
              <div className="p-6">
                <BracketTree matches={tournament.matches} />
              </div>
            ) : playerMatches.length > 0 ? (
              <div className="divide-y divide-warm-border">
                {playerMatches.map(match => {
                  const isHome = match.homeTeamId === user.id;
                  const opponent = isHome ? match.awayTeam : match.homeTeam;
                  const myScore = isHome ? match.homeTeamScore : match.awayTeamScore;
                  const opScore = isHome ? match.awayTeamScore : match.homeTeamScore;
                  
                  return (
                    <div key={match.id} className="p-6 hover:bg-warm-surface transition-colors flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Match {match.round}</p>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-navy-dark text-white flex items-center justify-center font-bold">
                            {opponent?.username?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-lg text-navy-dark">vs {opponent?.username}</p>
                            <p className="text-sm text-text-muted">{new Date(match.matchDate).toLocaleDateString('en-GB')}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {match.status === 'COMPLETED' ? (
                          <div className="inline-flex flex-col items-end">
                            <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600 mb-2">{match.status}</span>
                            <div className="text-xl font-black font-heading text-navy-dark tracking-wider">
                              <span className={myScore > opScore ? "text-primary" : ""}>{myScore !== null ? myScore : '-'}</span>
                              <span className="text-text-muted mx-2">-</span>
                              <span className={opScore > myScore ? "text-primary" : ""}>{opScore !== null ? opScore : '-'}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold">UPCOMING</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Swords className="mx-auto text-warm-border mb-4" size={48} />
                <p className="text-lg font-bold text-navy-dark mb-1">Schedule Pending</p>
                <p className="text-text-muted">The organizer hasn't generated the match schedule yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Standings */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-navy-dark flex items-center gap-2">
            <Trophy className="text-primary" size={24} /> Standings
          </h2>
          
          <div className="bg-white rounded-2xl border border-warm-border shadow-sm overflow-hidden">
            {standings.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-warm-bg text-text-muted text-xs uppercase tracking-wider">
                    <th className="p-4 font-bold w-8">#</th>
                    <th className="p-4 font-bold">Player</th>
                    <th className="p-4 font-bold text-center">W-L</th>
                    <th className="p-4 font-bold text-right">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-border text-sm">
                  {standings.map((player, index) => (
                    <tr key={player.id} className={player.id === user.id ? "bg-primary/5" : ""}>
                      <td className="p-4 font-bold text-text-muted">{index + 1}</td>
                      <td className={`p-4 font-bold ${player.id === user.id ? "text-primary" : "text-navy-dark"}`}>
                        {player.username} {player.id === user.id && "(You)"}
                      </td>
                      <td className="p-4 text-center text-text-muted">{player.won}-{player.lost}</td>
                      <td className="p-4 font-black text-right text-navy-dark">{player.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-text-muted">No players approved yet.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlayerTournamentHub;
