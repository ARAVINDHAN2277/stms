import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const TestimonialCard = ({ quote, author, role, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className="bg-white p-6 md:p-8 rounded-2xl flex flex-col justify-between relative group warm-shadow hover:warm-shadow-hover transition-all duration-300 border border-warm-border"
    >
      <Quote className="text-primary/10 absolute top-6 right-6 w-12 h-12 md:w-16 md:h-16 transform -scale-x-100" />
      
      <p className="text-text-muted text-base md:text-lg italic mb-6 relative z-10">"{quote}"</p>
      
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-navy-dark font-bold font-heading text-sm md:text-base">
            {author.charAt(0)}
          </div>
        </div>
        <div>
          <h5 className="text-navy-dark font-bold text-sm md:text-base">{author}</h5>
          <p className="text-primary text-xs md:text-sm font-medium">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      quote: "TourneyGrid completely changed how we run our regional football leagues. The automated scheduling alone saved us weeks of manual work.",
      author: "Marcus Johnson",
      role: "League Director"
    },
    {
      quote: "As a competitive player, finding local tournaments used to be a hassle. Now, I just open the app and register instantly with my team.",
      author: "Sarah Chen",
      role: "Local Champion"
    },
    {
      quote: "The interface is simple yet powerful. It brings a completely new level of professionalism to our local weekend sports.",
      author: "David Alaba",
      role: "Tournament Organiser"
    }
  ];

  return (
    <section className="py-24 relative z-10 bg-warm-surface border-y border-warm-border overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Large Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-5/12 h-[500px] lg:h-[700px] relative rounded-3xl overflow-hidden warm-shadow-hover"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
              style={{ backgroundImage: "url('/images/testimonials-bg.png')" }}
            />
            {/* Gradient overlay for text contrast if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-10 left-10 pr-10">
              <h3 className="text-3xl font-heading font-bold text-white mb-2 tracking-tight">
                Built for the Community
              </h3>
              <p className="text-gray-300">
                Empowering local athletes and passionate organisers to elevate their game.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Testimonials */}
          <div className="w-full lg:w-7/12 flex flex-col gap-8">
            <div className="mb-4">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-heading font-bold text-navy-dark mb-4 tracking-tight"
              >
                What the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Community</span> Says
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-text-muted text-lg"
              >
                Hear from the players and organisers who use TourneyGrid to power their local events every weekend.
              </motion.p>
            </div>

            <div className="flex flex-col gap-6">
              {testimonials.map((test, index) => (
                <TestimonialCard 
                  key={index}
                  quote={test.quote}
                  author={test.author}
                  role={test.role}
                  delay={index * 0.15}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;
