import { motion } from 'framer-motion';

const SportCard = ({ sport, delay, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className="group relative flex-1 hover:flex-[4] h-[120px] lg:h-[500px] rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] warm-shadow border-2 border-transparent hover:border-primary/30"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
        style={{ backgroundImage: `url(${sport.image})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-700" />
      
      {/* Content */}
      <div className="absolute inset-0 p-4 lg:p-6 flex flex-col justify-end">
        <div className="flex items-center gap-4">
          {/* Number Badge */}
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-heading font-bold shrink-0 border border-white/20 group-hover:bg-primary group-hover:border-primary transition-colors duration-500">
            0{index + 1}
          </div>
          
          {/* Title */}
          <div className="overflow-hidden">
            <h3 className="text-xl lg:text-3xl font-heading font-bold text-white tracking-wide uppercase drop-shadow-lg whitespace-nowrap transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              {sport.name}
            </h3>
          </div>
        </div>
        
        {/* Expandable CTA using Grid trick */}
        <div className="grid grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out ml-14 lg:ml-16">
          <div className="overflow-hidden">
            <div className="pt-2 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 delay-100">
              <span className="inline-flex items-center text-sm font-bold text-primary hover:text-white transition-colors">
                Explore Tournaments &rarr;
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturedSports = () => {
  const sports = [
    { name: "Football", image: "/images/sports/football.png" },
    { name: "Cricket", image: "/images/sports/cricket.png" },
    { name: "Basketball", image: "/images/sports/basketball.png" },
    { name: "Tennis", image: "/images/sports/tennis.png" },
    { name: "Volleyball", image: "/images/sports/volleyball.png" },
    { name: "Kho Kho", image: "/images/sports/khokho.png" }
  ];

  return (
    <section className="py-24 relative z-10 bg-warm-bg border-y border-warm-border overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-heading font-bold text-navy-dark mb-4 uppercase tracking-tight"
            >
              Featured <span className="text-primary">Disciplines</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-text-muted text-lg"
            >
              Compete in your favorite sports. We support a wide variety of formats and scoring rules.
            </motion.p>
          </div>
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mt-6 md:mt-0 px-8 py-4 rounded-full border-2 border-warm-border hover:border-primary text-navy-dark font-bold hover:text-primary transition-all text-sm shadow-sm hover:warm-shadow bg-white"
          >
            View All Sports
          </motion.button>
        </div>

        {/* Expanding Accordion Container */}
        <div className="flex flex-col lg:flex-row w-full gap-4">
          {sports.map((sport, index) => (
            <SportCard 
              key={index}
              index={index}
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
