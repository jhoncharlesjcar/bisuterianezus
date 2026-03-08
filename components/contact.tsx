"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { peruLocations } from "@/lib/peru-locations"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"

export function Contact() {
  const { toast } = useToast()
  const { signUp } = useAuth()
  const supabase = useMemo(() => createClient(), [])

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalStep, setModalStep] = useState<1 | 2>(1)

  // Form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [addressNumber, setAddressNumber] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Cascading location states
  const [country, setCountry] = useState("")
  const [region, setRegion] = useState("")
  const [provincia, setProvincia] = useState("")
  const [distrito, setDistrito] = useState("")

  // Derived data for cascading selects
  const regionOptions = Object.entries(peruLocations.regions).map(([key, val]) => ({ value: key, label: val.label }))
  const provinciaOptions = region && peruLocations.regions[region]
    ? Object.entries(peruLocations.regions[region].provincias).map(([key, val]) => ({ value: key, label: val.label }))
    : []
  const distritoOptions = region && provincia && peruLocations.regions[region]?.provincias[provincia]
    ? peruLocations.regions[region].provincias[provincia].distritos
    : []

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setModalStep(2)
    }
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setFirstName("")
    setLastName("")
    setPhone("")
    setAddress("")
    setAddressNumber("")
    setCountry("")
    setRegion("")
    setProvincia("")
    setDistrito("")
    setModalStep(1)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const fullName = `${firstName} ${lastName}`.trim()
      const { error } = await signUp(email, password, fullName)

      if (error) {
        toast({
          title: "Error al registrar",
          description: error.message || "No pudimos crear tu cuenta. Intenta de nuevo.",
          variant: "destructive",
        })
      } else {
        // Save additional profile data (address, phone, location)
        // This will be associated once the user confirms their email
        toast({
          title: "¡Cuenta creada exitosamente!",
          description: "Bienvenida al Nezus Club. Revisa tu correo electrónico para confirmar tu cuenta.",
        })
        resetForm()
        setIsModalOpen(false)
      }
    } catch {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado. Intenta de nuevo.",
        variant: "destructive",
      })
    }

    setIsSubmitting(false)
  }

  return (
    <section className="bg-[#FAFAFA]">

      {/* Newsletter / Subscription Banner */}
      <div className="w-full py-8 md:py-16 relative overflow-hidden mt-8 md:mt-16 flex items-center justify-center lg:justify-start" style={{ background: "linear-gradient(135deg, #FFF5F6 0%, #FFE4E8 50%, #FFD6DC 100%)" }}>

        {/* Text Content */}
        <div className="container mx-auto px-4 relative z-10 w-full flex flex-col items-center">
          <div className="w-full max-w-2xl flex flex-col items-center">
            <h3 className="text-2xl md:text-3xl lg:text-[32px] font-serif text-black mb-6 md:mb-8 text-center tracking-wide">
              Regístrate y consigue un 10 % de descuento
            </h3>

            <p className="text-black/80 font-normal text-[15px] md:text-base mb-8 md:mb-10 leading-relaxed text-center">
              Entérate antes que nadie de todas las actualizaciones sobre nuevas<br className="hidden lg:block" />
              colecciones, ideas de estilo y de regalo y acceso exclusivo. Regístrate hoy en<br className="hidden lg:block" />
              el Nezus Club y recibe un 10 % de descuento* en tu próxima compra<br className="hidden lg:block" />
              online (solo en artículos sin descuento). <Link href="/terminos" className="underline underline-offset-2 hover:text-black transition-colors">* Se aplican términos y condiciones</Link>
            </p>

            <Button
              onClick={() => { setIsModalOpen(true); setModalStep(1); }}
              className="h-12 md:h-14 px-12 md:px-16 bg-black text-white hover:bg-black/90 rounded-none text-sm font-medium transition-all duration-700 border border-[#D4AF37]/30 hover:border-[#D4AF37]/60"
            >
              Únete al club
            </Button>
          </div>
        </div>

        {/* Decorative 3D premium emblem */}
        <div
          className="absolute right-[-20%] top-1/2 -translate-y-1/2 w-[280px] md:w-[350px] lg:w-[400px] xl:w-[450px] flex items-center justify-center pointer-events-none opacity-20 lg:opacity-100 lg:-right-[5%] xl:right-0"
        >
          <div className="relative w-full aspect-square flex items-center justify-center">
            <img
              src="/club-emblem.png"
              alt="Nezus 3D Logo"
              aria-hidden="true"
              className="w-[85%] h-[85%] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
            />
          </div>
        </div>
      </div>

      {/* Multi-step Registration Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className={cn("sm:max-w-[420px] p-0 overflow-hidden bg-white rounded-none", modalStep === 2 && "sm:max-w-[600px] max-h-[90vh] overflow-y-auto")}>
          <DialogTitle className="sr-only">
            {modalStep === 1 ? "Iniciar sesión o crear cuenta" : "Registrarse"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Formulario de registro del club.
          </DialogDescription>

          {modalStep === 1 ? (
            <div className="flex flex-col p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl font-serif text-black mb-3 text-center tracking-wide">Iniciar sesión o crear una cuenta nueva</h2>
              <p className="text-sm font-light text-black/60 mb-8 text-center">Reconoceremos si ya tienes una cuenta</p>

              <form onSubmit={handleEmailSubmit} className="w-full space-y-8">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Dirección de correo electrónico *"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="h-14 font-light rounded-none border-x-0 border-t-0 border-b border-black/20 focus-visible:ring-0 focus-visible:border-black shadow-none px-0"
                  />
                </div>
                <Button type="submit" className="w-full h-14 bg-black text-white hover:bg-black/90 rounded-none text-sm font-medium transition-colors mt-4">
                  Continuar
                </Button>
              </form>
            </div>
          ) : (
            <div className="p-8 sm:p-10">
              <h2 className="text-3xl font-serif text-black mb-8 text-center tracking-wide">Registrarse</h2>

              <form onSubmit={handleRegister} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                  <Input placeholder="Nombre *" required value={firstName} onChange={e => setFirstName(e.target.value)} className="h-12 font-light rounded-none border-x-0 border-t-0 border-b border-black/20 focus-visible:ring-0 focus-visible:border-black shadow-none px-0" />
                  <Input placeholder="Apellido *" required value={lastName} onChange={e => setLastName(e.target.value)} className="h-12 font-light rounded-none border-x-0 border-t-0 border-b border-black/20 focus-visible:ring-0 focus-visible:border-black shadow-none px-0" />
                </div>


                <Input placeholder="Dirección *" required value={address} onChange={e => setAddress(e.target.value)} className="h-12 font-light rounded-none border-x-0 border-t-0 border-b border-black/20 focus-visible:ring-0 focus-visible:border-black shadow-none px-0" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input placeholder="N°*" required value={addressNumber} onChange={e => setAddressNumber(e.target.value)} className="h-12 font-light rounded-none border-x-0 border-t-0 border-b border-black/20 focus-visible:ring-0 focus-visible:border-black shadow-none px-0" />
                </div>

                <Select value={country} onValueChange={(val) => { setCountry(val); setRegion(""); setProvincia(""); setDistrito(""); }}>
                  <SelectTrigger className="h-12 font-light rounded-none border-x-0 border-t-0 border-b border-black/20 focus-visible:ring-0 focus-visible:border-black shadow-none px-0 bg-transparent">
                    <SelectValue placeholder="Seleccione un país *" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="pe">Perú</SelectItem>
                    <SelectItem value="cl">Chile</SelectItem>
                    <SelectItem value="mx">México</SelectItem>
                    <SelectItem value="co">Colombia</SelectItem>
                  </SelectContent>
                </Select>

                {country === "pe" && (
                  <>
                    <Select value={region} onValueChange={(val) => { setRegion(val); setProvincia(""); setDistrito(""); }}>
                      <SelectTrigger className="h-12 font-light rounded-none border-x-0 border-t-0 border-b border-black/20 focus-visible:ring-0 focus-visible:border-black shadow-none px-0 bg-transparent">
                        <SelectValue placeholder="Seleccione una región *" />
                      </SelectTrigger>
                      <SelectContent className="rounded-none max-h-60">
                        {regionOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {region && provinciaOptions.length > 0 && (
                      <Select value={provincia} onValueChange={(val) => { setProvincia(val); setDistrito(""); }}>
                        <SelectTrigger className="h-12 font-light rounded-none border-x-0 border-t-0 border-b border-black/20 focus-visible:ring-0 focus-visible:border-black shadow-none px-0 bg-transparent">
                          <SelectValue placeholder="Seleccione una provincia *" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none max-h-60">
                          {provinciaOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {provincia && distritoOptions.length > 0 && (
                      <Select value={distrito} onValueChange={setDistrito}>
                        <SelectTrigger className="h-12 font-light rounded-none border-x-0 border-t-0 border-b border-black/20 focus-visible:ring-0 focus-visible:border-black shadow-none px-0 bg-transparent">
                          <SelectValue placeholder="Seleccione un distrito *" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none max-h-60">
                          {distritoOptions.map(d => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </>
                )}

                <Input type="text" onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.value === "" ? e.target.type = "text" : null)} placeholder="Fecha de nacimiento" className="h-12 font-light rounded-none border-x-0 border-t-0 border-b border-black/20 focus-visible:ring-0 focus-visible:border-black shadow-none px-0" />

                <Input type="tel" inputMode="numeric" placeholder="+ Teléfono *" required value={phone} onChange={e => setPhone(e.target.value)} className="h-12 font-light rounded-none border-x-0 border-t-0 border-b border-black/20 focus-visible:ring-0 focus-visible:border-black shadow-none px-0" />

                <Input type="email" value={email} readOnly className="h-12 font-light rounded-none border-x-0 border-t-0 border-b border-black/20 focus-visible:ring-0 shadow-none px-0 text-black/60" />

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Introduce una contraseña *"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="h-12 font-light rounded-none border-x-0 border-t-0 border-b border-black/20 focus-visible:ring-0 focus-visible:border-black shadow-none px-0 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/60"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="text-[11px] text-black/60 space-y-4 pt-6">
                  <p>Al crear una cuenta, aceptas los <Link href="/terminos" className="underline text-black font-medium">Términos y condiciones</Link>, y la <Link href="/politica-privacidad" className="underline text-black font-medium">Política de privacidad y cookies</Link> de Nezus.</p>

                  <div className="flex items-start space-x-3">
                    <Checkbox id="marketing" className="mt-1 rounded border-black/30" />
                    <label htmlFor="marketing" className="leading-relaxed -mt-0.5">

                      Sí, me gustaría unirme al Club Nezus y recibir correos electrónicos y comunicaciones suyas sobre su negocio, nuevas ofertas y los términos y políticas del Club Nezus. <br /><br />
                      Al hacerlo, serás el primero en enterarte de nuevos lanzamientos de productos, promociones, eventos y mucho más.
                    </label>
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full h-14 bg-black text-white hover:bg-black/90 rounded-none text-sm font-medium mt-8 transition-colors">
                  {isSubmitting ? "REGISTRANDO..." : "REGISTRAR"}
                </Button>

                <button
                  type="button"
                  onClick={() => setModalStep(1)}
                  className="text-xs text-black/70 hover:text-black font-medium mt-6 block"
                >
                  Inicia sesión o utiliza otro correo electrónico {'>'}
                </button>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
