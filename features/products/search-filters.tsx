"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useSearch } from "@/lib/search-context"
import type { SearchFilters } from "@/lib/types"

interface Category {
    id: string
    name: string
}

export function SearchFilters() {
    const { filters, setFilters, search } = useSearch()
    const [categories, setCategories] = useState<Category[]>([])
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])

    useEffect(() => {
        // Fetch categories
        fetch("/api/categories")
            .then((res) => res.json())
            .then((data) => setCategories(data.categories || []))
            .catch(console.error)
    }, [])

    const handleCategoryToggle = (categoryId: string, checked: boolean) => {
        const currentCategories = filters.categories || []
        const newCategories = checked
            ? [...currentCategories, categoryId]
            : currentCategories.filter((id) => id !== categoryId)

        setFilters({ ...filters, categories: newCategories })
    }

    const handlePriceChange = (value: number[]) => {
        setPriceRange([value[0], value[1]])
        setFilters({
            ...filters,
            minPrice: value[0],
            maxPrice: value[1],
        })
    }

    const handleSortChange = (value: string) => {
        setFilters({ ...filters, sortBy: value as SearchFilters["sortBy"] })
    }

    const handleStockToggle = (checked: boolean) => {
        setFilters({ ...filters, inStock: checked ? true : undefined })
    }

    const handleClearFilters = () => {
        setFilters({})
        setPriceRange([0, 100])
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Filtros</CardTitle>
                    <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                        Limpiar
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Sort */}
                <div className="space-y-2">
                    <Label>Ordenar por</Label>
                    <Select value={filters.sortBy} onValueChange={handleSortChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Más recientes</SelectItem>
                            <SelectItem value="price_asc">Precio: Menor a Mayor</SelectItem>
                            <SelectItem value="price_desc">Precio: Mayor a Menor</SelectItem>
                            <SelectItem value="name_asc">Nombre: A-Z</SelectItem>
                            <SelectItem value="name_desc">Nombre: Z-A</SelectItem>
                            <SelectItem value="rating_desc">Mejor calificados</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Separator />

                {/* Categories */}
                {categories.length > 0 && (
                    <>
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Categorías</Label>
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <div key={category.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`category-${category.id}`}
                                            checked={filters.categories?.includes(category.id)}
                                            onCheckedChange={(checked) =>
                                                handleCategoryToggle(category.id, checked as boolean)
                                            }
                                        />
                                        <Label
                                            htmlFor={`category-${category.id}`}
                                            className="cursor-pointer font-normal"
                                        >
                                            {category.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Separator />
                    </>
                )}

                {/* Price Range */}
                <div className="space-y-4">
                    <Label className="text-base font-semibold">Rango de Precio</Label>
                    <div className="pt-2">
                        <Slider
                            min={0}
                            max={200}
                            step={5}
                            value={priceRange}
                            onValueChange={handlePriceChange}
                            className="w-full"
                        />
                        <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                            <span>S/ {priceRange[0]}</span>
                            <span>S/ {priceRange[1]}</span>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Stock */}
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="in-stock"
                        checked={filters.inStock === true}
                        onCheckedChange={handleStockToggle}
                    />
                    <Label htmlFor="in-stock" className="cursor-pointer font-normal">
                        Solo productos en stock
                    </Label>
                </div>

                {/* Apply Button */}
                <Button onClick={search} className="w-full">
                    Aplicar Filtros
                </Button>
            </CardContent>
        </Card>
    )
}
