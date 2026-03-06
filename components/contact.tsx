"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Mail, MapPin, Eye, EyeOff } from "lucide-react"
import { SiWhatsapp, SiInstagram } from "@icons-pack/react-simple-icons"
import { cn } from "@/lib/utils"
import { RevealWrapper, AnimatedLine } from "@/components/ui/text-reveal"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { peruLocations } from "@/lib/peru-locations"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"

const contactMethods = [
  {
    icon: SiWhatsapp,
    title: "WhatsApp",
    subtitle: "Respuesta inmediata",
    value: "+51 935 128 673",
    href: "https://wa.me/51935128673",
    accent: "text-black",
  },
  {
    icon: Mail,
    title: "Correo",
    subtitle: "Te respondemos en 24h",
    value: "nezusbisuteria@gmail.com",
    href: "mailto:nezusbisuteria@gmail.com",
    accent: "text-black",
  },
  {
    icon: SiInstagram,
    title: "Instagram",
    subtitle: "Síguenos y escríbenos",
    value: "@aretesnezus",
    href: "https://instagram.com/aretesnezus",
    accent: "text-black",
  },
  {
    icon: MapPin,
    title: "Showroom",
    subtitle: "Visítanos",
    value: "Jr. José Gálvez 444 stand 25 Magdalena del Mar, Lima",
    href: "https://www.google.com/maps/place/06000+Jr,+Jir%C3%B3n+Jos%C3%A9+G%C3%A1lvez+444,+Magdalena+del+Mar+15086",
    accent: "text-black",
  },
]

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
    <section id="contacto" className="pt-10 md:pt-16 lg:pt-20 bg-[#FAFAFA]">
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
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-black/60">Contacto</span>
            <AnimatedLine className="w-12 text-black/30" direction="left" />
          </div>
          <RevealWrapper>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-black mb-6 tracking-tight">
              Estamos para <span className="italic text-black/70">ayudarte</span>
            </h2>
          </RevealWrapper>
          <p className="text-black/60 max-w-xl mx-auto text-base md:text-lg font-light leading-relaxed">
            Te asesoramos para encontrar la pieza perfecta o resolver cualquier duda que tengas.
          </p>
        </motion.div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 pb-16 md:pb-24">
          {contactMethods.map((method, i) => (
            <motion.a
              key={i}
              href={method.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={cn(
                "group relative p-8 md:p-10 border border-black/10 bg-white transition-all duration-300",
                "hover:border-black/30 hover:shadow-md flex flex-col items-center text-center"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 flex items-center justify-center mb-6 transition-transform duration-500",
                  method.accent,
                  "group-hover:scale-110"
                )}
              >
                <method.icon className="w-8 h-8" strokeWidth={1} />
              </div>
              <h4 className="font-serif text-xl mb-2 text-black">{method.title}</h4>
              <p className="text-[10px] text-black/50 uppercase tracking-[0.15em] mb-4">
                {method.subtitle}
              </p>
              <p className="text-sm text-black/80 font-light mt-auto">{method.value}</p>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Newsletter / Subscription Banner */}
      <div className="w-full py-10 md:py-24 relative overflow-hidden mt-8 md:mt-16" style={{ backgroundColor: "#C9ADA1" }}>
        <div className="container mx-auto px-4 relative z-10 w-full flex flex-col items-center">

          <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif text-black mb-6 md:mb-8 text-center tracking-wide">
            Regístrate y consigue un 10 % de descuento
          </h3>

          <p className="text-black/80 font-normal text-sm md:text-base mb-8 md:mb-10 leading-relaxed max-w-3xl xl:max-w-4xl text-center">
            Entérate antes que nadie de todas las actualizaciones sobre nuevas<br className="hidden lg:block" />
            colecciones, ideas de estilo y de regalo y acceso exclusivo. Regístrate hoy en<br className="hidden lg:block" />
            el Nezus Club y recibe un 10 % de descuento* en tu próxima compra<br className="hidden lg:block" />
            online (solo en artículos sin descuento). <Link href="/terminos" className="underline underline-offset-2 hover:text-black/60 transition-colors">* Se aplican términos y condiciones</Link>
          </p>

          <Button
            onClick={() => { setIsModalOpen(true); setModalStep(1); }}
            className="h-12 md:h-14 px-10 md:px-16 bg-black text-white hover:bg-black/90 rounded-none text-sm font-medium transition-colors"
          >
            Únete al club
          </Button>

        </div>

        {/* Decorative 3D premium emblem on the right — Swarovski-style */}
        <div
          className="hidden lg:flex absolute right-0 top-0 bottom-0 w-[400px] xl:w-[480px] items-center justify-center pointer-events-none"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 20%, rgba(0,0,0,0.85) 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 20%, rgba(0,0,0,0.85) 100%)"
          }}
        >
          <img
            src="/Logo-3D-emblem.png.png"
            alt=""
            aria-hidden="true"
            className="w-[340px] xl:w-[400px] h-auto object-contain"
            style={{ filter: "contrast(1.15) saturate(1.4) brightness(1.08)" }}
          />
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
