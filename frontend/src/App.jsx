import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./context/AuthContext.jsx";
import { Toaster } from 'react-hot-toast';
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import OrganiserDashboard from "./pages/OrganiserDashboard.jsx";
import PlayerDashboard from "./pages/PlayerDashboard.jsx";
import RegisterTournament from "./pages/RegisterTournament.jsx";
import { GoogleMapsMarkerClusterer } from "@react-google-maps/api";
import GoogleMapSelector from "./pages/GoogleMapSelector.jsx";
import OrganiseTournament from "./pages/OrganiseTournament.jsx";
import MyTournamentsOrganiser from "./pages/MyTournamentsOrganiser.jsx";
import MyTournamentsPlayer from "./pages/MyTournamentsPlayer.jsx";
import TournamentDashboard from "./pages/TournamentDashboard.jsx";
import CreateSquad from "./pages/CreateSquad.jsx";
import SquadDashboard from "./pages/SquadDashboard.jsx";
import ExploreTournaments from "./pages/ExploreTournaments.jsx";
import TournamentDetail from "./pages/TournamentDetail.jsx";

const App = () => { 
  const { user } = useContext(AuthContext);
  
  return (
    <>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#111116', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      <Routes>
        {/* Public Routes without the Global Layout */}
        <Route path="/" element={<Home />} />
        
        {/* Protected layout routes */}
        <Route path="/" element={<Layout />}>
          <Route path="login" element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <Login />} />
          <Route path="signup" element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <Signup />} />
          
          <Route path="tournament-register" element={<RegisterTournament />} />
          <Route path="select-location" element={<GoogleMapSelector />} />
          <Route path="player-dashboard" element={user?.role === "player" ? <PlayerDashboard /> : <Navigate to="/login" />} />
          <Route path="organiser-dashboard" element={user?.role === "organiser" ? <OrganiserDashboard /> : <Navigate to="/login" />} />
          <Route path="organise-tournament" element={user?.role === "organiser" ? <OrganiseTournament /> : <Navigate to="/login" />} />
          <Route path="organiser/tournaments" element={user?.role === "organiser" ? <MyTournamentsOrganiser /> : <Navigate to="/login" />} />
          <Route path="organiser/tournaments/:id" element={user?.role === "organiser" ? <TournamentDashboard /> : <Navigate to="/login" />} />
          
          {/* Standardized Player Routes */}
          <Route path="player/my-grid" element={user?.role === "player" ? <MyTournamentsPlayer /> : <Navigate to="/login" />} />
          <Route path="player/explore" element={user?.role === "player" ? <ExploreTournaments /> : <Navigate to="/login" />} />
          <Route path="player/squads" element={user?.role === "player" ? <SquadDashboard /> : <Navigate to="/login" />} />
          <Route path="tournament/:id" element={user?.role === "player" ? <TournamentDetail /> : <Navigate to="/login" />} />
          
          <Route path="squads/create" element={user?.role === "player" ? <CreateSquad /> : <Navigate to="/login" />} />
        </Route>
      </Routes>
    </>
  ); 
};

export default App;
