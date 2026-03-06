"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import type { Category } from "@/lib/types"

import { fallbackCategories, categoryImages } from "@/lib/constants"
import { TextReveal, RevealWrapper, AnimatedLine } from "@/components/ui/text-reveal"

export function CategoryGridContent({ categories }: { categories: Category[] }) {
    return (
        <section className="py-10 md:py-16 lg:py-20 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-center mb-8 md:mb-12 lg:mb-16"
                >
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <AnimatedLine className="w-12 text-black/30" direction="right" />
                        <span className="text-black text-xs font-medium tracking-[0.4em] uppercase">Categorías Premium</span>
                        <AnimatedLine className="w-12 text-black/30" direction="left" />
                    </div>
                    <RevealWrapper>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-black mb-6 leading-[1.1] font-light">
                            Selección <span className="italic">Exclusiva</span>
                        </h2>
                    </RevealWrapper>
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="max-w-xl mx-auto text-black/60 font-light leading-relaxed tracking-wide"
                    >
                        Piezas curadas para resaltar tu elegancia en cada rincón del Perú.
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 min-h-[400px]">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: index * 0.15, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                            className="w-full"
                        >
                            <Link
                                href={`/tienda?category=${category.slug}`}
                                className="group relative block aspect-[3/4] overflow-hidden bg-[#FAFAFA]"
                                style={{ perspective: "800px" }}
                            >
                                <Image
                                    src={category.image_url || categoryImages[category.slug] || categoryImages.aretes}
                                    alt={category.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    priority={index < 3}
                                    className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                                />

                                {/* Overlays */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-700 opacity-60 group-hover:opacity-80" />

                                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 text-center items-center">
                                    <p className="text-[10px] text-white/70 font-medium uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 ease-out mb-3">
                                        Explorar
                                    </p>
                                    <h3 className="text-white font-serif text-3xl md:text-4xl font-light tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                                        {category.name}
                                    </h3>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
