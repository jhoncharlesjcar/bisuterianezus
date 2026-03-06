"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import type { Product } from "@/lib/types"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { RevealWrapper, AnimatedLine } from "@/components/ui/text-reveal"
import { MagneticButton } from "@/components/ui/magnetic-button"

export function FeaturedProductsContent({ products }: { products: Product[] }) {
    return (
        <section id="featured" className="py-10 md:py-16 lg:py-20 bg-[#FAFAFA] relative overflow-hidden">
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
                        <span className="text-black text-xs font-medium tracking-[0.4em] uppercase">Selección Curada</span>
                        <AnimatedLine className="w-12 text-black/30" direction="left" />
                    </div>
                    <RevealWrapper>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-black mb-6 leading-[1.1] font-light">
                            Productos <span className="italic">Destacados</span>
                        </h2>
                    </RevealWrapper>
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="max-w-xl mx-auto text-black/60 font-light leading-relaxed tracking-wide"
                    >
                        Una selección de nuestras piezas más deseadas, perfectas para cualquier ocasión.
                    </motion.p>
                </motion.div>

                {products.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative px-0 md:px-4"
                    >
                        <Carousel
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            plugins={[
                                Autoplay({
                                    delay: 4000,
                                    stopOnInteraction: false,
                                    stopOnMouseEnter: true,
                                }) as any,
                            ]}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-4">
                                {products.map((product, index) => (
                                    <CarouselItem key={product.id} className="pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/4">
                                        <ProductCard product={product} index={index} />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="hidden md:flex left-0 bg-white/80 backdrop-blur-md border border-black/10 text-black hover:bg-black hover:text-white transition-colors h-14 w-14 rounded-full" />
                            <CarouselNext className="hidden md:flex right-0 bg-white/80 backdrop-blur-md border border-black/10 text-black hover:bg-black hover:text-white transition-colors h-14 w-14 rounded-full" />
                        </Carousel>
                    </motion.div>
                ) : null}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-center mt-12"
                >
                    <MagneticButton>
                        <Link href="/tienda">
                            <Button
                                variant="outline"
                                className="h-14 px-10 rounded-none border-black/20 text-black hover:bg-black hover:text-white transition-colors uppercase tracking-widest text-xs font-medium"
                            >
                                Ver toda la colección
                            </Button>
                        </Link>
                    </MagneticButton>
                </motion.div>
            </div>
        </section>
    )
}
