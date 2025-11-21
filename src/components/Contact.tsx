import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Get in Touch
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to take control of your financial future? Contact us today for a consultation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a href="mailto:varnathfinancialadvisors@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                      varnathfinancialadvisors@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <a href="tel:+918688032553" className="text-muted-foreground hover:text-primary transition-colors">
                      +91 86880 32553
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>15+ years of industry expertise</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Personalized service for every client</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Transparent pricing with no hidden costs</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>100% compliance guarantee</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Dedicated support team</span>
                </li>
              </ul>
              <Button 
                size="lg" 
                variant="secondary" 
                className="w-full mt-6"
              >
                Schedule Free Consultation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
