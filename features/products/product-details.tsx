"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice, cn } from "@/lib/utils"
import {
  Heart, Minus, Plus, Truck, RotateCcw, Shield,
  AlertTriangle, ArrowRight, Lock, CheckCircle2
} from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useWishlist } from "@/lib/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import { SiWhatsapp } from "@icons-pack/react-simple-icons"
import { createClient } from "@/lib/supabase/client"
import ProductCard from "@/features/products/product-card"

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [stickyVisible, setStickyVisible] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { toast } = useToast()
  const ctaRef = useRef<HTMLDivElement>(null)
  const supabase = useMemo(() => createClient(), [])

  const inWishlist = isInWishlist(product.id)
  const isLowStock = product.in_stock && product.stock_quantity <= (product.low_stock_threshold || 5) && product.stock_quantity > 0

  // Load cross-sell products
  useEffect(() => {
    if (product.category_id) {
      supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("category_id", product.category_id)
        .neq("id", product.id)
        .eq("in_stock", true)
        .limit(4)
        .then(({ data }) => setRelatedProducts(data || []))
    }
  }, [product.category_id, product.id, supabase])

  // Sticky CTA observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    )
    if (ctaRef.current) observer.observe(ctaRef.current)
    return () => observer.disconnect()
  }, [])

  const handleAddToCart = () => {
    setIsAdding(true)
    for (let i = 0; i < quantity; i++) {
      addToCart({
        ...product,
        category: product.category,
      })
    }

    // Instead of Toast, let the cart sheet handle the feedback for a more frictionless experience
    // The cart sheet will auto-open due to the context state change 

    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  const handleWishlist = async () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Necesitas una cuenta para guardar favoritos",
      })
      return
    }

    if (inWishlist) {
      await removeFromWishlist(product.id)
      toast({ title: "Guardado actualizado", description: "Producto eliminado de favoritos" })
    } else {
      await addToWishlist(product)
      toast({ title: "Guardado exitoso", description: "Producto añadido a favoritos" })
    }
  }

  const whatsappMessage = encodeURIComponent(
    `Hola, me interesa el producto: ${product.name} - ${formatPrice(product.price)}`
  )

  const images = [
    { src: product.image_url || "/placeholder.svg", label: "Producto" },
    ...(product.lifestyle_image_url ? [{ src: product.lifestyle_image_url, label: "Lifestyle" }] : []),
  ]
  const [activeImage, setActiveImage] = useState(0)

  return (
    <>
      <div className="bg-[#FAFAFA] min-h-screen">
        <div className="container mx-auto px-4 py-8 lg:py-16 max-w-7xl">

          {/* Breadcrumb pseudo-element */}
          <nav className="mb-8 text-[10px] tracking-widest uppercase text-black/40 flex items-center gap-2">
            <a href="/" className="hover:text-black transition-colors">Inicio</a>
            <span>/</span>
            <a href="/tienda" className="hover:text-black transition-colors">Tienda</a>
            {product.category && (
              <>
                <span>/</span>
                <span className="text-black">{product.category.name}</span>
              </>
            )}
          </nav>

          <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12 items-start">
            {/* Image Gallery area */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative lg:sticky lg:top-32 space-y-4"
            >
              <div className="relative aspect-square overflow-hidden bg-white flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={images[activeImage].src}
                      alt={`${product.name} - ${images[activeImage].label}`}
                      fill
                      className="object-cover object-center"
                      style={activeImage === 0 && product.image_position ? { objectPosition: product.image_position } : undefined}
                      priority
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  </motion.div>
                </AnimatePresence>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <div className="absolute top-6 left-6 z-10 bg-black text-white px-3 py-1 text-[10px] uppercase tracking-widest font-medium">
                    Oferta
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={cn(
                        "relative w-20 h-24 overflow-hidden bg-white border-2 transition-all duration-300",
                        activeImage === i ? "border-black" : "border-transparent hover:border-black/20"
                      )}
                    >
                      <Image src={img.src} alt={img.label} fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col pt-4 lg:pt-12"
            >

              <h1 className="text-3xl lg:text-5xl font-serif font-light leading-tight mb-4 text-black">{product.name}</h1>

              <div className="flex items-end gap-3 mb-8">
                <span className="text-2xl font-medium text-black">
                  {formatPrice(product.price)}
                </span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <span className="text-sm text-black/40 line-through mb-1">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
              </div>

              <div className="w-full h-px bg-black/5 mb-8" />

              {product.description && (
                <p className="text-black/60 mb-8 leading-relaxed text-sm font-light">
                  {product.description}
                </p>
              )}

              {/* Stock Indicator */}
              {isLowStock ? (
                <div className="mb-8 flex items-start gap-3 p-4 bg-[#F9F6F0] border border-[#E8DECF]">
                  <AlertTriangle className="w-4 h-4 text-[#8E8B82] mt-0.5" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-black font-medium mb-1">Disponibilidad Limitada</p>
                    <p className="text-xs text-black/60 font-light">Privilegio exclusivo: {product.stock_quantity} unidad(es) restante(s) en nuestro atelier.</p>
                  </div>
                </div>
              ) : !product.in_stock && (
                <div className="mb-8 p-4 bg-black/5 text-center">
                  <p className="text-xs uppercase tracking-widest text-black font-medium">Agotado Temporalmente</p>
                </div>
              )}

              {/* Add to Cart Actions */}
              <div className="space-y-4 mb-12">
                <div className="flex gap-4">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-black/20 h-14 bg-white hidden sm:flex">
                    <button
                      className="h-full w-12 flex items-center justify-center text-black/60 hover:text-black transition-colors"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || !product.in_stock}
                      aria-label="Reducir cantidad"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center font-medium text-sm">
                      {quantity}
                    </span>
                    <button
                      className="h-full w-12 flex items-center justify-center text-black/60 hover:text-black transition-colors"
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      disabled={quantity >= product.stock_quantity || !product.in_stock}
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <div ref={ctaRef} className="flex-1 flex flex-col gap-2">
                    <Button
                      className="w-full h-14 bg-white text-black border border-black hover:bg-black/5 rounded-none uppercase tracking-widest text-xs font-medium transition-all group"
                      disabled={!product.in_stock || isAdding}
                      onClick={handleAddToCart}
                    >
                      <AnimatePresence mode="wait">
                        {isAdding ? (
                          <motion.div key="added" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            Añadido
                          </motion.div>
                        ) : (
                          <motion.div key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                            Añadir a la Bolsa
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                    <a
                      href={`https://wa.me/51935128673?text=${encodeURIComponent(`¡Hola! Quiero comprar:\n\n• ${product.name}\n• Cantidad: ${quantity}\n• Precio: ${formatPrice(product.price * quantity)}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <Button
                        className="w-full h-14 bg-black text-white hover:bg-black/90 rounded-none uppercase tracking-widest text-xs font-medium transition-all group"
                        disabled={!product.in_stock}
                      >
                        <SiWhatsapp className="mr-3 h-4 w-4" />
                        Comprar por WhatsApp
                        <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                      </Button>
                    </a>
                  </div>

                  {/* Wishlist */}
                  <Button
                    variant="outline"
                    className="h-14 w-14 rounded-none border-black/20 hover:border-black bg-white transition-colors flex-shrink-0"
                    onClick={handleWishlist}
                    aria-label={inWishlist ? "Quitar de favoritos" : "Añadir a favoritos"}
                  >
                    <Heart className={cn("h-4 w-4 transition-all duration-300", inWishlist ? "fill-black text-black scale-110" : "text-black")} strokeWidth={1} />
                  </Button>
                </div>


              </div>

              {/* Policies */}
              <div className="border-t border-black/10 pt-6 mt-auto">
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <Truck className="w-4 h-4 text-black/40 flex-shrink-0 mt-0.5" strokeWidth={1} />
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest font-medium mb-0.5">Envíos</h4>
                      <p className="text-[11px] font-light text-black/60 leading-relaxed">Envíos seguros a nivel nacional en Perú. Envío gratuito en compras superiores a S/ 100.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <RotateCcw className="w-4 h-4 text-black/40 flex-shrink-0 mt-0.5" strokeWidth={1} />
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest font-medium mb-0.5">Devoluciones</h4>
                      <p className="text-[11px] font-light text-black/60 leading-relaxed">Cambios gratuitos dentro de los 7 días si el producto presenta fallos artesanales.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Lock className="w-4 h-4 text-black/40 flex-shrink-0 mt-0.5" strokeWidth={1} />
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest font-medium mb-0.5">Pago Seguro</h4>
                      <p className="text-[11px] font-light text-black/60 leading-relaxed">Transacciones e información encriptadas para tu seguridad.</p>
                    </div>
                  </li>
                </ul>
              </div>

            </motion.div>
          </div>

          {/* Cross-Sell Section */}
          {relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="mt-32 pt-16 border-t border-black/10"
            >
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                  <h3 className="text-3xl md:text-4xl font-serif font-light mb-2">Para Combinar</h3>
                  <p className="text-sm text-black/50 font-light">Piezas seleccionadas para complementar tu estilo.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8">
                {relatedProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <AnimatePresence>
        {stickyVisible && product.in_stock && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black/10 px-4 py-4 lg:hidden pb-safe"
          >
            <div className="flex items-center gap-4 max-w-lg mx-auto">
              <div className="flex-1 min-w-0">
                <p className="font-serif text-sm truncate leading-tight">{product.name}</p>
                <p className="text-xs text-black/60 tracking-widest">{formatPrice(product.price)}</p>
              </div>
              <Button
                className="h-12 px-8 bg-black hover:bg-black/90 text-white rounded-none uppercase tracking-widest text-[10px] font-medium transition-all"
                onClick={handleAddToCart}
                disabled={isAdding}
              >
                {isAdding ? "Añadido" : "Añadir"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
