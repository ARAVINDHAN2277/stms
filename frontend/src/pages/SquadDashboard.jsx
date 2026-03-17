import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Mail, Users, Plus, Check, X, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SquadDashboard = () => {
    const [squads, setSquads] = useState([]);
    const [invites, setInvites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inviting, setInviting] = useState(null); // squadId
    const [inviteEmail, setInviteEmail] = useState('');
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [squadsRes, invitesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/squads/mine', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:5000/api/squads/invites/pending', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setSquads(squadsRes.data);
            setInvites(invitesRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInvite = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/squads/${inviting}/invite`, { email: inviteEmail }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Invite sent!');
            setInviteEmail('');
            setInviting(null);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to send invite');
        }
    };

    const handleAcceptInvite = async (inviteId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/squads/invites/${inviteId}/accept`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            alert('Failed to join squad');
        }
    };

    const handleRejectInvite = async (inviteId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/squads/invites/${inviteId}/reject`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            alert('Failed to reject invite');
        }
    };

    if (loading) return (
       <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
       </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0c] pt-28 pb-12 px-6">
            <div className="max-w-6xl mx-auto">
                
                {/* Pending Invitations Section */}
                {invites.length > 0 && (
                    <div className="mb-12 bg-purple-600/5 border border-purple-500/20 rounded-sm p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl"></div>
                        <h2 className="text-white font-black uppercase tracking-widest text-lg flex items-center gap-3 mb-6">
                           <Mail className="w-5 h-5 text-purple-400" /> Incoming Recruits
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {invites.map(invite => (
                                <div key={invite.id} className="bg-black/40 border border-white/5 p-5 rounded-sm flex items-center justify-between group hover:border-purple-500/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-purple-500/20 rounded-sm flex items-center justify-center border border-purple-500/20">
                                            <Shield className="w-5 h-5 text-purple-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold uppercase tracking-tight text-sm">{invite.squad.name}</h4>
                                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Captain: {invite.squad.captain.username}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleRejectInvite(invite.id)} className="p-2 border border-white/10 text-gray-400 hover:text-red-500 hover:border-red-500/30 transition-all rounded-sm">
                                            <X className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleAcceptInvite(invite.id)} className="px-4 py-2 bg-purple-600 text-white font-black uppercase tracking-widest text-[10px] hover:bg-purple-500 transition-all rounded-sm shadow-xl">
                                            Accept
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center mb-12 animate-slide-in">
                    <div>
                        <h1 className="text-white text-4xl font-black uppercase tracking-tighter italic">Squad <span className="text-purple-500">Command</span></h1>
                        <p className="text-gray-500 text-sm font-medium">Manage your squads, roster, and ongoing invitations.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/squads/create')}
                        className="px-6 py-3 glass rounded-sm text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 hover:border-purple-500 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4 text-purple-500" /> Create New
                    </button>
                </div>

                {squads.length === 0 ? (
                    <div className="glass rounded-sm p-24 text-center animate-slide-in [animation-delay:200ms]">
                        <Users className="w-16 h-16 text-gray-700 mx-auto mb-6 opacity-50" />
                        <h3 className="text-white font-black text-xl uppercase tracking-widest mb-4">No Squads Found</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm">You haven't joined or created any squads yet. Forge a new team to start competing in squad tournaments.</p>
                        <button onClick={() => navigate('/squads/create')} className="text-purple-500 font-bold uppercase text-xs tracking-widest hover:underline">Start a Squad now</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-in [animation-delay:200ms]">
                        {squads.map(squad => (
                            <div key={squad.id} className="glass rounded-sm p-8 shadow-2xl hover:border-white/10 transition-all group">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center">
                                        <div className="w-16 h-16 bg-black/50 border border-white/5 rounded-sm p-1 mr-6">
                                            {squad.logoUrl ? (
                                                <img src={squad.logoUrl} alt={squad.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-purple-600/20 flex items-center justify-center text-purple-500 font-black text-xl italic">{squad.name.substring(0,2)}</div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-white text-2xl font-black uppercase tracking-tighter truncate max-w-[200px]">{squad.name}</h3>
                                            <div className="flex items-center text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">
                                                <Shield className="w-3 h-3 text-purple-500 mr-2" /> Captain: {squad.captain.username}
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setInviting(squad.id)}
                                        className="p-3 bg-white/5 rounded-sm hover:bg-purple-600/20 transition-colors"
                                        title="Invite Player"
                                    >
                                        <Mail className="w-4 h-4 text-white" />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] mb-4 border-b border-white/5 pb-2">Roster ({squad.members.length})</div>
                                    {squads.find(s => s.id === squad.id).members.map(member => (
                                        <div key={member.id} className="flex justify-between items-center py-2 px-3 bg-black/30 rounded-sm border border-transparent hover:border-white/5 transition-all">
                                            <div className="flex items-center">
                                                <div className={`w-2 h-2 rounded-full mr-3 ${member.role === 'CAPTAIN' ? 'bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.5)]' : 'bg-gray-600'}`}></div>
                                                <span className="text-white text-xs font-bold uppercase tracking-wider">{member.user.username}</span>
                                            </div>
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${member.role === 'CAPTAIN' ? 'text-purple-400' : 'text-gray-600'}`}>{member.role}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Invite Modal */}
            {inviting && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-[#111116] border border-white/10 rounded-sm p-10 w-full max-w-md shadow-2xl relative">
                        <button onClick={() => setInviting(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                        <ShieldAlert className="w-12 h-12 text-purple-500 mb-6 mx-auto" />
                        <h3 className="text-white text-2xl font-black uppercase tracking-tighter italic text-center mb-2">Recruit <span className="text-purple-500">Operative</span></h3>
                        <p className="text-gray-500 text-sm text-center mb-8">Deploy a squad invitation to a player via their registered email address.</p>

                        <form onSubmit={handleInvite} className="space-y-6">
                            <div>
                                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Player Email</label>
                                <input 
                                    type="email" 
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                    placeholder="operative@grid.com"
                                    className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-sm focus:outline-none focus:border-purple-500 transition-colors uppercase font-bold"
                                    required
                                />
                            </div>
                            <button 
                                type="submit"
                                className="w-full py-4 bg-purple-600 text-white font-black uppercase tracking-widest text-xs rounded-sm hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all"
                            >
                                DISPATCH INVITE
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SquadDashboard;
