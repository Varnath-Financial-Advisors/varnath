import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MessageSquare, Calculator, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Portal = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const displayName =
    (user?.user_metadata?.full_name as string) || user?.email || "Client";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const cards = [
    { icon: FileText, title: "My Documents", desc: "Your shared reports and filings will appear here." },
    { icon: MessageSquare, title: "Messages", desc: "Direct updates from your advisor." },
    { icon: Calculator, title: "Tax Calculator", desc: "Estimate your tax anytime.", href: `${import.meta.env.BASE_URL}#tax-calculator` },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <section className="flex-1 py-28 px-4 bg-gradient-to-b from-accent/30 to-background">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">
                Welcome, {displayName}
              </h1>
              <p className="text-muted-foreground">Your secure client area</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((c) => (
              <Card key={c.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <c.icon className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{c.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{c.desc}</p>
                  {c.href && (
                    <Button variant="link" className="px-0" asChild>
                      <a href={c.href}>Open</a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Portal;
