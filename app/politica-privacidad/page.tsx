import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PoliticaPrivacidad() {
    return (
        <main className="min-h-screen bg-[#FAFAFA]">
            <Header variant="solid" />
            <div className="pt-32 pb-24">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="mb-16">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-black mb-6 tracking-tight">Política de Privacidad</h1>
                        <p className="text-black/60 text-lg font-light leading-relaxed">Última actualización: Marzo 2026</p>
                    </div>

                    <div className="space-y-12 text-black/80 font-light leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-serif mb-4 text-black">1. Información que recopilamos</h2>
                            <p className="mb-4">En Nezus Bisutería Fina, recopilamos información personal que usted nos proporciona voluntariamente al registrarse en el sitio, realizar un pedido, suscribirse a nuestro boletín o comunicarse con nosotros. Esta información puede incluir:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Nombre y apellidos</li>
                                <li>Dirección de correo electrónico</li>
                                <li>Número de teléfono</li>
                                <li>Dirección de envío y facturación</li>
                                <li>Información de pago (procesada de forma segura por nuestros proveedores)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif mb-4 text-black">2. Uso de su información</h2>
                            <p className="mb-4">Utilizamos la información recopilada para los siguientes propósitos:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Procesar y entregar sus pedidos</li>
                                <li>Enviarle actualizaciones sobre el estado de su compra</li>
                                <li>Responder a sus consultas y brindar servicio al cliente</li>
                                <li>Personalizar su experiencia de compra</li>
                                <li>Enviarle boletines y ofertas especiales (solo si ha dado su consentimiento)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif mb-4 text-black">3. Protección de datos</h2>
                            <p>Implementamos medidas de seguridad para proteger su información personal. Sus datos de pago se procesan a través de pasarelas seguras y no almacenamos información confidencial de tarjetas de crédito en nuestros servidores.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif mb-4 text-black">4. Compartir información</h2>
                            <p>No vendemos, intercambiamos ni transferimos su información personal a terceros, excepto en los casos necesarios para proporcionar nuestros servicios (por ejemplo, empresas de envío o procesadores de pago), quienes están obligados a mantener la confidencialidad de sus datos.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif mb-4 text-black">5. Cookies</h2>
                            <p>Utilizamos cookies para mejorar su experiencia en nuestro sitio web, retener artículos en su carrito y analizar el tráfico del sitio. Puede configurar su navegador para que rechace las cookies, pero esto puede limitar algunas funcionalidades del sitio.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif mb-4 text-black">6. Sus derechos</h2>
                            <p>Usted tiene derecho a acceder, corregir o eliminar su información personal. Si desea ejercer estos derechos o tiene preguntas sobre nuestra política de privacidad, contáctenos en niezusbisuteria@gmail.com.</p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
