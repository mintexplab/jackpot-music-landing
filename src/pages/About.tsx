import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <header className="p-6">
        <Button variant="outline" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back
          </Link>
        </Button>
      </header>

      <main className="flex-1 px-6 md:px-12 lg:px-24 py-12 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-8">
          About JMG
        </h1>

        <div className="space-y-8 text-foreground/90">
          <p className="text-lg leading-relaxed">
            Jackpot Music Group is a specialized, boutique label dedicated to driving the global success of established German Indie and Alternative artists. Based internationally, our mission is to provide the professionalism and reach of a major label while maintaining an artist-first ethos.
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
            <p className="mb-6 leading-relaxed">
              We focus entirely on accelerating the careers of artists who have already built a strong foundation (20k+ monthly listeners). Our services are built around operational efficiency and specialized European growth:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">Full-Service Global Distribution</h3>
                <p className="leading-relaxed text-muted-foreground">
                  We ensure your music reaches every major digital platform worldwide, optimized for modern streaming consumption.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">Dedicated A&R Development</h3>
                <p className="leading-relaxed text-muted-foreground">
                  We work closely with our artists to refine release strategies, secure collaborations, and provide strategic input that complements their independent vision.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">Specialized European Promotion</h3>
                <p className="leading-relaxed text-muted-foreground">
                  We leverage industry relationships and targeted campaigns to maximize exposure within the DACH-Region (Germany, Austria, Switzerland). This includes crucial investment in the active TV-Bemusterung (servicing to over 300 German broadcast channels, including ARD/ZDF) to secure sync and performance royalty opportunities.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">Administrative Excellence</h3>
                <p className="leading-relaxed text-muted-foreground">
                  We manage complex logistics, including digital rights administration and ensuring clean, transparent royalty collection so our artists can focus purely on creation.
                </p>
              </div>
            </div>
          </section>

          <p className="text-lg leading-relaxed border-t border-border pt-8">
            At Jackpot Music Group, we are partners in development, not just distributors. We provide the infrastructure and expertise necessary for established independent artists to reach their next major milestone.
          </p>
        </div>
      </main>

      <footer className="py-6 text-center text-muted-foreground text-sm font-medium">
        © 2025 Jackpot Music Entertainment
      </footer>
    </div>
  );
};

export default About;
