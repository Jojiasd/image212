import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// బిల్డ్ టైమ్‌లో కీస్ లేకపోయినా క్రాష్ అవ్వకుండా, కేవలం రన్‌టైమ్‌లో మాత్రమే క్లయింట్‌ను క్రియేట్ చేస్తుంది
export const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    })
  : (null as any);
