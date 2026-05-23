import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck, TrendingUp } from 'lucide-react';

const OrganiserPromo = () => {
  const benefits = [
    { icon: LayoutDashboard, title: "Centralized Dashboard", desc: "Manage all your tournaments from one sleek interface." },
    { icon: CalendarCheck, title: "Automated Scheduling", desc: "Our algorithm generates perfect match schedules instantly." },
    { icon: Users, title: "Participant Management", desc: "Handle registrations, fees, and brackets effortlessly." },
    { icon: TrendingUp, title: "Tournament Insights", desc: "Track revenue, participation rates, and match statistics." }
  ];

  return (
    <section className="py-24 relative z-10 bg-warm-bg overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full mix-blend-multiply pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Column: Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative rounded-2xl bg-white border border-warm-border p-2 warm-shadow rotate-[-2deg] hover:rotate-0 transition-transform duration-500 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Fake Browser Chrome */}
              <div className="bg-gray-100 rounded-t-xl px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="ml-4 px-3 py-1 text-xs text-gray-500 bg-white rounded-md shadow-sm border border-gray-200">organiser.tourneygrid.com</div>
              </div>
              
              {/* Fake Dashboard Content */}
              <div className="bg-white rounded-b-xl p-6 h-[400px] flex flex-col gap-4 border-x border-b border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 bg-gray-50 rounded-xl border border-gray-100 animate-pulse" />
                  <div className="h-24 bg-gray-50 rounded-xl border border-gray-100 animate-pulse" />
                  <div className="h-24 bg-gray-50 rounded-xl border border-gray-100 animate-pulse" />
                </div>
                <div className="flex-grow bg-gray-50 rounded-xl border border-gray-100 flex p-4 gap-4">
                  <div className="w-2/3 h-full bg-gray-200 rounded-lg animate-pulse" />
                  <div className="w-1/3 h-full flex flex-col gap-2">
                    <div className="h-8 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-navy-dark mb-6 tracking-tight">
              Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Passion.</span><br />
              Designed for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Performance.</span>
            </h2>
            <p className="text-text-muted text-lg mb-10 leading-relaxed">
              Transform the way you manage sports events. Our premium organiser tools eliminate manual paperwork and automate the heavy lifting so you can focus on the game.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="mt-1 text-primary bg-primary/10 p-2 rounded-lg h-fit">
                    <benefit.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-navy-dark font-bold mb-1">{benefit.title}</h4>
                    <p className="text-text-muted text-sm">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link 
              to="/organise-tournament"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl warm-shadow hover:warm-shadow-hover transition-all"
            >
              Start Organising
            </Link>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default OrganiserPromo;
