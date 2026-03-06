import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const code = searchParams.get("code")
        const subtotal = Number.parseFloat(searchParams.get("subtotal") || "0")

        if (!code) {
            return NextResponse.json({ valid: false, error: "Código requerido" }, { status: 400 })
        }

        const supabase = await createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        // Fetch coupon
        const { data: coupon, error } = await supabase
            .from("coupons")
            .select("*")
            .eq("code", code.toUpperCase())
            .single()

        if (error || !coupon) {
            return NextResponse.json({ valid: false, error: "Cupón no encontrado" })
        }

        // Validate coupon
        if (!coupon.active) {
            return NextResponse.json({ valid: false, error: "Cupón inactivo" })
        }

        const now = new Date()

        if (coupon.starts_at && new Date(coupon.starts_at) > now) {
            return NextResponse.json({ valid: false, error: "Cupón aún no válido" })
        }

        if (coupon.expires_at && new Date(coupon.expires_at) < now) {
            return NextResponse.json({ valid: false, error: "Cupón expirado" })
        }

        if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
            return NextResponse.json({ valid: false, error: "Cupón agotado" })
        }

        if (subtotal < coupon.min_purchase) {
            return NextResponse.json({
                valid: false,
                error: `Compra mínima de S/ ${coupon.min_purchase.toFixed(2)} requerida`,
            })
        }

        // Check user usage limit
        if (user && coupon.user_usage_limit) {
            const { count } = await supabase
                .from("coupon_usage")
                .select("*", { count: "exact", head: true })
                .eq("coupon_id", coupon.id)
                .eq("user_id", user.id)

            if (count && count >= coupon.user_usage_limit) {
                return NextResponse.json({ valid: false, error: "Ya usaste este cupón" })
            }
        }

        // Calculate discount
        let discountAmount = 0
        if (coupon.type === "percentage") {
            discountAmount = (subtotal * coupon.amount) / 100
            if (coupon.max_discount && discountAmount > coupon.max_discount) {
                discountAmount = coupon.max_discount
            }
        } else {
            discountAmount = coupon.amount
        }

        return NextResponse.json({
            valid: true,
            coupon,
            discount_amount: discountAmount,
        })
    } catch (error) {
        console.error("Coupon validation error:", error)
        return NextResponse.json({ valid: false, error: "Error al validar cupón" }, { status: 500 })
    }
}
