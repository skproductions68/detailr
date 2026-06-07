import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL      = 'https://gxarqolizftthhaxekka.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4YXJxb2xpemZ0dGhoYXhla2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NDM5OTQsImV4cCI6MjA5MzMxOTk5NH0.GGWnE5kFXaVy0T3F_nS5WgYQ0exnSCZcrzH_Fv_QqNo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);