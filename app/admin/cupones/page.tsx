"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Pencil, Tag, Percent } from "lucide-react"
import { toast } from "sonner"

interface Coupon {
    id: string
    code: string
    discount_type: "percentage" | "fixed"
    discount_value: number
    min_purchase?: number
    max_uses?: number
    current_uses: number
    expires_at?: string
    is_active: boolean
    created_at: string
}

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)

    const [formData, setFormData] = useState({
        code: "",
        discount_type: "percentage" as "percentage" | "fixed",
        discount_value: "",
        min_purchase: "",
        max_uses: "",
        expires_at: "",
        is_active: true,
    })

    useEffect(() => {
        fetchCoupons()
    }, [])

    const fetchCoupons = async () => {
        try {
            const response = await fetch("/api/admin/coupons")
            if (response.ok) {
                const data = await response.json()
                setCoupons(data.coupons || [])
            }
        } catch (error) {
            console.error("Error fetching coupons:", error)
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            code: "",
            discount_type: "percentage",
            discount_value: "",
            min_purchase: "",
            max_uses: "",
            expires_at: "",
            is_active: true,
        })
        setEditingCoupon(null)
    }

    const openEditDialog = (coupon: Coupon) => {
        setEditingCoupon(coupon)
        setFormData({
            code: coupon.code,
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value.toString(),
            min_purchase: coupon.min_purchase?.toString() || "",
            max_uses: coupon.max_uses?.toString() || "",
            expires_at: coupon.expires_at?.split("T")[0] || "",
            is_active: coupon.is_active,
        })
        setDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const method = editingCoupon ? "PUT" : "POST"
            const body = editingCoupon
                ? { id: editingCoupon.id, ...formData }
                : formData

            const response = await fetch("/api/admin/coupons", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })

            if (response.ok) {
                toast.success(editingCoupon ? "Cupón actualizado" : "Cupón creado")
                setDialogOpen(false)
                resetForm()
                fetchCoupons()
            } else {
                const error = await response.json()
                toast.error(error.error || "Error al guardar")
            }
        } catch {
            toast.error("Error de conexión")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este cupón?")) return

        try {
            const response = await fetch(`/api/admin/coupons?id=${id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                setCoupons(coupons.filter((c) => c.id !== id))
                toast.success("Cupón eliminado")
            } else {
                toast.error("Error al eliminar")
            }
        } catch {
            toast.error("Error de conexión")
        }
    }

    const toggleActive = async (coupon: Coupon) => {
        try {
            const response = await fetch("/api/admin/coupons", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: coupon.id, is_active: !coupon.is_active }),
            })

            if (response.ok) {
                setCoupons(
                    coupons.map((c) =>
                        c.id === coupon.id ? { ...c, is_active: !c.is_active } : c
                    )
                )
                toast.success("Estado actualizado")
            }
        } catch {
            toast.error("Error al actualizar")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Cupones</h1>
                    <p className="text-muted-foreground">
                        Gestiona los cupones de descuento
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm() }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Cupón
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingCoupon ? "Editar Cupón" : "Nuevo Cupón"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Código</Label>
                                <Input
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="DESCUENTO20"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tipo de descuento</Label>
                                    <Select
                                        value={formData.discount_type}
                                        onValueChange={(v) => setFormData({ ...formData, discount_type: v as "percentage" | "fixed" })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                                            <SelectItem value="fixed">Monto fijo (S/)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Valor</Label>
                                    <Input
                                        type="number"
                                        value={formData.discount_value}
                                        onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                                        placeholder={formData.discount_type === "percentage" ? "20" : "10.00"}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Compra mínima (opcional)</Label>
                                    <Input
                                        type="number"
                                        value={formData.min_purchase}
                                        onChange={(e) => setFormData({ ...formData, min_purchase: e.target.value })}
                                        placeholder="50.00"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Usos máximos (opcional)</Label>
                                    <Input
                                        type="number"
                                        value={formData.max_uses}
                                        onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                                        placeholder="100"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Fecha de expiración (opcional)</Label>
                                <Input
                                    type="date"
                                    value={formData.expires_at}
                                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                />
                                <Label>Cupón activo</Label>
                            </div>

                            <Button type="submit" className="w-full">
                                {editingCoupon ? "Actualizar" : "Crear Cupón"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        Todos los cupones
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-center py-8">Cargando cupones...</p>
                    ) : coupons.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            No hay cupones creados
                        </p>
                    ) : (
                        <div className="divide-y">
                            {coupons.map((coupon) => (
                                <div
                                    key={coupon.id}
                                    className="flex items-center justify-between py-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                                            <Percent className="h-6 w-6 text-accent" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold text-lg">
                                                    {coupon.code}
                                                </span>
                                                <Badge variant={coupon.is_active ? "default" : "secondary"}>
                                                    {coupon.is_active ? "Activo" : "Inactivo"}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {coupon.discount_type === "percentage"
                                                    ? `${coupon.discount_value}% de descuento`
                                                    : `S/ ${coupon.discount_value} de descuento`}
                                                {coupon.min_purchase && ` • Mín: S/${coupon.min_purchase}`}
                                                {coupon.max_uses && ` • ${coupon.current_uses}/${coupon.max_uses} usos`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={coupon.is_active}
                                            onCheckedChange={() => toggleActive(coupon)}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => openEditDialog(coupon)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive"
                                            onClick={() => handleDelete(coupon.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
