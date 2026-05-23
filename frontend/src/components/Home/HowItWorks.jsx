import { motion } from 'framer-motion';
import { MapPin, Zap, Settings, CalendarClock, Target, Compass } from 'lucide-react';

const FeatureCard = ({ title, description, features, delay, watermark: WatermarkIcon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className="bg-white p-8 rounded-2xl flex flex-col h-full warm-shadow hover:warm-shadow-hover transition-all duration-300 relative overflow-hidden group border border-warm-border"
    >
      {/* Background Watermark Icon */}
      <div className="absolute -bottom-10 -right-10 text-primary/5 group-hover:text-primary/10 transition-colors duration-500 z-0 pointer-events-none">
        <WatermarkIcon size={200} strokeWidth={1} />
      </div>

      <h3 className="text-2xl font-heading font-bold text-navy-dark mb-4 border-b border-warm-border pb-4 relative z-10">
        {title}
      </h3>
      <p className="text-text-muted mb-8 flex-grow relative z-10">
        {description}
      </p>
      
      <ul className="space-y-4 relative z-10">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <div className="mt-1 text-primary bg-primary/10 p-1.5 rounded-lg">
              <feature.icon size={18} />
            </div>
            <span className="text-navy-surface font-medium">{feature.text}</span>
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
      watermark: Target,
      features: [
        { icon: Compass, text: "Discover nearby tournaments using GPS" },
        { icon: Zap, text: "Register instantly with one click" },
        { icon: Target, text: "Track your matches and results" }
      ]
    },
    {
      title: "For Organisers",
      description: "Focus on the game, not the paperwork. We automate the entire tournament lifecycle.",
      watermark: CalendarClock,
      features: [
        { icon: Settings, text: "Create and manage tournaments effortlessly" },
        { icon: CalendarClock, text: "Auto-generate schedules with simulated annealing" },
        { icon: MapPin, text: "Manage venues and participant logistics" }
      ]
    },
    {
      title: "Platform Features",
      description: "Built with cutting-edge tech to deliver a seamless, high-performance experience.",
      watermark: Zap,
      features: [
        { icon: MapPin, text: "Precision GPS-based discovery" },
        { icon: Zap, text: "Smart algorithmic match scheduling" },
        { icon: Settings, text: "Modern, secure tournament management" }
      ]
    }
  ];

  return (
    <section className="py-24 relative z-10 bg-warm-surface">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold text-navy-dark mb-4"
          >
            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Works</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-muted text-lg"
          >
            Whether you're looking to compete or host the next big event, TourneyGrid provides the ultimate toolset.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <FeatureCard 
              key={index}
              title={card.title}
              description={card.description}
              features={card.features}
              watermark={card.watermark}
              delay={index * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
