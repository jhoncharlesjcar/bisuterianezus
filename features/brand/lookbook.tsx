"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRef } from "react"
import { cn } from "@/lib/utils"
import { RevealWrapper, AnimatedLine } from "@/components/ui/text-reveal"
import { MagneticButton } from "@/components/ui/magnetic-button"

const collections = [
    {
        id: 1,
        title: "Resplandor Estival",
        subtitle: "La luz a tu favor",
        description: "Una celebración del brillo vibrante. Diseños radiantes que capturan la esencia del verano y resaltan tu magnetismo natural bajo cualquier luz.",
        image: "/images/lifestyle/lifestyle-aretes-mandala-negro-celeste.png",
        link: "/tienda?category=resplandor-estival",
    },
    {
        id: 2,
        title: "Elegancia Nocturna",
        subtitle: "Para tus mejores momentos",
        description: "Aretes y collares que capturan la refracción de las estrellas. El complemento definitivo para cenas de gala o noches memorables, donde el brillo es el protagonista absoluto.",
        image: "/images/lifestyle/product_17_lifestyle.png",
        link: "/tienda?category=elegancia-nocturna",
    },
    {
        id: 3,
        title: "Geometría del Lujo",
        subtitle: "Inspiración vanguardista",
        description: "El encanto de la geometría cristalina. Formas arquitectónicas y siluetas expresivas donde cada faceta crea un espectáculo de sofisticación incomparable.",
        image: "/images/lifestyle/lifestyle-corazon-piedras-verdes.png",
        link: "/tienda?category=geometria-del-lujo",
    },
]

export function Lookbook() {
    const containerRef = useRef<HTMLDivElement>(null)

    return (
        <section id="lookbook" ref={containerRef} className="py-10 md:py-16 lg:py-32 bg-[#FAFAFA] overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-center mb-8 md:mb-12 lg:mb-16"
                >
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <AnimatedLine className="w-12 text-black/30" direction="right" />
                        <span className="text-black text-xs font-medium tracking-[0.4em] uppercase">Editorial</span>
                        <AnimatedLine className="w-12 text-black/30" direction="left" />
                    </div>
                    <RevealWrapper>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-black mb-8 leading-[1.1] font-light">
                            Lookbook <span className="italic">2026</span>
                        </h2>
                    </RevealWrapper>
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="max-w-xl mx-auto text-black/60 font-light leading-relaxed tracking-wide"
                    >
                        Una narrativa visual de elegancia, sofisticación y brillo absoluto. Descubre la pieza que eleva tu estilo al siguiente nivel.
                    </motion.p>
                </motion.div>

                <div className="space-y-16 md:space-y-20 lg:space-y-28">
                    {collections.map((collection, index) => (
                        <CollectionItem key={collection.id} collection={collection} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function CollectionItem({ collection, index }: { collection: any, index: number }) {
    const itemRef = useRef<HTMLDivElement>(null)
    const isEven = index % 2 === 0

    // Real parallax effect using useScroll + useTransform
    const { scrollYProgress } = useScroll({
        target: itemRef,
        offset: ["start end", "end start"],
    })

    const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

    return (
        <div ref={itemRef} className={cn(
            "relative grid lg:grid-cols-12 gap-12 lg:gap-24 items-center",
            !isEven && "lg:flex-row-reverse"
        )}>
            {/* Image Side with Parallax */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className={cn(
                    "relative lg:col-span-7 group overflow-hidden",
                    !isEven && "lg:order-2"
                )}
            >
                <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-neutral-100/50">
                    <motion.div
                        style={{ y: imageY }}
                        className="absolute inset-[-10%] w-[120%] h-[120%]"
                    >
                        <Image
                            src={collection.image}
                            alt={collection.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 60vw"
                        />
                    </motion.div>
                </div>
            </motion.div>

            {/* Text Side */}
            <motion.div
                initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                className={cn(
                    "lg:col-span-5 space-y-10 text-left",
                    !isEven && "lg:order-1"
                )}
            >
                <div className="space-y-6">
                    <span className="text-xs font-medium tracking-[0.3em] uppercase text-black/50">
                        {collection.subtitle}
                    </span>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-black leading-[1.1] font-light">
                        {collection.title}
                    </h3>
                </div>

                <p className="text-base md:text-lg text-black/60 font-light leading-relaxed tracking-wide max-w-md lg:mx-0">
                    {collection.description}
                </p>

                <div className="pt-8">
                    <MagneticButton>
                        <Link href={collection.link}>
                            <Button
                                variant="outline"
                                className="h-14 px-10 rounded-none border-[#D4AF37]/30 text-black hover:bg-black hover:text-white hover:border-black transition-all duration-700 uppercase tracking-widest text-xs font-medium"
                            >
                                Explorar Colección
                            </Button>
                        </Link>
                    </MagneticButton>
                </div>
            </motion.div>
        </div>
    )
}

