"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchBar } from "@/components/search-bar"
import { SearchFilters } from "@/components/search-filters"
import ProductCard from "@/components/product-card"
import { useSearch } from "@/lib/search-context"
import { Skeleton } from "@/components/ui/skeleton"
import type { Product } from "@/lib/types"

function SearchResultsContent() {
    const searchParams = useSearchParams()
    const { query, setQuery, results, isSearching, search } = useSearch()
    const [initialized, setInitialized] = useState(false)

    useEffect(() => {
        const queryParam = searchParams.get("q")
        if (queryParam && !initialized) {
            setQuery(queryParam)
            setInitialized(true)
        }
    }, [searchParams, setQuery, initialized])

    useEffect(() => {
        if (initialized && query) {
            search()
        }
    }, [initialized, query, search])

    return (
        <div className="min-h-screen">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Search Header */}
                <div className="mb-8">
                    <h1 className="mb-4 text-3xl font-bold">Resultados de Búsqueda</h1>
                    <SearchBar />
                    {query && (
                        <p className="mt-4 text-muted-foreground">
                            {isSearching ? (
                                "Buscando..."
                            ) : (
                                <>
                                    {results.length} resultado{results.length !== 1 ? "s" : ""} para &quot;{query}&quot;
                                </>
                            )}
                        </p>
                    )}
                </div>

                <div className="grid gap-8 lg:grid-cols-4">
                    {/* Filters Sidebar */}
                    <aside className="lg:col-span-1">
                        <SearchFilters />
                    </aside>

                    {/* Results Grid */}
                    <div className="lg:col-span-3">
                        {isSearching ? (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="space-y-4">
                                        <Skeleton className="aspect-square w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : results.length > 0 ? (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {results.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : query ? (
                            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                                <h3 className="text-2xl font-semibold">No se encontraron resultados</h3>
                                <p className="mt-2 text-muted-foreground">
                                    Intenta ajustar tus filtros o buscar con otros términos
                                </p>
                            </div>
                        ) : (
                            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                                <h3 className="text-2xl font-semibold">Comienza tu búsqueda</h3>
                                <p className="mt-2 text-muted-foreground">
                                    Usa la barra de búsqueda para encontrar productos
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchResultsContent />
        </Suspense>
    )
}
