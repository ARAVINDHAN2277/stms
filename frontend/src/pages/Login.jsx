import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext.jsx";
import axios from "axios";
import { Link } from "react-router-dom";
import { Shield, Mail, Lock, LogIn, Zap } from "lucide-react";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password }, { withCredentials: true });
      const { token, userData } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      setError(err.response?.data?.message || "Access Denied. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 relative overflow-hidden bg-[#0a0a0c]">
      {/* Background Grid & Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="scanline"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-in">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4 animate-pulse">
            <Zap className="w-3 h-3 text-purple-400 fill-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">Secure Access Active</span>
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic glitch-text">
            Welcome <span className="text-purple-500">Back</span>
          </h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Log in to your account</p>
        </div>

        <div className="glass p-8 rounded-sm border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-50"></div>
          
          {error && (
            <div className="mb-6 p-3 bg-red-400/10 border border-red-400/20 text-red-400 text-[10px] font-black uppercase tracking-widest text-center animate-pulse">
              LOGIN ERROR: {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                <Mail className="w-3 h-3 text-purple-500" /> Email Address
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

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                <Lock className="w-3 h-3 text-blue-500" /> Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 glass-input text-white text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full tactical-btn bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-center justify-center gap-3 ${loading ? 'opacity-50 cursor-wait' : ''}`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 flex flex-col gap-4">
             <Link to="/signup" className="text-center group/link">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover/link:text-white transition-colors">New User? </span>
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest group-hover/link:text-purple-300 transition-colors underline decoration-purple-500/30 underline-offset-4">Create Account</span>
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

export default Login;
