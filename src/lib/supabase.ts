import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Cliente para uso no Browser/Client Components
export const supabase = createClient(supabaseUrl, supabaseAnonKey as string)

// Cliente para uso no Servidor (Server Actions/Auth.js) - Ignora RLS
// Usa um ternário para evitar crash no client-side (onde SUPABASE_SERVICE_ROLE_KEY é undefined)
export const supabaseAdmin = createClient(
  supabaseUrl, 
  typeof window === "undefined" ? supabaseServiceKey : "dummy-key-for-browser", 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

