import { Header } from "@/components/layout/header"
import { Hero } from "@/features/brand/hero"
import { CategoryGrid } from "@/features/products/category-grid"
import { FeaturedProducts } from "@/features/products/featured-products"
import { About } from "@/features/brand/about"
import { Lookbook } from "@/features/brand/lookbook"
import { Promotions } from "@/features/brand/promotions"
import { Testimonials } from "@/features/brand/testimonials"
import { Contact } from "@/features/brand/contact"
import { Footer } from "@/components/layout/footer"
import { CookieBanner } from "@/components/layout/cookie-banner"

export const revalidate = 3600 // 1 hour

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <About />
      <Lookbook />
      <Promotions />
      <Testimonials />
      <Contact />
      <Footer />
      <CookieBanner />
    </main>
  )
}
