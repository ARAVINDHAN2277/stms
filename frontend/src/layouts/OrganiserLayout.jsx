import { useState, useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import { 
  LayoutDashboard, 
  Trophy, 
  PlusCircle, 
  Users, 
  Swords, 
  BarChart, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OrganiserLayout = () => {
  const { user, setUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/organiser-dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'My Tournaments', path: '/organiser/tournaments', icon: <Trophy size={20} /> },
    { name: 'Organise New', path: '/organise-tournament', icon: <PlusCircle size={20} /> },
    { name: 'Participants', path: '#', icon: <Users size={20} /> },
    { name: 'Matches', path: '#', icon: <Swords size={20} /> },
    { name: 'Analytics', path: '#', icon: <BarChart size={20} /> },
    { name: 'Settings', path: '#', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-warm-bg flex text-text-main">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-warm-border fixed h-full z-40">
        <div className="h-20 flex items-center px-6 border-b border-warm-border">
          <Link to="/" className="flex items-center gap-3">
            <img src="/images/logo.png" alt="TourneyGrid" className="h-8 w-8 object-contain" />
            <span className="text-xl font-heading font-bold tracking-wide text-navy-dark">TourneyGrid</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 px-2">Organiser OS</span>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-white font-medium shadow-md shadow-primary/20' 
                    : 'text-text-muted hover:bg-warm-surface hover:text-primary'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-warm-border">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header & Drawer */}
      <div className="lg:hidden fixed top-0 w-full bg-white border-b border-warm-border z-50 h-16 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="TourneyGrid" className="h-6 w-6 object-contain" />
          <span className="text-lg font-heading font-bold text-navy-dark">TourneyGrid</span>
        </Link>
        <button onClick={() => setMobileMenuOpen(true)} className="text-navy-dark p-2 rounded-lg bg-warm-surface">
          <Menu size={24} />
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy-dark/40 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed right-0 top-0 bottom-0 w-64 bg-white z-50 shadow-2xl flex flex-col lg:hidden"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-warm-border">
                <span className="font-heading font-bold text-navy-dark">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-text-muted p-2">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                        isActive ? 'bg-primary/10 text-primary font-medium' : 'text-text-muted'
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
              <div className="p-4 border-t border-warm-border">
                <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 p-2">
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
          {/* Header for Desktop */}
          <header className="hidden lg:flex items-center justify-between mb-8 pb-4 border-b border-warm-border/50">
            <div>
              <h2 className="text-2xl font-heading font-bold text-navy-dark">Welcome back, {user?.username}</h2>
              <p className="text-text-muted text-sm mt-1">Manage your tournaments and players efficiently.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg border border-primary/30">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            </div>
          </header>

          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default OrganiserLayout;
