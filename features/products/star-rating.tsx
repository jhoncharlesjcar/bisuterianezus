"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
    rating: number
    maxRating?: number
    size?: "sm" | "md" | "lg"
    showValue?: boolean
    interactive?: boolean
    onRatingChange?: (rating: number) => void
    className?: string
}

export function StarRating({
    rating,
    maxRating = 5,
    size = "md",
    showValue = false,
    interactive = false,
    onRatingChange,
    className,
}: StarRatingProps) {
    const sizeClasses = {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
    }

    const handleClick = (newRating: number) => {
        if (interactive && onRatingChange) {
            onRatingChange(newRating)
        }
    }

    return (
        <div className={cn("flex items-center gap-0.5", className)}>
            {Array.from({ length: maxRating }, (_, index) => {
                const starValue = index + 1
                const isFilled = starValue <= Math.round(rating)
                const isPartial = starValue > rating && starValue - 1 < rating

                return (
                    <button
                        key={index}
                        type="button"
                        onClick={() => handleClick(starValue)}
                        disabled={!interactive}
                        className={cn(
                            "relative",
                            interactive && "cursor-pointer hover:scale-110 transition-transform",
                            !interactive && "cursor-default"
                        )}
                    >
                        <Star
                            className={cn(
                                sizeClasses[size],
                                isFilled || isPartial
                                    ? "fill-[#D4AF37] text-[#D4AF37]"
                                    : "fill-none text-gray-300"
                            )}
                        />
                        {isPartial && (
                            <div
                                className="absolute inset-0 overflow-hidden"
                                style={{ width: `${(rating % 1) * 100}%` }}
                            >
                                <Star
                                    className={cn(sizeClasses[size], "fill-[#D4AF37] text-[#D4AF37]")}
                                />
                            </div>
                        )}
                    </button>
                )
            })}
            {showValue && (
                <span className="ml-1 text-sm font-medium text-muted-foreground">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    )
}
