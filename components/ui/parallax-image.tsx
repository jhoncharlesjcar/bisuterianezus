'use client'

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

interface ParallaxImageProps {
    children: React.ReactNode
    className?: string
    offset?: number // How much it moves (pixels)
}

export function ParallaxImage({
    children,
    className,
    offset = 50,
}: ParallaxImageProps) {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    })

    // Transform scroll progress (0 to 1) into y offset (-offset to +offset)
    const y = useTransform(scrollYProgress, [0, 1], [-offset, offset])

    return (
        <div ref={ref} className={cn("overflow-hidden relative w-full h-full", className)}>
            <motion.div style={{ y }} className="w-full h-[120%] -top-[10%] relative">
                {children}
            </motion.div>
        </div>
    )
}
