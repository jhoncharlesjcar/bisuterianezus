"use client"

import { motion } from "framer-motion"
import { Sparkles, Heart, Star, ShieldCheck, Award, Users } from "lucide-react"
import Image from "next/image"
import { FadeIn } from "@/components/ui/fade-in"
import { RevealWrapper, AnimatedLine } from "@/components/ui/text-reveal"

const values = [
  { icon: Award, title: "Maestría en Cada Faceta", desc: "Cada pieza es esculpida a mano para maximizar su refracción, garantizando un brillo inalterable que atrapa todas las miradas." },
  { icon: Heart, title: "Estética Radiante", desc: "Siluetas que redefinen la geometría de la elegancia, donde cada piedra y elemento juega con la luz creando un diseño deslumbrante." },
  { icon: Sparkles, title: "Magia Atemporal", desc: "Colecciones fascinantes que marcan el pulso de la alta bisutería, pensadas para empoderar y hacer brillar a quien las lleva." },
  { icon: Users, title: "Sofisticación Absoluta", desc: "Asesoría de estilo exclusiva, asistiéndote en la selección de la joya perfecta para que seas el centro de atención en tus momentos más trascendentales." },
]

export function About() {
  return (
    <section id="nosotros" className="py-10 md:py-16 lg:py-20 bg-[#FAFAFA] relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-12 order-2 lg:order-1"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium tracking-[0.2em] uppercase text-black/60">Nuestra Historia</span>
                <AnimatedLine className="w-16 text-black/20" direction="right" />
              </div>
              <RevealWrapper>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-black leading-[1.1] tracking-tight">
                  Elegancia redefinida para la <span className="italic text-black/70">mujer moderna</span>
                </h2>
              </RevealWrapper>
              <p className="text-base md:text-lg text-black/60 font-light leading-relaxed max-w-xl">
                En Nezus Bisutería, no solo curamos accesorios; celebramos la individualidad y la sofisticación. Desde nuestro showroom, seleccionamos meticulosamente piezas que combinan el diseño contemporáneo con un aura de lujo atemporal, creando colecciones diseñadas para elevar el estilo diario.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-12 pt-8 border-t border-black/10">
              {values.map((value, i) => (
                <FadeIn key={i} delay={i * 0.1} direction="up">
                  <div className="space-y-4 group">
                    <div className="flex items-center gap-3 mb-2">
                      <value.icon className="w-4 h-4 text-black/80" strokeWidth={1.5} />
                      <h4 className="font-serif text-lg text-black">{value.title}</h4>
                    </div>
                    <p className="text-sm font-light text-black/60 leading-relaxed pr-4">
                      {value.desc}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>

            {/* Mission Section - Minimalist */}
            <div className="pt-8 block">
              <FadeIn delay={0.4} direction="up">
                <div className="bg-white border border-black/5 p-8 relative overflow-hidden group hover:border-black/10 transition-colors">
                  <div className="relative z-10 flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                    <div className="w-20 h-20 relative flex-shrink-0">
                      <Image src="/Logo-3D-emblem.png.png" alt="Nezus Logo" fill sizes="80px" className="object-contain" />
                    </div>
                    <div>
                      <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-black/50 mb-3">Nuestra Misión</h3>
                      <p className="font-serif text-lg leading-relaxed text-black/80 italic">
                        "Destacar la belleza intrínseca de cada mujer a través de accesorios cuidadosamente seleccionados que irradian distinción y estilo."
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </motion.div>

          {/* Image Content */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative aspect-[3/4] md:aspect-[4/5] w-full max-w-md mx-auto lg:max-w-none overflow-hidden bg-[#EAEAEA]">
              <Image
                src="https://res.cloudinary.com/dn36m0jer/image/upload/v1771386096/nezus/products/img-20251121-wa0240.jpg"
                alt="Nezus Collection Showcase"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1.5s] ease-out hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>

            {/* Premium Floating Element - replacing the old 'decorative card' */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute -bottom-6 -left-6 md:-bottom-12 md:-left-12 bg-white p-6 md:p-8 border border-black/5 max-w-[240px] md:max-w-[280px] hidden sm:block z-10"
            >
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-black text-black" />)}
                </div>
                <p className="font-serif text-base md:text-lg text-black leading-snug">"Curaduría de accesorios que elevan cualquier look."</p>
                <div className="pt-2 border-t border-black/10">
                  <p className="text-[9px] uppercase tracking-widest font-medium text-black/50">El encanto del detalle</p>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  )
}
