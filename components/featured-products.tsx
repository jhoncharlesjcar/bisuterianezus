import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Product } from "@/lib/types"
import { FeaturedProductsContent } from "./featured-products-content"

export async function FeaturedProducts() {
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

  let products: Product[] = []

  try {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("featured", true)
      .eq("in_stock", true)
      .limit(8)

    if (data) products = data
  } catch (err) {
    console.error("Error fetching featured products", err)
  }

  return <FeaturedProductsContent products={products} />
}
