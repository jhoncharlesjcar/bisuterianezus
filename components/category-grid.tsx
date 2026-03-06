import Link from "next/link"
import Image from "next/image"
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Category } from "@/lib/types"

import { fallbackCategories, categoryImages } from "@/lib/constants"
import { CategoryGridContent } from "./category-grid-content"

export async function CategoryGrid() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  let categories = fallbackCategories

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .in("slug", ["aretes", "collares", "pulseras"])
      .order("name")
      .limit(3)

    if (!error && data && data.length > 0) {
      categories = data.map(cat => ({
        ...cat,
        image_url: categoryImages[cat.slug] || categoryImages.aretes
      }))
    }
  } catch {
    // Falls back to constant
  }

  return <CategoryGridContent categories={categories} />
}

