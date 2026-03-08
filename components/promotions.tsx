"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { RevealWrapper, AnimatedLine } from "@/components/ui/text-reveal"

// Fixed promotion end date for credibility (update manually for each campaign)
const PROMO_END_DATE = new Date("2026-03-15T23:59:59-05:00")

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now
      if (distance < 0) return

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  const units = [
    { label: "Días", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Seg", value: timeLeft.seconds },
  ]

  return (
    <div className="flex gap-4 md:gap-6">
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center">
          <div className="flex items-center justify-center">
            <span className="text-2xl md:text-3xl font-serif text-white/90">{String(unit.value).padStart(2, "0")}</span>
          </div>
          <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/60 mt-1">{unit.label}</span>
        </div>
      ))}
    </div>
  )
}

export function Promotions() {
  return (
    <section id="promociones" className="py-10 md:py-16 lg:py-32 bg-[#FAFAFA] relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-12 lg:mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-black/60">Privilegios Exclusivos</span>
            <AnimatedLine className="w-12 text-black/20" direction="right" />
          </div>
          <RevealWrapper>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-black mb-6 tracking-tight">
              Fascinación <span className="italic text-black/70">Atemporal</span>
            </h2>
          </RevealWrapper>
          <p className="text-black/60 max-w-xl mx-auto text-base md:text-lg font-light leading-relaxed">
            Descubre piezas excepcionales con atenciones exclusivas, disponibles por tiempo limitado.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Main Promotion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-8 group relative overflow-hidden h-[500px] md:h-[600px] bg-[#EAEAEA]"
          >
            <Link href="/tienda?category=coleccion-estelar" className="block h-full relative">
              <Image
                src="https://res.cloudinary.com/dn36m0jer/image/upload/v1771386099/nezus/products/img-20251121-wa0243.jpg"
                alt="Aretes de corazón con piedras turquesa"
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 border border-black/5" />

              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
                {/* Countdown */}
                <div className="mb-10">
                  <CountdownTimer targetDate={PROMO_END_DATE} />
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/70 block">Cortesía de Temporada</span>
                  <h3 className="font-serif text-4xl md:text-5xl font-light text-white leading-tight">20% en Colección Estelar</h3>
                  <p className="text-white/80 text-base md:text-lg font-light max-w-md">
                    Eleva tu magnetismo. Descuento aplicable directamente en las piezas exclusivas de la colección.
                  </p>
                  <div className="mt-8 flex justify-center bg-white text-black hover:bg-white/90 uppercase tracking-[0.15em] text-[10px] font-medium transition-colors h-14 px-8 items-center w-fit group/btn cursor-pointer">
                    Explorar el Privilegio
                    <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover/btn:translate-x-1" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Smaller Promotions */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="group relative overflow-hidden h-[240px] md:h-[285px] bg-[#EAEAEA] w-full lg:flex-1"
            >
              <Link href="/tienda?category=elegancia-nocturna" className="block h-full relative">
                <Image
                  src="https://res.cloudinary.com/dn36m0jer/image/upload/v1771386111/nezus/products/img-20251121-wa0252.jpg"
                  alt="Aretes con cuarzo rosa"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                <div className="absolute inset-0 border border-black/5" />

                <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end z-10 text-white">
                  <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-white/80 mb-2">Cortesía de Nezus</span>
                  <h4 className="font-serif text-3xl font-light mb-2">Envío Gratuito</h4>
                  <p className="text-white/90 text-sm font-light">En seleccion de piezas sobre S/100</p>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="group relative overflow-hidden h-[240px] md:h-[285px] bg-[#EAEAEA] w-full lg:flex-1"
            >
              <Link href="/tienda?category=edicion-limitada" className="block h-full relative">
                <Image
                  src="https://res.cloudinary.com/dn36m0jer/image/upload/v1771386092/nezus/products/christmas-tree-earrings-1.jpg"
                  alt="Aretes navideños"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500" />
                <div className="absolute inset-0 border border-black/5" />

                <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end z-10 text-white">
                  <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-white/80 mb-2">Colecciones Efímeras</span>
                  <h4 className="font-serif text-3xl font-light mb-2">Edición Limitada</h4>
                  <p className="text-white/90 text-sm font-light">Curaduría de accesorios exclusivos</p>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
