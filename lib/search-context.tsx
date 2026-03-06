"use client"

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Product, SearchFilters, SearchResults } from "./types"

interface SearchContextType {
    query: string
    filters: SearchFilters
    results: Product[]
    isSearching: boolean
    setQuery: (query: string) => void
    setFilters: (filters: SearchFilters) => void
    search: () => Promise<void>
    clearSearch: () => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
    const [query, setQuery] = useState("")
    const [filters, setFilters] = useState<SearchFilters>({})
    const [results, setResults] = useState<Product[]>([])
    const [isSearching, setIsSearching] = useState(false)

    const search = useCallback(async () => {
        setIsSearching(true)
        try {
            const params = new URLSearchParams()

            if (query) params.append("q", query)
            if (filters.categories?.length) params.append("categories", filters.categories.join(","))
            if (filters.minPrice) params.append("minPrice", filters.minPrice.toString())
            if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString())
            if (filters.inStock !== undefined) params.append("inStock", filters.inStock.toString())
            if (filters.minRating) params.append("minRating", filters.minRating.toString())
            if (filters.sortBy) params.append("sortBy", filters.sortBy)

            const response = await fetch(`/api/search?${params.toString()}`)

            if (!response.ok) {
                throw new Error("Search failed")
            }

            const data: SearchResults = await response.json()
            setResults(data.products)
        } catch (error) {
            console.error("Search error:", error)
            setResults([])
        } finally {
            setIsSearching(false)
        }
    }, [query, filters])

    const clearSearch = useCallback(() => {
        setQuery("")
        setFilters({})
        setResults([])
    }, [])

    return (
        <SearchContext.Provider
            value={{
                query,
                filters,
                results,
                isSearching,
                setQuery,
                setFilters,
                search,
                clearSearch,
            }}
        >
            {children}
        </SearchContext.Provider>
    )
}

export function useSearch() {
    const context = useContext(SearchContext)
    if (context === undefined) {
        throw new Error("useSearch must be used within a SearchProvider")
    }
    return context
}
