import { motion } from 'framer-motion';
import { MapPin, IndianRupee, Navigation, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const TournamentCard = ({ tournament, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="glassmorphism rounded-2xl overflow-hidden group hover:border-primary/50 transition-colors duration-300 flex flex-col h-full"
    >
      {/* Card Header Image Placeholder */}
      <div className="h-40 bg-gradient-to-br from-dark-surface to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs font-bold text-white border border-white/10 uppercase tracking-wider">
          {tournament.sportType}
        </div>
        <div className="absolute top-4 right-4 px-3 py-1 bg-secondary/20 text-secondary border border-secondary/30 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          Registrations Open
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-heading font-bold text-white mb-4 line-clamp-2">
          {tournament.tournamentName}
        </h3>
        
        <div className="space-y-3 mb-6 flex-grow">
          <div className="flex items-center text-gray-400 text-sm gap-2">
            <MapPin size={16} className="text-primary" />
            <span>{tournament.locationName || "Location not specified"}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-400 gap-2">
              <Navigation size={16} className="text-secondary" />
              <span>{tournament.distance} km away</span>
            </div>
            <div className="flex items-center text-white font-bold gap-1 bg-white/10 px-2 py-1 rounded-md">
              <IndianRupee size={14} className="text-gray-400" />
              {tournament.registrationFee}
            </div>
          </div>
        </div>
        
        <Link 
          to={`/display-tournaments`} 
          className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-center font-bold text-white hover:bg-primary hover:border-primary transition-all duration-300"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

const NearbyTournaments = () => {
  // Dynamic Placeholders for layout design
  const placeholders = [
    {
      id: "1",
      tournamentName: "Summer City Football Cup 2026",
      sportType: "Football",
      locationName: "Downtown Sports Arena",
      registrationFee: 500,
      distance: 2.4
    },
    {
      id: "2",
      tournamentName: "Regional Tennis Open",
      sportType: "Tennis",
      locationName: "Westside Tennis Club",
      registrationFee: 1200,
      distance: 5.1
    },
    {
      id: "3",
      tournamentName: "Midnight Basketball League",
      sportType: "Basketball",
      locationName: "Community Indoor Court",
      registrationFee: 300,
      distance: 8.7
    },
    {
      id: "4",
      tournamentName: "Cricket Super Series",
      sportType: "Cricket",
      locationName: "National Stadium Practice Grounds",
      registrationFee: 2000,
      distance: 12.3
    }
  ];

  return (
    <section className="py-24 relative z-10 bg-dark-bg">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-heading font-bold text-white mb-4 uppercase tracking-tight"
            >
              Tournaments <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-green-300">Near You</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 text-lg"
            >
              Discover and register for competitive events happening in your local area.
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mt-6 md:mt-0"
          >
            <Link 
              to="/display-tournaments"
              className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all text-sm inline-flex items-center gap-2"
            >
              Explore All <span aria-hidden="true">&rarr;</span>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {placeholders.map((tournament, index) => (
            <TournamentCard 
              key={tournament.id}
              tournament={tournament}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NearbyTournaments;
