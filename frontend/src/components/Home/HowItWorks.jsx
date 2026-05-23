import { motion } from 'framer-motion';
import { MapPin, Zap, Settings, CalendarClock, Target, Compass } from 'lucide-react';

const FeatureCard = ({ title, description, features, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className="glassmorphism p-8 rounded-2xl flex flex-col h-full glow-border hover:-translate-y-2 transition-transform duration-300"
    >
      <h3 className="text-2xl font-heading font-bold text-white mb-4 border-b border-white/10 pb-4">
        {title}
      </h3>
      <p className="text-gray-400 mb-8 flex-grow">
        {description}
      </p>
      
      <ul className="space-y-4">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <div className="mt-1 text-primary bg-primary/10 p-1.5 rounded-lg">
              <feature.icon size={18} />
            </div>
            <span className="text-gray-300 font-medium">{feature.text}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

const HowItWorks = () => {
  const cards = [
    {
      title: "For Players",
      description: "Find your next challenge easily. Our platform connects you with local tournaments in seconds.",
      features: [
        { icon: Compass, text: "Discover nearby tournaments using GPS" },
        { icon: Zap, text: "Register instantly with one click" },
        { icon: Target, text: "Track your matches and results" }
      ]
    },
    {
      title: "For Organisers",
      description: "Focus on the game, not the paperwork. We automate the entire tournament lifecycle.",
      features: [
        { icon: Settings, text: "Create and manage tournaments effortlessly" },
        { icon: CalendarClock, text: "Auto-generate schedules with simulated annealing" },
        { icon: MapPin, text: "Manage venues and participant logistics" }
      ]
    },
    {
      title: "Platform Features",
      description: "Built with cutting-edge tech to deliver a seamless, high-performance experience.",
      features: [
        { icon: MapPin, text: "Precision GPS-based discovery" },
        { icon: Zap, text: "Smart algorithmic match scheduling" },
        { icon: Settings, text: "Modern, secure tournament management" }
      ]
    }
  ];

  return (
    <section className="py-24 relative z-10 bg-dark-bg">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold text-white mb-4"
          >
            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Works</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            Whether you're looking to compete or host the next big event, STMS provides the ultimate toolset.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <FeatureCard 
              key={index}
              title={card.title}
              description={card.description}
              features={card.features}
              delay={index * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
