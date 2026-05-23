import Navbar from "../components/Home/Navbar.jsx";
import Hero from "../components/Home/Hero.jsx";
import LiveStats from "../components/Home/LiveStats.jsx";
import HowItWorks from "../components/Home/HowItWorks.jsx";
import FeaturedSports from "../components/Home/FeaturedSports.jsx";
import NearbyTournaments from "../components/Home/NearbyTournaments.jsx";
import InteractiveMap from "../components/Home/InteractiveMap.jsx";
import OrganiserPromo from "../components/Home/OrganiserPromo.jsx";
import Testimonials from "../components/Home/Testimonials.jsx";
import Footer from "../components/Home/Footer.jsx";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg text-white selection:bg-primary/30 selection:text-white">
      <Navbar />
      
      <main>
        <Hero />
        <LiveStats />
        <HowItWorks />
        <FeaturedSports />
        <NearbyTournaments />
        <InteractiveMap />
        <OrganiserPromo />
        <Testimonials />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
