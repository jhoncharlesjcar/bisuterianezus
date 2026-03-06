import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isUserAdmin, getCurrentUser } from "@/lib/admin-utils"

export const dynamic = 'force-dynamic'

// GET - Listar todos los productos (admin)
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

        const { data: dbProducts, error } = await supabase
            .from("products")
            .select(`
        *,
        category:categories(id, name, slug)
      `)
            .order("created_at", { ascending: false })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ products: dbProducts || [] })
    } catch (error) {
        console.error("Error fetching products:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

// POST - Crear nuevo producto
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
        const { name, description, price, category_id, image_url, lifestyle_image_url, stock_quantity, in_stock, featured } = body

        const slug = name.toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "")
            .substring(0, 50)

        const { data: product, error } = await supabase
            .from("products")
            .insert({
                name,
                slug,
                description,
                price: parseFloat(price),
                category_id,
                image_url,
                lifestyle_image_url,
                stock_quantity: parseInt(stock_quantity) || 10,
                low_stock_threshold: 5,
                in_stock: in_stock ?? true,
                featured: featured ?? false,
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ product }, { status: 201 })
    } catch (error) {
        console.error("Error creating product:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

// PUT - Actualizar producto
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

        const updateData: Record<string, unknown> = {}

        if (updates.name !== undefined) updateData.name = updates.name
        if (updates.description !== undefined) updateData.description = updates.description
        if (updates.price !== undefined) updateData.price = parseFloat(updates.price)
        if (updates.category_id !== undefined) updateData.category_id = updates.category_id
        if (updates.image_url !== undefined) updateData.image_url = updates.image_url
        if (updates.lifestyle_image_url !== undefined) updateData.lifestyle_image_url = updates.lifestyle_image_url
        if (updates.stock_quantity !== undefined) updateData.stock_quantity = parseInt(updates.stock_quantity)
        if (updates.in_stock !== undefined) updateData.in_stock = updates.in_stock
        if (updates.featured !== undefined) updateData.featured = updates.featured

        updateData.updated_at = new Date().toISOString()

        const { data: product, error } = await supabase
            .from("products")
            .update(updateData)
            .eq("id", id)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ product })
    } catch (error) {
        console.error("Error updating product:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

// DELETE - Eliminar producto
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
            .from("products")
            .delete()
            .eq("id", id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting product:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
