"use client"

import { X, Package, MapPin, Phone, Mail, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getAdminContactLink } from "@/lib/whatsapp"
import type { Order } from "@/lib/types"

interface OrderDetailModalProps {
    order: Order | null
    isOpen: boolean
    onClose: () => void
    onStatusChange: (orderId: string, status: string) => Promise<void>
}

const statusOptions = [
    { value: "pending", label: "Pendiente", color: "bg-yellow-500" },
    { value: "confirmed", label: "Confirmado", color: "bg-blue-500" },
    { value: "preparing", label: "Preparando", color: "bg-purple-500" },
    { value: "shipped", label: "Enviado", color: "bg-cyan-500" },
    { value: "delivered", label: "Entregado", color: "bg-green-500" },
    { value: "cancelled", label: "Cancelado", color: "bg-red-500" },
]

export function OrderDetailModal({ order, isOpen, onClose, onStatusChange }: OrderDetailModalProps) {
    if (!isOpen || !order) return null

    const currentStatus = statusOptions.find(s => s.value === order.status) || statusOptions[0]

    const handleWhatsApp = () => {
        if (order.shipping_phone) {
            const link = getAdminContactLink(order.shipping_phone, {
                id: order.id,
                customer_name: order.shipping_full_name,
                status: order.status,
            })
            window.open(link, "_blank")
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <h2 className="text-xl font-bold">Pedido #{order.id.substring(0, 8)}</h2>
                        <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleString("es-PE")}
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="p-4 space-y-6">
                    {/* Estado y acciones */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Estado:</span>
                            <Select
                                value={order.status}
                                onValueChange={(value) => onStatusChange(order.id, value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${status.color}`} />
                                                {status.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {order.shipping_phone && (
                            <Button variant="outline" onClick={handleWhatsApp} className="gap-2">
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp
                            </Button>
                        )}
                    </div>

                    {/* Info del cliente */}
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                        <h3 className="font-semibold mb-3">Información del Cliente</h3>

                        {order.shipping_full_name && (
                            <div className="flex items-center gap-2 text-sm">
                                <Package className="h-4 w-4 text-muted-foreground" />
                                <span>{order.shipping_full_name}</span>
                            </div>
                        )}

                        {order.user_id && (
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>Usuario registrado</span>
                            </div>
                        )}

                        {order.shipping_phone && (
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{order.shipping_phone}</span>
                            </div>
                        )}

                        {order.shipping_address_line1 && (
                            <div className="flex items-start gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <span>{order.shipping_address_line1}, {order.shipping_city}, {order.shipping_country}</span>
                            </div>
                        )}  </div>

                    {/* Productos */}
                    <div>
                        <h3 className="font-semibold mb-3">Productos</h3>
                        <div className="divide-y">
                            {order.items?.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 py-3">
                                    {item.product_image && (
                                        <img
                                            src={item.product_image}
                                            alt={item.product_name}
                                            className="w-12 h-12 rounded object-cover"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <p className="font-medium">{item.product_name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.quantity} x S/ {item.unit_price.toFixed(2)}
                                        </p>
                                    </div>
                                    <p className="font-semibold">
                                        S/ {item.total_price.toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totales */}
                    <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>S/ {order.subtotal?.toFixed(2) || order.total.toFixed(2)}</span>
                        </div>
                        {order.shipping_cost && order.shipping_cost > 0 && (
                            <div className="flex justify-between text-sm">
                                <span>Envío</span>
                                <span>S/ {order.shipping_cost.toFixed(2)}</span>
                            </div>
                        )}
                        {order.discount_amount && order.discount_amount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Descuento</span>
                                <span>-S/ {order.discount_amount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-bold pt-2 border-t">
                            <span>Total</span>
                            <span>S/ {order.total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Notas */}
                    {order.notes && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                            <p className="text-sm font-medium mb-1">Notas:</p>
                            <p className="text-sm">{order.notes}</p>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 p-4 border-t">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Cerrar
                    </Button>
                </div>
            </div>
        </div>
    )
}
