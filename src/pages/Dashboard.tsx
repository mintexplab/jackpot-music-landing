import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

const Dashboard = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Fetch subscribers
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });

      if (error) {
        if (error.code === "PGRST301" || error.message.includes("RLS")) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to view subscribers",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        setSubscribers(data || []);
      }

      setIsLoading(false);
    };

    checkAuthAndFetch();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate("/auth");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <header className="p-6 flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back
          </Link>
        </Button>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut size={16} />
          Logout
        </Button>
      </header>

      <main className="flex-1 px-6 md:px-12 lg:px-24 py-12 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-8">
          Newsletter Subscribers
        </h1>

        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : subscribers.length === 0 ? (
          <p className="text-muted-foreground">No subscribers yet.</p>
        ) : (
          <div className="space-y-2">
            {subscribers.map((subscriber) => (
              <div
                key={subscriber.id}
                className="p-4 border border-border bg-secondary/50 flex justify-between items-center"
              >
                <span className="text-foreground">{subscriber.email}</span>
                <span className="text-muted-foreground text-sm">
                  {new Date(subscriber.subscribed_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-muted-foreground text-sm font-medium">
        © 2025 Jackpot Music Entertainment
      </footer>
    </div>
  );
};

export default Dashboard;
