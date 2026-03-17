import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Users, Shield, ArrowLeft } from 'lucide-react';

const CreateSquad = () => {
    const [name, setName] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/squads', { name, logoUrl }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/player-dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create squad');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0c] pt-28 pb-12 px-4">
            <div className="max-w-2xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-white transition-colors mb-8 group uppercase text-[10px] font-black tracking-[0.2em]">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                <div className="bg-[#111116] border border-white/5 rounded-sm p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Users className="w-32 h-32 text-purple-500" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center mb-8">
                            <div className="w-12 h-12 bg-purple-600/20 border border-purple-500/30 rounded-sm flex items-center justify-center mr-4">
                                <Shield className="w-6 h-6 text-purple-500" />
                            </div>
                            <div>
                                <h1 className="text-white text-3xl font-black uppercase tracking-tighter italic">Assemble Your <span className="text-purple-500">Squad</span></h1>
                                <p className="text-gray-500 text-sm font-medium">Create a team identity to dominate squad tournaments.</p>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Squad Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. PHANTOM REAPERS"
                                    className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors uppercase font-bold tracking-wider placeholder:text-white/10"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Logo URL (Optional)</label>
                                <input
                                    type="url"
                                    value={logoUrl}
                                    onChange={(e) => setLogoUrl(e.target.value)}
                                    placeholder="https://example.com/logo.png"
                                    className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors placeholder:text-white/10 font-medium"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-[0.2em] text-sm rounded-sm transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] disabled:opacity-50"
                            >
                                {loading ? 'Initializing...' : 'Forge Squad'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateSquad;
