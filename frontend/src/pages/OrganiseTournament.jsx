import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const OrganiseTournament = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state;
  
  const [tournamentName, setTournamentName] = useState("");
  const [sportType, setSportType] = useState("");
  const [registrationFee, setRegistrationFee] = useState(""); // New field for Registration Fee
  const selectedLocation = locationState?.location || "Not selected";

  const handleLocationSelect = () => {
    navigate("/select-location?type=organiser");
  };

  const handleOrganiseTournament = async () => {
    if (!tournamentName || !sportType || !registrationFee || selectedLocation === "Not selected") {
      alert("Please fill in all fields and select a location.");
      return;
    }
  
    try {
      await registerTournament(); // Wait for tournament to be registered
      alert("Tournament organised successfully!");
    } catch (error) {
      alert("Failed to organise tournament. Please try again.");
    }
  };
  
  const registerTournament = async () => {
    try {
      const token = localStorage.getItem("token"); // or however you store JWT
      console.log(token);
      const response = await axios.post(
        "http://localhost:5000/api/tournaments/register",
        {
          tournamentName,
          sportType,
          registrationFee,
          location: selectedLocation,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Include the token here
          },
        }
      );
  
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error registering tournament:", error);
      throw error; // rethrow to handle in handleOrganiseTournament
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-6">Organise Tournament</h2>
      
      <div className="w-80 bg-white shadow-lg rounded-2xl p-6 space-y-4">
        <label className="block text-gray-700 font-semibold">Tournament Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
          placeholder="Enter Tournament Name"
        />

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

        <label className="block text-gray-700 font-semibold">Registration Fee</label>
        <input
          type="number"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={registrationFee}
          onChange={(e) => setRegistrationFee(e.target.value)}
          placeholder="Enter Registration Fee"
        />

        <button 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
          onClick={handleLocationSelect}
        >
          Select Location
        </button>

        <button 
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
          onClick={handleOrganiseTournament}
        >
          Organise Tournament
        </button>
      </div>
    </div>
  );
};

export default OrganiseTournament;
