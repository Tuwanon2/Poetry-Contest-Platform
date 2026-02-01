import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your actual Supabase project credentials
const SUPABASE_URL = 'https://ekpstgavxcnmmrhqswmc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_QglE8ympLl-WeJBdFSqCBA_PS8o5i6d';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
