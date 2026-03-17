import React, { useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";

const RegisterTournament = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state || {};
  
  const [sportType, setSportType] = useState(locationState.sportType || "");
  const [locationText, setLocationText] = useState(locationState.locationText || "");

  const selectedLocation = locationState.location || null;
  
  const handleLocationSelect = (e) => {
    e.preventDefault();
    navigate("/select-location?type=player", {
      state: { sportType, locationText }
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!sportType) {
      alert("Please select a sport.");
      return;
    }

    if (!selectedLocation && !locationText) {
       alert("Please provide a city/state or set a map ping.");
       return;
    }

    // Backend handles the text-based location search if locationText is provided,
    // or frontend just sends the map lat/lng
    navigate("/player/explore", {
      state: { sportType, locationText, location: selectedLocation }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg glass rounded-sm shadow-2xl p-8 relative overflow-hidden animate-slide-in">
        {/* Subtle accent glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500"></div>

        <h2 className="text-3xl font-black tracking-tight text-center text-white uppercase mb-8">
          Find <span className="text-blue-500">Tournaments</span>
        </h2>
        
        <form className="space-y-6" onSubmit={handleSearch}>
          <div>
            <label className="block text-gray-400 font-medium text-xs tracking-wider uppercase mb-2">Select Sport Type</label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white appearance-none cursor-pointer"
                value={sportType}
                onChange={(e) => setSportType(e.target.value)}
              >
                <option value="" disabled className="text-gray-500">Choose a Sport</option>
                <option value="Football">Football</option>
                <option value="Basketball">Basketball</option>
                <option value="Tennis">Tennis</option>
                <option value="Cricket">Cricket</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-blue-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-gray-400 font-medium text-xs tracking-wider uppercase mb-2">Your Location (City / State)</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-600 transition-colors mb-4 disabled:opacity-50"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              placeholder="e.g. Madurai, Tamil Nadu"
              disabled={!!selectedLocation}
            />

            <div className="flex space-x-4 items-center">
              <button 
                type="button"
                className="flex-1 px-4 py-3 font-bold tracking-widest text-white uppercase bg-black/50 border border-blue-500/50 rounded-sm hover:bg-blue-500/10 hover:border-blue-500 transition-all text-sm"
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
            className="w-full px-4 py-4 mt-6 font-bold tracking-widest text-white uppercase bg-blue-600 rounded-sm hover:bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all disabled:opacity-50 disabled:shadow-none"
          >
            Search Tournaments
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterTournament;
