// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://saymkqzkshxyfouobgtj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNheW1rcXprc2h4eWZvdW9iZ3RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMzU2ODMsImV4cCI6MjA1NDcxMTY4M30.hpCZANeYXNerAIBzhrBm1tZjJ_6tbSPpH28nWbeaEXY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);