"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { Product, Category } from "@/lib/types"

interface ProductModalProps {
    product?: Product | null
    isOpen: boolean
    onClose: () => void
    onSave: (product: Partial<Product>) => Promise<void>
}

export function ProductModal({ product, isOpen, onClose, onSave }: ProductModalProps) {
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category_id: "",
        image_url: "",
        stock_quantity: "10",
        in_stock: true,
        featured: false,
        lifestyle_image_url: "",
    })

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                description: product.description || "",
                price: product.price?.toString() || "",
                category_id: product.category_id || "",
                image_url: product.image_url || "",
                stock_quantity: product.stock_quantity?.toString() || "10",
                in_stock: product.in_stock ?? true,
                featured: product.featured ?? false,
                lifestyle_image_url: product.lifestyle_image_url || "",
            })
        } else {
            setFormData({
                name: "",
                description: "",
                price: "",
                category_id: "",
                image_url: "",
                stock_quantity: "10",
                in_stock: true,
                featured: false,
                lifestyle_image_url: "",
            })
        }
    }, [product])

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories")
            if (res.ok) {
                const data = await res.json()
                setCategories(data.categories || [])
            }
        } catch (error) {
            console.error("Error fetching categories:", error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await onSave({
                ...formData,
                id: product?.id,
                price: parseFloat(formData.price),
                stock_quantity: parseInt(formData.stock_quantity),
            })
            onClose()
        } catch (error) {
            console.error("Error saving product:", error)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-card rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold">
                        {product ? "Editar Producto" : "Nuevo Producto"}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Precio (S/) *</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock *</Label>
                            <Input
                                id="stock"
                                type="number"
                                min="0"
                                value={formData.stock_quantity}
                                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Categoría</Label>
                        <Select
                            value={formData.category_id}
                            onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">URL de Imagen Principal</Label>
                        <Input
                            id="image"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            placeholder="/images/producto.jpg"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lifestyle_image">URL de Imagen Lifestyle (Hover)</Label>
                        <Input
                            id="lifestyle_image"
                            value={formData.lifestyle_image_url}
                            onChange={(e) => setFormData({ ...formData, lifestyle_image_url: e.target.value })}
                            placeholder="/images/lifestyle-producto.png"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Switch
                                id="in_stock"
                                checked={formData.in_stock}
                                onCheckedChange={(checked) => setFormData({ ...formData, in_stock: checked })}
                            />
                            <Label htmlFor="in_stock">Disponible</Label>
                        </div>

                        <div className="flex items-center gap-2">
                            <Switch
                                id="featured"
                                checked={formData.featured}
                                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                            />
                            <Label htmlFor="featured">Destacado</Label>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading ? "Guardando..." : "Guardar"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
