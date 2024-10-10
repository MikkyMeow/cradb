import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hlsziigdseisbkblvhrm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsc3ppaWdkc2Vpc2JrYmx2aHJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4Mjk4OTAsImV4cCI6MjA0MjQwNTg5MH0.VtbQAbXFNezMM4SkGPlm6TlrlCr0S_0C3NihgpfpoBU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
