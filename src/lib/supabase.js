import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not set. Please check your .env file.')
}

// Custom no-op lock: prevents Web Locks API deadlock with React auth listeners
// The gotrue-js lock can get stuck (especially with React Strict Mode),
// causing signOut() and other auth calls to hang indefinitely.
const noOpLock = (_name, _acquireTimeout, fn) => fn()

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      lock: noOpLock,
    },
  }
)

export default supabase
