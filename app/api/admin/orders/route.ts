import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isUserAdmin, getCurrentUser } from "@/lib/admin-utils"

// GET - Listar todos los pedidos
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
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "20")
        const offset = (page - 1) * limit

        let query = supabase
            .from("orders")
            .select(`
        *,
        items:order_items(
          id,
          product_name,
          product_image,
          quantity,
          unit_price,
          total_price
        )
      `, { count: "exact" })
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1)

        if (status && status !== "all") {
            query = query.eq("status", status)
        }

        const { data: orders, error, count } = await query

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            orders,
            total: count,
            page,
            totalPages: Math.ceil((count || 0) / limit)
        })
    } catch (error) {
        console.error("Error fetching orders:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

// PUT - Actualizar estado del pedido
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
        const { id, status, tracking_number, notes } = body

        if (!id) {
            return NextResponse.json({ error: "ID requerido" }, { status: 400 })
        }

        const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString()
        }

        if (status) updateData.status = status
        if (tracking_number !== undefined) updateData.tracking_number = tracking_number
        if (notes !== undefined) updateData.notes = notes

        const { data: order, error } = await supabase
            .from("orders")
            .update(updateData)
            .eq("id", id)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        if (status) {
            const statusMessages: Record<string, { title: string; description: string }> = {
                pending: { title: "Pedido Pendiente", description: "El pedido está pendiente de confirmación" },
                processing: { title: "En Proceso", description: "El pedido está siendo procesado" },
                shipped: { title: "Enviado", description: "El pedido ha sido enviado" },
                delivered: { title: "Entregado", description: "El pedido ha sido entregado" },
                cancelled: { title: "Cancelado", description: "El pedido ha sido cancelado" },
            }

            const statusInfo = statusMessages[status] || { title: status, description: "" }

            await supabase.from("order_tracking").insert({
                order_id: id,
                status,
                title: statusInfo.title,
                description: statusInfo.description,
            })
        }

        return NextResponse.json({ order })
    } catch (error) {
        console.error("Error updating order:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

// DELETE - Eliminar pedido (solo si está cancelado)
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

        const { data: order } = await supabase
            .from("orders")
            .select("status")
            .eq("id", id)
            .single()

        if (order?.status !== "cancelled") {
            return NextResponse.json({
                error: "Solo se pueden eliminar pedidos cancelados"
            }, { status: 400 })
        }

        await supabase.from("order_items").delete().eq("order_id", id)
        await supabase.from("order_tracking").delete().eq("order_id", id)

        const { error } = await supabase
            .from("orders")
            .delete()
            .eq("id", id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting order:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
