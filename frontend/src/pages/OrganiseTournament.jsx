import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const OrganiseTournament = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state || {};
  
  const [tournamentName, setTournamentName] = useState(locationState.tournamentName || "");
  const [sportType, setSportType] = useState(locationState.sportType || "");
  const [registrationFee, setRegistrationFee] = useState(locationState.registrationFee || "");
  const [locationText, setLocationText] = useState(locationState.locationText || "");
  
  const selectedLocation = locationState.location || null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLocationSelect = (e) => {
    e.preventDefault();
    navigate("/select-location?type=organiser", {
      state: { tournamentName, sportType, registrationFee, locationText }
    });
  };

  const handleOrganiseTournament = async (e) => {
    e.preventDefault();
    if (!tournamentName || !sportType || !registrationFee) {
      alert("Please fill in all tournament details.");
      return;
    }

    if (!selectedLocation && !locationText) {
      alert("Please provide a City/State or set a map ping.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/tournaments/register",
        {
          tournamentName,
          sportType,
          registrationFee,
          locationText,
          location: selectedLocation,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      alert("Tournament launched successfully!");
      navigate('/organiser/tournaments'); // Navigate back to list of tournaments
    } catch (error) {
      alert(error.response?.data?.message || "Failed to organise tournament. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg bg-[#111116] border border-white/5 rounded-sm shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>

        <h2 className="text-3xl font-black tracking-tight text-center text-white uppercase mb-8">
          Organise <span className="text-purple-500">Tournament</span>
        </h2>
        
        <form className="space-y-6" onSubmit={handleOrganiseTournament}>
          <div>
            <label className="block text-gray-400 font-medium text-xs tracking-wider uppercase mb-2">Tournament Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-600 transition-colors"
              value={tournamentName}
              onChange={(e) => setTournamentName(e.target.value)}
              placeholder="E.g. The Winter Major"
            />
          </div>

          <div>
            <label className="block text-gray-400 font-medium text-xs tracking-wider uppercase mb-2">Sport Type</label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white appearance-none cursor-pointer"
                value={sportType}
                onChange={(e) => setSportType(e.target.value)}
              >
                <option value="" disabled className="text-gray-500">Choose a Sport</option>
                <option value="Football">Football</option>
                <option value="Basketball">Basketball</option>
                <option value="Tennis">Tennis</option>
                <option value="Cricket">Cricket</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-purple-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 font-medium text-xs tracking-wider uppercase mb-2">Registration Fee ($)</label>
            <input
              type="number"
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-600 transition-colors"
              value={registrationFee}
              onChange={(e) => setRegistrationFee(e.target.value)}
              placeholder="e.g. 50"
            />
          </div>

          <div className="pt-2">
            <label className="block text-gray-400 font-medium text-xs tracking-wider uppercase mb-2">Location (City / State)</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-600 transition-colors mb-4 disabled:opacity-50"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              placeholder="e.g. Madurai, Tamil Nadu"
              disabled={!!selectedLocation}
            />

            <div className="flex space-x-4 items-center">
              <button 
                type="button"
                className="flex-1 px-4 py-3 font-bold tracking-widest text-white uppercase bg-black/50 border border-purple-500/50 rounded-sm hover:bg-purple-500/10 hover:border-purple-500 transition-all text-sm"
                onClick={handleLocationSelect}
              >
                {selectedLocation ? "Change Map Ping" : "Or Set Map Ping"}
              </button>
              {selectedLocation && (
                <div className="text-emerald-400 text-sm font-bold flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Locked
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-4 mt-6 font-bold tracking-widest text-white uppercase bg-purple-600 rounded-sm hover:bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all disabled:opacity-50 disabled:shadow-none"
          >
            {isSubmitting ? "Initiating Launch Sequence..." : "Launch Tournament"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrganiseTournament;
