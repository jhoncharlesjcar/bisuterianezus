"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { MagneticButton } from "@/components/ui/magnetic-button"

const slides = [
  {
    id: 1,
    title: "El Despertar\nde la Luz",
    subtitle: "Colección exclusiva",
    description: "Maestría peruana que captura la belleza pura de la luz. Revela tu brillo interior con cristales y piedras concebidos para deslumbrar.",
    cta: "Descubrir la Colección",
    ctaLink: "/tienda",
    video: "https://res.cloudinary.com/dn36m0jer/video/upload/v1771803952/nezus/videos/Generate_a_video_202602212203.mp4",
  },
  {
    id: 2,
    title: "Elegancia",
    subtitle: "Revelaciones Recientes",
    description: "Magia en cada detalle. Un despliegue de resplandor diseñado para transformar lo cotidiano en algo verdaderamente extraordinario.",
    cta: "Explorar el Privilegio",
    ctaLink: "/tienda?category=aretes",
    video: "https://res.cloudinary.com/dn36m0jer/video/upload/v1771803957/nezus/videos/Generate_a_video_202602212221.mp4",
  },
  {
    id: 3,
    title: "Brillo Absoluto",
    subtitle: "Fascinación Asegurada",
    description: "El virtuosismo de la bisutería fina se encuentra con el poder de la luz. Calidad inigualable que ilumina cada uno de tus instantes.",
    cta: "Conocer el Legado",
    ctaLink: "/#nosotros",
    video: "https://res.cloudinary.com/dn36m0jer/video/upload/v1771803955/nezus/videos/Generate_a_video_202602212208.mp4",
  },
]

// Word-by-word reveal for the hero title
function HeroTitle({ text, slideKey }: { text: string; slideKey: number }) {
  const lines = text.split("\n")
  return (
    <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif text-white mb-8 leading-[1.05] tracking-tight font-light">
      {lines.map((line, lineIdx) => (
        <span key={`${slideKey}-${lineIdx}`} className="block">
          {line.split(" ").map((word, wordIdx) => (
            <span key={wordIdx} className="overflow-hidden inline-block mr-[0.25em]">
              <motion.span
                className="inline-block"
                initial={{ y: "120%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-120%", opacity: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.3 + (lineIdx * 3 + wordIdx) * 0.08,
                  ease: [0.25, 0.4, 0, 1],
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </h1>
  )
}

// Animated subtitle line
function HeroSubtitle({ text, slideKey }: { text: string; slideKey: number }) {
  return (
    <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
      <motion.div
        key={`line-${slideKey}`}
        className="h-[1px] bg-white/70"
        initial={{ width: 0 }}
        animate={{ width: 64 }}
        exit={{ width: 0 }}
        transition={{ duration: 1, delay: 0.1, ease: [0.25, 0.4, 0, 1] }}
      />
      <motion.span
        key={`sub-${slideKey}`}
        className="text-white/90 text-xs tracking-[0.4em] uppercase font-medium"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0, 1] }}
      >
        {text}
      </motion.span>
    </div>
  )
}

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(nextSlide, 8500)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  return (
    <>
      <link rel="preload" as="image" href={slides[0].video.replace('.mp4', '.jpg')} fetchPriority="high" />
      <section
        id="inicio"
        className="relative w-full min-h-[500px] h-[80vh] lg:h-[96vh] bg-black overflow-hidden flex items-center"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* --- BACKGROUND VIDEO WITH KEN BURNS --- */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 1.8, ease: [0.4, 0, 0.2, 1] },
                scale: { duration: 12, ease: "linear" },
              }}
              className="w-full h-full relative"
            >
              <video
                src={slides[currentSlide].video}
                poster={slides[currentSlide].video.replace('.mp4', '.jpg')}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-black/30 md:bg-gradient-to-r md:from-black/80 md:via-black/50 md:to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* --- FOREGROUND CONTENT (TEXT) --- */}
        <div className="relative z-10 container mx-auto px-4 lg:px-12 h-full flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl text-center md:text-left pt-20"
            >
              <HeroSubtitle text={slides[currentSlide].subtitle} slideKey={currentSlide} />

              <HeroTitle text={slides[currentSlide].title} slideKey={currentSlide} />

              <motion.p
                className="text-sm md:text-lg text-white/80 mb-6 md:mb-12 font-light leading-relaxed max-w-xl md:pr-12 md:mx-0 mx-auto tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.4, 0, 1] }}
              >
                {slides[currentSlide].description}
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9, ease: [0.25, 0.4, 0, 1] }}
              >
                <MagneticButton strength={0.15}>
                  <Link href={slides[currentSlide].ctaLink}>
                    <Button className="bg-white hover:bg-white/90 text-black px-6 py-4 md:px-12 md:py-7 rounded-none text-[10px] md:text-xs tracking-[0.25em] uppercase font-bold transition-all duration-700 shadow-2xl hover:shadow-[0_20px_60px_rgba(255,255,255,0.3)]">
                      {slides[currentSlide].cta}
                    </Button>
                  </Link>
                </MagneticButton>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* --- NAVIGATION OVERLAYS --- */}
        {/* Dots Indicator */}
        <div
          className="absolute bottom-8 lg:bottom-12 left-0 right-0 z-20 flex justify-center md:justify-start md:left-16"
          role="tablist"
        >
          <div className="flex gap-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                role="tab"
                aria-selected={currentSlide === index}
                className={cn(
                  "h-[2px] transition-all duration-700 ease-in-out focus:outline-none",
                  currentSlide === index
                    ? "w-16 bg-white"
                    : "w-8 bg-white/30 hover:bg-white/70"
                )}
              />
            ))}
          </div>
        </div>

        {/* Arrows Navigation */}
        <div className="absolute bottom-8 right-4 md:right-12 z-20 flex gap-2">
          <motion.button
            onClick={prevSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 md:p-5 bg-black/20 hover:bg-white/10 text-white backdrop-blur-md transition-all duration-300 border border-white/10"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 font-light" />
          </motion.button>
          <motion.button
            onClick={nextSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 md:p-5 bg-black/20 hover:bg-white/10 text-white backdrop-blur-md transition-all duration-300 border border-white/10"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 font-light" />
          </motion.button>
        </div>
      </section>
    </>
  )
}
