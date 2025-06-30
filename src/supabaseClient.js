// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vckgeyxonrgydsfbrabj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZja2dleXhvbnJneWRzZmJyYWJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDQwODIsImV4cCI6MjA2NjMyMDA4Mn0.o15DP4G8Boe5w6C5wQAFJ2S7N1AxE1PxqwlYUso8oC4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey,{
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});