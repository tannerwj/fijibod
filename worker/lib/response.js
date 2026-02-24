import { corsHeaders } from './cors.js';

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}

export function error(message, status) {
  return json({ error: message }, status);
}
