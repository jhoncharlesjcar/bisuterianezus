"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Package, ShoppingCart, Tag, Star, Users, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAdmin } from "@/lib/admin-context"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Productos", href: "/admin/productos", icon: Package },
    { name: "Pedidos", href: "/admin/pedidos", icon: ShoppingCart },
    { name: "Cupones", href: "/admin/cupones", icon: Tag },
    { name: "Reseñas", href: "/admin/resenas", icon: Star },
    { name: "Usuarios", href: "/admin/usuarios", icon: Users },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { isAdmin, loading } = useAdmin()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted || loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Skeleton className="h-8 w-8" />
            </div>
        )
    }

    if (!isAdmin) {
        return (
            <div className="flex h-screen items-center justify-center bg-muted/20">
                <div className="text-center space-y-4 p-8">
                    <h1 className="text-2xl font-bold text-destructive">Acceso Denegado</h1>
                    <p className="text-muted-foreground">No tienes permisos de administrador.</p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/login">
                            <Button>Iniciar Sesión</Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline">Ir al Inicio</Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-muted/20">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 border-r bg-card md:block">
                <div className="flex h-full flex-col">
                    <div className="border-b p-6">
                        <Link href="/admin">
                            <h1 className="text-2xl font-bold text-accent">Nezus Admin</h1>
                        </Link>
                    </div>
                    <nav className="flex-1 space-y-1 p-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent/10 transition-colors"
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="border-t p-4">
                        <Link href="/">
                            <Button variant="outline" className="w-full">
                                Ver Tienda
                            </Button>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 border-b bg-card p-4">
                <div className="flex items-center justify-between">
                    <Link href="/admin">
                        <h1 className="text-xl font-bold text-accent">Nezus Admin</h1>
                    </Link>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64">
                            <nav className="space-y-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent/10"
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                            <div className="mt-4">
                                <Link href="/">
                                    <Button variant="outline" className="w-full">
                                        Ver Tienda
                                    </Button>
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto md:mt-0 mt-16">
                <div className="container mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
