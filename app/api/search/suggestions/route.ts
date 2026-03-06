import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const query = searchParams.get("q") || ""

        if (query.length < 2) {
            return NextResponse.json({ suggestions: [] })
        }

        const supabase = await createClient()

        // Get matching product names
        const { data: products, error } = await supabase
            .from("products")
            .select("name")
            .ilike("name", `%${query}%`)
            .limit(5)

        if (error) {
            console.error("Suggestions error:", error)
            return NextResponse.json({ suggestions: [] })
        }

        const suggestions = products?.map((p) => p.name) || []

        return NextResponse.json({ suggestions })
    } catch (error) {
        console.error("Suggestions error:", error)
        return NextResponse.json({ suggestions: [] })
    }
}
