"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Star, Check, X, Trash2, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface Review {
    id: string
    rating: number
    title?: string
    comment?: string
    status: "pending" | "approved" | "rejected"
    created_at: string
    product?: {
        id: string
        name: string
        slug: string
        image_url?: string
    }
    user?: {
        id: string
        full_name?: string
        avatar_url?: string
    }
}

const statusOptions = [
    { value: "all", label: "Todas", color: "bg-gray-500" },
    { value: "pending", label: "Pendientes", color: "bg-yellow-500" },
    { value: "approved", label: "Aprobadas", color: "bg-green-500" },
    { value: "rejected", label: "Rechazadas", color: "bg-red-500" },
]

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState("all")

    useEffect(() => {
        fetchReviews()
    }, [statusFilter])

    const fetchReviews = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (statusFilter !== "all") params.set("status", statusFilter)

            const response = await fetch(`/api/admin/reviews?${params}`)
            if (response.ok) {
                const data = await response.json()
                setReviews(data.reviews || [])
            }
        } catch (error) {
            console.error("Error fetching reviews:", error)
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (id: string, status: "approved" | "rejected") => {
        try {
            const response = await fetch("/api/admin/reviews", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            })

            if (response.ok) {
                setReviews(
                    reviews.map((r) => (r.id === id ? { ...r, status } : r))
                )
                toast.success(status === "approved" ? "Reseña aprobada" : "Reseña rechazada")
            } else {
                toast.error("Error al actualizar")
            }
        } catch {
            toast.error("Error de conexión")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar esta reseña?")) return

        try {
            const response = await fetch(`/api/admin/reviews?id=${id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                setReviews(reviews.filter((r) => r.id !== id))
                toast.success("Reseña eliminada")
            } else {
                toast.error("Error al eliminar")
            }
        } catch {
            toast.error("Error de conexión")
        }
    }

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                ))}
            </div>
        )
    }

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            pending: "bg-yellow-100 text-yellow-800",
            approved: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
        }
        const labels: Record<string, string> = {
            pending: "Pendiente",
            approved: "Aprobada",
            rejected: "Rechazada",
        }
        return (
            <Badge className={colors[status] || "bg-gray-100"}>
                {labels[status] || status}
            </Badge>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Reseñas</h1>
                    <p className="text-muted-foreground">
                        Modera las reseñas de los clientes
                    </p>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por estado" />
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

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Reseñas de clientes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-center py-8">Cargando reseñas...</p>
                    ) : reviews.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            No hay reseñas
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="border rounded-lg p-4 space-y-3"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            {review.product?.image_url && (
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                                                    <Image
                                                        src={review.product.image_url}
                                                        alt={review.product.name || ""}
                                                        fill
                                                        sizes="48px"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium">{review.product?.name || "Producto"}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Por {review.user?.full_name || "Usuario anónimo"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(review.status)}
                                            {renderStars(review.rating)}
                                        </div>
                                    </div>

                                    {review.title && (
                                        <p className="font-medium">{review.title}</p>
                                    )}
                                    {review.comment && (
                                        <p className="text-muted-foreground">{review.comment}</p>
                                    )}

                                    <div className="flex items-center justify-between pt-2 border-t">
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(review.created_at).toLocaleDateString("es-PE")}
                                        </span>
                                        <div className="flex gap-2">
                                            {review.status === "pending" && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-green-600"
                                                        onClick={() => updateStatus(review.id, "approved")}
                                                    >
                                                        <Check className="mr-1 h-4 w-4" />
                                                        Aprobar
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-600"
                                                        onClick={() => updateStatus(review.id, "rejected")}
                                                    >
                                                        <X className="mr-1 h-4 w-4" />
                                                        Rechazar
                                                    </Button>
                                                </>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive"
                                                onClick={() => handleDelete(review.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
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
