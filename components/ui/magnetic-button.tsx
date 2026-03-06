'use client'

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MagneticButtonProps {
    children: React.ReactNode
    className?: string
    strength?: number
    onClick?: () => void
}

export function MagneticButton({
    children,
    className,
    strength = 0.3,
    onClick,
}: MagneticButtonProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const handleMouse = (e: React.MouseEvent) => {
        if (!ref.current) return
        const { clientX, clientY } = e
        const { left, top, width, height } = ref.current.getBoundingClientRect()
        const middleX = clientX - (left + width / 2)
        const middleY = clientY - (top + height / 2)
        setPosition({ x: middleX * strength, y: middleY * strength })
    }

    const reset = () => {
        setPosition({ x: 0, y: 0 })
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            onClick={onClick}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 350, damping: 15, mass: 0.5 }}
            className={cn("inline-block cursor-pointer", className)}
        >
            <motion.div
                animate={{ x: position.x * 0.3, y: position.y * 0.3 }}
                transition={{ type: "spring", stiffness: 350, damping: 15, mass: 0.5 }}
            >
                {children}
            </motion.div>
        </motion.div>
    )
}
