import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.87.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminPassword = Deno.env.get("ADMIN_PASSWORD")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const adminEmail = "malith@jackpotmusik.de";
    
    // Check if user exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === adminEmail);
    
    let userId: string;
    
    if (existingUser) {
      userId = existingUser.id;
      console.log("Admin user already exists:", userId);
    } else {
      // Create the admin user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
      });

      if (createError) {
        throw createError;
      }
      
      userId = newUser.user.id;
      console.log("Created admin user:", userId);
    }
    
    // Add admin role
    const { error: roleError } = await supabase
      .from("user_roles")
      .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });

    if (roleError) {
      console.error("Role error:", roleError);
      throw roleError;
    }

    console.log("Admin setup complete for:", adminEmail);

    return new Response(
      JSON.stringify({ success: true, message: "Admin account setup complete" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in setup-admin function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
