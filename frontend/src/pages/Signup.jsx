import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("player");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", { username, email, password, role });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 bg-[#111116] border border-white/5 rounded-sm shadow-2xl relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

        <h2 className="text-3xl font-black tracking-tight text-center text-white uppercase mb-8">
          Join the <span className="text-purple-500">Grid</span>
        </h2>
        
        {error && <p className="text-red-400 mt-2 mb-4 text-center text-sm font-medium bg-red-400/10 py-2 rounded-sm border border-red-400/20">{error}</p>}
        
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-gray-400 font-medium text-xs tracking-wider uppercase mb-2">Username</label>
            <input
              type="text"
              placeholder="Display name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-600 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 font-medium text-xs tracking-wider uppercase mb-2">Email</label>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-600 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 font-medium text-xs tracking-wider uppercase mb-2">Password</label>
            <input
              type="password"
              placeholder="Secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-600 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 font-medium text-xs tracking-wider uppercase mb-2">Role</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white appearance-none cursor-pointer"
              >
                <option value="player">Player</option>
                <option value="organiser">Organiser</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-purple-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 mt-4 font-bold tracking-widest text-white uppercase bg-purple-600 rounded-sm hover:bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-500 font-medium">
          Already have an account? <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-wide">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
