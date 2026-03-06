import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isUserAdmin, getCurrentUser } from "@/lib/admin-utils"

// GET - Listar todas las reseñas
export async function GET(request: Request) {
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

        const { searchParams } = new URL(request.url)
        const status = searchParams.get("status")

        let query = supabase
            .from("reviews")
            .select(`
        *,
        product:products(id, name, slug, image_url),
        user:profiles(id, full_name, avatar_url)
      `)
            .order("created_at", { ascending: false })

        if (status && status !== "all") {
            query = query.eq("status", status)
        }

        const { data: reviews, error } = await query

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ reviews })
    } catch (error) {
        console.error("Error fetching reviews:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

// PUT - Actualizar estado de reseña (aprobar/rechazar)
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
        const { id, status } = body

        if (!id || !status) {
            return NextResponse.json({ error: "ID y estado requeridos" }, { status: 400 })
        }

        if (!["pending", "approved", "rejected"].includes(status)) {
            return NextResponse.json({ error: "Estado inválido" }, { status: 400 })
        }

        const { data: review, error } = await supabase
            .from("reviews")
            .update({ status, updated_at: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ review })
    } catch (error) {
        console.error("Error updating review:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

// DELETE - Eliminar reseña
export async function DELETE(request: Request) {
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

        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "ID requerido" }, { status: 400 })
        }

        const { error } = await supabase
            .from("reviews")
            .delete()
            .eq("id", id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting review:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
