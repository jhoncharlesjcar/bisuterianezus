"use client"

import { useEffect, useState } from "react"
import { StarRating } from "@/components/star-rating"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ThumbsUp } from "lucide-react"
import type { Review, ReviewStats } from "@/lib/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ReviewSkeleton } from "@/components/ui/skeleton-gold"

interface ProductReviewsProps {
    productId: string
}

export function ProductReviews({ productId }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [stats, setStats] = useState<ReviewStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchReviews()
    }, [productId])

    const fetchReviews = async () => {
        try {
            const response = await fetch(`/api/reviews?productId=${productId}`)
            if (response.ok) {
                const data = await response.json()
                setReviews(data.reviews || [])
                setStats(data.stats || null)
            }
        } catch (error) {
            console.error("Error fetching reviews:", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <ReviewSkeleton />
    }

    return (
        <div className="space-y-12">
            {/* Stats Summary */}
            {stats && stats.total_reviews > 0 && (
                <div className="bg-[#FAFAFA] p-8 border border-black/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-2xl font-serif font-light text-black mb-2">Reseñas de Clientes</h3>
                        <p className="text-xs text-black/50 uppercase tracking-widest font-medium">
                            Basado en {stats.total_reviews} reseña{stats.total_reviews !== 1 ? "s" : ""}
                        </p>
                    </div>
                    <div className="text-center md:text-right flex flex-col items-center md:items-end">
                        <div className="text-5xl font-serif font-light text-black mb-2">{stats.average_rating.toFixed(1)}</div>
                        <StarRating rating={stats.average_rating} size="lg" />
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-8">
                {reviews.length === 0 ? (
                    <p className="text-center text-black/50 py-12 font-light">
                        Aún no hay reseñas para este producto. ¡Sé el primero en opinar!
                    </p>
                ) : (
                    reviews.map((review, index) => (
                        <div key={review.id} className="pt-8 first:pt-0 border-t border-black/5 first:border-0">
                            <div className="flex gap-6">
                                <Avatar className="w-12 h-12 border border-black/5 relative">
                                    <AvatarImage src={review.user?.avatar_url} />
                                    <AvatarFallback className="bg-[#FAFAFA] text-black font-serif font-light text-xl relative h-full w-full">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{review.user?.full_name?.charAt(0) || "U"}</div>
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                                        <div>
                                            <p className="font-medium text-sm text-black mb-1">{review.user?.full_name || "Usuario"}</p>
                                            <StarRating rating={review.rating} size="sm" />
                                        </div>
                                        <p className="text-xs text-black/40 uppercase tracking-widest">
                                            {format(new Date(review.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                                        </p>
                                    </div>

                                    {review.title && (
                                        <p className="font-serif text-lg text-black mt-4">{review.title}</p>
                                    )}

                                    {review.comment && (
                                        <p className="text-black/60 font-light text-sm leading-relaxed">{review.comment}</p>
                                    )}

                                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-black/5">
                                        <div className="flex items-center gap-2">
                                            {review.verified_purchase && (
                                                <p className="text-[10px] text-[#8E8B82] uppercase tracking-widest font-medium">✓ Compra verificada</p>
                                            )}
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8 text-xs text-black/50 hover:text-black hover:bg-black/5 rounded-none px-3 transition-colors">
                                            <ThumbsUp className="h-3 w-3 mr-2" />
                                            Útil ({review.helpful_count})
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
