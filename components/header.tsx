"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useMemo } from "react"
import { Menu, User, Heart, Search, ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SiTiktok, SiWhatsapp, SiInstagram } from "@icons-pack/react-simple-icons"
import { CartSheet } from "@/components/cart-sheet"
import { useAuth } from "@/lib/auth-context"
import { useWishlist } from "@/lib/wishlist-context"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import type { Category } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"

import { categoryImages } from "@/lib/constants"

const topBarMessages = [
  "Envíos gratis a todo el Perú en compras mayores a S/100",
  "Pago 100% Seguro · Yape · Plin · Transferencia Bancaria",
  "Asesoría personalizada por WhatsApp +51 935 128 673",
  "Lima · Arequipa · Cusco · Chiclayo · Piura · Huancayo · Ica",
]

function TopTicker({ scrolled, variant = "transparent" }: { scrolled: boolean, variant?: "transparent" | "solid" }) {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % topBarMessages.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  const isSolid = scrolled || variant === "solid"

  return (
    <div className={cn(
      "w-full transition-colors duration-500 z-30",
      isSolid
        ? "bg-black text-white py-2"
        : "bg-white/10 backdrop-blur-md border-b border-white/10 py-2.5"
    )}>
      <div className="container mx-auto px-4 lg:px-12 max-w-7xl">
        <div className="flex items-center justify-center">

          <div className="relative w-full h-4 flex items-center justify-center overflow-hidden text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={msgIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6, ease: [0.25, 0.4, 0, 1] }}
                className="text-[9px] md:text-[10px] text-white uppercase tracking-[0.15em] md:tracking-[0.2em] font-medium absolute w-full"
              >
                {topBarMessages[msgIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  )
}


export function Header({ variant = "transparent" }: { variant?: "transparent" | "solid" }) {
  const { user, profile, loading, signOut } = useAuth()
  const { itemCount: wishlistCount } = useWishlist()
  const router = useRouter()
  const [showMegaMenu, setShowMegaMenu] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    loadCategories()
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isSolid = scrolled || variant === "solid"

  const loadCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .in("slug", ["aretes", "collares", "pulseras", "resplandor-estival", "elegancia-nocturna", "geometria-del-lujo", "coleccion-estelar", "edicion-limitada"])
      .order("name")
    setCategories(data || [])
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery("")
    }
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex flex-col",
        isSolid
          ? "bg-white/95 backdrop-blur-md border-b border-black/5"
          : "bg-white/90 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none border-transparent"
      )}
    >
      <TopTicker scrolled={scrolled} variant={variant} />
      <div className={cn("container mx-auto px-4 max-w-7xl transition-all duration-500", isSolid ? "py-2" : "py-2 lg:py-4")}>
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group relative z-50">
            <div className="flex flex-col">
              <span className={cn("font-serif text-2xl md:text-3xl font-light tracking-tight leading-none transition-colors duration-500", isSolid ? "text-black" : "text-black lg:text-white")}>NEZUS</span>
              <span className={cn("text-[8px] md:text-[9px] tracking-[0.3em] uppercase mt-1 transition-colors duration-500", isSolid ? "text-black/60" : "text-black/60 lg:text-white/60")}>Bisutería Artesanal Fina</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {["Inicio", "Nosotros", "Contacto"].map((item) => (
              <Link
                key={item}
                href={item === "Inicio" ? "/" : `/#${item.toLowerCase()}`}
                className={cn("relative text-[10px] font-medium tracking-[0.25em] uppercase transition-colors group py-2", isSolid ? "text-black/70 hover:text-black" : "text-white/80 hover:text-white")}
              >
                {item}
                <span className={cn("absolute bottom-0 left-0 w-0 h-[1px] transition-all duration-500 group-hover:w-full", isSolid ? "bg-black" : "bg-white")} />
              </Link>
            ))}

            <div
              className="relative"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setShowMegaMenu(false)
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  setShowMegaMenu(!showMegaMenu)
                }
              }}
            >
              <button className={cn("flex items-center gap-2 text-[10px] font-medium tracking-[0.25em] uppercase transition-colors py-6 group", isSolid ? "text-black/70 hover:text-black" : "text-white/80 hover:text-white")}>
                Tienda
                <ChevronDown className={cn("w-3 h-3 transition-transform duration-500 opacity-50", showMegaMenu && "rotate-180")} />
              </button>

              <AnimatePresence>
                {showMegaMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] bg-white border border-black/5 shadow-2xl p-10 overflow-hidden"
                  >
                    <div className="grid grid-cols-12 gap-12 relative z-10">
                      <div className="col-span-3 space-y-6">
                        <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-black/40 mb-6 border-b border-black/5 pb-4">Explorar</h3>
                        <ul className="space-y-4">
                          {categories.map((category) => (
                            <li key={category.id}>
                              <Link
                                href={`/tienda?category=${category.slug}`}
                                className="text-black/70 hover:text-black transition-all flex items-center gap-3 group/item text-sm font-light"
                                onClick={() => setShowMegaMenu(false)}
                              >
                                {category.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <Link
                          href="/tienda"
                          className="inline-flex items-center gap-2 mt-8 text-black text-xs font-medium uppercase tracking-[0.15em] hover:opacity-70 transition-all border-b border-black pb-1"
                          onClick={() => setShowMegaMenu(false)}
                        >
                          Ver Todo
                        </Link>
                      </div>

                      <div className="col-span-9 grid grid-cols-3 gap-6">
                        {categories.slice(0, 3).map((category) => (
                          <Link
                            key={category.id}
                            href={`/tienda?category=${category.slug}`}
                            className="group relative overflow-hidden bg-[#FAFAFA] aspect-[3/4]"
                            onClick={() => setShowMegaMenu(false)}
                          >
                            <Image
                              src={category.image_url || categoryImages[category.slug] || "/images/placeholder-category.jpg"}
                              alt={category.name}
                              fill
                              sizes="(max-width: 768px) 100vw, 280px"
                              className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                              <h4 className="text-lg font-serif font-light text-white tracking-wide">{category.name}</h4>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 lg:gap-4 relative z-50">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              className={cn("rounded-none transition-colors", isSolid ? "text-black hover:bg-black/5" : "text-black lg:text-white hover:bg-black/5 lg:hover:bg-white/10")}
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </Button>

            {user && (
              <Link href="/perfil">
                <Button variant="ghost" size="icon" className={cn("relative rounded-none transition-colors", isSolid ? "text-black hover:bg-black/5" : "text-black lg:text-white hover:bg-black/5 lg:hover:bg-white/10")}>
                  <Heart className="h-5 w-5" strokeWidth={1.5} />
                  {wishlistCount > 0 && (
                    <span className={cn("absolute top-1 right-1 text-[9px] w-4 h-4 flex items-center justify-center rounded-full", isSolid ? "bg-black text-white" : "bg-black text-white lg:bg-white lg:text-black")}>
                      {wishlistCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            <CartSheet scrolled={scrolled} />

            <div className={cn("hidden lg:block h-6 w-[1px] mx-2 transition-colors", isSolid ? "bg-black/10" : "bg-white/20")} />

            {loading ? (
              <div className={cn("hidden lg:block w-10 h-10 rounded-full animate-pulse", isSolid ? "bg-black/5" : "bg-white/10")} />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button suppressHydrationWarning variant="ghost" size="icon" className={cn("rounded-none transition-colors", isSolid ? "text-black hover:bg-black/5" : "text-white hover:bg-white/10")}>
                    <User className="h-5 w-5" strokeWidth={1.5} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 bg-white border border-black/10 shadow-xl rounded-none">
                  <div className="px-4 py-3 mb-2 border-b border-black/5">
                    <p className="text-sm font-medium truncate text-black">{profile?.full_name || "Mi Cuenta"}</p>
                    <p className="text-[10px] text-black/50 truncate uppercase tracking-widest">{user.email}</p>
                  </div>
                  <DropdownMenuItem asChild className="rounded-none focus:bg-black/5 cursor-pointer py-2.5">
                    <Link href="/perfil" className="text-xs uppercase tracking-wider text-black/70">Mi Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-none focus:bg-black/5 cursor-pointer py-2.5">
                    <Link href="/perfil?tab=orders" className="text-xs uppercase tracking-wider text-black/70">Pedidos</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-none focus:bg-black/5 cursor-pointer py-2.5">
                    <Link href="/perfil?tab=wishlist" className="text-xs uppercase tracking-wider text-black/70">Favoritos</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-black/5" />
                  <DropdownMenuItem onClick={handleSignOut} className="rounded-none focus:bg-black/5 text-black cursor-pointer py-2.5 text-xs uppercase tracking-wider">
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden lg:flex items-center gap-4">
                <Link href="/login" className={cn("text-[10px] font-medium tracking-[0.25em] uppercase transition-colors", isSolid ? "text-black/70 hover:text-black" : "text-white/80 hover:text-white")}>
                  Login
                </Link>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button suppressHydrationWarning variant="ghost" size="icon" className={cn("lg:hidden rounded-none transition-colors", isSolid ? "text-black hover:bg-black/5" : "text-black hover:bg-black/5")}>
                  <Menu className="h-6 w-6" strokeWidth={1.5} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white border-l border-black/10 p-0">
                <div className="flex flex-col h-full bg-white">
                  <div className="p-6 border-b border-black/5 flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="font-serif font-light text-2xl">NEZUS</span>
                      <span className="text-[8px] tracking-[0.3em] font-medium text-black/40 uppercase">Bisutería Artesanal Fina</span>
                    </div>
                  </div>

                  <nav className="flex-1 overflow-y-auto py-8 text-center space-y-6">
                    <Link href="/" className="block text-2xl font-serif font-light tracking-tight hover:opacity-60 transition-opacity">Inicio</Link>
                    <Link href="/tienda" className="block text-2xl font-serif font-light tracking-tight hover:opacity-60 transition-opacity">Tienda</Link>
                    <Link href="/#nosotros" className="block text-2xl font-serif font-light tracking-tight hover:opacity-60 transition-opacity">Nosotros</Link>
                    <Link href="/#contacto" className="block text-2xl font-serif font-light tracking-tight hover:opacity-60 transition-opacity">Contacto</Link>

                    <div className="pt-8 border-t border-black/5">
                      <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] text-black/40 mb-6">Categorías</h4>
                      <div className="space-y-4">
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/tienda?category=${category.slug}`}
                            className="block text-sm font-light text-black/70 hover:text-black transition-colors"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </nav>

                  <div className="p-8 border-t border-black/5 bg-[#FAFAFA]">
                    {user ? (
                      <div className="space-y-4 text-center">
                        <Link href="/perfil" className="block text-sm font-medium tracking-[0.2em] uppercase hover:opacity-60">Mi Cuenta</Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-xs text-black/50 hover:text-black transition-colors uppercase tracking-widest mt-4"
                        >
                          Cerrar Sesión
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <Button className="w-full bg-black text-white rounded-none hover:bg-black/80 font-medium tracking-[0.2em] uppercase text-xs h-12" asChild>
                          <Link href="/login">Ingresar / Unirse</Link>
                        </Button>
                      </div>
                    )}

                    <div className="mt-12 flex justify-center gap-8">
                      <a href="https://instagram.com/nezusbisuteria" target="_blank" rel="noopener noreferrer" className="text-black/40 hover:text-black transition-colors">
                        <SiInstagram className="w-4 h-4" />
                      </a>
                      <a href="https://wa.me/51935128673" target="_blank" rel="noopener noreferrer" className="text-black/40 hover:text-black transition-colors">
                        <SiWhatsapp className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Animated Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-0 z-50 bg-white"
          >
            <div className="container mx-auto px-4 h-full flex flex-col justify-center relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(false)}
                className="absolute right-4 top-8 hover:bg-black/5 rounded-none"
              >
                <X className="w-8 h-8" strokeWidth={1} />
              </Button>

              <form onSubmit={handleSearch} className="max-w-4xl mx-auto w-full space-y-12">
                <div className="text-center space-y-4">
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-black">Buscar en la tienda</h3>
                  <p className="text-black/40 text-xs uppercase tracking-[0.3em]">Encuentra tu próximo favorito</p>
                </div>

                <div className="relative border-b-2 border-black/10 focus-within:border-black transition-colors">
                  <input
                    type="text"
                    placeholder="Ingresa un término..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-6 bg-transparent text-2xl md:text-4xl font-light focus:outline-none placeholder:text-black/20 text-center"
                    autoFocus
                  />
                </div>

                <div className="flex flex-col items-center gap-6">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-black/40">Sugerencias</span>
                  <div className="flex flex-wrap justify-center gap-4">
                    {["Aretes de Gota", "Collares Artesanales", "Pulseras Finas"].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setSearchQuery(tag);
                          router.push(`/buscar?q=${encodeURIComponent(tag)}`);
                          setSearchOpen(false);
                        }}
                        className="px-6 py-2 border border-black/10 text-xs font-medium tracking-wide hover:border-black transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
