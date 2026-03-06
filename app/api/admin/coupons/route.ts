import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isUserAdmin, getCurrentUser } from "@/lib/admin-utils"

// GET - Listar todos los cupones
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

        const { data: coupons, error } = await supabase
            .from("coupons")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ coupons })
    } catch (error) {
        console.error("Error fetching coupons:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

// POST - Crear nuevo cupón
export async function POST(request: Request) {
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
        const { code, discount_type, discount_value, min_purchase, max_uses, expires_at, is_active } = body

        if (!code || !discount_type || !discount_value) {
            return NextResponse.json({ error: "Código, tipo y valor son requeridos" }, { status: 400 })
        }

        const { data: coupon, error } = await supabase
            .from("coupons")
            .insert({
                code: code.toUpperCase(),
                discount_type,
                discount_value: parseFloat(discount_value),
                min_purchase: min_purchase ? parseFloat(min_purchase) : null,
                max_uses: max_uses ? parseInt(max_uses) : null,
                current_uses: 0,
                expires_at: expires_at || null,
                is_active: is_active ?? true,
            })
            .select()
            .single()

        if (error) {
            if (error.code === "23505") {
                return NextResponse.json({ error: "Ya existe un cupón con ese código" }, { status: 400 })
            }
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ coupon }, { status: 201 })
    } catch (error) {
        console.error("Error creating coupon:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

// PUT - Actualizar cupón
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
        const { id, ...updates } = body

        if (!id) {
            return NextResponse.json({ error: "ID requerido" }, { status: 400 })
        }

        const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }

        if (updates.code !== undefined) updateData.code = updates.code.toUpperCase()
        if (updates.discount_type !== undefined) updateData.discount_type = updates.discount_type
        if (updates.discount_value !== undefined) updateData.discount_value = parseFloat(updates.discount_value)
        if (updates.min_purchase !== undefined) updateData.min_purchase = updates.min_purchase ? parseFloat(updates.min_purchase) : null
        if (updates.max_uses !== undefined) updateData.max_uses = updates.max_uses ? parseInt(updates.max_uses) : null
        if (updates.expires_at !== undefined) updateData.expires_at = updates.expires_at || null
        if (updates.is_active !== undefined) updateData.is_active = updates.is_active

        const { data: coupon, error } = await supabase
            .from("coupons")
            .update(updateData)
            .eq("id", id)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ coupon })
    } catch (error) {
        console.error("Error updating coupon:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

// DELETE - Eliminar cupón
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
            .from("coupons")
            .delete()
            .eq("id", id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting coupon:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
