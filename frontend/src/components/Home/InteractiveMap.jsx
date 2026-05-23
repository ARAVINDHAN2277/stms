import { motion } from 'framer-motion';
import { Map, Crosshair, Navigation } from 'lucide-react';

const InteractiveMap = () => {
  return (
    <section className="py-24 relative z-10 bg-dark-surface/50 border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-heading font-bold text-white mb-4 uppercase tracking-tight"
          >
            Find Tournaments <span className="text-primary">Near You</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            Our advanced GPS filtering shows exactly what's happening in your local area.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative w-full h-[500px] rounded-3xl glassmorphism border-2 border-white/10 overflow-hidden flex items-center justify-center group"
        >
          {/* Abstract Map Background Placeholder */}
          <div className="absolute inset-0 bg-dark-bg z-0 opacity-80" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDU5LCAxMzAsIDI0NiwgMC4xKSIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTAgMjBoNDBNMjAgMHY0MCIvPjwvZz48L3N2Zz4=')] z-0" />
          
          {/* Mock Map UI Elements */}
          <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
            <div className="bg-dark-surface/80 backdrop-blur-md border border-white/10 p-2 rounded-lg text-white shadow-lg">
              <Crosshair size={20} />
            </div>
            <div className="bg-dark-surface/80 backdrop-blur-md border border-white/10 flex flex-col rounded-lg text-white shadow-lg overflow-hidden">
              <button className="p-2 border-b border-white/10 hover:bg-white/10 transition-colors">+</button>
              <button className="p-2 hover:bg-white/10 transition-colors">-</button>
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
            <div className="w-48 h-48 bg-primary/20 rounded-full animate-ping absolute" />
            <div className="w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/50 relative">
              <Navigation className="text-primary" size={24} />
            </div>
          </div>

          {/* Mock Markers */}
          <div className="absolute top-1/3 left-1/4 z-10">
            <div className="w-4 h-4 bg-secondary rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
          </div>
          <div className="absolute bottom-1/3 right-1/4 z-10">
            <div className="w-4 h-4 bg-secondary rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
          </div>
          <div className="absolute top-2/3 left-2/3 z-10">
            <div className="w-4 h-4 bg-secondary rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent z-20 pointer-events-none" />
          
          <div className="absolute bottom-8 z-30 bg-dark-surface/90 backdrop-blur-md border border-white/10 px-8 py-4 rounded-full flex items-center gap-4 shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
            <Map size={24} className="text-primary" />
            <span className="text-white font-medium">Interactive Map Preview</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveMap;
