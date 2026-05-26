import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext.jsx';

const Hero = () => {
  const { user } = useContext(AuthContext);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background with cinematic sports image and dark overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/80 via-navy-dark/60 to-navy-dark/95" />
        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark mb-8 text-secondary font-medium text-sm border border-secondary/30"
        >
          <Trophy size={16} className="text-secondary" />
          <span className="text-warm-surface">The Next Generation Sports Platform</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tight text-white mb-6 uppercase"
        >
          Compete. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Organise.</span> Inspire.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-12 font-sans font-light leading-relaxed"
        >
          A modern platform for discovering, managing, and organizing sports tournaments with ease.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
        >
          <Link 
            to="/explore"
            className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-hover text-white font-bold rounded-xl overflow-hidden shadow-[0_0_40px_rgba(255,107,53,0.3)] hover:shadow-[0_0_60px_rgba(255,107,53,0.5)] transition-all duration-300 hover:-translate-y-1"
          >
            <span className="relative z-10 text-lg">Explore Tournaments</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          {user ? (
            <Link 
              to={`/${user.role}-dashboard`}
              className="group flex items-center justify-center gap-2 px-8 py-4 glass-dark text-white font-bold text-lg rounded-xl hover:bg-white/10 border border-white/20 hover:border-white/40 transition-all duration-300 hover:-translate-y-1 shadow-lg backdrop-blur-md"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link 
              to="/organise-tournament"
              className="group flex items-center justify-center gap-2 px-8 py-4 glass-dark text-white font-bold text-lg rounded-xl hover:bg-white/10 border border-white/20 hover:border-white/40 transition-all duration-300 hover:-translate-y-1 shadow-lg backdrop-blur-md"
            >
              Organise Tournament
            </Link>
          )}
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-secondary to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
