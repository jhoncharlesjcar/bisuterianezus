import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ isAdmin: false }, { status: 401 })
        }

        // Check admin_roles table
        const { data: adminRole } = await supabase
            .from("admin_roles")
            .select("role")
            .eq("user_id", user.id)
            .single()

        if (adminRole) {
            // S7: Only return boolean, resolve permissions server-side
            return NextResponse.json({ isAdmin: true })
        }

        // Fallback: check profiles.role
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single()

        if (profile?.role === "admin") {
            return NextResponse.json({ isAdmin: true })
        }

        return NextResponse.json({ isAdmin: false })
    } catch (error) {
        console.error("Admin check error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
