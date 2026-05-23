import Navbar from "../components/Home/Navbar.jsx";
import Hero from "../components/Home/Hero.jsx";
import LiveStats from "../components/Home/LiveStats.jsx";
import HowItWorks from "../components/Home/HowItWorks.jsx";
import FeaturedSports from "../components/Home/FeaturedSports.jsx";
import OrganiserPromo from "../components/Home/OrganiserPromo.jsx";
import Testimonials from "../components/Home/Testimonials.jsx";
import CTASection from "../components/Home/CTASection.jsx";
import Footer from "../components/Home/Footer.jsx";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-warm-bg text-text-main selection:bg-primary/30 selection:text-navy-dark">
      <Navbar />
      
      <main>
        <Hero />
        <LiveStats />
        <HowItWorks />
        <FeaturedSports />
        <OrganiserPromo />
        <Testimonials />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
