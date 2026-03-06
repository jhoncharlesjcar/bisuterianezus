import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const BASE_URL = 'https://nezusbisuteria.com'

type SitemapEntry = {
    url: string
    lastModified?: Date
    changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
    priority?: number
}

export default async function sitemap(): Promise<SitemapEntry[]> {
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

    // Static pages
    const staticPages: SitemapEntry[] = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/tienda`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/buscar`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/login`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/registro`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/politica-privacidad`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.2,
        },
        {
            url: `${BASE_URL}/terminos`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.2,
        },
    ]

    // Dynamic product pages
    let productPages: SitemapEntry[] = []
    try {
        const { data: products } = await supabase
            .from('products')
            .select('slug, updated_at')
            .eq('in_stock', true)

        if (products) {
            productPages = products.map((product) => ({
                url: `${BASE_URL}/producto/${product.slug}`,
                lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }))
        }
    } catch {
        // Fallback — products will not be in sitemap
    }

    // Dynamic category pages
    let categoryPages: SitemapEntry[] = []
    try {
        const { data: categories } = await supabase
            .from('categories')
            .select('slug')

        if (categories) {
            categoryPages = categories.map((cat) => ({
                url: `${BASE_URL}/tienda?category=${cat.slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }))
        }
    } catch {
        // Fallback
    }

    return [...staticPages, ...productPages, ...categoryPages]
}
