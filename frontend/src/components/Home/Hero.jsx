import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background with abstract stadium lights effect */}
      <div className="absolute inset-0 bg-dark-bg z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full mix-blend-screen" />
        
        {/* Abstract grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik02MCAwTDAgMHY2MGg2MFYweiIvPjxwYXRoIGQ9Ik0wIDE1aDYwTTBfMzBoNjBNMF80NWg2ME0xNSAwX3Y2ME0zMCAwX3Y2ME00NSAwX3Y2MCIvPjwvZz48L3N2Zz4=')] opacity-30" />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism mb-8 text-secondary font-medium text-sm glow-border"
        >
          <Activity size={16} />
          <span>The Next Generation Sports Platform</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tight text-white mb-6 uppercase"
        >
          Find. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Compete.</span> Organise.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-12 font-sans"
        >
          A modern platform for discovering and managing sports tournaments with GPS precision and automated scheduling.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
        >
          <Link 
            to="/display-tournaments"
            className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all"
          >
            <span className="relative z-10">Explore Tournaments</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 h-full w-0 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full z-0" />
          </Link>
          
          <Link 
            to="/organise-tournament"
            className="group flex items-center justify-center gap-2 px-8 py-4 glassmorphism text-white font-bold rounded-xl hover:bg-white/10 transition-all glow-border"
          >
            Organise Tournament
          </Link>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
