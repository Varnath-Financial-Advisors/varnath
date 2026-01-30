import { Link } from "react-router-dom";
import logo from "@/assets/varnath-logo.png";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <img src={logo} alt="Varnath Financial Advisors" className="h-12 w-auto mb-4" />
            <p className="text-sm opacity-80">
              Your trusted partner for financial excellence and regulatory compliance
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="opacity-80 hover:opacity-100 transition-opacity">Home</Link></li>
              <li><Link to="/services" className="opacity-80 hover:opacity-100 transition-opacity">Services</Link></li>
              <li><Link to="/knowledge-base" className="opacity-80 hover:opacity-100 transition-opacity">Knowledge Base</Link></li>
              <li><a href="#contact" className="opacity-80 hover:opacity-100 transition-opacity">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li className="opacity-80">Tax Advisory</li>
              <li className="opacity-80">Virtual CFO</li>
              <li className="opacity-80">MCA Compliance</li>
              <li className="opacity-80">ROC Filing</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-sm">
              <li className="opacity-80">Pillar No. 215, Budvel Village,</li>
              <li className="opacity-80">Rajendra Nagar Mandal,</li>
              <li className="opacity-80">Hyderabad - 500030</li>
              <li className="opacity-80 mt-3">+91 86880 32553</li>
              <li className="opacity-80">varnathfinancialadvisors@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 pt-8 text-center text-sm opacity-80">
          <p>&copy; {new Date().getFullYear()} Varnath Financial Advisors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
