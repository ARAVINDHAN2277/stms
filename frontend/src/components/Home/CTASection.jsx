import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-24 relative z-10 bg-warm-bg overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl p-10 md:p-16 lg:p-20 text-center relative overflow-hidden warm-shadow-hover"
        >
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
            style={{ backgroundImage: "url('/images/cta-bg.png')" }}
          />
          <div className="absolute inset-0 bg-navy-dark/85 z-0" />
          <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-0" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-white mb-6 tracking-tight">
              Ready to Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Grid?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed font-light">
              Join thousands of local athletes and organisers on the premier platform for discovering, managing, and competing in sports tournaments across the region.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/signup"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl warm-shadow transition-all"
              >
                Create Free Account
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
