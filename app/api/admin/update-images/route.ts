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

        // Get all products from Supabase
        const { data: dbProducts, error } = await supabase
            .from("products")
            .select("id, slug, image_url, lifestyle_image_url")

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Build a map from slug -> Cloudinary URLs (from local products)
        const localMap: Record<string, { image_url: string; lifestyle_image_url?: string }> = {}
        for (const p of localProducts) {
            localMap[p.slug] = {
                image_url: p.image_url || "",
                lifestyle_image_url: (p as any).lifestyle_image_url,
            }
        }

        const results = { updated: [] as string[], skipped: [] as string[], errors: [] as string[] }

        for (const dbProduct of dbProducts || []) {
            const localData = localMap[dbProduct.slug]
            if (!localData) {
                results.skipped.push(`${dbProduct.slug}: no local match`)
                continue
            }

            // Check if already using Cloudinary
            if (dbProduct.image_url?.includes("res.cloudinary.com")) {
                results.skipped.push(`${dbProduct.slug}: already on Cloudinary`)
                continue
            }

            // Update to Cloudinary URLs
            const updateData: Record<string, string> = {
                image_url: localData.image_url,
            }
            if (localData.lifestyle_image_url) {
                updateData.lifestyle_image_url = localData.lifestyle_image_url
            }

            const { error: updateError } = await supabase
                .from("products")
                .update(updateData)
                .eq("id", dbProduct.id)

            if (updateError) {
                results.errors.push(`${dbProduct.slug}: ${updateError.message}`)
            } else {
                results.updated.push(dbProduct.slug)
            }
        }

        return NextResponse.json({
            message: `Actualización completada: ${results.updated.length} actualizados, ${results.skipped.length} omitidos, ${results.errors.length} errores`,
            updated: results.updated,
            skipped: results.skipped,
            errors: results.errors,
        })
    } catch (error) {
        console.error("Update images error:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
