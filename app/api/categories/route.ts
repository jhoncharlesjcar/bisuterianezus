import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
    try {
        const supabase = await createClient()

        const { data: categories, error } = await supabase
            .from("categories")
            .select("id, name, slug")
            .in("slug", ["aretes", "collares", "pulseras", "resplandor-estival", "elegancia-nocturna", "geometria-del-lujo", "coleccion-estelar", "edicion-limitada"])
            .order("name")

        if (error) {
            console.error("Categories error:", error)
            return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
        }

        return NextResponse.json({ categories: categories || [] })
    } catch (error) {
        console.error("Categories error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
