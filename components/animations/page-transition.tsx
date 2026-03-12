"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { type ReactNode } from "react"

/**
 * D9: Page transition wrapper with Framer Motion.
 * Provides a smooth fade-in/out between route changes.
 */
export function PageTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname()

    return (
        <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                ease: [0.25, 0.4, 0, 1],
            }}
        >
            {children}
        </motion.div>
    )
}
