import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "player" // default role
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/signup", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || "Signup failed");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-navy-dark py-16">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[10%] left-[-5%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
      </div>

      <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative z-10 border border-warm-border/50 my-8">
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img src="/images/logo.png" alt="TourneyGrid" className="h-16 w-16 object-contain drop-shadow-md" />
          </Link>
        </div>
        <h2 className="text-3xl font-heading font-black text-center text-navy-dark mb-2 tracking-tight">Create Account</h2>
        <p className="text-center text-text-muted mb-8 font-medium">Join TourneyGrid to compete or organise.</p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 font-medium">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-navy-dark mb-2">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Your username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-5 py-3.5 rounded-xl border border-warm-border bg-warm-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-navy-dark font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-navy-dark mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-3.5 rounded-xl border border-warm-border bg-warm-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-navy-dark font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-navy-dark mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-3.5 rounded-xl border border-warm-border bg-warm-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-navy-dark font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-navy-dark mb-2">I want to...</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <label className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border cursor-pointer transition-all ${
                formData.role === "player" 
                  ? "border-primary bg-primary/10 text-primary font-bold shadow-sm" 
                  : "border-warm-border bg-warm-surface text-text-muted font-medium hover:border-primary/50"
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="player"
                  checked={formData.role === "player"}
                  onChange={handleChange}
                  className="hidden"
                />
                Play
              </label>
              <label className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border cursor-pointer transition-all ${
                formData.role === "organiser" 
                  ? "border-primary bg-primary/10 text-primary font-bold shadow-sm" 
                  : "border-warm-border bg-warm-surface text-text-muted font-medium hover:border-primary/50"
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="organiser"
                  checked={formData.role === "organiser"}
                  onChange={handleChange}
                  className="hidden"
                />
                Organise
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full px-4 py-4 mt-6 font-bold text-white bg-gradient-to-r from-primary to-primary-hover rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Create Account
          </button>
        </form>
        
        <p className="mt-8 text-center text-text-muted font-medium">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-bold hover:text-primary-hover transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
