import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Testimonials = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const testimonials = [
    {
      name: "Rajesh Kumar",
      company: "TechStart Solutions Pvt. Ltd.",
      role: "Founder & CEO",
      rating: 5,
      review: "Varnath has been instrumental in managing our company's finances from day one. Their GST filing is always on time, and their tax planning saved us over ₹15 lakhs last year. Highly recommend their Virtual CFO services!",
    },
    {
      name: "Priya Sharma",
      company: "Sharma Textiles",
      role: "Managing Director",
      rating: 5,
      review: "We switched to Varnath for our MCA compliance needs and couldn't be happier. Their team is knowledgeable, responsive, and always keeps us updated on regulatory changes. A trusted partner for our business.",
    },
    {
      name: "Amit Patel",
      company: "GreenLeaf Exports",
      role: "Director",
      rating: 5,
      review: "The team at Varnath helped us navigate complex export documentation and tax benefits. Their advisory on FEMA compliance was invaluable. Professional service with personal attention.",
    },
    {
      name: "Sunita Agarwal",
      company: "Agarwal Medical Stores",
      role: "Proprietor",
      rating: 5,
      review: "As a small business owner, I needed reliable yet affordable CA services. Varnath delivered exactly that. From ITR filing to GST returns, everything is handled seamlessly. Five stars!",
    },
    {
      name: "Vikram Mehta",
      company: "Mehta & Associates Law Firm",
      role: "Senior Partner",
      rating: 5,
      review: "We've worked with several CA firms, but Varnath stands out for their attention to detail and proactive approach. Their quarterly financial reviews have transformed how we manage our firm's finances.",
    },
    {
      name: "Ananya Reddy",
      company: "CloudNine Tech",
      role: "Co-Founder",
      rating: 5,
      review: "Starting a tech company in India comes with many compliance challenges. Varnath guided us through company incorporation, ESOP structuring, and investor reporting. Couldn't have scaled without them!",
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-500 fill-yellow-500" : "text-muted"
        }`}
      />
    ));
  };

  return (
    <section id="testimonials" className="py-20 px-4 bg-background" ref={sectionRef}>
      <div className="container mx-auto">
        <div 
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4 fill-primary" />
            Client Reviews
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            What Our Clients Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trusted by businesses across India for reliable financial services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className={`group hover:shadow-xl transition-all duration-500 relative overflow-hidden border-2 border-transparent hover:border-primary/20 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ 
                transitionDelay: isVisible ? `${150 + index * 80}ms` : "0ms"
              }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardContent className="pt-6 relative">
                <Quote className="w-10 h-10 text-primary/10 absolute top-4 right-4 group-hover:text-primary/20 transition-colors" />
                <div className="flex gap-1 mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed relative z-10">
                  "{testimonial.review}"
                </p>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-primary font-medium">{testimonial.role}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
