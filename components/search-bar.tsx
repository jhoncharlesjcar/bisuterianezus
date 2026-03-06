"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useSearch } from "@/lib/search-context"
import { cn } from "@/lib/utils"

export function SearchBar({ className }: { className?: string }) {
    const router = useRouter()
    const { query, setQuery, search } = useSearch()
    const [localQuery, setLocalQuery] = useState(query)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [suggestions, setSuggestions] = useState<string[]>([])
    const searchRef = useRef<HTMLDivElement>(null)
    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Fetch suggestions with debounce
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }

        if (localQuery.length >= 2) {
            debounceRef.current = setTimeout(async () => {
                try {
                    const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(localQuery)}`)
                    if (response.ok) {
                        const data = await response.json()
                        setSuggestions(data.suggestions || [])
                        setShowSuggestions(true)
                    }
                } catch (error) {
                    console.error("Failed to fetch suggestions:", error)
                }
            }, 300)
        } else {
            setSuggestions([])
            setShowSuggestions(false)
        }

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current)
            }
        }
    }, [localQuery])

    const handleSearch = async (e?: React.FormEvent) => {
        e?.preventDefault()
        setQuery(localQuery)
        setShowSuggestions(false)
        router.push(`/buscar?q=${encodeURIComponent(localQuery)}`)
    }

    const handleSuggestionClick = (suggestion: string) => {
        setLocalQuery(suggestion)
        setQuery(suggestion)
        setShowSuggestions(false)
        router.push(`/buscar?q=${encodeURIComponent(suggestion)}`)
    }

    const handleClear = () => {
        setLocalQuery("")
        setQuery("")
        setSuggestions([])
        setShowSuggestions(false)
    }

    return (
        <div ref={searchRef} className={cn("relative w-full max-w-md", className)}>
            <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Buscar productos..."
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    onFocus={() => localQuery.length >= 2 && setShowSuggestions(true)}
                    className="pl-10 pr-10"
                />
                {localQuery && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleClear}
                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </form>

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto rounded-md border bg-popover p-1 shadow-lg">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm hover:bg-accent"
                        >
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <span>{suggestion}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
