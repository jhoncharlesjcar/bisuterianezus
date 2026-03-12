import { Category } from "@/lib/types"

export const categoryImages: Record<string, string> = {
    aretes: "https://res.cloudinary.com/dn36m0jer/image/upload/v1771386082/nezus/products/aretes-gota-dorada-cristales.jpg",
    collares: "/images/collar-perlas-flor-lila.jpeg",
    pulseras: "https://res.cloudinary.com/dn36m0jer/image/upload/v1771387398/nezus/products/pulseras-mostacilla-pareja.jpg",
}

export const fallbackCategories: Category[] = [
    {
        id: "1",
        name: "Aretes",
        slug: "aretes",
        image_url: categoryImages.aretes,
        created_at: new Date().toISOString(),
    },
    {
        id: "2",
        name: "Collares",
        slug: "collares",
        image_url: categoryImages.collares,
        created_at: new Date().toISOString(),
    },
    {
        id: "3",
        name: "Pulseras",
        slug: "pulseras",
        image_url: categoryImages.pulseras,
        created_at: new Date().toISOString(),
    },
]
