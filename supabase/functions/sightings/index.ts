// supabase/functions/sightings/index.ts
// This import is correct for Deno/Supabase Edge Functions. Ignore local TS linter errors.
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

// Environment variables (set in supabase/.env)
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

// CORS headers for all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Change to your frontend URL in production
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

// Helper to extract and verify JWT
async function authenticateRequest(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, error: 'Missing or invalid Authorization header' };
  }
  const jwt = authHeader.replace('Bearer ', '');
  // Use Supabase Auth API to verify JWT
  const { data, error } = await supabase.auth.getUser(jwt);
  if (error || !data?.user) {
    return { user: null, error: 'Invalid or expired JWT' };
  }
  return { user: data.user, error: null };
}

// CRUD handler stubs
async function handleGet(req: Request, user: any) {
  // Return an empty array for now (stub)
  return new Response(JSON.stringify([]), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

async function handlePost(req: Request, user: any) {
  // TODO: Parse body, anonymize location, handle photo URL
  // Example stub for location anonymization
  /*
  const { latitude, longitude, ...rest } = await req.json();
  // TODO: Replace with real neighborhood lookup
  const neighborhood = 'stub-neighborhood';
  // TODO: Store sighting with neighborhood and photo URL
  */
  return new Response(JSON.stringify({ message: 'POST sightings (stub)' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

async function handlePut(req: Request, user: any) {
  // TODO: Implement PUT (update sighting)
  return new Response(JSON.stringify({ message: 'PUT sightings (stub)' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

async function handleDelete(req: Request, user: any) {
  // TODO: Implement DELETE (remove sighting)
  return new Response(JSON.stringify({ message: 'DELETE sightings (stub)' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  // Authenticate user
  const { user, error } = await authenticateRequest(req);
  if (error) {
    return new Response(JSON.stringify({ error }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
  // Route based on HTTP method
  switch (req.method) {
    case 'GET':
      return await handleGet(req, user);
    case 'POST':
      return await handlePost(req, user);
    case 'PUT':
      return await handlePut(req, user);
    case 'DELETE':
      return await handleDelete(req, user);
    default:
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
}); 