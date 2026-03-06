import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isUserAdmin, getCurrentUser } from "@/lib/admin-utils"

// GET - Listar todos los usuarios
export async function GET() {
    try {
        const supabase = await createClient()

        const user = await getCurrentUser(supabase)
        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const isAdmin = await isUserAdmin(supabase)
        if (!isAdmin) {
            return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
        }

        const { data: profiles, error } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ users: profiles })
    } catch (error) {
        console.error("Error fetching users:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

// PUT - Actualizar usuario (ej: cambiar rol)
export async function PUT(request: Request) {
    try {
        const supabase = await createClient()

        const user = await getCurrentUser(supabase)
        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const isAdmin = await isUserAdmin(supabase)
        if (!isAdmin) {
            return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
        }

        const body = await request.json()
        const { id, role, is_active } = body

        if (!id) {
            return NextResponse.json({ error: "ID requerido" }, { status: 400 })
        }

        const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }

        if (role !== undefined) updateData.role = role
        if (is_active !== undefined) updateData.is_active = is_active

        const { data: profile, error } = await supabase
            .from("profiles")
            .update(updateData)
            .eq("id", id)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ user: profile })
    } catch (error) {
        console.error("Error updating user:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
