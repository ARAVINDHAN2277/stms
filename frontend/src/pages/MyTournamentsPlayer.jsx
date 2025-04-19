import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const MyTournamentsPlayer = () => {
  const { user } = useContext(AuthContext); // user._id should be available here
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { sportType, location: userLocation } = location.state || {};
  console.log(user)
  useEffect(() => {
    const fetchNearbyTournaments = async () => {
      try {
        if (!sportType || !userLocation?.lat || !userLocation?.lng) return;

        const res = await axios.get('http://localhost:5000/api/tournaments/nearby', {
          params: {
            lat: userLocation.lat,
            lng: userLocation.lng,
            sport: sportType,
          },
        });
        setTournaments(res.data);
      } catch (error) {
        console.error('Error fetching nearby tournaments', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyTournaments();
  }, [sportType, location]);

  const handleRegister = async (tournamentId) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/tournaments/${tournamentId}/register`, {
        playerId: user._id,
      });
      alert('Registered successfully!');
    } catch (error) {
      console.error('Error registering for tournament', error);
      alert('Failed to register');
    }
  };

  if (loading) return <p>Loading nearby tournaments...</p>;

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Tournaments Near You</h2>
      {tournaments.length === 0 ? (
        <p>No tournaments found.</p>
      ) : (
        <ul className="space-y-6 w-full max-w-2xl">
          {tournaments.map((tournament) => (
            <li
              key={tournament._id}
              className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-200"
            >
              <h3 className="text-xl font-semibold mb-2">{tournament.tournamentName}</h3>
              <p><strong>Sport:</strong> {tournament.sportType}</p>
              <p><strong>Fee:</strong> ₹{tournament.registrationFee}</p>
              <p><strong>Location:</strong> {tournament.location?.lat}, {tournament.location?.lng}</p>
              <button
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={() => handleRegister(tournament._id)}
              >
                Register
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyTournamentsPlayer;
