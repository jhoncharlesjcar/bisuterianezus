import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
    try {
        const supabase = await createClient()
        await supabase.auth.signOut()

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Logout error:", error)
        return NextResponse.json({ error: "Error al cerrar sesión" }, { status: 500 })
    }
}

export async function GET() {
    try {
        const supabase = await createClient()
        await supabase.auth.signOut()

        // Redirect to home
        return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"))
    } catch (error) {
        console.error("Logout error:", error)
        return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"))
    }
}
