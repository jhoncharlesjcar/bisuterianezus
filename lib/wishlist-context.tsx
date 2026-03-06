"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth-context"
import type { Product, WishlistItem } from "@/lib/types"

interface WishlistContextType {
  items: WishlistItem[]
  loading: boolean
  addToWishlist: (product: Product) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  itemCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      loadWishlist()
    } else {
      setItems([])
      setLoading(false)
    }
  }, [user])

  const loadWishlist = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("wishlists")
        .select(`
          *,
          product:products(*)
        `)
        .eq("user_id", user.id)

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        // Silently ignore 'not found' / 'table does not exist' to avoid console flood
        // PGRST116 = JSON object requested, multiple (or no) rows returned
        // 42P01 = undefined_table
        console.warn("Notice loading wishlist:", error.message)
      }

      setItems(data || [])
    } catch (err) {
      // Safe catch
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = async (product: Product) => {
    if (!user) return

    const { data, error } = await supabase
      .from("wishlists")
      .insert({
        user_id: user.id,
        product_id: product.id,
      })
      .select(`
        *,
        product:products(*)
      `)
      .single()

    if (!error && data) {
      setItems(prev => [...prev, data])
    }
  }

  const removeFromWishlist = async (productId: string) => {
    if (!user) return

    await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId)

    setItems(prev => prev.filter(item => item.product_id !== productId))
  }

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product_id === productId)
  }

  return (
    <WishlistContext.Provider value={{
      items,
      loading,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      itemCount: items.length,
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
