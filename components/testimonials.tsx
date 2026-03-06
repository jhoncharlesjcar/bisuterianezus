"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { Star, ShieldCheck, Quote, Sparkles } from "lucide-react"
import { RevealWrapper, AnimatedLine } from "@/components/ui/text-reveal"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    quote:
      "¡Absolutamente enamorada de mi nuevo collar! La calidad es increíble y el diseño es simplemente perfecto. ¡Recibo cumplidos cada vez que lo uso!",
    name: "Ana Lucía R.",
    location: "Lima, Perú",
    initials: "AL",
    rating: 5,
    verified: true,
    product: "Collar Elegancia Dorada",
  },
  {
    quote:
      "El servicio al cliente fue excepcional. Me ayudaron a elegir el regalo perfecto para mi esposa y llegó justo a tiempo. ¡Definitivamente volveré a comprar aquí!",
    name: "Carlos G.",
    location: "Arequipa, Perú",
    initials: "CG",
    rating: 5,
    verified: true,
    product: "Set Aniversario Premium",
  },
  {
    quote:
      "Compré unos aretes y son aún más bonitos en persona. Se nota que están hechos con mucho cuidado y atención al detalle. ¡Mi nueva tienda de joyería favorita!",
    name: "Sofía M.",
    location: "Trujillo, Perú",
    initials: "SM",
    rating: 5,
    verified: true,
    product: "Aretes Gota Dorada",
  },
  {
    quote:
      "Las pulseras que compré para mis amigas fueron un éxito total. Todas quedaron encantadas con la calidad y los colores. ¡Excelente opción para regalos!",
    name: "María Elena P.",
    location: "Cusco, Perú",
    initials: "ME",
    rating: 5,
    verified: true,
    product: "Pulsera Artesanal",
  },
  {
    quote:
      "Increíble variedad de diseños únicos. Cada pieza que he comprado es especial y diferente. Me encanta poder encontrar accesorios tan originales.",
    name: "Luciana V.",
    location: "Piura, Perú",
    initials: "LV",
    rating: 5,
    verified: false,
    product: "Colección Verano",
  },
  {
    quote:
      "La atención personalizada es lo que más me gusta. Siempre me asesoran para elegir las piezas que mejor combinan con mi estilo. ¡Son los mejores!",
    name: "Patricia S.",
    location: "Ica, Perú",
    initials: "PS",
    rating: 5,
    verified: true,
    product: "Aretes Corazón Turquesa",
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-10 md:py-16 lg:py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-12 lg:mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <AnimatedLine className="w-12 text-black/30" direction="right" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-black/60">Experiencias</span>
            <AnimatedLine className="w-12 text-black/30" direction="left" />
          </div>
          <RevealWrapper>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-black mb-6 tracking-tight">
              Nuestros <span className="italic text-black/70">Clientes</span>
            </h2>
          </RevealWrapper>
          <p className="text-black/60 max-w-xl mx-auto text-base md:text-lg font-light leading-relaxed">
            Descubre las historias de quienes ya disfrutan de nuestras piezas exclusivas.
          </p>
        </motion.div>

        <div className="relative px-4 md:px-12">
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
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-6">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-6 basis-full md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="h-full"
                  >
                    <div className="relative h-full p-10 bg-white border border-black/10 hover:border-black/30 transition-colors duration-500 flex flex-col group">
                      {/* Quote icon */}
                      <div className="absolute top-8 right-8 text-black/10 group-hover:text-black/20 transition-colors">
                        <Quote className="w-12 h-12" strokeWidth={1} />
                      </div>

                      {/* Stars */}
                      <div className="flex gap-1 mb-8">
                        {Array(testimonial.rating)
                          .fill(0)
                          .map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-black fill-black" strokeWidth={1} />
                          ))}
                      </div>

                      {/* Quote text */}
                      <p className="text-black/80 leading-relaxed text-base mb-10 flex-1 font-light italic">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>

                      {/* Product purchased */}
                      <div className="mb-8 inline-flex items-center gap-2 self-start border-b border-black/10 pb-2">
                        <Sparkles className="w-3 h-3 text-black/60" strokeWidth={1.5} />
                        <span className="text-[10px] font-medium tracking-[0.2em] text-black/60 uppercase">
                          {testimonial.product}
                        </span>
                      </div>

                      {/* User info */}
                      <div className="flex items-center gap-4">
                        {/* Avatar with initials */}
                        <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 border border-black/10">
                          <span className="text-xs font-medium text-black tracking-widest">{testimonial.initials}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-serif text-lg text-black truncate">{testimonial.name}</p>
                            {testimonial.verified && (
                              <ShieldCheck className="w-4 h-4 text-black/40 flex-shrink-0" strokeWidth={1.5} />
                            )}
                          </div>
                          <p className="text-[10px] text-black/50 uppercase tracking-[0.15em]">{testimonial.location}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 bg-white border-black/10 hover:bg-black hover:text-white rounded-none w-12 h-12 transition-colors" />
            <CarouselNext className="hidden md:flex -right-4 bg-white border-black/10 hover:bg-black hover:text-white rounded-none w-12 h-12 transition-colors" />
          </Carousel>
        </div>
      </div>
    </section>
  )
}
