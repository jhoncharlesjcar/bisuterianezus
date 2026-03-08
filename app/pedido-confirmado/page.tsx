"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle2, Package, MessageCircle, ArrowRight, Loader2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { SiWhatsapp } from "@icons-pack/react-simple-icons"

function ConfirmacionContent() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get("order") || "—"

    return (
        <main className="min-h-screen bg-[#FAFAFA] text-black">
            <Header variant="solid" />

            <div className="container mx-auto px-4 py-24 md:py-32 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center"
                >
                    {/* Success Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black mb-8"
                    >
                        <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={1.5} />
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-serif font-light mb-4 tracking-tight">
                        ¡Gracias por tu compra!
                    </h1>
                    <p className="text-black/60 text-lg font-light mb-2">
                        Tu pedido ha sido registrado exitosamente.
                    </p>

                    {orderId !== "—" && (
                        <p className="text-xs uppercase tracking-widest text-black/40 font-medium mb-12">
                            Nº de orden: <span className="text-black">{orderId}</span>
                        </p>
                    )}

                    {/* Steps */}
                    <div className="grid sm:grid-cols-3 gap-8 my-16 text-left">
                        {[
                            {
                                icon: CheckCircle2,
                                title: "Pedido Recibido",
                                desc: "Hemos registrado tu orden y estamos procesándola.",
                            },
                            {
                                icon: MessageCircle,
                                title: "Envía tu Constancia",
                                desc: "Envíanos la captura de tu pago por WhatsApp al 935 128 673.",
                            },
                            {
                                icon: Package,
                                title: "Preparación y Envío",
                                desc: "Prepararemos tu pedido con cariño y te notificaremos al despachar.",
                            },
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.2, duration: 0.6 }}
                                className="p-6 bg-white border border-black/5"
                            >
                                <step.icon className="w-6 h-6 text-black mb-4" strokeWidth={1} />
                                <h3 className="text-sm font-medium uppercase tracking-widest mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-black/60 font-light leading-relaxed">
                                    {step.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href={`https://wa.me/51935128673?text=${encodeURIComponent(`Hola, acabo de realizar un pedido (Orden: ${orderId}). Adjunto mi constancia de pago.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button className="bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-none h-14 px-8 uppercase tracking-widest text-[10px] font-medium w-full sm:w-auto">
                                <SiWhatsapp className="w-4 h-4 mr-3" />
                                Enviar Constancia
                            </Button>
                        </a>

                        <Button asChild variant="outline" className="rounded-none h-14 px-8 uppercase tracking-widest text-[10px] font-medium border-black/20 hover:border-black hover:bg-transparent group">
                            <Link href="/tienda">
                                Seguir Comprando
                                <ArrowRight className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </main>
    )
}

export default function PedidoConfirmadoPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
                <Loader2 className="h-8 w-8 animate-spin text-black/50" strokeWidth={1} />
            </main>
        }>
            <ConfirmacionContent />
        </Suspense>
    )
}
