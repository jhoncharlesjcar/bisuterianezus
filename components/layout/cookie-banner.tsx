"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setTimeout(() => setShowBanner(true), 2000)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setShowBanner(false)
  }

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined")
    setShowBanner(false)
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white border border-black/10 shadow-2xl p-6 md:p-8 relative">
              {/* Close button */}
              <button
                onClick={handleDecline}
                className="absolute top-4 right-4 text-black/30 hover:text-black transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pr-8 md:pr-12">
                <div className="flex-1 max-w-2xl">
                  <p className="text-xs text-black/70 font-light leading-relaxed">
                    Utilizamos cookies para personalizar tu experiencia, recordar preferencias
                    y mostrarte piezas de interés. Puedes leer nuestra <a href="/politica-privacidad" className="underline hover:text-black">Política de Privacidad</a>.
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto flex-shrink-0">
                  <Button
                    variant="outline"
                    onClick={handleDecline}
                    className="flex-1 md:flex-none rounded-none border-black/20 text-black/70 hover:bg-black/5 hover:text-black text-[10px] uppercase tracking-widest font-medium h-9 px-4 transition-colors"
                  >
                    Rechazar
                  </Button>
                  <Button
                    onClick={handleAccept}
                    className="flex-1 md:flex-none bg-black text-white hover:bg-black/90 rounded-none text-[10px] uppercase tracking-widest font-medium h-9 px-6 transition-colors"
                  >
                    Aceptar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
