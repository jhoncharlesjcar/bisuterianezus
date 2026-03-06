import { Metadata } from "next"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProductDetails } from "@/components/product-details"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

import { ProductReviews } from "@/components/product-reviews"
import { WriteReviewForm } from "@/components/write-review-form"
import { Separator } from "@/components/ui/separator"
import { Suspense } from "react"

export const revalidate = 0

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .single()

  if (!product) {
    return {
      title: "Producto no encontrado",
    }
  }

  return {
    title: product.name,
    description: product.description || `${product.name} - Bisutería artesanal de alta calidad`,
    openGraph: {
      title: product.name,
      description: product.description || `${product.name} - Bisutería artesanal`,
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: dbProduct } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .single()

  const product = dbProduct

  if (!product) {
    notFound()
  }

  const { data: dbRelated } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .limit(4)

  const relatedProducts = dbRelated || []


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ProductDetails product={product} />

        {/* Reviews Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Escribe una Reseña</h2>
              <Suspense fallback={<div>Cargando formulario...</div>}>
                <WriteReviewForm
                  productId={product.id}
                />
              </Suspense>
            </div>

            <Separator />

            <div>
              <Suspense fallback={<div>Cargando reseñas...</div>}>
                <ProductReviews productId={product.id} />
              </Suspense>
            </div>
          </div>
        </section>


      </main>
      <Footer />
    </div>
  )
}
