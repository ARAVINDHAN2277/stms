import React from "react";
import { useNavigate } from "react-router-dom";

const PlayerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-black tracking-tight text-center text-white uppercase mb-8">
        Player <span className="text-blue-500">Dashboard</span>
      </h2>
      
      <div className="w-full max-w-md bg-[#111116] border border-white/5 rounded-sm shadow-2xl p-8 space-y-6 relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500"></div>

        <button 
          className="w-full px-4 py-4 font-bold tracking-widest text-white uppercase bg-blue-600 rounded-sm hover:bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all flex items-center justify-center gap-3"
          onClick={() => navigate("/tournament-register")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
          Register for Tournament
        </button>
        <button 
          className="w-full px-4 py-4 font-bold tracking-widest text-white uppercase bg-black/50 border border-blue-500/50 rounded-sm hover:bg-blue-500/10 hover:border-blue-500 transition-all flex items-center justify-center gap-3"
          onClick={() => navigate("/player/tournaments")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
          My Tournaments
        </button>
      </div>
    </div>
  );
};

export default PlayerDashboard;
