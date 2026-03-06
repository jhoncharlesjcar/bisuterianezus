import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Primero intentar admin_roles
        const { data: adminRole } = await supabase
            .from("admin_roles")
            .select("*")
            .eq("user_id", user.id)
            .single()

        if (adminRole) {
            return NextResponse.json({ role: adminRole })
        }

        // Fallback: verificar en profiles
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single()

        if (profile?.role === "admin") {
            return NextResponse.json({
                role: {
                    role: "admin",
                    permissions: ["products", "orders", "users"]
                }
            })
        }

        return NextResponse.json({ role: null })
    } catch (error) {
        console.error("Admin check error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
