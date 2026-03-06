"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Minus, Plus, Trash2, X, ChevronRight, Truck } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { formatPrice, cn } from "@/lib/utils"
import { SiWhatsapp } from "@icons-pack/react-simple-icons"

interface CartSheetProps {
    scrolled?: boolean
}

export function CartSheet({ scrolled = true }: CartSheetProps) {
    const { items, removeFromCart, updateQuantity, clearCart, itemCount, total } = useCart()
    const [isOpen, setIsOpen] = useState(false)

    const handleWhatsAppCheckout = () => {
        if (items.length === 0) return

        const message = `¡Hola! Me gustaría hacer un pedido:\n\n${items
            .map((item) => `• ${item.product.name} - Cantidad: ${item.quantity} - ${formatPrice(item.product.price * item.quantity)}`)
            .join("\n")}\n\n*Total: ${formatPrice(total)}*`

        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://wa.me/51935128673?text=${encodedMessage}`
        window.open(whatsappUrl, "_blank")
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button suppressHydrationWarning variant="ghost" size="icon" className={cn("relative rounded-none transition-colors", scrolled ? "text-black hover:bg-black/5" : "text-black lg:text-white hover:bg-black/5 lg:hover:bg-white/10")}>
                    <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
                    {itemCount > 0 && (
                        <span className={cn("absolute -top-1 -right-1 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center", scrolled ? "bg-black text-white" : "bg-black text-white lg:bg-white lg:text-black")}>
                            {itemCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-black/10">
                <SheetHeader className="p-6 border-b border-black/5">
                    <SheetTitle className="flex items-center justify-between font-serif text-2xl font-light text-black">
                        <span>Tu Bolsa</span>
                        {items.length > 0 && (
                            <button
                                onClick={clearCart}
                                className="text-xs font-medium tracking-widest uppercase text-black/40 hover:text-black transition-colors"
                            >
                                Limpiar Bolsa
                            </button>
                        )}
                    </SheetTitle>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                        <ShoppingCart className="h-12 w-12 text-black/20 mb-6" strokeWidth={1} />
                        <h3 className="text-xl font-serif font-light text-black mb-2">Tu bolsa está vacía</h3>
                        <p className="text-sm text-black/50 mb-8 font-light tracking-wide">Descubre nuestras colecciones y encuentra tu próxima pieza favorita.</p>
                        <Button
                            asChild
                            onClick={() => setIsOpen(false)}
                            className="bg-black text-white hover:bg-black/90 rounded-none h-12 px-8 uppercase tracking-widest text-xs"
                        >
                            <Link href="/tienda">Explorar Tienda</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            <div className="space-y-6">
                                <AnimatePresence initial={false}>
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.product.id}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex gap-6 pb-6 border-b border-black/5"
                                        >
                                            <div className="relative w-24 h-32 bg-[#FAFAFA] overflow-hidden flex-shrink-0 group">
                                                <Image
                                                    src={item.product.image_url || "/placeholder.svg"}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-serif text-lg leading-tight text-black mb-1 pr-4">{item.product.name}</h4>
                                                        <p className="text-sm font-medium text-black/60">{formatPrice(item.product.price)}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.product.id)}
                                                        className="text-black/30 hover:text-black transition-colors p-1"
                                                    >
                                                        <X className="h-4 w-4" strokeWidth={1.5} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-4 mt-4">
                                                    <div className="flex items-center border border-black/10">
                                                        <button
                                                            className="w-8 h-8 flex items-center justify-center text-black/60 hover:text-black hover:bg-black/5 transition-colors"
                                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                        >
                                                            <Minus className="h-3 w-3" strokeWidth={1.5} />
                                                        </button>
                                                        <span className="text-xs font-medium w-8 text-center text-black">{item.quantity}</span>
                                                        <button
                                                            className="w-8 h-8 flex items-center justify-center text-black/60 hover:text-black hover:bg-black/5 transition-colors"
                                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                        >
                                                            <Plus className="h-3 w-3" strokeWidth={1.5} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="p-6 bg-[#FAFAFA] border-t border-black/5 space-y-6">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-medium tracking-widest text-black/60 uppercase">Subtotal</span>
                                <span className="text-2xl font-serif text-black">{formatPrice(total)}</span>
                            </div>

                            {total < 100 ? (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                                        <span className="text-black/40 font-medium">Envío gratis desde S/100</span>
                                        <span className="font-medium text-black">{Math.round((total / 100) * 100)}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-black/5 overflow-hidden">
                                        <motion.div
                                            className="h-full bg-black"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min((total / 100) * 100, 100)}%` }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                        />
                                    </div>
                                    <p className="text-xs text-black/50 text-center font-light">
                                        ¡Agrega {formatPrice(100 - total)} más para <span className="font-medium text-black">envío gratis</span>!
                                    </p>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2 py-1">
                                    <Truck className="w-4 h-4 text-black/60" strokeWidth={1.5} />
                                    <span className="text-xs font-medium text-black uppercase tracking-widest">Envío gratis aplicado</span>
                                </div>
                            )}

                            <div className="space-y-3">
                                <Button
                                    className="w-full bg-black hover:bg-black/90 text-white rounded-none h-14 group"
                                    onClick={handleWhatsAppCheckout}
                                >
                                    <SiWhatsapp className="mr-3 h-4 w-4" />
                                    <span className="uppercase tracking-widest text-xs font-medium">Comprar por WhatsApp</span>
                                    <ChevronRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                                </Button>
                            </div>
                            <p className="text-[10px] text-center text-black/40 uppercase tracking-widest">
                                Compra directa y personalizada
                            </p>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    )
}

