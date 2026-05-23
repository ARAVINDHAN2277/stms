import { Link } from 'react-router-dom';
import { Trophy, Globe, MessageCircle, Camera, Briefcase } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#050810] pt-20 pb-10 border-t border-white/5 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Trophy className="text-primary" size={28} />
              <span className="text-2xl font-heading font-bold tracking-wider text-white">STMS</span>
            </Link>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              The premier platform for discovering, managing, and competing in sports tournaments across the globe. Built for athletes and organisers who demand excellence.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary transition-all">
                <MessageCircle size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary transition-all">
                <Camera size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary transition-all">
                <Briefcase size={18} />
              </a>
              <a href="https://github.com/ARAVINDHAN2277/stms" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary transition-all">
                <Globe size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-6 font-heading tracking-wide uppercase">Explore</h4>
            <ul className="space-y-3">
              <li><Link to="/display-tournaments" className="text-gray-400 hover:text-primary transition-colors text-sm">Find Tournaments</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">Interactive Map</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">Leaderboards</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">Sports Directory</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-heading tracking-wide uppercase">Organise</h4>
            <ul className="space-y-3">
              <li><Link to="/organise-tournament" className="text-gray-400 hover:text-primary transition-colors text-sm">Host a Tournament</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">Dashboard Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">Automated Scheduling</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-heading tracking-wide uppercase">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">Contact Us</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Sports Tournament Management System. All rights reserved.
          </p>
          <div className="text-sm font-mono text-gray-600">
            STMS v2.0.0
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
