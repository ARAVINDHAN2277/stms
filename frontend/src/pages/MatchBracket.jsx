import React, { useState } from 'react';
import axios from 'axios';
import { Trophy } from 'lucide-react';

const MatchBracket = ({ tournamentId, matches, fetchDashboardData }) => {
  const [generating, setGenerating] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/tournaments/${tournamentId}/schedule`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDashboardData();
    } catch (e) {
      alert("Failed to generate bracket.");
    } finally {
      setGenerating(false);
    }
  };

  const handleMatchClick = (match) => {
    if (match.status === 'Completed') return;
    const isSquad = match.squad1Id || match.squad2Id;
    if (isSquad) {
        if (!match.squad1Id || !match.squad2Id) return;
    } else {
        if (!match.player1Id || !match.player2Id) return;
    }
    setSelectedMatch(match);
    setP1Score(match.player1Score || 0);
    setP2Score(match.player2Score || 0);
  };

  const handleScoreUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      let winnerId = null;
      let winnerSquadId = null;
      let status = 'Completed';
      
      const isSquad = selectedMatch.squad1Id || selectedMatch.squad2Id;

      if (Number(p1Score) > Number(p2Score)) {
          if (isSquad) winnerSquadId = selectedMatch.squad1Id;
          else winnerId = selectedMatch.player1Id;
      } else if (Number(p2Score) > Number(p1Score)) {
          if (isSquad) winnerSquadId = selectedMatch.squad2Id;
          else winnerId = selectedMatch.player2Id;
      } else {
          status = 'Ongoing';
      }

      if(status === 'Completed' && winnerId === null && winnerSquadId === null) {
          alert("A match must have a clear winner (no draws)."); return;
      }

      await axios.patch(`http://localhost:5000/api/tournaments/match/${selectedMatch.id}`, {
        player1Score: Number(p1Score),
        player2Score: Number(p2Score),
        status,
        winnerId,
        winnerSquadId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSelectedMatch(null);
      fetchDashboardData();
    } catch (err) {
      alert("Failed to update score.");
    }
  };

  if (!matches || matches.length === 0) {
    return (
      <div className="bg-[#111116] border border-white/5 rounded-sm shadow-xl p-6 text-center py-24">
         <Trophy className="w-16 h-16 text-emerald-500 mx-auto mb-4 opacity-50" />
         <h3 className="text-white font-black text-2xl uppercase tracking-widest mb-2">Interactive Brackets</h3>
         <p className="text-gray-400 mb-8 max-w-lg mx-auto">Lock in the participant roster to initialize the matchmaking matrix. A randomized Single-Elimination tree will be compiled automatically.</p>
         <button 
           onClick={handleGenerate}
           disabled={generating}
           className="px-8 py-4 font-black tracking-widest text-white uppercase text-sm bg-emerald-600 rounded-sm hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all disabled:opacity-50"
         >
           {generating ? "Initializing Matrix..." : "Generate Bracket"}
         </button>
      </div>
    );
  }

  const rounds = {};
  matches.forEach(m => {
    if (!rounds[m.round]) rounds[m.round] = [];
    rounds[m.round].push(m);
  });
  
  const roundKeys = Object.keys(rounds).sort((a,b) => Number(a) - Number(b));

  return (
    <div className="bg-[#111116] border border-white/5 rounded-sm shadow-xl p-6 overflow-x-auto min-h-[500px]">
       <h3 className="text-white font-black text-xl uppercase tracking-widest mb-8 flex items-center">
          <Trophy className="w-5 h-5 mr-3 text-emerald-500" /> Tournament Tree
       </h3>
       
       <div className="flex space-x-12 min-w-max pb-8">
         {roundKeys.map((roundNum) => (
           <div key={roundNum} className="flex flex-col space-y-8 w-64">
             <h4 className="text-gray-500 font-bold uppercase tracking-widest text-xs border-b border-white/10 pb-2 mb-4 text-center">
               Round {roundNum}
             </h4>
             {rounds[roundNum].sort((a,b) => a.matchIndex - b.matchIndex).map(match => (
               <div 
                  key={match.id} 
                  onClick={() => handleMatchClick(match)}
                  className={`bg-black/50 border rounded-sm p-4 relative ${
                    match.status === 'Completed' ? 'border-emerald-500/30 opacity-70 cursor-default' : 'border-white/10 hover:border-emerald-500 cursor-pointer transition-colors shadow-lg'
                  }`}
                  title={match.status === 'Completed' ? "Finalized" : "Click to enter score"}
               >
                 {match.status === 'Completed' && <div className="absolute top-2 right-2 text-[8px] uppercase tracking-widest text-emerald-500 font-bold">FINAL</div>}
                                  <div className={`flex justify-between items-center mb-3 ${(match.winnerId === match.player1Id || match.winnerSquadId === match.squad1Id) && (match.winnerId || match.winnerSquadId) ? 'text-emerald-400 font-bold' : 'text-gray-300'}`}>
                    <span className="truncate pr-2 text-sm">{match.squad1?.name || match.player1?.username || 'TBD'}</span>
                    <span className="font-black bg-white/5 px-2 py-1 rounded-sm text-xs">{match.player1Score}</span>
                  </div>
                  
                  <div className={`flex justify-between items-center ${(match.winnerId === match.player2Id || match.winnerSquadId === match.squad2Id) && (match.winnerId || match.winnerSquadId) ? 'text-emerald-400 font-bold' : 'text-gray-300'}`}>
                    <span className="truncate pr-2 text-sm">{match.squad2?.name || match.player2?.username || (match.status === 'Completed' ? 'BYE' : 'TBD')}</span>
                    <span className="font-black bg-white/5 px-2 py-1 rounded-sm text-xs">{match.player2Score}</span>
                  </div>
               </div>
             ))}
           </div>
         ))}
       </div>

       {selectedMatch && (
         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <div className="bg-[#111116] border border-white/10 p-8 rounded-sm w-full max-w-md shadow-2xl relative">
             <button onClick={() => setSelectedMatch(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
             <h3 className="text-white font-black text-lg uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Update Match Matrix</h3>
             
             <form onSubmit={handleScoreUpdate}>
                 <div className="flex justify-between items-center mb-6 bg-black/50 p-4 border border-white/5 rounded-sm">
                   <span className="text-white font-bold truncate pr-4">{selectedMatch.squad1?.name || selectedMatch.player1?.username || 'TBD'}</span>
                   <input type="number" min="0" value={p1Score} onChange={e => setP1Score(e.target.value)} className="w-20 bg-[#111116] border border-white/10 text-center text-xl font-black text-emerald-400 py-2 focus:outline-none rounded-sm" />
                 </div>
                 
                 <div className="flex justify-between items-center mb-8 bg-black/50 p-4 border border-white/5 rounded-sm">
                   <span className="text-white font-bold truncate pr-4">{selectedMatch.squad2?.name || selectedMatch.player2?.username || 'TBD'}</span>
                   <input type="number" min="0" value={p2Score} onChange={e => setP2Score(e.target.value)} className="w-20 bg-[#111116] border border-white/10 text-center text-xl font-black text-emerald-400 py-2 focus:outline-none rounded-sm" />
                 </div>

                <div className="flex space-x-4">
                   <button type="button" onClick={() => setSelectedMatch(null)} className="flex-1 py-3 text-gray-400 font-bold tracking-widest uppercase text-xs border border-white/10 rounded-sm hover:bg-white/5 transition-colors">Abort</button>
                   <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white font-bold tracking-widest uppercase text-xs rounded-sm hover:bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all">Set Final Score</button>
                </div>
             </form>
           </div>
         </div>
       )}
    </div>
  );
};

export default MatchBracket;
