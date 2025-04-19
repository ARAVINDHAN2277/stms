import React, { useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";

const RegisterTournament = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state;
  const [sportType, setSportType] = useState("");

  const selectedLocation = locationState?.location || "Not selected";
  const handleLocationSelect = () => {
    navigate("/select-location?type=player");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-6">Register Tournament</h2>
      
      <div className="w-80 bg-white shadow-lg rounded-2xl p-6 space-y-4">
        <label className="block text-gray-700 font-semibold">Select Sport Type</label>
        
        <select
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={sportType}
          onChange={(e) => setSportType(e.target.value)}
        >
          <option value="">Choose a Sport</option>
          <option value="Football">Football</option>
          <option value="Basketball">Basketball</option>
          <option value="Tennis">Tennis</option>
          <option value="Cricket">Cricket</option>
        </select>

        <button 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
          onClick={handleLocationSelect}
        >
          Select Location
        </button>

        <button 
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md mt-4"
          onClick={() => navigate("/display-tournaments",{
            state: {
              sportType,
              location: selectedLocation,
            },
          })}
        >
          Search Tournaments
        </button>
      </div>
    </div>
  );
};

export default RegisterTournament;
