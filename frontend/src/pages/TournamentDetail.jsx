import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trophy, MapPin, Calendar, Users, Shield, ArrowLeft, Zap } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

const TournamentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tournament, setTournament] = useState(null);
    const [squads, setSquads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSquad, setSelectedSquad] = useState('');
    const [enrolling, setEnrolling] = useState(false);

    const socket = useSocket();

    useEffect(() => {
        fetchData();
    }, [id]);

    useEffect(() => {
        if (socket && id) {
            socket.emit('join_tournament', id);
            
            socket.on('match_update', () => fetchData());
            socket.on('new_announcement', () => fetchData());

            return () => {
                socket.off('match_update');
                socket.off('new_announcement');
            };
        }
    }, [socket, id]);

    const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [tRes, sRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/tournaments/${id}`),
                    axios.get('http://localhost:5000/api/squads/mine', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setTournament(tRes.data);
                setSquads(sRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
    };

    const handleEnroll = async () => {
        if (tournament.type === 'SQUAD' && !selectedSquad) {
            alert("Please select a squad first.");
            return;
        }

        setEnrolling(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/tournaments/${id}/join`, {
                squadId: tournament.type === 'SQUAD' ? selectedSquad : null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Successfully enrolled in the grid!');
            navigate('/player/my-grid');
        } catch (err) {
            alert(err.response?.data?.message || 'Enrollment failed');
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    );

    if (!tournament) return (
        <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center text-white font-black uppercase tracking-widest">
            Signal Lost - Tournament Not Found
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0c] pt-28 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                <button 
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-black uppercase text-[10px] tracking-widest mb-8"
                >
                  <ArrowLeft className="w-4 h-4" /> Abort Mission
                </button>

                <div className="glass rounded-sm overflow-hidden shadow-2xl animate-slide-in">
                    <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 bg-black border-2 border-white/10 rounded-sm flex items-center justify-center shadow-2xl">
                                <Trophy className="w-12 h-12 text-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 p-8">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2 italic">
                                    {tournament.tournamentName}
                                </h1>
                                <div className="flex flex-wrap gap-4 text-gray-500">
                                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded-sm">
                                        <Zap className="w-3 h-3 text-blue-500" /> {tournament.sportType}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
                                        <MapPin className="w-3 h-3 text-emerald-500" /> {tournament.locationName || 'Global'}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
                                        <Calendar className="w-3 h-3 text-purple-500" /> Starts {new Date(tournament.startDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Entry Fee</p>
                                <p className="text-3xl font-black text-emerald-400">${tournament.registrationFee}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Tournament Mode</h3>
                                    <div className="glass p-4 rounded-sm flex items-center justify-between">
                                        <p className="text-white font-bold uppercase text-sm tracking-wide">{tournament.type}</p>
                                        <Users className="w-4 h-4 text-blue-500 opacity-50" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Registration Status</h3>
                                    <div className="glass p-4 rounded-sm flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                        <p className="text-white font-bold uppercase text-sm tracking-wide">{tournament.status}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 p-6 rounded-sm">
                                <h3 className="text-white font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-blue-500" /> Enrollment Protocol
                                </h3>
                                
                                {tournament.type === 'SQUAD' && (
                                    <div className="mb-6">
                                        <label className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-2 block">Select Deployable Squad</label>
                                        <select 
                                            value={selectedSquad}
                                            onChange={e => setSelectedSquad(e.target.value)}
                                            className="w-full bg-black border border-white/10 p-3 text-white text-xs uppercase font-bold rounded-sm focus:border-blue-500 outline-none"
                                        >
                                            <option value="">-- Choose Squad --</option>
                                            {squads.map(s => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <button 
                                    onClick={handleEnroll}
                                    disabled={enrolling || (tournament.type === 'SQUAD' && !selectedSquad)}
                                    className="w-full py-4 bg-blue-600 text-white font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50"
                                >
                                    {enrolling ? 'INITIALIZING...' : 'AUTHORIZE DEPLOYMENT'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TournamentDetail;
