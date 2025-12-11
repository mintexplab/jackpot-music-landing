import { useState } from "react";
import { Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // For now, just show success - backend needed for actual notification
    console.log("Newsletter signup:", email);
    
    toast({
      title: "Subscribed",
      description: "You've been added to our mailing list.",
    });
    
    setEmail("");
    setIsDialogOpen(false);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight text-center mb-12">
          Jackpot Music Group
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" asChild>
            <a href="mailto:demos@jackpotmusik.de">Demos</a>
          </Button>
          
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            Newsletter / New Releases
          </Button>
        </div>

        <div className="flex gap-6 mt-8">
          <a
            href="https://instagram.com/jackpotmusicgroup"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-[#ff0055] transition-colors"
          >
            <Instagram size={24} />
          </a>
          <a
            href="https://linkedin.com/jackpotmusic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-[#ff0055] transition-colors"
          >
            <Linkedin size={24} />
          </a>
        </div>
      </main>

      <footer className="py-6 text-center text-muted-foreground text-sm">
        © 2025 Jackpot Music Entertainment
      </footer>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Newsletter / New Releases</DialogTitle>
            <DialogDescription>
              Enter your email to stay updated on new releases.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary border-border"
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
