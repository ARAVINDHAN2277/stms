import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const MyTournamentsOrganiser = () => {
  const { user } = useContext(AuthContext);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tournaments/organiser/${user._id}`);
        setTournaments(res.data);
      } catch (error) {
        console.error("Error fetching tournaments", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchTournaments();
  }, [user]);

  const handleGenerateSchedule = async (tournamentId) => {
    try {
      setGeneratingId(tournamentId);
      const res = await axios.post(`http://localhost:5000/api/tournaments/${tournamentId}/schedule`);
      alert(`Schedule generated successfully: ${res.data.message}`);
    } catch (error) {
      console.error('Error generating schedule:', error);
      alert('Failed to generate schedule.');
    } finally {
      setGeneratingId(null);
    }
  };

  if (loading) return <p>Loading tournaments...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Organised Tournaments</h2>
      {tournaments.length === 0 ? (
        <p>No tournaments found.</p>
      ) : (
        <ul className="space-y-3">
          {tournaments.map((tournament) => (
            <li key={tournament._id} className="p-4 bg-gray-100 rounded shadow">
              <h3 className="text-lg font-semibold">{tournament.tournamentName}</h3>
              <p><strong>Sport:</strong> {tournament.sportType}</p>
              <p><strong>Location:</strong> {tournament.location?.lat || "N/A"}</p>
              <p><strong>Fee:</strong> ₹{tournament.registrationFee}</p>
              <button
                onClick={() => handleGenerateSchedule(tournament._id)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={generatingId === tournament._id}
              >
                {generatingId === tournament._id ? "Generating..." : "Generate Schedule"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyTournamentsOrganiser;
