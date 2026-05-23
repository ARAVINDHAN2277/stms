import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./context/AuthContext.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import OrganiserDashboard from "./pages/OrganiserDashboard.jsx";
import PlayerDashboard from "./pages/PlayerDashboard.jsx";
import RegisterTournament from "./pages/RegisterTournament.jsx";
import GoogleMapSelector from "./pages/GoogleMapSelector.jsx";
import OrganiseTournament from "./pages/OrganiseTournament.jsx";
import MyTournamentsOrganiser from "./pages/MyTournamentsOrganiser.jsx";
import MyTournamentsPlayer from "./pages/MyTournamentsPlayer.jsx";

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to
          ={`/${user.role}-dashboard`} /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <Signup />} />

        <Route path="/tournament-register" element={<RegisterTournament />} />
        <Route path="/select-location" element={<GoogleMapSelector />} />
        <Route path="/player-dashboard" element={user?.role === "player" ? <PlayerDashboard /> : <Navigate to="/login" />} />
        <Route path="/organiser-dashboard" element={user?.role === "organiser" ? <OrganiserDashboard /> : <Navigate to="/login" />} />
        <Route path="/organise-tournament" element={<OrganiseTournament />} />
        <Route path="/organiser/tournaments" element={<MyTournamentsOrganiser />} />
        <Route path="/display-tournaments" element={<MyTournamentsPlayer />} />
      </Routes>
    </>
  );
};

export default App;

