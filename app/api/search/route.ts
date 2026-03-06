import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { SearchFilters } from "@/lib/types"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const supabase = await createClient()

        // Parse filters
        const query = searchParams.get("q") || ""
        const categories = searchParams.get("categories")?.split(",").filter(Boolean) || []
        const minPrice = searchParams.get("minPrice") ? Number.parseFloat(searchParams.get("minPrice")!) : undefined
        const maxPrice = searchParams.get("maxPrice") ? Number.parseFloat(searchParams.get("maxPrice")!) : undefined
        const inStock = searchParams.get("inStock") === "true" ? true : searchParams.get("inStock") === "false" ? false : undefined
        const minRating = searchParams.get("minRating") ? Number.parseInt(searchParams.get("minRating")!) : undefined
        const sortBy = searchParams.get("sortBy") as SearchFilters["sortBy"] || "newest"
        const page = Number.parseInt(searchParams.get("page") || "1")
        const perPage = Number.parseInt(searchParams.get("perPage") || "12")

        // Build query
        let queryBuilder = supabase
            .from("products")
            .select(`
        *,
        category:categories(*)
      `, { count: "exact" })

        // Text search
        if (query) {
            queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%,sku.ilike.%${query}%`)
        }

        // Category filter
        if (categories.length > 0) {
            queryBuilder = queryBuilder.in("category_id", categories)
        }

        // Price filters
        if (minPrice !== undefined) {
            queryBuilder = queryBuilder.gte("price", minPrice)
        }
        if (maxPrice !== undefined) {
            queryBuilder = queryBuilder.lte("price", maxPrice)
        }

        // Stock filter
        if (inStock !== undefined) {
            queryBuilder = queryBuilder.eq("in_stock", inStock)
        }

        // Sorting
        switch (sortBy) {
            case "price_asc":
                queryBuilder = queryBuilder.order("price", { ascending: true })
                break
            case "price_desc":
                queryBuilder = queryBuilder.order("price", { ascending: false })
                break
            case "name_asc":
                queryBuilder = queryBuilder.order("name", { ascending: true })
                break
            case "name_desc":
                queryBuilder = queryBuilder.order("name", { ascending: false })
                break
            case "newest":
                queryBuilder = queryBuilder.order("created_at", { ascending: false })
                break
            default:
                queryBuilder = queryBuilder.order("created_at", { ascending: false })
        }

        // Pagination
        const from = (page - 1) * perPage
        const to = from + perPage - 1
        queryBuilder = queryBuilder.range(from, to)

        const { data: products, error, count } = await queryBuilder

        if (error) {
            console.error("Search error:", error)
            return NextResponse.json({ error: "Search failed" }, { status: 500 })
        }

        // Get review stats for rating filter (if needed)
        // This would require a separate aggregation query

        return NextResponse.json({
            products: products || [],
            total: count || 0,
            page,
            per_page: perPage,
            total_pages: Math.ceil((count || 0) / perPage),
        })
    } catch (error) {
        console.error("Search error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
