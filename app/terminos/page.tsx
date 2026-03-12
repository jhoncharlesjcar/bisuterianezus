import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function TerminosYCondiciones() {
    return (
        <main className="min-h-screen bg-[#FAFAFA]">
            <Header variant="solid" />
            <div className="pt-32 pb-24">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="mb-16">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-black mb-6 tracking-tight">Términos y Condiciones</h1>
                        <p className="text-black/60 text-lg font-light leading-relaxed">Última actualización: Marzo 2026</p>
                    </div>

                    <div className="space-y-12 text-black/80 font-light leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-serif mb-4 text-black">1. Aceptación de los Términos</h2>
                            <p>Al acceder y utilizar el sitio web de Nezus Bisutería Fina (en adelante, "Nezus"), usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo con alguno de ellos, le solicitamos que no utilice nuestro servicio.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif mb-4 text-black">2. Propiedad Intelectual</h2>
                            <p>Todo el contenido incluido en este sitio web, como texto, gráficos, logotipos, imágenes y diseño de accesorios, es propiedad exclusiva de Nezus y sus proveedores, y está protegido por las leyes internacionales y peruanas de derechos de autor. Queda estrictamente prohibida su reproducción sin autorización por escrito.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif mb-4 text-black">3. Productos y Precios</h2>
                            <p className="mb-4">Nos esforzamos por mostrar con precisión las características, texturas y colores de nuestros productos. Sin embargo, no podemos garantizar que la visualización en su monitor sea exacta.</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Los precios están expresados en Soles Peruanos (S/) e incluyen IGV.</li>
                                <li>Nezus se reserva el derecho de modificar los precios en cualquier momento sin previo aviso.</li>
                                <li>Todas las compras están sujetas a la disponibilidad del producto en inventario.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif mb-4 text-black">4. Políticas de Envío</h2>
                            <p>Realizamos envíos a nivel nacional en Perú a través de Olva Courier u otros transportistas designados. Los tiempos de entrega estimados son aproximados y pueden variar según la demanda o factores externos. Nezus no se hace responsable de las demoras una vez que el paquete es entregado al transportista.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif mb-4 text-black">5. Cambios y Devoluciones</h2>
                            <p>Por razones de higiene y salubridad, no aceptamos cambios ni devoluciones de aretes. Para otros productos, se aceptarán cambios dentro de los 7 días posteriores a la recepción si el producto presenta fallos de fabricación, siempre y cuando no haya sido usado y se conserve en su empaque original.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif mb-4 text-black">6. Modificaciones de los Términos</h2>
                            <p>Nezus se reserva el derecho de actualizar o modificar estos Términos y Condiciones en cualquier momento sin previo aviso. Le recomendamos revisar esta página periódicamente para informarse sobre cualquier cambio.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif mb-4 text-black">7. Legislación y Jurisdicción</h2>
                            <p>Estos términos se rigen e interpretan de acuerdo con las leyes de la República del Perú. Cualquier disputa relacionada con estos términos estará sujeta a la jurisdicción exclusiva de los tribunales de Lima.</p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
