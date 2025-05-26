// supabase/functions/sightings/index.ts
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
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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

// Helper to find neighborhood for given coordinates
async function getNeighborhoodForLocation(lat: number, lng: number) {
  // For MVP, we'll use a simple approach - find the nearest neighborhood
  // In production, this would use PostGIS or similar for proper point-in-polygon tests
  
  const { data: neighborhoods, error } = await supabase
    .from('neighborhoods')
    .select('*');
  
  if (error || !neighborhoods || neighborhoods.length === 0) {
    return 'Unknown';
  }
  
  // For now, return the first neighborhood or a default
  // TODO: Implement proper geospatial lookup
  return neighborhoods[0]?.name || 'Unknown';
}

// CRUD handlers
async function handleGet(req: Request, user: any) {
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  const sightingId = pathParts[pathParts.length - 1];
  
  // Check if requesting specific sighting
  if (sightingId && sightingId !== 'sightings') {
    // Get specific sighting
    const { data, error } = await supabase
      .from('sightings')
      .select('*')
      .eq('id', sightingId)
      .single();
    
    if (error) {
      return new Response(JSON.stringify({ error: 'Sighting not found' }), { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    return new Response(JSON.stringify(data), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
  
  // List all sightings (with optional filters)
  let query = supabase.from('sightings').select('*');
  
  // Add filters if provided
  const userId = url.searchParams.get('user_id');
  if (userId) {
    query = query.eq('user_id', userId);
  }
  
  // Order by creation date, newest first
  query = query.order('created_at', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
  
  // For public view, anonymize exact locations
  const publicData = data?.map(sighting => {
    if (sighting.user_id !== user.id) {
      // Hide exact coordinates for other users' sightings
      const { location_lat, location_lng, ...publicSighting } = sighting;
      return publicSighting;
    }
    return sighting;
  });
  
  return new Response(JSON.stringify(publicData || []), { 
    headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
  });
}

async function handlePost(req: Request, user: any) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.sighting_date || body.firefly_count === undefined || 
        body.location_lat === undefined || body.location_lng === undefined) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: sighting_date, firefly_count, location_lat, location_lng' 
      }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    // Get neighborhood for anonymization
    const neighborhood = await getNeighborhoodForLocation(body.location_lat, body.location_lng);
    
    // Prepare sighting data
    const sightingData = {
      user_id: user.id,
      sighting_date: body.sighting_date,
      sighting_time: body.sighting_time || null,
      firefly_count: body.firefly_count,
      weather_conditions: body.weather_conditions || null,
      location_neighborhood: neighborhood,
      location_lat: body.location_lat,
      location_lng: body.location_lng,
      notes: body.notes || null,
      photo_url: body.photo_url || null,
      verified: false,
      created_at: new Date().toISOString()
    };
    
    // Insert sighting
    const { data, error } = await supabase
      .from('sightings')
      .insert([sightingData])
      .select()
      .single();
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    return new Response(JSON.stringify(data), { 
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { 
      status: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
}

async function handlePut(req: Request, user: any) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const sightingId = pathParts[pathParts.length - 1];
    
    if (!sightingId || sightingId === 'sightings') {
      return new Response(JSON.stringify({ error: 'Sighting ID required' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    // Check if user owns the sighting
    const { data: existing, error: fetchError } = await supabase
      .from('sightings')
      .select('user_id')
      .eq('id', sightingId)
      .single();
    
    if (fetchError || !existing) {
      return new Response(JSON.stringify({ error: 'Sighting not found' }), { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    if (existing.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized: not owner of sighting' }), { 
        status: 403, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    const body = await req.json();
    
    // If location is being updated, recalculate neighborhood
    if (body.location_lat !== undefined && body.location_lng !== undefined) {
      body.location_neighborhood = await getNeighborhoodForLocation(body.location_lat, body.location_lng);
    }
    
    // Update sighting
    const { data, error } = await supabase
      .from('sightings')
      .update(body)
      .eq('id', sightingId)
      .select()
      .single();
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    return new Response(JSON.stringify({ success: true, updated: data }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { 
      status: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
}

async function handleDelete(req: Request, user: any) {
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  const sightingId = pathParts[pathParts.length - 1];
  
  if (!sightingId || sightingId === 'sightings') {
    return new Response(JSON.stringify({ error: 'Sighting ID required' }), { 
      status: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
  
  // Check if user owns the sighting
  const { data: existing, error: fetchError } = await supabase
    .from('sightings')
    .select('user_id')
    .eq('id', sightingId)
    .single();
  
  if (fetchError || !existing) {
    return new Response(JSON.stringify({ error: 'Sighting not found' }), { 
      status: 404, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
  
  if (existing.user_id !== user.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized: not owner of sighting' }), { 
      status: 403, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
  
  // Delete sighting
  const { error } = await supabase
    .from('sightings')
    .delete()
    .eq('id', sightingId);
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
  
  return new Response(JSON.stringify({ success: true }), { 
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
    case 'POST':
      return await handlePost(req, user);
    case 'PUT':
      return await handlePut(req, user);
    case 'DELETE':
      return await handleDelete(req, user);
    default:
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
  }
}); 