'use client'

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

interface FadeInProps {
    children: React.ReactNode
    className?: string
    delay?: number
    direction?: "up" | "down" | "left" | "right" | "none"
    duration?: number
    amount?: "some" | "all" | number
}

export function FadeIn({
    children,
    className,
    delay = 0,
    direction = "up",
    duration = 0.8,
    amount = 0.3, // Trigger when 30% visible
}: FadeInProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount })

    const getInitialOffset = () => {
        switch (direction) {
            case "up":
                return { y: 40, opacity: 0 }
            case "down":
                return { y: -40, opacity: 0 }
            case "left":
                return { x: 40, opacity: 0 }
            case "right":
                return { x: -40, opacity: 0 }
            case "none":
                return { opacity: 0 }
        }
    }

    const getTargetOffset = () => {
        return direction === "none" ? { opacity: 1 } : { x: 0, y: 0, opacity: 1 }
    }

    return (
        <motion.div
            ref={ref}
            initial={getInitialOffset()}
            animate={isInView ? getTargetOffset() : getInitialOffset()}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1], // Custom sophisticated easing
            }}
            className={cn("w-full h-full", className)}
        >
            {children}
        </motion.div>
    )
}
