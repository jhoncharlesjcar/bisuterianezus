import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isUserAdmin, getCurrentUser } from "@/lib/admin-utils"

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

        // Get all products ordered by creation date
        const { data: products, error } = await supabase
            .from("products")
            .select("id, name, sku")
            .order("created_at", { ascending: true })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        const results = { updated: [] as string[], errors: [] as string[] }

        for (let i = 0; i < (products || []).length; i++) {
            const product = products![i]
            const skuNumber = String(i + 1).padStart(2, "0")
            const sku = `NEZ-${skuNumber}`

            const { error: updateError } = await supabase
                .from("products")
                .update({ sku })
                .eq("id", product.id)

            if (updateError) {
                results.errors.push(`${product.name}: ${updateError.message}`)
            } else {
                results.updated.push(`${sku} → ${product.name}`)
            }
        }

        return NextResponse.json({
            message: `SKUs actualizados: ${results.updated.length} productos`,
            updated: results.updated,
            errors: results.errors,
        })
    } catch (error) {
        console.error("SKU update error:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
