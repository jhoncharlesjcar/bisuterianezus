import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isUserAdmin, getCurrentUser } from "@/lib/admin-utils"
import { products as localProducts } from "@/lib/products"

export async function POST() {
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

        // Get existing products from Supabase
        const { data: existingProducts } = await supabase
            .from("products")
            .select("slug")

        const existingSlugs = new Set((existingProducts || []).map((p: any) => p.slug))

        // Get category IDs from Supabase
        const { data: categories } = await supabase
            .from("categories")
            .select("id, slug")

        const categoryMap: Record<string, string> = {}
        for (const cat of categories || []) {
            categoryMap[cat.slug] = cat.id
        }

        // Filter products that don't exist in Supabase yet
        const newProducts = localProducts.filter(p => !existingSlugs.has(p.slug))

        if (newProducts.length === 0) {
            return NextResponse.json({
                message: "Todos los productos ya están en Supabase",
                migrated: 0,
                skipped: localProducts.length
            })
        }

        const results = { success: [] as string[], errors: [] as string[] }

        for (const product of newProducts) {
            // Map category slug to actual category UUID
            const categoryId = product.category_id ? categoryMap[product.category_id] : null

            const insertData: Record<string, unknown> = {
                name: product.name,
                slug: product.slug,
                description: product.description,
                price: product.price,
                category_id: categoryId,
                image_url: product.image_url,
                stock_quantity: product.stock_quantity || 10,
                low_stock_threshold: product.low_stock_threshold || 3,
                in_stock: product.in_stock ?? true,
                featured: product.featured ?? false,
            }

            // Add lifestyle_image_url if it exists
            if ((product as any).lifestyle_image_url) {
                insertData.lifestyle_image_url = (product as any).lifestyle_image_url
            }

            const { error } = await supabase
                .from("products")
                .insert(insertData)

            if (error) {
                results.errors.push(`${product.name}: ${error.message}`)
            } else {
                results.success.push(product.name)
            }
        }

        return NextResponse.json({
            message: `Migración completada: ${results.success.length} insertados, ${results.errors.length} errores`,
            migrated: results.success.length,
            errors: results.errors,
            successNames: results.success
        })
    } catch (error) {
        console.error("Migration error:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
