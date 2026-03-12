"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { formatPrice } from "@/lib/utils"
import { ShoppingCart, Check, Heart, Minus, Plus, X } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useWishlist } from "@/lib/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface QuickViewModalProps {
  product: Product
  open: boolean
  onClose: () => void
}

export function QuickViewModal({ product, open, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { toast } = useToast()

  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    setIsAdding(true)
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }

    toast({
      title: "¡Producto agregado!",
      description: `${quantity}x ${product.name} se agregó a tu carrito.`,
      duration: 2000,
    })

    setTimeout(() => {
      setIsAdding(false)
      setQuantity(1)
      onClose()
    }, 1000)
  }

  const handleWishlist = async () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Necesitas una cuenta para guardar favoritos",
        variant: "destructive",
      })
      return
    }

    if (inWishlist) {
      await removeFromWishlist(product.id)
      toast({
        title: "Eliminado de favoritos",
        description: `${product.name} se eliminó de tu lista`,
      })
    } else {
      await addToWishlist(product)
      toast({
        title: "¡Agregado a favoritos!",
        description: `${product.name} se guardó en tu lista`,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="grid md:grid-cols-2 gap-0"
        >
          <div className="relative aspect-square bg-muted">
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              style={product.image_position ? { objectPosition: product.image_position } : undefined}
            />
            {product.compare_at_price && product.compare_at_price > product.price && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-sm font-semibold rounded">
                -{Math.round((1 - product.price / product.compare_at_price) * 100)}% OFF
              </div>
            )}
          </div>

          <div className="p-6 flex flex-col">
            <DialogHeader>
              <p className="text-sm text-muted-foreground">{product.category?.name || "Sin categoría"}</p>
              <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
              <DialogDescription className="sr-only">
                Vista rápida del producto {product.name}
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-3 mt-4">
              <span className="text-3xl font-bold text-accent">{formatPrice(product.price)}</span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>

            {product.description && (
              <p className="mt-4 text-muted-foreground line-clamp-3">{product.description}</p>
            )}

            <div className="mt-4">
              <p className="text-sm mb-2">
                Disponibilidad:{" "}
                <span className={product.in_stock ? "text-green-600" : "text-red-500"}>
                  {product.in_stock ? `En stock (${product.stock_quantity} disponibles)` : "Agotado"}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <span className="text-sm font-medium">Cantidad:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-r-none"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-l-none"
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  disabled={quantity >= product.stock_quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3 mt-auto pt-6">
              <Button
                className="flex-1"
                size="lg"
                disabled={!product.in_stock || isAdding}
                onClick={handleAddToCart}
              >
                {isAdding ? (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Agregado
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Agregar al carrito
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-4"
                onClick={handleWishlist}
              >
                <Heart className={`h-5 w-5 ${inWishlist ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>

            <Link
              href={`/producto/${product.slug}`}
              className="mt-4 text-center text-sm text-accent hover:underline"
              onClick={onClose}
            >
              Ver detalles completos
            </Link>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
