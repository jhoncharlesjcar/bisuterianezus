/**
 * S6: Environment variable validation.
 * Next.js requires static access to NEXT_PUBLIC_ variables for bundling.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== "undefined") {
        console.error("❌ Critical: Supabase environment variables are missing! Check your .env.local file.")
    } else {
        throw new Error(
            `❌ Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. ` +
            `Please add them to your .env.local file.`
        )
    }
}

export const env = {
    supabaseUrl: supabaseUrl || "",
    supabaseAnonKey: supabaseAnonKey || "",
} as const
