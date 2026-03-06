"use client"

import { ReactNode } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import { SearchProvider } from "@/lib/search-context"
import { AdminProvider } from "@/lib/admin-context"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminProvider>
        <CartProvider>
          <WishlistProvider>
            <SearchProvider>
              {children}
            </SearchProvider>
          </WishlistProvider>
        </CartProvider>
      </AdminProvider>
    </AuthProvider>
  )
}
