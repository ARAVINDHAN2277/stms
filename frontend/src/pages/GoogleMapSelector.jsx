import React, { useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";

const mapContainerStyle = {
  width: "100%",
  height: "500px", 
};

const center = {
    lat: 9.9252, // Default to Madurai
    lng: 78.1198,
  };

const GoogleMapSelector = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBwfGnHyOceDkBzQpnLcx5XEaov5lz7QOo", // Replace with your API key
  });
  const navigate = useNavigate();
  const locationState = useLocation().state || {};

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchParams] = useSearchParams();
  const userType = searchParams.get("type");
  
  const handleMapClick = (event) => {
    setSelectedLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      const targetRoute = userType === "player" ? "/tournament-register" : "/organise-tournament";
      // Merge previous form state with new location
      navigate(targetRoute, { state: { ...locationState, location: selectedLocation } });
    }
  };

  if (loadError) return <div className="flex items-center justify-center min-h-[calc(100vh-80px)] text-red-500 font-bold uppercase tracking-wider">Error loading maps</div>;
  if (!isLoaded) return <div className="flex items-center justify-center min-h-[calc(100vh-80px)] text-purple-500 font-bold uppercase tracking-wider animate-pulse">Initializing Orbit Grid...</div>;

  const accentColor = userType === "player" ? "text-blue-500" : "text-purple-500";
  const glowClass = userType === "player" ? "from-blue-500 to-emerald-500" : "from-purple-500 to-blue-500";

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="w-full max-w-4xl bg-[#111116] border border-white/5 rounded-sm shadow-2xl p-6 relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${glowClass}`}></div>

        <h2 className="text-3xl font-black tracking-tight text-center text-white uppercase mb-8">
          Pinpoint <span className={accentColor}>Coordinates</span>
        </h2>

         <p className="text-center text-gray-400 mb-6 font-medium text-sm tracking-widest uppercase">
          Click the interactive grid to drop a geographical pin
        </p>

        <div className="w-full rounded-sm overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] filter grayscale-[20%] contrast-[1.1]">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={10}
            center={center}
            onClick={handleMapClick}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
            }}
          >
            {selectedLocation && <Marker position={selectedLocation} />}
          </GoogleMap>
        </div>
        <button 
          className="w-full mt-8 px-4 py-4 font-bold tracking-widest text-white uppercase bg-emerald-600 rounded-sm hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] disabled:opacity-50 disabled:shadow-none transition-all flex justify-center items-center gap-2"
          onClick={handleConfirmLocation}
          disabled={!selectedLocation}
        >
          {selectedLocation ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Confirm Extract Location
            </>
          ) : (
             "Awaiting Marker..."
          )}
        </button>
      </div>
    </div>
  );
};

export default GoogleMapSelector;
