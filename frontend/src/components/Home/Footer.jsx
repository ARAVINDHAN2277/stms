import { Link } from 'react-router-dom';
import { Trophy, Globe, MessageCircle, Camera, Briefcase } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-dark pt-20 pb-10 border-t border-white/5 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <img src="/images/logo.png" alt="TourneyGrid Logo" className="h-8 w-8 object-contain group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-heading font-bold tracking-wider text-white">TourneyGrid</span>
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
            <h4 className="text-white font-bold mb-6 font-heading tracking-wide uppercase">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe to get the latest updates on new tournaments and features.</p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                required
              />
              <button 
                type="submit" 
                className="bg-primary hover:bg-primary-hover text-white rounded-lg px-4 py-3 text-sm font-bold transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} TourneyGrid. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
