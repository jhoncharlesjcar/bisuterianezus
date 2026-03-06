"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, TrendingUp, AlertCircle, Star } from "lucide-react"
import type { DashboardStats } from "@/lib/types"

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const response = await fetch("/api/admin/stats")
            if (response.ok) {
                const data = await response.json()
                setStats(data)
            }
        } catch (error) {
            console.error("Error fetching stats:", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div>Cargando estadísticas...</div>
    }

    const statCards = [
        {
            title: "Ingresos del Mes",
            value: `S/ ${stats?.revenue_month?.toFixed(2) || "0.00"}`,
            icon: TrendingUp,
            color: "text-green-600",
        },
        {
            title: "Pedidos Totales",
            value: stats?.total_orders || 0,
            icon: ShoppingCart,
            color: "text-blue-600",
        },
        {
            title: "Productos en Stock Bajo",
            value: stats?.low_stock_products || 0,
            icon: AlertCircle,
            color: "text-orange-600",
        },
        {
            title: "Clientes Totales",
            value: stats?.total_customers || 0,
            icon: Users,
            color: "text-purple-600",
        },
        {
            title: "Pedidos Pendientes",
            value: stats?.pending_orders || 0,
            icon: Package,
            color: "text-yellow-600",
        },
        {
            title: "Reseñas Pendientes",
            value: stats?.pending_reviews || 0,
            icon: Star,
            color: "text-pink-600",
        },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Bienvenido al panel de administración</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {statCards.map((card) => (
                    <Card key={card.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                            <card.icon className={`h-4 w-4 ${card.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{card.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Ventas Recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Hoy</span>
                                <span className="font-semibold">S/ {stats?.revenue_today?.toFixed(2) || "0.00"}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Semana</span>
                                <span className="font-semibold">S/ {stats?.revenue_week?.toFixed(2) || "0.00"}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Mes</span>
                                <span className="font-semibold">S/ {stats?.revenue_month?.toFixed(2) || "0.00"}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pedidos Recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Hoy</span>
                                <span className="font-semibold">{stats?.orders_today || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Semana</span>
                                <span className="font-semibold">{stats?.orders_week || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Mes</span>
                                <span className="font-semibold">{stats?.orders_month || 0}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
