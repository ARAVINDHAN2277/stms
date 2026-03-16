import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Settings, Users, Radio, LayoutDashboard, Trophy, Share2, ArrowLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import MatchBracket from './MatchBracket';

const TournamentDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [announcementText, setAnnouncementText] = useState("");
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [editForm, setEditForm] = useState({
    tournamentName: "",
    sportType: "",
    registrationFee: "",
    maxPlayers: ""
  });

  useEffect(() => {
    fetchDashboardData();
  }, [id]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/tournaments/${id}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTournament(res.data);
      setEditForm({
        tournamentName: res.data.tournamentName,
        sportType: res.data.sportType,
        registrationFee: res.data.registrationFee,
        maxPlayers: res.data.maxPlayers || ""
      });
    } catch (error) {
      console.error('Error fetching dashboard', error);
      if (error.response?.status === 403) navigate('/organiser/tournaments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <p className="text-purple-500 font-bold uppercase tracking-widest animate-pulse">Accessing Control Room...</p>
    </div>
  );

  if (!tournament) return null;

  const totalRevenue = tournament.registeredPlayers.length * tournament.registrationFee;
  const registrationLink = `${window.location.origin}/tournament-register?id=${tournament.id}`;

  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    setIsBroadcasting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/tournaments/${id}/announcements`, 
        { message: announcementText },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setAnnouncementText("");
      fetchDashboardData();
      alert("Broadcast transmitted successfully!");
    } catch (error) {
      alert("Failed to transmit broadcast.");
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === 'Cancelled') {
      if (!window.confirm("Are you absolutely sure you want to completely terminate this tournament?")) return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/tournaments/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      if (newStatus === 'Cancelled') {
         navigate('/organiser/tournaments');
      } else {
         fetchDashboardData();
      }
    } catch (e) {
      alert("Status override failed.");
    }
  };

  const handleSettingsSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/tournaments/${id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert("Settings permanently saved.");
      fetchDashboardData();
    } catch (e) {
      alert("Settings update failed.");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111116] border border-white/5 rounded-sm p-6 shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-blue-500"></div>
               <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-4">Financial Overview</h3>
               <div className="text-4xl font-black text-emerald-400">${totalRevenue}</div>
               <p className="text-gray-500 mt-2 text-sm">Collected Prize Pool</p>
            </div>
            <div className="bg-[#111116] border border-white/5 rounded-sm p-6 shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-emerald-500"></div>
               <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-4">Player Roster</h3>
               <div className="text-4xl font-black text-white">{tournament.registeredPlayers.length} <span className="text-lg text-gray-500 font-medium">/ {tournament.maxPlayers || '∞'}</span></div>
               <p className="text-gray-500 mt-2 text-sm">Active Signups</p>
            </div>
            
            <div className="col-span-1 md:col-span-2 bg-[#111116] border border-white/5 rounded-sm p-6 shadow-xl mt-4">
               <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-6 flex items-center"><Share2 className="w-4 h-4 mr-2 text-purple-500" /> Share & Onboard</h3>
               <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                  <div className="bg-white p-4 rounded-sm">
                    <QRCodeSVG value={registrationLink} size={150} />
                  </div>
                  <div className="flex-1 w-full text-center md:text-left">
                    <p className="text-white font-medium text-lg mb-2">Registration Link</p>
                    <p className="text-gray-400 text-sm mb-4">Players can scan this QR code or use the direct link to enroll instantly.</p>
                    <input type="text" readOnly value={registrationLink} className="w-full bg-black/50 border border-white/10 text-emerald-400 px-4 py-2 rounded-sm text-sm focus:outline-none mb-4" />
                    <button onClick={() => navigator.clipboard.writeText(registrationLink)} className="px-4 py-2 bg-purple-600/20 text-purple-400 font-bold tracking-widest uppercase text-xs rounded-sm hover:bg-purple-600/40 transition-colors border border-purple-500/30">Copy Link</button>
                  </div>
               </div>
            </div>
          </div>
        );
      case 'roster':
        return (
          <div className="bg-[#111116] border border-white/5 rounded-sm shadow-xl p-6">
            <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-6">Registered Players ({tournament.registeredPlayers.length})</h3>
            {tournament.registeredPlayers.length === 0 ? (
               <p className="text-gray-500 text-center py-8 text-sm">No players have initiated enrollment sequence yet.</p>
            ) : (
               <div className="space-y-3">
                 {tournament.registeredPlayers.map((reg, idx) => (
                   <div key={reg.id} className="flex justify-between items-center bg-black/30 border border-white/5 p-4 rounded-sm">
                     <div className="flex items-center space-x-4">
                       <span className="text-gray-600 font-black">{String(idx + 1).padStart(2, '0')}</span>
                       <span className="text-white font-bold">{reg.player.username}</span>
                     </div>
                     <span className="text-gray-400 text-sm">{reg.player.email}</span>
                   </div>
                 ))}
               </div>
            )}
          </div>
        );
      case 'brackets':
        return (
          <MatchBracket 
            tournamentId={id} 
            matches={tournament.matches} 
            fetchDashboardData={fetchDashboardData} 
          />
        );
      case 'broadcast':
        return (
          <div className="bg-[#111116] border border-white/5 rounded-sm shadow-xl p-6">
            <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-6 flex items-center"><Radio className="w-4 h-4 mr-2 text-blue-500" /> Communications Network</h3>
            
            <form onSubmit={handleBroadcastSubmit} className="mb-8 p-6 bg-black/30 border border-white/5 rounded-sm">
              <label className="block text-gray-400 font-medium text-xs tracking-wider uppercase mb-2">New Announcement</label>
              <textarea 
                className="w-full h-32 px-4 py-3 bg-black/50 border border-white/10 rounded-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-600 resize-none mb-4"
                placeholder="Type your message here... (e.g., Match 3 is delayed by 15 mins due to rain)"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
              ></textarea>
              <button 
                type="submit" 
                disabled={isBroadcasting}
                className="px-6 py-3 font-bold tracking-widest text-white uppercase text-xs bg-blue-600 rounded-sm hover:bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all disabled:opacity-50"
              >
                {isBroadcasting ? "Transmitting..." : "Send Broadcast"}
              </button>
            </form>

            <h4 className="text-gray-500 font-bold uppercase tracking-wider text-[10px] mb-4">Transmission History</h4>
            {tournament.announcements?.length === 0 ? (
              <p className="text-gray-600 text-sm">No transmissions sent yet.</p>
            ) : (
              <div className="space-y-4">
                {tournament.announcements?.map(ann => (
                  <div key={ann.id} className="p-4 border-l-2 border-blue-500 bg-white/5 rounded-r-sm shadow-md">
                    <p className="text-white text-sm mb-2">{ann.message}</p>
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest">{new Date(ann.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'settings':
        return (
          <div className="bg-[#111116] border border-white/5 rounded-sm shadow-xl p-6">
            <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-6 flex items-center"><Settings className="w-4 h-4 mr-2 text-red-500" /> Safeguards & Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-black/30 border border-white/5 rounded-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-white font-bold mb-2">Registration Status</h4>
                  <p className="text-sm text-gray-500 mb-6">Lock or unlock the portal to prevent new players from enrolling.</p>
                </div>
                <button 
                  onClick={() => handleStatusChange(tournament.status === 'Open' ? 'Closed' : 'Open')}
                  className={`w-full py-3 font-bold tracking-widest uppercase text-xs rounded-sm transition-colors border ${
                    tournament.status === 'Open' 
                      ? 'bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20' 
                      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20'
                  }`}
                >
                  {tournament.status === 'Open' ? 'Lock Registration' : 'Unlock Registration'}
                </button>
              </div>

              <div className="p-6 bg-red-900/10 border border-red-500/20 rounded-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-red-400 font-bold mb-2 uppercase tracking-widest text-sm">Danger Zone</h4>
                  <p className="text-sm text-gray-500 mb-6">Cancelling removes this tournament permanently. This action cannot be reversed.</p>
                </div>
                <button 
                  onClick={() => handleStatusChange('Cancelled')}
                  className="w-full py-3 bg-red-600 text-white font-bold tracking-widest text-xs uppercase rounded-sm hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all"
                >
                  Terminate Tournament
                </button>
              </div>
            </div>

            <form onSubmit={handleSettingsSave} className="mt-8 pt-8 border-t border-white/5 space-y-6">
              <h4 className="text-white font-bold uppercase tracking-widest text-xs">Edit Configuration Payload</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 font-medium text-[10px] tracking-widest uppercase mb-2">Tournament Name</label>
                  <input type="text" value={editForm.tournamentName} onChange={e => setEditForm({...editForm, tournamentName: e.target.value})} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-sm focus:outline-none focus:border-red-500 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-gray-400 font-medium text-[10px] tracking-widest uppercase mb-2">Sport Type</label>
                  <select value={editForm.sportType} onChange={e => setEditForm({...editForm, sportType: e.target.value})} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-sm focus:outline-none focus:border-red-500 text-white text-sm appearance-none">
                    <option value="Football">Football</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Tennis">Tennis</option>
                    <option value="Cricket">Cricket</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 font-medium text-[10px] tracking-widest uppercase mb-2">Registration Fee ($)</label>
                  <input type="number" value={editForm.registrationFee} onChange={e => setEditForm({...editForm, registrationFee: e.target.value})} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-sm focus:outline-none focus:border-red-500 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-gray-400 font-medium text-[10px] tracking-widest uppercase mb-2">Max Players (leave blank for ∞)</label>
                  <input type="number" value={editForm.maxPlayers} onChange={e => setEditForm({...editForm, maxPlayers: e.target.value})} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-sm focus:outline-none focus:border-red-500 text-white text-sm" />
                </div>
              </div>
              <button type="submit" className="px-6 py-3 font-bold tracking-widest text-white uppercase text-xs bg-red-600/20 border border-red-500/50 rounded-sm hover:bg-red-500/40 transition-all">Save Overrides</button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-black text-white">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-[#0a0a0d] border-r border-white/5 flex flex-col pt-8">
        <button onClick={() => navigate('/organiser/tournaments')} className="flex items-center text-gray-400 hover:text-white mb-8 px-6 transition-colors font-bold text-xs uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
        </button>
        
        <div className="px-6 mb-8">
           <h2 className="text-xl font-black uppercase text-white truncate" title={tournament.tournamentName}>{tournament.tournamentName}</h2>
           <span className={`inline-block mt-2 px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${
             tournament.status === 'Open' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
           }`}>
             STATUS: {tournament.status}
           </span>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center px-4 py-3 rounded-sm font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}>
            <LayoutDashboard className="w-4 h-4 mr-3" /> Overview
          </button>
          <button onClick={() => setActiveTab('roster')} className={`w-full flex items-center px-4 py-3 rounded-sm font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'roster' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}>
            <Users className="w-4 h-4 mr-3" /> Player Roster
          </button>
          <button onClick={() => setActiveTab('brackets')} className={`w-full flex items-center px-4 py-3 rounded-sm font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'brackets' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}>
            <Trophy className="w-4 h-4 mr-3" /> Bracket Matrix
          </button>
          <button onClick={() => setActiveTab('broadcast')} className={`w-full flex items-center px-4 py-3 rounded-sm font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'broadcast' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}>
            <Radio className="w-4 h-4 mr-3" /> Broadcasts
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center px-4 py-3 rounded-sm font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}>
            <Settings className="w-4 h-4 mr-3" /> Safeguards
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-5xl mx-auto relative z-10">
           {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TournamentDashboard;
