"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { SiTiktok, SiWhatsapp, SiInstagram, SiFacebook } from "@icons-pack/react-simple-icons"
import { MapPin, Phone, Mail, ChevronRight, CreditCard, Truck, Shield, Clock, Instagram, Facebook, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const contactMethods = [
  {
    icon: SiFacebook,
    href: "https://www.facebook.com/share/1GAMLHfNR1/",
  },
  {
    icon: SiInstagram,
    href: "https://instagram.com/bisuterianezus",
  },
  {
    icon: SiTiktok,
    href: "https://tiktok.com/@bisuteria.nezus",
  },
]

export function Footer() {
  const supabase = useMemo(() => createClient(), [])

  return (
    <>

      <footer id="contacto" className="relative bg-[#0a0a0a] text-white font-swarovski">

        {/* Trust Bar */}
        <div className="border-b border-[#D4AF37]/15">
          <div className="container mx-auto px-4 md:px-8 lg:px-16 py-6 md:py-10 max-w-[1400px]">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {[
                { icon: Truck, title: "Envíos Nacionales", desc: "A todo el Perú vía Olva, Shalom, Mavisur y más" },
                { icon: CreditCard, title: "Pago Seguro", desc: "yape, plin, transferencias bancarias" },
                { icon: Shield, title: "Garantía Nezus", desc: "Calidad excepcional asegurada" },
                { icon: Clock, title: "Atención Premium", desc: "Asesoría personalizada" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="group relative flex items-start gap-4 transition-all duration-300 hover:translate-x-1"
                >
                  <div className="w-5 h-5 shrink-0 flex items-center justify-center text-white/40 transition-transform duration-500 group-hover:scale-110 group-hover:text-white mt-1">
                    <item.icon className="w-full h-full" strokeWidth={1} />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-swarovski text-[11px] mb-[2px] text-white leading-none">{item.title}</h4>
                    <p className="text-[8px] text-white/40 uppercase tracking-[0.15em] leading-[1.2] transition-colors group-hover:text-white/60">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-20 lg:py-24 max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8">
            {/* Brand Info */}
            <div className="lg:col-span-4 flex flex-col items-start pr-0 md:pr-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Link href="/" className="inline-block mb-6 group relative">
                  <span className="font-sans text-5xl font-medium tracking-normal block leading-none text-white">NEZUS</span>
                  <span className="text-[10px] tracking-[0.4em] font-light text-white/40 uppercase block mt-1">Bisutería Artesanal Fina</span>
                </Link>

                <p className="text-white/50 text-[14px] font-swarovski leading-relaxed max-w-sm mb-16">
                  Elevando la esencia de la mujer peruana con piezas que combinan tradición, modernidad y un brillo inigualable.
                </p>
              </motion.div>

              {/* Social Icons */}
              <div className="flex justify-start items-center gap-6 md:gap-8 w-full">
                {contactMethods.map((method, i) => (
                  <motion.a
                    key={i}
                    href={method.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="group relative flex items-center justify-center"
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full border border-white flex items-center justify-center transition-all duration-300",
                        "group-hover:bg-white group-hover:text-black"
                      )}
                    >
                      <method.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Menus */}
            <div className="lg:col-span-3 flex lg:justify-center">
              <div className="space-y-10">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-[11px] uppercase tracking-[0.3em] text-white font-bold mb-8 font-swarovski"
                >
                  Explora Nezus
                </motion.h3>
                <ul className="space-y-4">
                  {[
                    { label: "Aretes", value: "aretes" },
                    { label: "Collares", value: "collares" },
                    { label: "Pulseras", value: "pulseras" },
                    { label: "Nuestra Esencia", href: "/#nosotros" },
                    { label: "Lookbook", href: "/#lookbook" },
                    { label: "Resplandor Estival", value: "resplandor-estival" },
                    { label: "Elegancia Nocturna", value: "elegancia-nocturna" },
                    { label: "Geometría del Lujo", value: "geometria-del-lujo" },
                    { label: "Colección Estelar (Promo)", value: "coleccion-estelar" },
                    { label: "Edición Limitada", value: "edicion-limitada" },
                  ].map((item, i) => (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.6 }}
                    >
                      <Link
                        href={item.href || `/tienda?category=${item.value}`}
                        className="group relative flex items-center gap-2 transition-all duration-300 hover:translate-x-1 font-swarovski text-[13px] tracking-wide leading-none text-white/60 hover:text-white"
                      >
                        <span className="w-1 h-[1px] bg-white/0 group-hover:bg-white/40 group-hover:w-2 transition-all duration-300" />
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-2 flex lg:justify-center">
              <div className="space-y-10">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-[11px] uppercase tracking-[0.3em] text-white font-bold mb-8 whitespace-nowrap font-swarovski"
                >
                  Condiciones Legales
                </motion.h3>
                <ul className="space-y-4">
                  {[
                    { label: "Política De Privacidad", href: "/politica-privacidad" },
                    { label: "Términos & Condiciones", href: "/terminos" },
                  ].map((item, i) => (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.6 }}
                    >
                      <Link
                        href={item.href}
                        className="group relative flex items-center gap-2 transition-all duration-300 hover:translate-x-1 font-swarovski text-[13px] tracking-wide leading-none text-white/60 hover:text-white whitespace-nowrap"
                      >
                        <span className="w-1 h-[1px] bg-white/0 group-hover:bg-white/40 group-hover:w-2 transition-all duration-300" />
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact & Social - Right Side */}
            <div className="lg:col-span-3 flex flex-col items-start lg:items-end mt-8 lg:mt-0">
              <div className="space-y-10 w-full lg:max-w-[280px]">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-[11px] uppercase tracking-[0.3em] text-white font-bold mb-8 text-left font-swarovski"
                >
                  CONTACTO
                </motion.h3>

                <div className="flex flex-col space-y-6">
                  <motion.a
                    href="https://wa.me/51935128673"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="group relative flex items-start gap-4 transition-all duration-300 hover:translate-x-1"
                  >
                    <div className="w-5 h-5 shrink-0 flex items-center justify-center text-white/40 transition-transform duration-500 group-hover:scale-110 group-hover:text-white mt-1">
                      <SiWhatsapp className="w-full h-full" strokeWidth={1} />
                    </div>
                    <div className="flex flex-col text-left">
                      <h4 className="font-swarovski font-bold text-[14px] mb-[2px] text-white leading-none">Asesoría Vía WhatsApp</h4>
                      <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] leading-[1.2] mb-1 group-hover:text-white/60 transition-colors font-swarovski">Respuesta inmediata</p>
                      <span className="text-[14px] text-white/80 font-swarovski tracking-tight">935 128 673</span>
                    </div>
                  </motion.a>

                  <motion.a
                    href="mailto:bisuterianezus@gmail.com"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05, duration: 0.6 }}
                    className="group relative flex items-start gap-4 transition-all duration-300 hover:translate-x-1"
                  >
                    <div className="w-5 h-5 shrink-0 flex items-center justify-center text-white/40 transition-transform duration-500 group-hover:scale-110 group-hover:text-white mt-1">
                      <Mail className="w-full h-full" strokeWidth={1} />
                    </div>
                    <div className="flex flex-col text-left">
                      <h4 className="font-swarovski font-bold text-[14px] mb-[2px] text-white leading-none">Correo</h4>
                      <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-swarovski leading-[1.2] mb-1 group-hover:text-white/60 transition-colors">Te respondemos en 24h</p>
                      <span className="text-[14px] text-white/80 font-swarovski tracking-tight">bisuterianezus@gmail.com</span>
                    </div>
                  </motion.a>

                  <motion.a
                    href="https://maps.app.goo.gl/MhwmnLjs8V2FPFKv5"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="group relative flex items-start gap-4 transition-all duration-300 hover:translate-x-1"
                  >
                    <div className="w-5 h-5 shrink-0 flex items-center justify-center text-white/40 transition-transform duration-500 group-hover:scale-110 group-hover:text-white mt-1">
                      <MapPin className="w-full h-full" strokeWidth={1} />
                    </div>
                    <div className="flex flex-col text-left">
                      <h4 className="font-swarovski font-bold text-[14px] mb-[2px] text-white leading-none">Ubicación</h4>
                      <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-swarovski leading-[1.2] mb-1 group-hover:text-white/60 transition-colors">Visítanos</p>
                      <span className="text-[14px] text-white/80 font-swarovski leading-snug tracking-tight">Jr. José Gálvez 444 stand N°25<br /> Magdalena del Mar, Lima, Perú</span>
                    </div>
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#D4AF37]/15">
          <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8 max-w-[1400px]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <p className="text-[8px] text-white/30 uppercase tracking-[0.25em] font-light text-center md:text-left leading-relaxed max-w-md font-swarovski">
                &copy; {new Date().getFullYear()} Nezus Bisutería Artesanal Fina. Todos los derechos reservados. Diseñado por Jcar Labs.
              </p>

              <div className="flex items-center gap-8">
                <span className="text-[8px] text-white/20 uppercase tracking-[0.2em] font-light font-swarovski">
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
