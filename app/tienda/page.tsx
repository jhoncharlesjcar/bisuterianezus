"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import type { Product, Category } from "@/lib/types"
import { fallbackCategories } from "@/lib/constants"
import ProductCard from "@/components/product-card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Search, Loader2, SlidersHorizontal, X, ArrowRight } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function TiendaContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // Initialize state from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "todos")

  const [priceRange, setPriceRange] = useState([0, 100])
  const [maxPrice, setMaxPrice] = useState(100)
  const [sortOrder, setSortOrder] = useState("featured")
  const [filtersOpen, setFiltersOpen] = useState(false)

  const supabase = useMemo(() => createClient(), [])


  useEffect(() => {
    loadData()
  }, [])

  // Sync when searchParams change (if navigated via internal links)
  useEffect(() => {
    const catParam = searchParams.get("category")
    if (catParam) {
      setCategory(catParam)
    }
  }, [searchParams])

  const loadData = async () => {
    setLoading(true)

    const [productsRes, categoriesRes] = await Promise.all([
      supabase
        .from("products")
        .select("*, category:categories(*)")
        .order("featured", { ascending: false }),
      supabase
        .from("categories")
        .select("*")
        .in("slug", ["aretes", "collares", "pulseras", "resplandor-estival", "elegancia-nocturna", "geometria-del-lujo", "coleccion-estelar", "edicion-limitada"])
        .order("name"),
    ])

    const loadedProducts = productsRes.data || []

    setProducts(loadedProducts)

    // Use DB categories if available, otherwise use fallback
    const dbCategories = categoriesRes.data || []
    setCategories(dbCategories.length > 0 ? dbCategories : fallbackCategories)

    if (loadedProducts.length > 0) {
      const max = Math.ceil(Math.max(...loadedProducts.map((p) => p.price)))
      setMaxPrice(max)
      setPriceRange([0, max])
    }

    setLoading(false)
  }


  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products]

    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description?.toLowerCase().includes(search)
      )
    }

    if (category !== "todos") {
      filtered = filtered.filter((p) => p.category?.slug === category || p.category_id === category)
    }

    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    switch (sortOrder) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
    }

    return filtered
  }, [products, category, priceRange, sortOrder, searchTerm])

  const activeCategory = useMemo(() => {
    if (category === "todos") return null;
    return categories.find(c => c.slug === category || c.id === category);
  }, [category, categories]);

  const pageTitle = activeCategory ? activeCategory.name : "Colecciones";
  // Si la categoría tiene descripción, la mostramos. Si no, mostramos un fallback.
  const pageDescription = activeCategory?.description || "Explora nuestra cuidada selección de joyería artesanal. Cada pieza es diseñada para realzar tu estilo con elegancia discreta.";

  const resetFilters = () => {
    setCategory("todos")
    setPriceRange([0, maxPrice])
    setSortOrder("featured")
    setSearchTerm("")
  }

  const FiltersContent = () => (
    <div className="space-y-10">
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-light text-black">Buscar</h3>
        <div className="relative">
          <Input
            placeholder="Buscar piezas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm font-light border-0 border-b border-black/20 rounded-none px-0 py-2 bg-transparent focus-visible:ring-0 focus-visible:border-black placeholder:text-black/30 pb-3"
          />
          <Search className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-serif text-lg font-light text-black">Categoría</h3>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setCategory("todos")}
            className={`text-left text-sm font-light transition-colors ${category === "todos" ? "text-black font-medium" : "text-black/60 hover:text-black"}`}
          >
            Todas las piezas
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.slug || cat.id)}
              className={`text-left text-sm font-light transition-colors ${category === cat.slug || category === cat.id ? "text-black font-medium" : "text-black/60 hover:text-black"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="font-serif text-lg font-light text-black">Rango de Precios</h3>
        <Slider
          min={0}
          max={maxPrice}
          step={1}
          value={priceRange}
          onValueChange={setPriceRange}
          className="w-full"
        />
        <div className="flex justify-between text-[11px] font-medium tracking-widest text-black/60">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {(category !== "todos" || searchTerm !== "" || priceRange[0] !== 0 || priceRange[1] !== maxPrice) && (
        <Button
          variant="outline"
          className="w-full h-12 bg-transparent border-black/20 hover:border-black hover:bg-transparent rounded-none uppercase tracking-widest text-[10px] font-medium text-black transition-all"
          onClick={resetFilters}
        >
          Limpiar Filtros
        </Button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 lg:py-24 max-w-7xl">

          <motion.div
            key={pageTitle} // force re-animation when title changes
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16 lg:mb-24"
          >
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-black mb-6">{pageTitle}</h1>
            <p className="max-w-2xl mx-auto text-black/60 font-light leading-relaxed">
              {pageDescription}
            </p>
          </motion.div>

          {loading ? (
            <div className="flex flex-col justify-center items-center py-32 opacity-50">
              <Loader2 className="h-8 w-8 animate-spin text-black mb-4" strokeWidth={1} />
              <span className="text-xs uppercase tracking-widest font-medium text-black">Cargando Colección...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-x-16 gap-y-12 items-start">

              {/* Desktop Sidebar */}
              <aside className="hidden lg:block sticky top-32">
                <div className="pr-4 border-r border-black/5 min-h-[50vh]">
                  <FiltersContent />
                </div>
              </aside>

              <div className="flex flex-col w-full min-w-0">

                {/* Filters Toolbar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6 border-b border-black/5 pb-6">

                  {/* Mobile Filters Trigger */}
                  <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden w-full sm:w-auto h-12 rounded-none border-black/20 text-xs tracking-widest uppercase font-medium">
                        <SlidersHorizontal className="h-4 w-4 mr-2" strokeWidth={1.5} />
                        Filtros
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px] border-r-0 bg-[#FAFAFA] p-8">
                      <SheetHeader className="mb-8 text-left">
                        <SheetTitle className="font-serif text-3xl font-light">Filtros</SheetTitle>
                      </SheetHeader>
                      <FiltersContent />
                    </SheetContent>
                  </Sheet>

                  <div className="flex items-center gap-4 w-full sm:w-auto self-end sm:self-auto justify-between sm:justify-end">
                    <p className="text-[10px] uppercase tracking-widest text-black/40 font-medium whitespace-nowrap hidden sm:block">
                      Mostrando {filteredAndSortedProducts.length} piezas
                    </p>
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                      <SelectTrigger className="w-[180px] sm:w-[220px] h-12 bg-transparent border-0 border-black/20 rounded-none focus:ring-0 focus:border-black px-0 uppercase tracking-widest text-[10px] font-medium text-black/60 shadow-none text-right justify-end gap-2">
                        <SelectValue placeholder="Ordenar por" />
                      </SelectTrigger>
                      <SelectContent className="rounded-none border-black/10 shadow-xl bg-white">
                        <SelectItem value="featured" className="text-xs font-light focus:bg-black/5 uppercase tracking-wider py-3">Nuestra Selección</SelectItem>
                        <SelectItem value="newest" className="text-xs font-light focus:bg-black/5 uppercase tracking-wider py-3">Lo Más Nuevo</SelectItem>
                        <SelectItem value="price-asc" className="text-xs font-light focus:bg-black/5 uppercase tracking-wider py-3">Precio: Menor a Mayor</SelectItem>
                        <SelectItem value="price-desc" className="text-xs font-light focus:bg-black/5 uppercase tracking-wider py-3">Precio: Mayor a Menor</SelectItem>
                        <SelectItem value="name-asc" className="text-xs font-light focus:bg-black/5 uppercase tracking-wider py-3">Nombre: A-Z</SelectItem>
                        <SelectItem value="name-desc" className="text-xs font-light focus:bg-black/5 uppercase tracking-wider py-3">Nombre: Z-A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Product Grid */}
                {filteredAndSortedProducts.length > 0 ? (
                  <motion.div
                    layout
                    className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16"
                  >
                    <AnimatePresence>
                      {filteredAndSortedProducts.map((product, index) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          key={product.id}
                        >
                          <ProductCard product={product} index={index} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-24 text-center border border-black/5 bg-white p-8"
                  >
                    <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-6">
                      <Search className="w-6 h-6 text-black/40" strokeWidth={1} />
                    </div>
                    <h3 className="text-2xl font-serif font-light mb-2">Ninguna pieza encontrada</h3>
                    <p className="text-black/50 font-light max-w-md mb-8">
                      Intenta ajustar tus filtros de búsqueda o explora otras categorías para encontrar lo que buscas.
                    </p>
                    <Button
                      onClick={resetFilters}
                      className="h-12 px-8 bg-black hover:bg-black/90 text-white rounded-none uppercase tracking-widest text-[10px] font-medium transition-all group"
                    >
                      Ver la colección completa
                      <ArrowRight className="w-4 h-4 ml-2 opacity-0 -mr-6 group-hover:opacity-100 group-hover:mr-0 transition-all duration-300" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function TiendaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="h-8 w-8 animate-spin text-black" strokeWidth={1} />
      </div>
    }>
      <TiendaContent />
    </Suspense>
  )
}
