import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

// GET /api/reviews?productId=xyz
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const productId = searchParams.get("productId")

        if (!productId) {
            return NextResponse.json({ error: "Product ID required" }, { status: 400 })
        }

        const supabase = await createClient()

        const { data: reviews, error } = await supabase
            .from("reviews")
            .select(`
        *,
        user:profiles(full_name, avatar_url)
      `)
            .eq("product_id", productId)
            .eq("status", "approved")
            .order("created_at", { ascending: false })

        if (error) {
            console.error("Error fetching reviews:", error)
            return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
        }

        // Get review stats
        const { data: statsData, error: statsError } = await supabase
            .rpc("get_review_stats", { product_id_param: productId })

        return NextResponse.json({
            reviews: reviews || [],
            stats: statsData || { average_rating: 0, total_reviews: 0 },
        })
    } catch (error) {
        console.error("Reviews error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

// POST /api/reviews
export async function POST(request: NextRequest) {
    try {
        // S4: Rate limiting — 5 review submissions per minute per IP
        const ip = getClientIp(request)
        const rateCheck = checkRateLimit(`reviews:post:${ip}`, { maxRequests: 5, windowSeconds: 60 })
        if (!rateCheck.success) {
            return NextResponse.json(
                { error: "Demasiadas solicitudes. Intenta de nuevo en unos minutos." },
                { status: 429 }
            )
        }

        const supabase = await createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { product_id, rating, title, comment, images } = body

        if (!product_id || !rating) {
            return NextResponse.json(
                { error: "Product ID and rating are required" },
                { status: 400 }
            )
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "Rating must be between 1 and 5" },
                { status: 400 }
            )
        }

        // Check if user already reviewed this product
        const { data: existing } = await supabase
            .from("reviews")
            .select("id")
            .eq("product_id", product_id)
            .eq("user_id", user.id)
            .single()

        if (existing) {
            return NextResponse.json(
                { error: "You have already reviewed this product" },
                { status: 400 }
            )
        }

        // Create review
        const { data: review, error } = await supabase
            .from("reviews")
            .insert({
                product_id,
                user_id: user.id,
                rating,
                title,
                comment,
                images,
                status: "approved", // Auto-approve for now, can change to "pending"
            })
            .select()
            .single()

        if (error) {
            console.error("Error creating review:", error)
            return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
        }

        return NextResponse.json({ review }, { status: 201 })
    } catch (error) {
        console.error("Review creation error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
