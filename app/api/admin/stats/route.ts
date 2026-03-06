import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
    try {
        const supabase = await createClient()

        // Verificar si el usuario es admin
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { data: adminRole } = await supabase
            .from("admin_roles")
            .select("*")
            .eq("user_id", user.id)
            .single()

        if (!adminRole) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 })
        }

        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)
        const monthAgo = new Date(today)
        monthAgo.setMonth(monthAgo.getMonth() - 1)

        // Total revenue
        const { data: orders } = await supabase
            .from("orders")
            .select("total, created_at, status")
            .eq("payment_status", "paid")

        const totalRevenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0
        const revenueToday = orders?.filter(o => new Date(o.created_at) >= today).reduce((sum, order) => sum + order.total, 0) || 0
        const revenueWeek = orders?.filter(o => new Date(o.created_at) >= weekAgo).reduce((sum, order) => sum + order.total, 0) || 0
        const revenueMonth = orders?.filter(o => new Date(o.created_at) >= monthAgo).reduce((sum, order) => sum + order.total, 0) || 0

        // Total orders
        const totalOrders = orders?.length || 0
        const ordersToday = orders?.filter(o => new Date(o.created_at) >= today).length || 0
        const ordersWeek = orders?.filter(o => new Date(o.created_at) >= weekAgo).length || 0
        const ordersMonth = orders?.filter(o => new Date(o.created_at) >= monthAgo).length || 0
        const pendingOrders = orders?.filter(o => o.status === "pending").length || 0

        // Products with low stock
        const { data: lowStockProducts } = await supabase
            .from("products")
            .select("id")
            .lt("stock_quantity", 5)
            .eq("in_stock", true)

        const lowStockCount = lowStockProducts?.length || 0

        // Total customers (unique users with orders)
        const { data: profiles } = await supabase
            .from("profiles")
            .select("id", { count: "exact", head: true })

        const totalCustomers = profiles || 0

        // Pending reviews
        const { data: pendingReviews } = await supabase
            .from("reviews")
            .select("id", { count: "exact", head: true })
            .eq("status", "pending")

        const pendingReviewsCount = pendingReviews || 0

        return NextResponse.json({
            total_revenue: totalRevenue,
            total_orders: totalOrders,
            pending_orders: pendingOrders,
            low_stock_products: lowStockCount,
            total_customers: totalCustomers,
            pending_reviews: pendingReviewsCount,
            revenue_today: revenueToday,
            revenue_week: revenueWeek,
            revenue_month: revenueMonth,
            orders_today: ordersToday,
            orders_week: ordersWeek,
            orders_month: ordersMonth,
        })
    } catch (error) {
        console.error("Stats error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
