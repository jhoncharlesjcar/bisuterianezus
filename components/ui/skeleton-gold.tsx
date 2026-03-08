"use client"

import { cn } from "@/lib/utils"

interface GoldSkeletonProps {
    className?: string
    lines?: number
}

/**
 * D7: Premium gold shimmer skeleton loader.
 * Uses the gold-shimmer animation from globals.css.
 */
export function GoldSkeleton({ className, lines = 1 }: GoldSkeletonProps) {
    return (
        <div className={cn("space-y-3", className)}>
            {Array.from({ length: lines }, (_, i) => (
                <div
                    key={i}
                    className="h-4 rounded-sm shimmer-gold bg-black/5"
                    style={{ width: i === lines - 1 ? "60%" : "100%" }}
                />
            ))}
        </div>
    )
}

/**
 * A full-width skeleton for review cards.
 */
export function ReviewSkeleton() {
    return (
        <div className="space-y-8">
            {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="p-8 border border-black/5 bg-[#FAFAFA]">
                    <div className="flex gap-1 mb-4">
                        {Array.from({ length: 5 }, (_, j) => (
                            <div key={j} className="w-4 h-4 rounded-sm shimmer-gold bg-[#D4AF37]/10" />
                        ))}
                    </div>
                    <GoldSkeleton lines={3} className="mb-6" />
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full shimmer-gold bg-black/5" />
                        <div className="flex-1">
                            <div className="h-4 w-24 shimmer-gold bg-black/5 rounded-sm mb-2" />
                            <div className="h-3 w-16 shimmer-gold bg-black/5 rounded-sm" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
