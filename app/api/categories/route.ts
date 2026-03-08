import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { unstable_cache } from "next/cache"

// A4: Cached category fetching with 60s revalidation
const getCachedCategories = unstable_cache(
    async () => {
        const supabase = await createClient()
        const { data: categories, error } = await supabase
            .from("categories")
            .select("id, name, slug")
            .in("slug", ["aretes", "collares", "pulseras", "resplandor-estival", "elegancia-nocturna", "geometria-del-lujo", "coleccion-estelar", "edicion-limitada"])
            .order("name")

        if (error) {
            console.error("Categories cache error:", error)
            return []
        }

        return categories || []
    },
    ["categories-list"],
    { revalidate: 60 }
)

export async function GET() {
    try {
        const categories = await getCachedCategories()
        return NextResponse.json({ categories })
    } catch (error) {
        console.error("Categories error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
