import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Trophy, Users, ShieldCheck, Swords } from 'lucide-react';

const AnimatedCounter = ({ from = 0, to, duration = 2, inView }) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!inView) return;
    
    let startTime;
    let animationFrame;
    
    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      if (progress < duration * 1000) {
        const currentCount = Math.floor(from + (to - from) * (progress / (duration * 1000)));
        setCount(currentCount);
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        setCount(to);
      }
    };
    
    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [from, to, duration, inView]);

  return <span>{count.toLocaleString()}</span>;
};

const StatCard = ({ icon: Icon, title, value, delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white p-8 rounded-2xl flex flex-col items-center justify-center text-center warm-shadow relative overflow-hidden group hover:warm-shadow-hover transition-all duration-300 border border-warm-border"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="w-16 h-16 rounded-full bg-warm-surface border border-primary/10 flex items-center justify-center mb-6 text-primary group-hover:text-secondary group-hover:scale-110 transition-all duration-500 z-10">
        <Icon size={32} />
      </div>
      
      <h3 className="text-4xl md:text-5xl font-heading font-bold text-navy-dark mb-2 z-10">
        <AnimatedCounter to={value} inView={isInView} />+
      </h3>
      
      <p className="text-text-muted font-medium uppercase tracking-wider text-sm z-10">{title}</p>
    </motion.div>
  );
};

const LiveStats = () => {
  const stats = [
    { icon: Trophy, title: "Tournaments Hosted", value: 1240 },
    { icon: Users, title: "Active Players", value: 45800 },
    { icon: ShieldCheck, title: "Organisers", value: 850 },
    { icon: Swords, title: "Matches Scheduled", value: 15600 }
  ];

  return (
    <section className="py-24 relative z-10 -mt-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard 
              key={index}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveStats;
