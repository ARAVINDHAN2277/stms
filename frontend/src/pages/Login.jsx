import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import  AuthContext  from "../context/AuthContext.jsx";
import axios from "axios";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("/api/auth/login", { email, password }, { withCredentials: true });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.userData));
      setUser(response.data.userData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-navy-dark pt-16">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
      </div>

      <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative z-10 border border-warm-border/50">
        <div className="flex justify-center mb-6">
          <Link to="/">
            <img src="/images/logo.png" alt="TourneyGrid" className="h-16 w-16 object-contain drop-shadow-md" />
          </Link>
        </div>
        <h2 className="text-3xl font-heading font-black text-center text-navy-dark mb-2 tracking-tight">Welcome Back</h2>
        <p className="text-center text-text-muted mb-8 font-medium">Sign in to your TourneyGrid account</p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-navy-dark mb-2">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border border-warm-border bg-warm-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-navy-dark font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-navy-dark mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border border-warm-border bg-warm-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-navy-dark font-medium"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-4 mt-4 font-bold text-white bg-gradient-to-r from-primary to-primary-hover rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Login to Account
          </button>
        </form>
        
        <p className="mt-8 text-center text-text-muted font-medium">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary font-bold hover:text-primary-hover transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
