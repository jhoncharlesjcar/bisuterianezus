"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { ShoppingCart, Check, Heart, Eye } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useWishlist } from "@/lib/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import { QuickViewModal } from "@/components/quick-view-modal"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface ProductCardProps {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)
  const isMobile = useIsMobile()

  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)
    addToCart(product)

    toast({
      title: "Agregado",
      description: `${product.name} en tu bolsa.`,
      duration: 2000,
    })

    setTimeout(() => setIsAdding(false), 1500)
  }

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast({
        title: "Ingresa a tu cuenta",
        description: "Inicia sesión para guardar favoritos.",
        variant: "destructive",
      })
      return
    }

    if (inWishlist) {
      await removeFromWishlist(product.id)
    } else {
      await addToWishlist(product)
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowQuickView(true)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, delay: index * 0.08, ease: [0.25, 0.4, 0, 1] }}
        whileHover={{ y: -6, transition: { duration: 0.4 } }}
        className="group flex flex-col h-full bg-transparent"
      >
        <div className="relative overflow-hidden bg-[#FAFAFA] aspect-[4/5] mb-3 md:mb-4">
          <Link href={`/producto/${product.slug}`} className="block h-full relative">
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-0"
              style={product.image_position ? { objectPosition: product.image_position } : undefined}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Lifestyle Image on Hover */}
            {product.lifestyle_image_url && (
              <Image
                src={product.lifestyle_image_url}
                alt={`${product.name} lifestyle`}
                fill
                className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
            {!product.lifestyle_image_url && (
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            )}
          </Link>

          {/* Quick Actions overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-3 z-30 translate-x-0 opacity-100 md:translate-x-12 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 transition-all duration-500">
            <button
              onClick={handleWishlist}
              className="w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors shadow-sm md:hover:bg-black md:hover:text-white"
              aria-label="Añadir a favoritos"
            >
              <Heart className={cn("h-3.5 w-3.5 md:h-4 md:w-4", inWishlist && "fill-current text-red-500")} />
            </button>
            <button
              onClick={handleQuickView}
              className="w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors shadow-sm md:hover:bg-black md:hover:text-white"
              aria-label="Vista rápida"
            >
              <Eye className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </button>
          </div>

          {!product.in_stock && (
            <div className="absolute bottom-4 left-4 z-20">
              <span className="bg-black text-white px-3 py-1 text-[10px] font-medium tracking-widest uppercase">
                Agotado
              </span>
            </div>
          )}

          {/* Add to Cart button on Image Hover */}
          {product.in_stock && (
            <div className="absolute bottom-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-30 hidden md:block">
              <button
                className="w-full bg-black/90 backdrop-blur-md text-white py-4 text-xs font-medium tracking-widest uppercase hover:bg-black transition-colors flex items-center justify-center gap-2"
                onClick={handleAddToCart}
                disabled={isAdding}
              >
                {isAdding ? "AÑADIDO" : "AÑADIR A LA BOLSA"}
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="text-center px-4 flex-1 flex flex-col">
          <Link href={`/producto/${product.slug}`} className="block flex-1">
            <h3 className="font-serif text-base md:text-lg tracking-[0.05em] text-foreground mb-1.5 md:mb-2 group-hover:text-black/60 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm font-medium tracking-[0.1em] text-black">
                {formatPrice(product.price)}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-xs text-black/40 line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>
          </Link>

          {/* Mobile Only: Always visible Add to Cart */}
          {product.in_stock && isMobile && (
            <Button
              variant="outline"
              className="w-full mt-4 rounded-none text-xs tracking-widest uppercase border-black/20 hover:bg-black hover:text-white transition-colors h-11"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? "AÑADIDO" : "AÑADIR A LA BOLSA"}
            </Button>
          )}
        </div>
      </motion.div>

      <QuickViewModal
        product={product}
        open={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  )
}

