import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { User, Mail, Lock, UserPlus, Zap, Shield, ChevronRight } from "lucide-react";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("player");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:5000/api/auth/signup", { username, email, password, role });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data || "Neural Link Failed. Try another frequency.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 relative overflow-hidden bg-[#0a0a0c]">
      {/* Background Grid & Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="scanline"></div>
      </div>

      <div className="w-full max-w-lg relative z-10 animate-slide-in">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4 animate-pulse">
            <Zap className="w-3 h-3 text-blue-400 fill-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Register New Account</span>
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic glitch-text">
            Join the <span className="text-purple-500">Grid</span>
          </h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Create your competitive profile</p>
        </div>

        <div className="glass p-8 rounded-sm border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-50"></div>
          
          {error && (
            <div className="mb-6 p-3 bg-red-400/10 border border-red-400/20 text-red-400 text-[10px] font-black uppercase tracking-widest text-center animate-pulse">
              SIGNUP ERROR: {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  <User className="w-3 h-3 text-purple-500" /> Username
                </label>
                <input
                  type="text"
                  placeholder="X_NEON_X"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-4 glass-input text-white text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  <Mail className="w-3 h-3 text-blue-500" /> Email Address
                </label>
                <input
                  type="email"
                  placeholder="user@tourneygrid.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 glass-input text-white text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                <Lock className="w-3 h-3 text-purple-500" /> Create Password
              </label>
              <input
                type="password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 glass-input text-white text-sm"
                required
              />
            </div>

            {/* Tactical Class Selection */}
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Choose Account Role</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("player")}
                  className={`relative p-4 rounded-sm border transition-all duration-300 group ${
                    role === "player" 
                      ? "bg-purple-500/10 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]" 
                      : "bg-white/5 border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${role === "player" ? "text-purple-400" : "text-gray-500"}`}>Player</div>
                  <div className="text-[8px] text-gray-600 font-bold uppercase">Compete in tournaments</div>
                  {role === "player" && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>}
                </button>

                <button
                  type="button"
                  onClick={() => setRole("organiser")}
                  className={`relative p-4 rounded-sm border transition-all duration-300 group ${
                    role === "organiser" 
                      ? "bg-blue-500/10 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                      : "bg-white/5 border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${role === "organiser" ? "text-blue-400" : "text-gray-500"}`}>Organiser</div>
                  <div className="text-[8px] text-gray-600 font-bold uppercase">Host and manage events</div>
                  {role === "organiser" && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full tactical-btn bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-center justify-center gap-3 mt-4 ${loading ? 'opacity-50 cursor-wait' : ''}`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5">
             <Link to="/login" className="flex items-center justify-between group/link glass p-4 rounded-sm hover:bg-white/5 transition-all">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Already have an account?</span>
                <span className="flex items-center gap-2 text-[10px] font-black text-purple-400 uppercase tracking-widest group-hover/link:translate-x-1 transition-transform">
                  Sign In <ChevronRight className="w-3 h-3" />
                </span>
             </Link>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <div className="flex items-center gap-2 text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">
            <Shield className="w-2 h-2" /> Secure Connection
          </div>
          <div className="w-1 h-3 border-l border-white/10" />
          <div className="flex items-center gap-2 text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">
            v2.1.0 TourneyGrid
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
