import { SupabaseClient } from "@supabase/supabase-js"

/**
 * Verifica si el usuario actual es admin.
 * Busca en admin_roles O en profiles.role.
 */
export async function isUserAdmin(supabase: SupabaseClient): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    // Check admin_roles first
    const { data: adminRole } = await supabase
        .from("admin_roles")
        .select("role")
        .eq("user_id", user.id)
        .single()

    if (adminRole) return true

    // Fallback: check profiles.role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

    return profile?.role === "admin"
}

/**
 * Obtiene el usuario actual autenticado.
 */
export async function getCurrentUser(supabase: SupabaseClient) {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

/**
 * A3: Centralized admin requirement check.
 * Returns the authenticated user if they are an admin, otherwise returns an error response.
 * Use this in all admin API routes to avoid duplicating auth+admin check boilerplate.
 */
export async function requireAdmin(supabase: SupabaseClient) {
    const user = await getCurrentUser(supabase)

    if (!user) {
        return {
            user: null,
            error: { message: "No autorizado", status: 401 },
        }
    }

    const isAdmin = await isUserAdmin(supabase)

    if (!isAdmin) {
        return {
            user: null,
            error: { message: "Acceso denegado", status: 403 },
        }
    }

    return { user, error: null }
}
