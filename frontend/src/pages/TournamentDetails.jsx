import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Users, Trophy, IndianRupee, CheckCircle } from "lucide-react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const TournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = React.useContext(AuthContext);
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/tournaments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTournament(res.data);
        
        // Check if current user is already registered. 
        // We'll need the user's ID. For now, assuming the backend doesn't crash if they try to register twice, 
        // but we can check the registrations array if the backend populates it for players.
        // If the backend doesn't populate registrations for players (due to privacy), we might need a specific endpoint.
        // For now, let's just let them click it and handle the error if already registered.
      } catch (err) {
        console.error("Error fetching tournament:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTournament();
  }, [id]);

  const handleRegister = async () => {
    if (!user?.profileCompleted) {
      if (window.confirm("Please complete your profile to register for tournaments. Go to profile now?")) {
        navigate('/profile');
      }
      return;
    }
    
    setRegistering(true);
    try {
      const token = localStorage.getItem("token");
      // The backend uses req.user.id internally for some routes, but the previous register route used `playerId` in body.
      // Wait, let's look at registerForTournament in controller. 
      // export const registerForTournament = async (req, res) => { const { playerId } = req.body; ... }
      // The backend expects playerId. However, from the frontend, getting playerId usually comes from Context.
      // Wait, if backend uses authMiddleware, it should know the user. 
      // Let's get the user id from localStorage token manually, or better yet, I'll modify the backend to use `req.user.id`.
      // For now, let's just send a dummy string or parse the JWT. 
      // Actually, since I have to modify backend anyway, I'll make backend use `req.user.id`.
      await axios.post(`/api/tournaments/${id}/register`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsRegistered(true);
      alert("Registration successful! Waiting for organiser approval.");
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message === "Already registered") {
         setIsRegistered(true);
         alert("You are already registered for this tournament.");
      } else {
         alert("Failed to register. Please try again.");
      }
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-text-muted">Loading tournament details...</div>;
  if (!tournament) return <div className="p-8 text-center text-red-500">Tournament not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <Link to="/player/discover" className="inline-flex items-center gap-2 text-text-muted hover:text-navy-dark transition-colors mb-6 font-medium">
        <ArrowLeft size={18} /> Back to Discovery
      </Link>

      <div className="bg-white rounded-3xl border border-warm-border shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-navy-dark to-primary relative">
           <div className="absolute top-4 right-4 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white font-bold text-sm">
             {tournament.status?.replace("_", " ")}
           </div>
           <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/60 to-transparent">
             <div className="flex items-center gap-3 mb-2">
               <span className="px-3 py-1 bg-teal-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm">
                 {tournament.sportType}
               </span>
             </div>
             <h1 className="text-3xl md:text-5xl font-heading font-black text-white">{tournament.tournamentName}</h1>
           </div>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-8">
            <section>
              <h3 className="text-xl font-bold text-navy-dark mb-4 border-b border-warm-border pb-2">Logistics</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-warm-surface flex items-center justify-center shrink-0">
                    <MapPin className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-navy-dark">Venue</p>
                    <p className="text-text-muted">{tournament.venueName || "Location TBD"}</p>
                    {tournament.stateDistrict && <p className="text-sm text-text-muted">{tournament.stateDistrict}</p>}
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-warm-surface flex items-center justify-center shrink-0">
                    <Calendar className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-navy-dark">Dates</p>
                    <p className="text-text-muted">
                      {tournament.startDate ? new Date(tournament.startDate).toLocaleDateString('en-GB') : "TBD"} - 
                      {tournament.endDate ? new Date(tournament.endDate).toLocaleDateString('en-GB') : "TBD"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-navy-dark mb-4 border-b border-warm-border pb-2">About the Event</h3>
              <p className="text-text-muted leading-relaxed">
                Join the {tournament.tournamentName} and compete against the best players in the region. 
                Ensure you register before the deadline. Matches will be scheduled using a round-robin format, 
                guaranteeing multiple games for all participants.
              </p>
            </section>
          </div>

          {/* Action Sidebar */}
          <div className="w-full md:w-80 space-y-6">
            <div className="bg-warm-bg rounded-2xl p-6 border border-warm-border text-center">
               <p className="text-sm text-text-muted uppercase tracking-wide font-semibold mb-1">Entry Fee</p>
               <p className="text-4xl font-black text-navy-dark mb-6 flex items-center justify-center">
                 <IndianRupee size={28} className="mr-1 opacity-70" /> {tournament.registrationFee}
               </p>

               {isRegistered ? (
                 <div className="w-full py-4 bg-green-50 text-green-700 font-bold rounded-xl flex items-center justify-center gap-2 border border-green-200">
                   <CheckCircle size={20} /> Registered
                 </div>
               ) : (
                 <button 
                   onClick={handleRegister}
                   disabled={registering || tournament.status !== "REGISTRATION_OPEN"}
                   className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all ${
                     tournament.status === "REGISTRATION_OPEN"
                     ? "bg-teal-500 hover:bg-teal-600 text-white hover:shadow-lg hover:-translate-y-0.5"
                     : "bg-gray-300 text-gray-500 cursor-not-allowed"
                   }`}
                 >
                   {registering ? "Processing..." : tournament.status === "REGISTRATION_OPEN" ? "Register Now" : "Registration Closed"}
                 </button>
               )}

               <p className="text-xs text-text-muted mt-4">
                 Payment will be collected after your registration is approved by the organiser.
               </p>
            </div>
            
            <div className="bg-white rounded-2xl p-5 border border-warm-border flex items-center gap-4">
               <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                 <Users size={24} />
               </div>
               <div>
                 <p className="font-bold text-navy-dark">Organised By</p>
                 <p className="text-text-muted text-sm">{tournament.organiser?.username || "Admin"}</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetails;
