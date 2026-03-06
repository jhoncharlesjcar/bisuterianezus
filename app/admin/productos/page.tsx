"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Trash2, Download, Edit } from "lucide-react"
import { ProductModal } from "@/components/admin/product-modal"
import { exportProductsToCSV } from "@/lib/export-utils"
import type { Product } from "@/lib/types"
import { toast } from "sonner"

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/admin/products")
            if (response.ok) {
                const data = await response.json()
                setProducts(data.products || [])
            }
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSaveProduct = async (productData: Partial<Product>) => {
        try {
            const method = productData.id ? "PUT" : "POST"
            const response = await fetch("/api/admin/products", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData),
            })

            if (response.ok) {
                toast.success(productData.id ? "Producto actualizado" : "Producto creado")
                fetchProducts()
            } else {
                const error = await response.json()
                toast.error(error.error || "Error al guardar")
            }
        } catch (error) {
            toast.error("Error de conexión")
        }
    }

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este producto?")) return

        try {
            const response = await fetch(`/api/admin/products?id=${id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                toast.success("Producto eliminado")
                setProducts(products.filter((p) => p.id !== id))
            } else {
                const error = await response.json()
                toast.error(error.error || "Error al eliminar")
            }
        } catch (error) {
            toast.error("Error de conexión")
        }
    }

    const handleToggleStock = async (product: Product) => {
        try {
            const response = await fetch("/api/admin/products", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: product.id, in_stock: !product.in_stock }),
            })

            if (response.ok) {
                setProducts(
                    products.map((p) =>
                        p.id === product.id ? { ...p, in_stock: !p.in_stock } : p
                    )
                )
                toast.success(product.in_stock ? "Producto desactivado" : "Producto activado")
            }
        } catch (error) {
            toast.error("Error al actualizar")
        }
    }

    const handleQuickUpdate = async (id: string, field: string, value: string) => {
        const numValue = parseFloat(value)
        if (isNaN(numValue) || numValue < 0) return

        try {
            const response = await fetch("/api/admin/products", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, [field]: numValue }),
            })

            if (response.ok) {
                setProducts(
                    products.map((p) =>
                        p.id === id ? { ...p, [field]: numValue } : p
                    )
                )
                toast.success("Actualizado")
            }
        } catch (error) {
            toast.error("Error al actualizar")
        }
    }

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleExport = () => {
        exportProductsToCSV(products)
        toast.success("Exportando productos...")
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Productos</h1>
                    <p className="text-muted-foreground">
                        Gestiona tu inventario ({products.length} productos)
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                    </Button>
                    <Button onClick={() => { setEditingProduct(null); setModalOpen(true) }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Buscar productos..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {loading ? (
                            <p>Cargando productos...</p>
                        ) : filteredProducts.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                                No se encontraron productos
                            </p>
                        ) : (
                            <div className="divide-y">
                                {/* Header */}
                                <div className="hidden md:grid md:grid-cols-12 gap-4 py-2 text-sm font-medium text-muted-foreground">
                                    <div className="col-span-4">Producto</div>
                                    <div className="col-span-2 text-center">Precio (S/)</div>
                                    <div className="col-span-2 text-center">Stock</div>
                                    <div className="col-span-2 text-center">Activo</div>
                                    <div className="col-span-2 text-center">Acciones</div>
                                </div>

                                {filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 items-center"
                                    >
                                        {/* Producto */}
                                        <div className="col-span-4 flex gap-4">
                                            {product.image_url && (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="h-16 w-16 rounded-lg object-cover"
                                                />
                                            )}
                                            <div>
                                                <h3 className="font-semibold">{product.name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    SKU: {product.sku || "N/A"}
                                                </p>
                                                <div className="mt-1 flex gap-2">
                                                    {product.featured && (
                                                        <Badge variant="secondary">Destacado</Badge>
                                                    )}
                                                    {product.stock_quantity < (product.low_stock_threshold || 5) && (
                                                        <Badge variant="outline" className="text-orange-600">
                                                            Stock Bajo
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Precio */}
                                        <div className="col-span-2 flex justify-center">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                defaultValue={product.price}
                                                className="w-24 text-center"
                                                onBlur={(e) => handleQuickUpdate(product.id, "price", e.target.value)}
                                            />
                                        </div>

                                        {/* Stock */}
                                        <div className="col-span-2 flex justify-center">
                                            <Input
                                                type="number"
                                                min="0"
                                                defaultValue={product.stock_quantity}
                                                className="w-20 text-center"
                                                onBlur={(e) => handleQuickUpdate(product.id, "stock_quantity", e.target.value)}
                                            />
                                        </div>

                                        {/* Toggle Activo */}
                                        <div className="col-span-2 flex justify-center">
                                            <Switch
                                                checked={product.in_stock}
                                                onCheckedChange={() => handleToggleStock(product)}
                                            />
                                        </div>

                                        {/* Acciones */}
                                        <div className="col-span-2 flex justify-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => { setEditingProduct(product); setModalOpen(true) }}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive"
                                                onClick={() => handleDeleteProduct(product.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <ProductModal
                product={editingProduct}
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditingProduct(null) }}
                onSave={handleSaveProduct}
            />
        </div>
    )
}
