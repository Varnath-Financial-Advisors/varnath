import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Users, Target, Handshake, Building2 } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="py-20 px-4 bg-gradient-to-b from-accent/30 to-background">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              About Varnath Financial Advisors
            </h1>
            <p className="text-xl text-muted-foreground">
              Expert Financial Guidance for Your Business Success
            </p>
          </div>

          {/* Who We Are */}
          <Card className="mb-10">
            <CardContent className="pt-8 pb-8 px-8">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-7 h-7 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Who We Are</h2>
              </div>
              <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                Founded in <strong className="text-foreground">2020</strong>, <strong className="text-foreground">Varnath Financial Advisors</strong> was built with a clear mission —
                to simplify financial and compliance complexities for growing businesses.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                We understand that business owners should focus on scaling their vision, not getting slowed down by regulatory hurdles.
                Our role is to provide clarity, structure, and strategic financial direction so you can make confident decisions.
              </p>
            </CardContent>
          </Card>

          {/* Our Founder */}
          <Card className="mb-10">
            <CardContent className="pt-8 pb-8 px-8">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-7 h-7 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Our Founder</h2>
              </div>
              <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                <strong className="text-foreground">Varnath Financial Advisors</strong> is led by <strong className="text-foreground">CA Varun Athreya</strong>, a qualified Chartered Accountant
                committed to helping entrepreneurs build financially strong and compliant organizations.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                Recognizing that many startups struggle with compliance and financial structure during their growth phase,
                Varun founded the firm to act not just as a consultant — but as a long-term financial partner to business owners.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                His approach combines technical expertise with practical business insight, ensuring that clients receive
                advice that is both strategic and actionable.
              </p>
            </CardContent>
          </Card>

          {/* Our Philosophy */}
          <Card className="mb-10">
            <CardContent className="pt-8 pb-8 px-8">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-7 h-7 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Our Philosophy</h2>
              </div>
              <ul className="space-y-3">
                {[
                  "Simplify financial complexity",
                  "Build compliance-driven, future-ready businesses",
                  "Deliver advice you can actually act on",
                  "Create long-term partnerships — not transactional relationships",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-lg text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Who We Work With */}
          <Card className="mb-10">
            <CardContent className="pt-8 pb-8 px-8">
              <div className="flex items-center gap-3 mb-4">
                <Handshake className="w-7 h-7 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Who We Work With</h2>
              </div>
              <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                We specialize in supporting <strong className="text-foreground">business owners and entrepreneurs</strong> who want reliable financial guidance
                while focusing on growth.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Whether you are launching a startup or scaling an established company,
                our expertise ensures your financial foundation remains strong at every stage.
              </p>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="pt-10 pb-10 px-8 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Build Your Business With Financial Confidence
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Partner with experts who understand the financial challenges of growing businesses.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8"
                asChild
              >
                <a href="/#contact">Book a Consultation</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
