
import { Suspense } from "react"
import { UploadForm } from "@/components/upload-form"
import Image from "next/image"

export default async function PagoPlin({ searchParams }: { searchParams: Promise<{ monto?: string; order_id?: string }> }) {
    const { monto = "0.00", order_id: orderId = "" } = await searchParams

    return (
        <div className="max-w-md mx-auto p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Paga con Plin</h2>

            <p className="text-lg mb-2">Monto a pagar:</p>
            <p className="text-3xl font-bold text-blue-500 mb-6">S/ {monto}</p>

            {/* QR Plin placeholder */}
            <div className="mx-auto w-48 mb-4 relative aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">QR Plin</span>
                {/* <Image src="/qr-plin.png" alt="QR Plin" fill className="object-contain" /> */}
            </div>

            <p className="text-gray-600 mb-1">O deposita al número:</p>
            <p className="text-xl font-bold mb-6">9XX XXX XXX</p>

            <UploadForm monto={monto} orderId={orderId} metodo="Plin" />
        </div>
    )
}
