import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../../context/AuthContext.jsx';
import { Trophy, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(!isHomePage);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize and handle scroll state
  useEffect(() => {
    if (!isHomePage) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Initialize on mount
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-navy-dark shadow-md py-3' : 'bg-transparent py-5'}`}
    >
      <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/images/logo.png" alt="TourneyGrid Logo" className="h-8 w-8 object-contain group-hover:scale-110 transition-transform" />
          <span className="text-2xl font-heading font-bold tracking-wider text-white">TourneyGrid</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link to="/" className="hover:text-primary transition-colors text-gray-300">Home</Link>
          <Link to="/explore" className="hover:text-primary transition-colors text-gray-300">Explore</Link>
          <Link to="/organise-tournament" className="hover:text-primary transition-colors text-gray-300">Organise</Link>
          
          <div className="flex items-center gap-4 ml-4">
            {user ? (
              <>
                <Link 
                  to={`/${user.role}-dashboard`}
                  className="px-5 py-2 rounded-full bg-primary text-white font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 text-sm"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary transition-colors text-gray-300">Login</Link>
                <Link 
                  to="/signup" 
                  className="px-5 py-2 rounded-full bg-primary text-white font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden glass-dark mt-3 flex flex-col items-center py-6 gap-4 border-t border-white/10"
        >
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-lg">Home</Link>
          <Link to="/explore" onClick={() => setMobileMenuOpen(false)} className="text-lg">Explore</Link>
          <Link to="/organise-tournament" onClick={() => setMobileMenuOpen(false)} className="text-lg">Organise</Link>
          {user ? (
            <>
              <Link to={`/${user.role}-dashboard`} onClick={() => setMobileMenuOpen(false)} className="text-primary">Dashboard</Link>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="text-primary font-bold">Sign Up</Link>
            </>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
