import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.87.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NewsletterRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: NewsletterRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Processing newsletter signup for:", email);

    // Save to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: dbError } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });

    if (dbError && !dbError.message.includes("duplicate")) {
      console.error("Database error:", dbError);
      throw new Error("Failed to save subscription");
    }

    console.log("Sending newsletter confirmation to:", email);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Jackpot Music Group <newsletter@jackpotmusik.de>",
        to: [email],
        subject: "JMG Newsletter Subscription Confirmed / JMG Newsletter-Abonnement bestätigt",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #000; color: #fff; }
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              h1 { font-size: 24px; margin-bottom: 24px; }
              p { line-height: 1.6; margin-bottom: 16px; color: #ccc; }
              .divider { border-top: 1px solid #333; margin: 32px 0; }
              .footer { font-size: 12px; color: #666; margin-top: 40px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Your JMG newsletter subscription has been activated!</h1>
              <p>Thank you for subscribing to the Jackpot Music Group newsletter. You'll now receive updates about new releases, artist news, and exclusive content.</p>
              
              <div class="divider"></div>
              
              <h1>Ihr JMG Newsletter-Abonnement wurde aktiviert!</h1>
              <p>Vielen Dank für Ihre Anmeldung zum Newsletter der Jackpot Music Group. Sie erhalten ab sofort Updates über neue Veröffentlichungen, Künstlernews und exklusive Inhalte.</p>
              
              <div class="footer">
                <p>© 2025 Jackpot Music Entertainment</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-newsletter-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
