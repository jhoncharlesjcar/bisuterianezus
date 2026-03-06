import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { CategoryGrid } from "@/components/category-grid"
import { FeaturedProducts } from "@/components/featured-products"
import { About } from "@/components/about"
import { Lookbook } from "@/components/lookbook"
import { Promotions } from "@/components/promotions"
import { Testimonials } from "@/components/testimonials"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { CookieBanner } from "@/components/cookie-banner"

export const revalidate = 0

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
