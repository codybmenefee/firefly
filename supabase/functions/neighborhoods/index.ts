// supabase/functions/neighborhoods/index.ts
// This import is correct for Deno/Supabase Edge Functions. Ignore local TS linter errors.
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

// Environment variables (set in supabase/.env)
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
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

// CRUD handlers
async function handleGet(req: Request, user: any) {
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  const neighborhoodId = pathParts[pathParts.length - 1];
  
  // Check if requesting specific neighborhood
  if (neighborhoodId && neighborhoodId !== 'neighborhoods') {
    // Get specific neighborhood
    const { data, error } = await supabase
      .from('neighborhoods')
      .select('*')
      .eq('id', neighborhoodId)
      .single();
    
    if (error) {
      return new Response(JSON.stringify({ error: 'Neighborhood not found' }), { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    return new Response(JSON.stringify(data), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
  
  // List all neighborhoods
  let query = supabase.from('neighborhoods').select('*');
  
  // Add filters if provided
  const city = url.searchParams.get('city');
  const state = url.searchParams.get('state');
  
  if (city) {
    query = query.eq('city', city);
  }
  if (state) {
    query = query.eq('state', state);
  }
  
  // Order by name
  query = query.order('name', { ascending: true });
  
  const { data, error } = await query;
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
  
  return new Response(JSON.stringify(data || []), { 
    headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
  });
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  
  // Authenticate user
  const { user, error } = await authenticateRequest(req);
  if (error) {
    return new Response(JSON.stringify({ error }), { 
      status: 401, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
  
  // Route based on HTTP method
  switch (req.method) {
    case 'GET':
      return await handleGet(req, user);
    default:
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
  }
}); 