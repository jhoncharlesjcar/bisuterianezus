import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/components/layout/providers"
import { PageTransition } from "@/components/animations/page-transition"
import "./globals.css"

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-sans" })
const inter = Inter({ subsets: ["latin"], variable: "--font-body" })

export const metadata: Metadata = {
  metadataBase: new URL("https://nezusbisuteria.com"),
  title: {
    default: "Nezus Bisutería | Accesorios de Bisutería Fina",
    template: "%s | Nezus Bisutería",
  },
  description:
    "Bisutería Nezus - Una empresa comprometida con la belleza y el estilo, ofreciendo accesorios de bisutería fina artesanal con los más altos estándares de calidad. Envíos a todo Perú.",
  keywords: ["bisutería", "aretes", "collares", "pulseras", "joyería artesanal", "Perú", "accesorios"],
  authors: [{ name: "Nezus Bisutería" }],
  creator: "Nezus Bisutería",
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://nezusbisuteria.com",
    siteName: "Nezus Bisutería",
    title: "Nezus Bisutería | Accesorios de Bisutería Fina",
    description: "Descubre nuestra colección de bisutería artesanal única. Aretes, collares y pulseras hechos con amor.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nezus Bisutería",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nezus Bisutería | Accesorios de Bisutería Fina",
    description: "Descubre nuestra colección de bisutería artesanal única.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <PageTransition>
            {children}
          </PageTransition>
          <Toaster />
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
