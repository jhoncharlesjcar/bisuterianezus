import { SupabaseClient } from "@supabase/supabase-js"

/**
 * Verifica si el usuario actual es admin
 * Busca en admin_roles O en profiles.role
 */
export async function isUserAdmin(supabase: SupabaseClient): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    // Primero intentar admin_roles
    const { data: adminRole } = await supabase
        .from("admin_roles")
        .select("role")
        .eq("user_id", user.id)
        .single()

    if (adminRole) return true

    // Fallback: verificar en profiles
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

    return profile?.role === "admin"
}

/**
 * Obtiene el usuario actual autenticado
 */
export async function getCurrentUser(supabase: SupabaseClient) {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}
