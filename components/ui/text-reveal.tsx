'use client'

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

interface TextRevealProps {
    children: string
    className?: string
    delay?: number
    duration?: number
    as?: "h1" | "h2" | "h3" | "h4" | "p" | "span"
    splitBy?: "word" | "line"
}

export function TextReveal({
    children,
    className,
    delay = 0,
    duration = 0.8,
    as: Tag = "h2",
    splitBy = "word",
}: TextRevealProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })

    if (splitBy === "line") {
        return (
            <Tag ref={ref} className={cn("overflow-hidden", className)}>
                <motion.span
                    className="block"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={isInView ? { y: "0%", opacity: 1 } : { y: "100%", opacity: 0 }}
                    transition={{
                        duration,
                        delay,
                        ease: [0.25, 0.4, 0, 1],
                    }}
                >
                    {children}
                </motion.span>
            </Tag>
        )
    }

    const words = children.split(" ")

    return (
        <Tag ref={ref} className={cn("flex flex-wrap", className)}>
            {words.map((word, i) => (
                <span key={i} className="overflow-hidden inline-block mr-[0.3em]">
                    <motion.span
                        className="inline-block"
                        initial={{ y: "110%", rotateX: 45, opacity: 0 }}
                        animate={
                            isInView
                                ? { y: "0%", rotateX: 0, opacity: 1 }
                                : { y: "110%", rotateX: 45, opacity: 0 }
                        }
                        transition={{
                            duration,
                            delay: delay + i * 0.06,
                            ease: [0.25, 0.4, 0, 1],
                        }}
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </Tag>
    )
}

// For rendering JSX children with italic spans etc.
interface RevealWrapperProps {
    children: React.ReactNode
    className?: string
    delay?: number
    duration?: number
}

export function RevealWrapper({
    children,
    className,
    delay = 0,
    duration = 1,
}: RevealWrapperProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })

    return (
        <div ref={ref} className={cn("overflow-hidden", className)}>
            <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={isInView ? { y: "0%", opacity: 1 } : { y: "100%", opacity: 0 }}
                transition={{
                    duration,
                    delay,
                    ease: [0.25, 0.4, 0, 1],
                }}
            >
                {children}
            </motion.div>
        </div>
    )
}

// Animated horizontal line that extends on view
export function AnimatedLine({
    className,
    delay = 0,
    direction = "right",
}: {
    className?: string
    delay?: number
    direction?: "left" | "right"
}) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.5 })

    return (
        <motion.div
            ref={ref}
            className={cn("h-[1px] bg-current", className)}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            style={{ transformOrigin: direction === "right" ? "left" : "right" }}
            transition={{
                duration: 1.2,
                delay,
                ease: [0.25, 0.4, 0, 1],
            }}
        />
    )
}
