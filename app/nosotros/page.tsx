import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"

export default function Nosotros() {
    return (
        <main className="min-h-screen bg-[#FAFAFA]">
            <Header variant="solid" />
            <div className="pt-32 pb-24">
                <div className="container mx-auto px-4 max-w-5xl">

                    {/* Hero Section */}
                    <div className="text-center mb-24">
                        <span className="text-xs font-medium tracking-[0.2em] uppercase text-black/60 mb-6 block">Nuestra Esencia</span>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-light text-black mb-8 tracking-tight">
                            La Historia detrás del <span className="italic text-black/70">Brillo</span>
                        </h1>
                        <p className="text-black/60 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                            Nezus nació con una visión clara: redefinir la bisutería fina en el Perú, fusionando la maestría artesanal con el diseño contemporáneo para empoderar la belleza única de cada mujer.
                        </p>
                    </div>

                    {/* Image Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-24">
                        <div className="relative h-[400px] md:h-[600px] w-full group overflow-hidden bg-[#EAEAEA]">
                            <Image
                                src="https://res.cloudinary.com/dn36m0jer/image/upload/v1771386095/nezus/products/img-20251121-wa0254.jpg"
                                alt="Diseño Nezus"
                                fill
                                className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                            />
                        </div>
                        <div className="relative h-[400px] md:h-[600px] w-full group overflow-hidden bg-[#EAEAEA] mt-8 md:mt-24">
                            <Image
                                src="https://res.cloudinary.com/dn36m0jer/image/upload/v1771386105/nezus/products/img-20251121-wa0216.jpg"
                                alt="Detalles Nezus"
                                fill
                                className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                            />
                        </div>
                    </div>

                    {/* Core Values */}
                    <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 mb-24">
                        <div>
                            <span className="text-[10px] uppercase tracking-widest text-black/40 font-medium mb-3 block">01 / Diseño</span>
                            <h3 className="text-2xl font-serif font-light text-black mb-4">Exclusividad</h3>
                            <p className="text-black/60 font-light leading-relaxed text-sm">
                                Cada pieza de nuestras colecciones es cuidadosamente seleccionada y diseñada pensando en la versatilidad y la elegancia atemporal. Creemos en la exclusividad como una forma de expresión personal.
                            </p>
                        </div>
                        <div>
                            <span className="text-[10px] uppercase tracking-widest text-black/40 font-medium mb-3 block">02 / Confección</span>
                            <h3 className="text-2xl font-serif font-light text-black mb-4">Calidad Premium</h3>
                            <p className="text-black/60 font-light leading-relaxed text-sm">
                                Trabajamos con materiales de la más alta calidad, priorizando acabados impecables en cada producto. Nuestro compromiso es entregar accesorios que mantengan su esplendor a lo largo del tiempo.
                            </p>
                        </div>
                        <div>
                            <span className="text-[10px] uppercase tracking-widest text-black/40 font-medium mb-3 block">03 / Experiencia</span>
                            <h3 className="text-2xl font-serif font-light text-black mb-4">Servicio Dedicado</h3>
                            <p className="text-black/60 font-light leading-relaxed text-sm">
                                Más allá de vender accesorios, creamos relaciones. Nuestro equipo está comprometido a brindarle una asesoría personalizada y una experiencia de compra inigualable desde el primer contacto.
                            </p>
                        </div>
                    </div>

                    {/* Final Statement */}
                    <div className="text-center py-20 border-t border-black/10">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-black mb-6 tracking-tight">
                            Descubre tu <span className="italic text-black/70">estilo</span> con Nezus
                        </h2>
                    </div>

                </div>
            </div>
            <Footer />
        </main>
    )
}
