"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search, Download, Eye, MessageCircle, Trash2 } from "lucide-react"
import { OrderDetailModal } from "@/components/admin/order-detail-modal"
import { exportOrdersToCSV } from "@/lib/export-utils"
import { getAdminContactLink } from "@/lib/whatsapp"
import type { Order } from "@/lib/types"
import { toast } from "sonner"

const statusOptions = [
    { value: "all", label: "Todos", color: "bg-gray-500" },
    { value: "pending", label: "Pendiente", color: "bg-yellow-500" },
    { value: "processing", label: "Procesando", color: "bg-blue-500" },
    { value: "shipped", label: "Enviado", color: "bg-cyan-500" },
    { value: "delivered", label: "Entregado", color: "bg-green-500" },
    { value: "cancelled", label: "Cancelado", color: "bg-red-500" },
]

type OrderStatus = Order["status"]

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("all")
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        fetchOrders()
    }, [status, page])

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "20",
            })
            if (status !== "all") params.set("status", status)

            const response = await fetch(`/api/admin/orders?${params}`)
            if (response.ok) {
                const data = await response.json()
                setOrders(data.orders || [])
                setTotalPages(data.totalPages || 1)
            }
        } catch (error) {
            console.error("Error fetching orders:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const response = await fetch("/api/admin/orders", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: orderId, status: newStatus }),
            })

            if (response.ok) {
                setOrders(
                    orders.map((o) =>
                        o.id === orderId ? { ...o, status: newStatus as OrderStatus } : o
                    )
                )
                toast.success("Estado actualizado")
            } else {
                toast.error("Error al actualizar estado")
            }
        } catch {
            toast.error("Error de conexión")
        }
    }

    const handleDeleteOrder = async (orderId: string) => {
        const order = orders.find((o) => o.id === orderId)
        if (order?.status !== "cancelled") {
            toast.error("Solo se pueden eliminar pedidos cancelados")
            return
        }

        if (!confirm("¿Estás seguro de eliminar este pedido?")) return

        try {
            const response = await fetch(`/api/admin/orders?id=${orderId}`, {
                method: "DELETE",
            })

            if (response.ok) {
                setOrders(orders.filter((o) => o.id !== orderId))
                toast.success("Pedido eliminado")
            } else {
                const error = await response.json()
                toast.error(error.error || "Error al eliminar")
            }
        } catch {
            toast.error("Error de conexión")
        }
    }

    const handleWhatsApp = (order: Order) => {
        if (order.shipping_phone) {
            const link = getAdminContactLink(order.shipping_phone, {
                id: order.id,
                customer_name: order.shipping_full_name,
                status: order.status,
            })
            window.open(link, "_blank")
        } else {
            toast.error("Cliente sin teléfono registrado")
        }
    }

    const handleExport = () => {
        // Mapear a formato esperado por exportOrdersToCSV
        const exportData = orders.map(o => ({
            id: o.id,
            customer_name: o.shipping_full_name,
            customer_email: undefined,
            customer_phone: o.shipping_phone,
            total: o.total,
            status: o.status,
            created_at: o.created_at,
            shipping_address: `${o.shipping_address_line1}, ${o.shipping_city}`,
            items: o.items?.map(i => ({
                product_name: i.product_name,
                quantity: i.quantity,
                unit_price: i.unit_price
            }))
        }))
        exportOrdersToCSV(exportData)
        toast.success("Exportando pedidos...")
    }

    const filteredOrders = orders.filter(
        (o) =>
            o.shipping_full_name?.toLowerCase().includes(search.toLowerCase()) ||
            o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
            o.id.toLowerCase().includes(search.toLowerCase())
    )

    const getStatusBadge = (orderStatus: string) => {
        const statusInfo = statusOptions.find((s) => s.value === orderStatus)
        return (
            <Badge variant="outline" className="gap-1">
                <div className={`w-2 h-2 rounded-full ${statusInfo?.color || "bg-gray-500"}`} />
                {statusInfo?.label || orderStatus}
            </Badge>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Pedidos</h1>
                    <p className="text-muted-foreground">
                        Gestiona los pedidos de la tienda
                    </p>
                </div>
                <Button variant="outline" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Exportar Excel
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por cliente o número de pedido..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filtrar estado" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((s) => (
                                    <SelectItem key={s.value} value={s.value}>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${s.color}`} />
                                            {s.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-center py-8">Cargando pedidos...</p>
                    ) : filteredOrders.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            No se encontraron pedidos
                        </p>
                    ) : (
                        <>
                            <div className="divide-y">
                                {/* Header */}
                                <div className="hidden md:grid md:grid-cols-12 gap-4 py-2 text-sm font-medium text-muted-foreground">
                                    <div className="col-span-2">Pedido</div>
                                    <div className="col-span-3">Cliente</div>
                                    <div className="col-span-2 text-center">Total</div>
                                    <div className="col-span-2 text-center">Estado</div>
                                    <div className="col-span-1 text-center">Fecha</div>
                                    <div className="col-span-2 text-center">Acciones</div>
                                </div>

                                {filteredOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 items-center"
                                    >
                                        {/* Pedido */}
                                        <div className="col-span-2">
                                            <span className="font-mono text-sm font-medium">
                                                {order.order_number}
                                            </span>
                                        </div>

                                        {/* Cliente */}
                                        <div className="col-span-3">
                                            <p className="font-medium">{order.shipping_full_name || "Sin nombre"}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.shipping_phone || order.shipping_city || "-"}
                                            </p>
                                        </div>

                                        {/* Total */}
                                        <div className="col-span-2 text-center">
                                            <span className="font-semibold">S/ {order.total.toFixed(2)}</span>
                                        </div>

                                        {/* Estado */}
                                        <div className="col-span-2 flex justify-center">
                                            {getStatusBadge(order.status)}
                                        </div>

                                        {/* Fecha */}
                                        <div className="col-span-1 text-center text-sm text-muted-foreground">
                                            {new Date(order.created_at).toLocaleDateString("es-PE")}
                                        </div>

                                        {/* Acciones */}
                                        <div className="col-span-2 flex justify-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => { setSelectedOrder(order); setModalOpen(true) }}
                                                title="Ver detalle"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleWhatsApp(order)}
                                                title="WhatsApp"
                                                disabled={!order.shipping_phone}
                                            >
                                                <MessageCircle className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive"
                                                onClick={() => handleDeleteOrder(order.id)}
                                                title="Eliminar"
                                                disabled={order.status !== "cancelled"}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Paginación */}
                            {totalPages > 1 && (
                                <div className="flex justify-center gap-2 mt-6">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={page <= 1}
                                        onClick={() => setPage(page - 1)}
                                    >
                                        Anterior
                                    </Button>
                                    <span className="py-2 px-4 text-sm">
                                        Página {page} de {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={page >= totalPages}
                                        onClick={() => setPage(page + 1)}
                                    >
                                        Siguiente
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            <OrderDetailModal
                order={selectedOrder}
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setSelectedOrder(null) }}
                onStatusChange={handleStatusChange}
            />
        </div>
    )
}
