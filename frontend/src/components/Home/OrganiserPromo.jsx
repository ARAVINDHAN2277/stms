import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck, TrendingUp, Trophy } from 'lucide-react';

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
              
              {/* Authentic Dashboard Content */}
              <div className="bg-warm-bg rounded-b-xl p-4 sm:p-6 h-[400px] flex flex-col gap-4 border-x border-b border-warm-border overflow-hidden relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                  <div className="flex flex-col">
                    <span className="text-xl font-heading font-bold text-navy-dark">Overview</span>
                    <span className="text-[10px] text-text-muted">Welcome back, Organiser</span>
                  </div>
                  <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold text-xs border border-primary/30">O</div>
                </div>
                
                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-3xl border border-warm-border/50 shadow-sm relative overflow-hidden group">
                    <div className="absolute -top-6 -right-6 w-16 h-16 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all duration-500"></div>
                    <div className="flex flex-col gap-1 relative z-10">
                      <div className="flex items-center gap-2 text-text-muted text-[10px] font-bold uppercase tracking-wider"><Trophy size={14} className="text-primary" /> Active Events</div>
                      <div className="text-3xl font-heading font-black text-navy-dark">3</div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-3xl border border-warm-border/50 shadow-sm relative overflow-hidden group">
                    <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-secondary/10 rounded-full blur-xl group-hover:bg-secondary/20 transition-all duration-500"></div>
                    <div className="flex flex-col gap-1 relative z-10">
                      <div className="flex items-center gap-2 text-text-muted text-[10px] font-bold uppercase tracking-wider"><Users size={14} className="text-secondary" /> Participants</div>
                      <div className="text-3xl font-heading font-black text-navy-dark">128</div>
                    </div>
                  </div>
                </div>
                
                {/* Main Content Area */}
                <div className="flex-grow flex gap-4 mt-2">
                  {/* Tournaments List */}
                  <div className="w-2/3 bg-white rounded-3xl border border-warm-border/50 shadow-sm p-4 flex flex-col gap-3 relative overflow-hidden group">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-500"></div>
                    <div className="text-xs font-black text-navy-dark border-b border-warm-border/50 pb-2 relative z-10">Recent Tournaments</div>
                    <div className="flex-1 flex flex-col gap-2 relative z-10">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-warm-surface border border-warm-border/50 hover:border-primary/30 transition-colors">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-navy-dark">Summer Championship {i}</span>
                            <span className="text-[9px] text-text-muted font-medium">Football • LIVE</span>
                          </div>
                          <div className="px-2 py-1 bg-gradient-to-r from-green-400 to-green-500 text-white text-[9px] font-bold rounded-lg shadow-sm">LIVE</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Actions / Notifications */}
                  <div className="w-1/3 flex flex-col gap-3">
                    <div className="bg-navy-dark rounded-3xl p-3 flex flex-col items-center justify-center text-center gap-1 shadow-md shadow-navy-dark/30 relative overflow-hidden">
                      <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/5 rounded-full blur-md"></div>
                      <div className="w-6 h-6 bg-white/10 rounded-xl flex items-center justify-center text-white mb-1"><TrendingUp size={12} /></div>
                      <span className="text-[9px] text-white/70 font-bold uppercase tracking-wider">Revenue</span>
                      <span className="text-sm font-black text-white relative z-10">₹45K</span>
                    </div>
                    <div className="bg-gradient-to-br from-primary to-primary-hover rounded-3xl p-3 flex flex-col items-center justify-center text-center gap-1 shadow-md shadow-primary/30 flex-grow relative overflow-hidden group/btn">
                      <div className="absolute -right-4 -bottom-4 opacity-10 group-hover/btn:scale-110 transition-transform duration-500"><Trophy size={48} color="white" /></div>
                      <span className="text-[11px] font-black text-white relative z-10">+ Create</span>
                    </div>
                  </div>
                </div>
                
                {/* Fade overlay for realism at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-warm-bg to-transparent pointer-events-none" />
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
