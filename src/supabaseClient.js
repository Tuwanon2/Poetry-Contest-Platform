import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your actual Supabase project credentials
const SUPABASE_URL = 'https://ekpstgavxcnmmrhqswmc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpbnhkZXV5b2tqcnJ6bnJzbm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NTYwNjUsImV4cCI6MjA4NTQzMjA2NX0.SbXuIqzI0WaiYmDxRE8RGOvKeTXor9Ex0CTYzm02i38';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
