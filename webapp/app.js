import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 👇 Reemplaza con tus credenciales de Supabase
const SUPABASE_URL = 'https://obdcnthujuiyoxyagqrz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iZGNudGh1anVpeW94eWFncXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NTYyODYsImV4cCI6MjA3MTAzMjI4Nn0.SGjKqiHfv83b2oUaf3PeH1I5FFmb9L9OVgdQi65WnWM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Autenticación ---
export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return true;
}

export async function signOut() {
  await supabase.auth.signOut();
}

// --- Crear token y guardarlo en tabla ---
export async function createToken(amount, currency = 'USD', note = null, ttlMinutes = 5, assignedTo = null) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + ttlMinutes * 60000).toISOString();

  const { data, error } = await supabase
    .from('tokens')
    .insert({ token, amount, currency, note, assigned_to: assignedTo, expires_at: expiresAt })
    .select();

  if (error) throw error;
  return data;
}

// --- Validar token al escanear ---
export async function redeemToken(token) {
  const { data, error } = await supabase
    .from('tokens')
    .update({ used: true, used_at: new Date().toISOString() })
    .eq('token', token)
    .eq('used', false)
    .select();

  if (error) throw error;
  return data;
}
