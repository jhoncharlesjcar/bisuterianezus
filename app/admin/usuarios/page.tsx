"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Search, Users, Mail, Phone, Calendar } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface User {
    id: string
    full_name?: string
    email?: string
    phone?: string
    avatar_url?: string
    role?: string
    is_active?: boolean
    created_at: string
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/admin/users")
            if (response.ok) {
                const data = await response.json()
                setUsers(data.users || [])
            }
        } catch (error) {
            console.error("Error fetching users:", error)
        } finally {
            setLoading(false)
        }
    }

    const toggleAdmin = async (user: User) => {
        const newRole = user.role === "admin" ? "user" : "admin"

        try {
            const response = await fetch("/api/admin/users", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: user.id, role: newRole }),
            })

            if (response.ok) {
                setUsers(
                    users.map((u) =>
                        u.id === user.id ? { ...u, role: newRole } : u
                    )
                )
                toast.success(`Usuario ${newRole === "admin" ? "promovido a admin" : "removido de admin"}`)
            } else {
                toast.error("Error al actualizar")
            }
        } catch {
            toast.error("Error de conexión")
        }
    }

    const filteredUsers = users.filter(
        (u) =>
            u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Usuarios</h1>
                    <p className="text-muted-foreground">
                        Gestiona los usuarios registrados
                    </p>
                </div>
                <Badge variant="outline" className="text-lg py-1 px-3">
                    {users.length} usuarios
                </Badge>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Users className="h-5 w-5" />
                        <CardTitle>Todos los usuarios</CardTitle>
                    </div>
                    <div className="relative mt-4">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre o email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-center py-8">Cargando usuarios...</p>
                    ) : filteredUsers.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            No se encontraron usuarios
                        </p>
                    ) : (
                        <div className="divide-y">
                            {filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between py-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
                                            {user.avatar_url ? (
                                                <Image
                                                    src={user.avatar_url}
                                                    alt={user.full_name || "Usuario"}
                                                    fill
                                                    sizes="48px"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-accent/20 text-accent font-bold text-lg">
                                                    {user.full_name?.charAt(0)?.toUpperCase() || "U"}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">
                                                    {user.full_name || "Sin nombre"}
                                                </span>
                                                {user.role === "admin" && (
                                                    <Badge variant="default">Admin</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                {user.email && (
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {user.email}
                                                    </span>
                                                )}
                                                {user.phone && (
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3" />
                                                        {user.phone}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(user.created_at).toLocaleDateString("es-PE")}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">Admin</span>
                                            <Switch
                                                checked={user.role === "admin"}
                                                onCheckedChange={() => toggleAdmin(user)}
                                            />
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
