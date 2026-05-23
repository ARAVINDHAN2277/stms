import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const TestimonialCard = ({ quote, author, role, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className="glassmorphism p-8 rounded-2xl flex flex-col justify-between h-full relative group"
    >
      <Quote className="text-white/10 absolute top-6 right-6 w-16 h-16 transform -scale-x-100" />
      
      <p className="text-gray-300 text-lg italic mb-8 relative z-10">"{quote}"</p>
      
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
          <div className="w-full h-full rounded-full bg-dark-surface flex items-center justify-center text-white font-bold font-heading">
            {author.charAt(0)}
          </div>
        </div>
        <div>
          <h5 className="text-white font-bold">{author}</h5>
          <p className="text-primary text-sm font-medium">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      quote: "STMS completely changed how we run our regional football leagues. The automated scheduling alone saved us weeks of manual work.",
      author: "Marcus Johnson",
      role: "League Director"
    },
    {
      quote: "As a competitive player, finding tournaments near me used to be a hassle. Now, I just open the map and register instantly.",
      author: "Sarah Chen",
      role: "Pro Tennis Player"
    },
    {
      quote: "The interface is sleek and feels like a premium esports platform. It brings a completely new level of professionalism to local sports.",
      author: "David Alaba",
      role: "Tournament Organiser"
    }
  ];

  return (
    <section className="py-24 relative z-10 bg-dark-surface/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-heading font-bold text-white mb-4 uppercase tracking-tight"
          >
            What the <span className="text-secondary">Community</span> Says
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, index) => (
            <TestimonialCard 
              key={index}
              quote={test.quote}
              author={test.author}
              role={test.role}
              delay={index * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
