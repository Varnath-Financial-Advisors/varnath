import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TrustSignals from "@/components/TrustSignals";
import Services from "@/components/Services";
import StartupServices from "@/components/StartupServices";
import TaxCalculator from "@/components/TaxCalculator";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <TrustSignals />
      <Services />
      <StartupServices />
      <TaxCalculator />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
