"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useAuth } from "@/lib/auth-context"
import type { AdminRole } from "@/lib/types"

interface AdminContextType {
    isAdmin: boolean
    isSuperAdmin: boolean
    permissions: string[]
    loading: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const [adminRole, setAdminRole] = useState<AdminRole | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user) {
            fetchAdminRole()
        } else {
            setAdminRole(null)
            setLoading(false)
        }
    }, [user])

    const fetchAdminRole = async () => {
        try {
            const response = await fetch("/api/admin/check")
            if (response.ok) {
                const data = await response.json()
                setAdminRole(data.role || null)
            } else {
                setAdminRole(null)
            }
        } catch (error) {
            console.error("Error checking admin role:", error)
            setAdminRole(null)
        } finally {
            setLoading(false)
        }
    }

    const value: AdminContextType = {
        isAdmin: !!adminRole,
        isSuperAdmin: adminRole?.role === "super_admin",
        permissions: adminRole?.permissions || [],
        loading,
    }

    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
    const context = useContext(AdminContext)
    if (context === undefined) {
        throw new Error("useAdmin must be used within an AdminProvider")
    }
    return context
}
