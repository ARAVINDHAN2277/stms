import { useState, useContext } from "react";
import  AuthContext  from "../context/AuthContext.jsx";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response  = await axios.post("http://localhost:5000/api/auth/login", { email, password }, { withCredentials: true });
      localStorage.setItem("token", response.data.token);
      setUser(response.data.userData);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 bg-[#111116] border border-white/5 rounded-sm shadow-2xl relative overflow-hidden group">
        {/* Subtle accent glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>

        <h2 className="text-3xl font-black tracking-tight text-center text-white uppercase mb-8">
          Welcome <span className="text-purple-500">Back</span>
        </h2>
        
        {error && <p className="text-red-400 mt-2 mb-4 text-center text-sm font-medium bg-red-400/10 py-2 rounded-sm border border-red-400/20">{error}</p>}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-400 font-medium text-xs tracking-wider uppercase mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-600 transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 font-bold tracking-widest text-white uppercase bg-purple-600 rounded-sm hover:bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all"
          >
            Login
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-500 font-medium">
          Don't have an account? <Link to="/signup" className="text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-wide">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
