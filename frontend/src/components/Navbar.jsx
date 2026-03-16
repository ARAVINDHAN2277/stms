import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDashboardRedirect = () => {
    if (user?.role === 'organiser') navigate('/organiser-dashboard');
    else if (user?.role === 'player') navigate('/player-dashboard');
    else navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const isHome = location.pathname === '/';

  return (
    <nav className="fixed w-full z-50 top-0 left-0 bg-[#0a0a0c]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-2xl font-black tracking-tighter text-white uppercase">
              Tourney<span className="text-purple-500">Grid</span>
            </span>
          </div>

          {/* Nav Links (Desktop) */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {isHome && (
                <>
                  <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide uppercase">Features</a>
                  <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide uppercase">How it Works</a>
                </>
              )}
              
              {user ? (
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-3 px-4 py-2 bg-white/5 border border-white/10 rounded-sm group hover:border-purple-500/50 transition-all">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></div>
                    <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest flex items-center">
                      <span className="text-gray-500 mr-2">ID:</span>
                      <span className="text-white group-hover:text-purple-400 transition-colors uppercase">{user.username || user.email?.split('@')[0]}</span>
                    </span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-400 transition-colors text-[10px] font-black tracking-widest uppercase"
                  >
                    Logout
                  </button>
                  <button 
                    onClick={handleDashboardRedirect}
                    className="px-6 py-2.5 rounded-sm bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]"
                  >
                    Dashboard
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-6">
                  <Link to="/login" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide uppercase">
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="px-6 py-2.5 rounded-sm bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
