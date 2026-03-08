"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Loader2, User, Package, Heart, LogOut, ChevronRight, Settings } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { formatPrice, cn } from "@/lib/utils"
import type { Order, WishlistItem } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"

const profileSchema = z.object({
  full_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  phone: z.string().optional(),
})

type ProfileForm = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { user, profile, loading, signOut, updateProfile } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [isUpdating, setIsUpdating] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
      })
    }
  }, [profile, reset])

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    if (!user) return
    setLoadingData(true)

    const [ordersRes, wishlistRes] = await Promise.all([
      supabase
        .from("orders")
        .select(`
          *,
          items:order_items(*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("wishlists")
        .select(`
          *,
          product:products(*)
        `)
        .eq("user_id", user.id),
    ])

    setOrders(ordersRes.data || [])
    setWishlist(wishlistRes.data || [])
    setLoadingData(false)
  }

  const onSubmit = async (data: ProfileForm) => {
    setIsUpdating(true)
    const { error } = await updateProfile(data)
    setIsUpdating(false)

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive",
      })
    } else {
      toast({
        title: "¡Éxito!",
        description: "Tu perfil ha sido actualizado",
      })
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const removeFromWishlist = async (productId: string) => {
    if (!user) return

    await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId)

    setWishlist(prev => prev.filter(item => item.product_id !== productId))
    toast({
      title: "Eliminado",
      description: "Producto eliminado de favoritos",
    })
  }

  const getStatusBadge = (status: string) => {
    const defaultClasses = "font-medium text-[10px] uppercase tracking-widest rounded-none px-3 py-1 bg-transparent border-black/10 text-black";

    switch (status) {
      case 'pending':
        return <Badge className={cn(defaultClasses, "border-yellow-600/30 text-yellow-700 bg-yellow-50")} variant="outline">Pendiente</Badge>;
      case 'processing':
        return <Badge className={cn(defaultClasses, "border-[#8E8B82]/30 text-[#8E8B82] bg-[#8E8B82]/10")} variant="outline">Procesando</Badge>;
      case 'shipped':
        return <Badge className={cn(defaultClasses, "border-blue-600/30 text-blue-700 bg-blue-50")} variant="outline">Enviado</Badge>;
      case 'delivered':
        return <Badge className={cn(defaultClasses, "border-green-600/30 text-green-700 bg-green-50")} variant="outline">Entregado</Badge>;
      case 'cancelled':
        return <Badge className={cn(defaultClasses, "border-red-600/30 text-red-700 bg-red-50")} variant="outline">Cancelado</Badge>;
      default:
        return <Badge className={defaultClasses} variant="outline">{status}</Badge>;
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="h-8 w-8 animate-spin text-black/50" strokeWidth={1} />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Header variant="solid" />
      <main className="flex-1 container mx-auto px-4 py-16 md:py-24 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-black/10 pb-8 gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-black mb-3">Mi Cuenta</h1>
              <p className="text-sm font-light text-black/60">
                Bienvenido de vuelta, {profile?.full_name || user.email}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="rounded-none border-black/20 text-[10px] uppercase tracking-widest font-medium hover:bg-black hover:text-white transition-colors h-10 px-6"
            >
              <LogOut className="mr-2 h-3 w-3" />
              Cerrar Sesión
            </Button>
          </div>

          <Tabs defaultValue="profile" className="space-y-12">
            <TabsList className="bg-transparent border-b border-black/10 w-full justify-start rounded-none h-auto p-0 flex gap-8">
              <TabsTrigger
                value="profile"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none p-0 pb-4 text-xs tracking-widest uppercase font-medium text-black/50 data-[state=active]:text-black transition-all gap-2"
              >
                <Settings className="h-3 w-3" strokeWidth={1.5} />
                Perfil
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none p-0 pb-4 text-xs tracking-widest uppercase font-medium text-black/50 data-[state=active]:text-black transition-all gap-2"
              >
                <Package className="h-3 w-3" strokeWidth={1.5} />
                Pedidos <span className="text-[10px] opacity-70">({orders.length})</span>
              </TabsTrigger>
              <TabsTrigger
                value="wishlist"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none p-0 pb-4 text-xs tracking-widest uppercase font-medium text-black/50 data-[state=active]:text-black transition-all gap-2"
              >
                <Heart className="h-3 w-3" strokeWidth={1.5} />
                Favoritos <span className="text-[10px] opacity-70">({wishlist.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="outline-none focus-visible:ring-0 mt-8">
              <Card className="rounded-none border border-black/5 shadow-none bg-white max-w-2xl">
                <CardHeader className="p-8 border-b border-black/5 pb-6">
                  <CardTitle className="text-xl font-serif font-light">Información Personal</CardTitle>
                  <CardDescription className="text-xs font-light text-black/50 mt-2">
                    Actualiza tu información de contacto para futuros pedidos.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[10px] tracking-widest uppercase text-black/60 font-medium">Email</Label>
                      <Input
                        id="email"
                        value={user.email || ""}
                        disabled
                        className="bg-black/5 border-0 border-b border-black/10 rounded-none px-4 py-6 text-sm font-light focus-visible:ring-0 shadow-none text-black/50 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2 relative">
                      <Label htmlFor="full_name" className="text-[10px] tracking-widest uppercase text-black/60 font-medium">Nombre Completo</Label>
                      <Input
                        id="full_name"
                        {...register("full_name")}
                        className={cn(
                          "bg-transparent border-0 border-b border-black/20 rounded-none px-0 py-6 text-sm font-light focus-visible:ring-0 focus-visible:border-black transition-colors shadow-none",
                          errors.full_name && "border-red-500 focus-visible:border-red-500"
                        )}
                      />
                      {errors.full_name && (
                        <p className="absolute right-0 top-10 text-[9px] text-red-500 uppercase tracking-widest">{errors.full_name.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[10px] tracking-widest uppercase text-black/60 font-medium">Teléfono</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+51 999 999 999"
                        {...register("phone")}
                        className="bg-transparent border-0 border-b border-black/20 rounded-none px-0 py-6 text-sm font-light focus-visible:ring-0 focus-visible:border-black transition-colors shadow-none placeholder:text-black/20"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isUpdating}
                      className="bg-black text-white hover:bg-black/90 rounded-none h-12 px-8 uppercase tracking-widest text-[10px] font-medium transition-all"
                    >
                      {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" strokeWidth={1.5} /> : null}
                      {isUpdating ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="outline-none focus-visible:ring-0 mt-8">
              <Card className="rounded-none border border-transparent shadow-none bg-transparent">

                <CardContent className="p-0">
                  {loadingData ? (
                    <div className="flex justify-center py-16">
                      <Loader2 className="h-8 w-8 animate-spin text-black/30" strokeWidth={1} />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-24 bg-white border border-black/5">
                      <Package className="h-10 w-10 mx-auto text-black/20 mb-6" strokeWidth={1} />
                      <h3 className="text-xl font-serif font-light mb-4">No tienes pedidos aún</h3>
                      <p className="text-black/50 font-light text-sm mb-8">
                        Tus futuras compras aparecerán en esta sección.
                      </p>
                      <Button
                        asChild
                        className="bg-black text-white hover:bg-black/90 rounded-none h-12 px-8 uppercase tracking-widest text-[10px] font-medium transition-all"
                      >
                        <Link href="/tienda">Explorar la Tienda</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <AnimatePresence>
                        {orders.map((order, index) => (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white border border-black/5 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-black/10 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-3">
                                <h4 className="font-serif text-lg text-black">Pedido #{order.order_number || order.id.slice(0, 8)}</h4>
                                {getStatusBadge(order.status)}
                              </div>
                              <p className="text-xs text-black/50 tracking-widest uppercase font-medium mb-1">
                                {new Date(order.created_at).toLocaleDateString("es-PE", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                              <p className="text-sm font-light text-black/70">
                                {order.items?.length || 0} {(order.items?.length === 1) ? 'artículo' : 'artículos'}
                              </p>
                            </div>
                            <div className="text-left md:text-right w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end md:gap-4 border-t border-black/5 md:border-0 pt-4 md:pt-0">
                              <p className="font-serif text-2xl text-black">{formatPrice(order.total)}</p>
                              <Button variant="link" className="text-[10px] uppercase tracking-widest font-medium text-black/50 hover:text-black p-0 h-auto group-hover:translate-x-1 transition-transform">
                                Ver detalles <ChevronRight className="w-3 h-3 ml-1 inline" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wishlist" className="outline-none focus-visible:ring-0 mt-8">
              <Card className="rounded-none border border-transparent shadow-none bg-transparent">
                <CardContent className="p-0">
                  {loadingData ? (
                    <div className="flex justify-center py-16">
                      <Loader2 className="h-8 w-8 animate-spin text-black/30" strokeWidth={1} />
                    </div>
                  ) : wishlist.length === 0 ? (
                    <div className="text-center py-24 bg-white border border-black/5">
                      <Heart className="h-10 w-10 mx-auto text-black/20 mb-6" strokeWidth={1} />
                      <h3 className="text-xl font-serif font-light mb-4">Tu lista de deseos está vacía</h3>
                      <p className="text-black/50 font-light text-sm mb-8">
                        Guarda tus piezas favoritas para comprarlas más tarde.
                      </p>
                      <Button
                        asChild
                        className="bg-black text-white hover:bg-black/90 rounded-none h-12 px-8 uppercase tracking-widest text-[10px] font-medium transition-all"
                      >
                        <Link href="/tienda">Descubrir Colección</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      <AnimatePresence>
                        {wishlist.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                          >
                            {item.product && (
                              <>
                                <div className="aspect-[3/4] relative mb-4 overflow-hidden bg-[#FAFAFA]">
                                  <Image
                                    src={item.product.image_url || "/placeholder.svg"}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                                  <button
                                    onClick={() => removeFromWishlist(item.product_id)}
                                    className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur text-black opacity-0 group-hover:opacity-100 transition-opacity rounded-none border border-black/5 hover:bg-white"
                                    aria-label="Remove from wishlist"
                                  >
                                    <Heart className="h-4 w-4 fill-black" strokeWidth={1} />
                                  </button>
                                </div>
                                <div className="flex justify-between items-start gap-4">
                                  <div>
                                    <h4 className="font-serif text-base text-black mb-1 line-clamp-1 group-hover:underline underline-offset-4 decoration-black/30">{item.product.name}</h4>
                                    <p className="text-sm font-medium text-black">{formatPrice(item.product.price)}</p>
                                  </div>
                                </div>
                                <Button
                                  asChild
                                  variant="outline"
                                  className="w-full mt-4 rounded-none border-black/20 text-[10px] uppercase tracking-widest font-medium hover:bg-black hover:text-white transition-colors h-10"
                                >
                                  <Link href={`/producto/${item.product.slug ? item.product.slug : item.product.name.toLowerCase().replace(/ /g, "-")}`}>Ver Producto</Link>
                                </Button>
                              </>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
