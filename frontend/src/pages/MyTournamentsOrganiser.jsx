import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyTournamentsOrganiser = () => {
  const { user } = useContext(AuthContext);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tournaments/organiser/${user.id || user._id}`);
        setTournaments(res.data);
      } catch (error) {
        console.error("Error fetching tournaments", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id || user?._id) fetchTournaments();
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <p className="text-purple-500 font-bold uppercase tracking-widest animate-pulse">Scanning Neural Net...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 min-h-[calc(100vh-80px)]">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-black tracking-tight text-white uppercase inline-block relative">
          Manage <span className="text-purple-500">Events</span>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
        </h2>
      </div>

      {tournaments.length === 0 ? (
        <div className="text-center py-24 bg-[#111116] border border-white/5 rounded-sm">
          <p className="text-gray-400 font-medium text-lg uppercase tracking-wider">No active systems detected.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <li key={tournament.id || tournament._id} className="bg-[#111116] border border-white/5 rounded-sm shadow-xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              {/* Left Accent Bar */}
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-blue-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="pl-2">
                <h3 className="text-xl font-black uppercase tracking-wide text-white mb-4 line-clamp-1">{tournament.tournamentName}</h3>
                
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">Sport</span>
                    <span className="text-white font-medium">{tournament.sportType}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">Location</span>
                    <span className="text-white font-medium">{tournament.locationName || (tournament.lat ? `${tournament.lat.toString().substring(0, 6)}...` : "N/A")}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">Entry Fee</span>
                    <span className="text-emerald-400 font-bold">${tournament.registrationFee}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/organiser/tournaments/${tournament.id || tournament._id}`)}
                  className="w-full px-4 py-3 font-bold tracking-widest text-white uppercase text-xs bg-purple-600 rounded-sm hover:bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all"
                >
                  Manage Event
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyTournamentsOrganiser;
