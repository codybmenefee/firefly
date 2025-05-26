import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (_req) => {
  try {
    // Check both 'sightings' and 'neighborhoods' tables and return their row counts
    const { count: sightingsCount, error: sightingsError } = await supabase
      .from('sightings')
      .select('*', { count: 'exact', head: true });
    const { count: neighborhoodsCount, error: neighborhoodsError } = await supabase
      .from('neighborhoods')
      .select('*', { count: 'exact', head: true });

    if (sightingsError && sightingsError.code === '42P01') {
      return new Response(JSON.stringify({ success: false, error: "'sightings' table does not exist" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json',
                   'Access-Control-Allow-Origin': '*',
                   'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                   'Access-Control-Allow-Headers': 'Authorization, Content-Type', },
      });
    }
    if (neighborhoodsError && neighborhoodsError.code === '42P01') {
      return new Response(JSON.stringify({ success: false, error: "'neighborhoods' table does not exist" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json',
                   'Access-Control-Allow-Origin': '*',
                   'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                   'Access-Control-Allow-Headers': 'Authorization, Content-Type', },
      });
    }
    if (sightingsError || neighborhoodsError) {
      return new Response(JSON.stringify({ success: false, error: (sightingsError?.message || neighborhoodsError?.message) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json',
                   'Access-Control-Allow-Origin': '*',
                   'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                   'Access-Control-Allow-Headers': 'Authorization, Content-Type', },
      });
    }
    return new Response(JSON.stringify({ success: true, sightingsCount, neighborhoodsCount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json',
                 'Access-Control-Allow-Origin': '*',
                 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                 'Access-Control-Allow-Headers': 'Authorization, Content-Type', },
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json',
                 'Access-Control-Allow-Origin': '*',
                 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                 'Access-Control-Allow-Headers': 'Authorization, Content-Type', },
    });
  }
}); 