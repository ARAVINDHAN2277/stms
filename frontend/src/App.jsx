import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./context/AuthContext.jsx";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Home/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import OrganiserDashboard from "./pages/OrganiserDashboard.jsx";
import PlayerDashboard from "./pages/PlayerDashboard.jsx";
import RegisterTournament from "./pages/RegisterTournament.jsx";
import GoogleMapSelector from "./pages/GoogleMapSelector.jsx";
import OrganiseTournament from "./pages/OrganiseTournament.jsx";
import MyTournamentsOrganiser from "./pages/MyTournamentsOrganiser.jsx";
import MyTournamentsPlayer from "./pages/MyTournamentsPlayer.jsx";
import TournamentManagement from "./pages/TournamentManagement.jsx";
import OrganiserLayout from "./layouts/OrganiserLayout.jsx";
import PlayerLayout from "./layouts/PlayerLayout.jsx";
import DiscoverTournaments from "./pages/DiscoverTournaments.jsx";
import PlayerTournamentHub from "./pages/PlayerTournamentHub.jsx";
import Profile from "./pages/Profile.jsx";

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <Signup />} />

        <Route path="/explore" element={
          <div className="bg-warm-bg min-h-screen">
            <Navbar />
            <div className="pt-24"><DiscoverTournaments /></div>
          </div>
        } />

        <Route path="/select-location" element={<GoogleMapSelector />} />

        {/* Player Routes wrapped in PlayerLayout */}
        <Route element={user?.role === "player" ? <PlayerLayout /> : <Navigate to="/login" />}>
          <Route path="/player-dashboard" element={<PlayerDashboard />} />
          <Route path="/discover" element={<DiscoverTournaments />} />
          <Route path="/my-tournaments" element={<MyTournamentsPlayer />} />
          <Route path="/player/tournaments/:id" element={<PlayerTournamentHub />} />
          <Route path="/player/profile" element={<Profile />} />
        </Route>

        {/* Organiser Routes wrapped in OrganiserLayout */}
        <Route element={user?.role === "organiser" ? <OrganiserLayout /> : <Navigate to="/login" />}>
          <Route path="/organiser-dashboard" element={<OrganiserDashboard />} />
          <Route path="/organiser/tournaments" element={<MyTournamentsOrganiser />} />
          <Route path="/organise-tournament" element={<OrganiseTournament />} />
          <Route path="/organiser/tournaments/:id" element={<TournamentManagement />} />
          <Route path="/organiser/profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;

