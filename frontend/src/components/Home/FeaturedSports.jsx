import { motion } from 'framer-motion';

const SportCard = ({ sport, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -10 }}
      className="glassmorphism rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="w-20 h-20 mb-4 rounded-full bg-dark-surface border border-white/5 flex items-center justify-center text-4xl group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] z-10">
        {sport.emoji}
      </div>
      
      <h3 className="text-xl font-heading font-bold text-white z-10 tracking-wide uppercase">{sport.name}</h3>
      <p className="text-sm text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 font-medium">Explore Tournaments &rarr;</p>
    </motion.div>
  );
};

const FeaturedSports = () => {
  const sports = [
    { name: "Football", emoji: "⚽" },
    { name: "Cricket", emoji: "🏏" },
    { name: "Basketball", emoji: "🏀" },
    { name: "Tennis", emoji: "🎾" },
    { name: "Volleyball", emoji: "🏐" },
    { name: "Kho Kho", emoji: "🏃‍♂️" }
  ];

  return (
    <section className="py-24 relative z-10 bg-dark-surface/50 border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-heading font-bold text-white mb-4 uppercase tracking-tight"
            >
              Featured <span className="text-primary">Disciplines</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 text-lg"
            >
              Compete in your favorite sports. We support a wide variety of formats and scoring rules.
            </motion.p>
          </div>
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mt-6 md:mt-0 px-6 py-3 rounded-full border border-gray-600 hover:border-primary text-white font-medium hover:text-primary transition-all text-sm"
          >
            View All Sports
          </motion.button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {sports.map((sport, index) => (
            <SportCard 
              key={index}
              sport={sport}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSports;
