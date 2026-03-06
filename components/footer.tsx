"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { SiTiktok, SiWhatsapp, SiInstagram } from "@icons-pack/react-simple-icons"
import { MapPin, Phone, Mail, ChevronRight, CreditCard, Truck, Shield, Clock, Instagram, Facebook, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

const cities = [
  "Lima", "Arequipa", "Trujillo", "Cusco", "Piura",
  "Chiclayo", "Iquitos", "Huancayo", "Tacna", "Pucallpa", "Ica", "Huánuco"
]

const topBarMessages = [
  "Envíos gratis a todo el Perú en compras mayores a S/100",
  "Pago 100% Seguro · Yape · Plin · Transferencia Bancaria",
  "Asesoría personalizada por WhatsApp +51 935 128 673",
  "Lima · Arequipa · Cusco · Chiclayo · Piura · Huancayo · Ica",
]

export function Footer() {
  const supabase = useMemo(() => createClient(), [])
  const [tickerIndex, setTickerIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % topBarMessages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Ticker Bar — above footer */}
      <div className="bg-black text-white py-2 flex items-center justify-center relative h-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={tickerIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center w-full px-4"
          >
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-center text-white/90">
              {topBarMessages[tickerIndex]}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="relative bg-[#0a0a0a] text-white">
        {/* Trust Bar */}
        <div className="border-b border-white/10">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-16 max-w-7xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
              {[
                { icon: Truck, title: "Envíos Nacionales", desc: "A todo el Perú vía Olva, Shalom, Mavisur y más " },
                { icon: CreditCard, title: "Pago Seguro", desc: "Yape, Plin y Transferencia Bancaria  " },
                { icon: Shield, title: "Garantía Nezus", desc: "Calidad excepcional asegurada" },
                { icon: Clock, title: "Atención Premium", desc: "Asesoría personalizada" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <item.icon className="w-5 h-5 text-white/50 mt-1" strokeWidth={1} />
                  <div>
                    <h4 className="font-serif text-sm tracking-wide mb-1 text-white">{item.title}</h4>
                    <p className="text-[10px] text-white/50 uppercase tracking-[0.15em] font-light">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 md:py-20 lg:py-32 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8">
            {/* Brand Info */}
            <div className="lg:col-span-4 flex flex-col items-start pr-0 md:pr-12">
              <Link href="/" className="inline-block mb-10">
                <span className="font-serif text-4xl font-light tracking-tight block leading-none text-white">NEZUS</span>
                <span className="text-[9px] tracking-[0.3em] font-light text-white/50 uppercase block mt-3">Bisutería Artesanal Fina</span>
              </Link>

              <p className="text-white/60 text-sm font-light leading-relaxed mb-12">
                Elevando la esencia de la mujer peruana con piezas que combinan tradición, modernidad y un brillo inigualable.
              </p>

              <div className="space-y-6 text-sm font-light">
                <div className="flex items-start gap-4 group cursor-pointer">
                  <MapPin className="w-4 h-4 text-white/50 mt-0.5" strokeWidth={1.5} />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Ubicación</span>
                    <span className="text-white/80">Jirón José Gálvez 444 stand N°25 Magdalena del Mar, Lima, Perú • Envíos a todo el país</span>
                  </div>
                </div>
                <div className="flex items-start gap-4 group cursor-pointer">
                  <Phone className="w-4 h-4 text-white/50 mt-0.5" strokeWidth={1.5} />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Asesoría Vía WhatsApp</span>
                    <a href="https://wa.me/51935128673" target="_blank" className="text-white/80 transition-colors hover:text-white">+51 935 128 673</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Menus */}
            <div className="lg:col-span-2 space-y-8">
              <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/50">Colecciones</h3>
              <ul className="space-y-4">
                {["Aretes", "Collares", "Pulseras", "Novedades"].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/tienda?category=${item.toLowerCase()}`}
                      className="text-sm font-light text-white/70 hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/50">Acerca De</h3>
              <ul className="space-y-4">
                {[
                  { label: "Nuestra Esencia", href: "/#nosotros" },
                  { label: "Lookbook", href: "/#lookbook" },
                  { label: "Servicio al Cliente", href: "/#contacto" },
                  { label: "Privacidad", href: "/politica-privacidad" },
                  { label: "Términos Legales", href: "/terminos" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm font-light text-white/70 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-end">
              <div className="mt-auto">
                <div className="flex items-center gap-6">
                  {[
                    { icon: SiInstagram, href: "https://instagram.com/aretesnezus", label: "Instagram" },
                    { icon: SiTiktok, href: "https://tiktok.com/@nezusbisuteria", label: "TikTok" },
                    { icon: Facebook, href: "https://facebook.com/bisuterianezus", label: "Facebook" },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/40 hover:text-white transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Info */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-light text-center md:text-left">
                &copy; {new Date().getFullYear()} Nezus Bisutería Artesanal Fina. Todos los derechos reservados.
              </p>

              <div className="flex items-center gap-6">
                <Link href="/politica-privacidad" className="text-[10px] text-white/40 hover:text-white uppercase tracking-[0.15em] font-light transition-colors">Política de Privacidad</Link>
                <Link href="/terminos" className="text-[10px] text-white/40 hover:text-white uppercase tracking-[0.15em] font-light transition-colors">Términos de Uso</Link>
                <span className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-light">
                  Lima, Perú
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
