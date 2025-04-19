import React, { useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useSearchParams, useNavigate } from "react-router-dom";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
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
      // Pass selected location to previous page or context
      console.log("Selected Location:", selectedLocation);
      const targetRoute = userType === "player" ? "/tournament-register" : "/organise-tournament";
      navigate(targetRoute, { state: { location: selectedLocation } });
    }
  };

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded) return <p>Loading maps...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-6">Select Location for {userType}</h2>
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={10}
          center={center}
          onClick={handleMapClick}
        >
          {selectedLocation && <Marker position={selectedLocation} />}
        </GoogleMap>
        <button 
          className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
          onClick={handleConfirmLocation}
          disabled={!selectedLocation}
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
};

export default GoogleMapSelector;

