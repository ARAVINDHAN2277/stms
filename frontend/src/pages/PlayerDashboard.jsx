import React from "react";
import { useNavigate } from "react-router-dom";

const PlayerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-6">Player Dashboard</h2>
      
      <div className="w-80 bg-white shadow-lg rounded-2xl p-6 space-y-4">
        <button 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
          onClick={() => navigate("/tournament-register")}>
          Register Tournament
        </button>
        <button 
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
          onClick={() => navigate("/player/tournaments")}>
          My Tournaments
        </button>
      </div>
    </div>
  );
};

export default PlayerDashboard;
