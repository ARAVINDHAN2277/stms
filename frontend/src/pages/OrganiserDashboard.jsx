import React from "react";
import { useNavigate } from "react-router-dom";

const OrganiserDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-black tracking-tight text-center text-white uppercase mb-8">
        Organiser <span className="text-purple-500">Dashboard</span>
      </h2>
      
      <div className="w-full max-w-md bg-[#111116] border border-white/5 rounded-sm shadow-2xl p-8 space-y-6 relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>

        <button 
          className="w-full px-4 py-4 font-bold tracking-widest text-white uppercase bg-purple-600 rounded-sm hover:bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all flex items-center justify-center gap-3"
          onClick={() => navigate("/organise-tournament")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Organise a Tournament
        </button>
        <button 
          className="w-full px-4 py-4 font-bold tracking-widest text-white uppercase bg-black/50 border border-purple-500/50 rounded-sm hover:bg-purple-500/10 hover:border-purple-500 transition-all flex items-center justify-center gap-3"
          onClick={() => navigate("/organiser/tournaments")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
          My Tournaments
        </button>
      </div>
    </div>
  );
};

export default OrganiserDashboard;
