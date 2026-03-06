"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Tag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { CouponValidation } from "@/lib/types"

interface CouponInputProps {
    onCouponApplied: (discount: number, code: string) => void
    subtotal: number
}

export function CouponInput({ onCouponApplied, subtotal }: CouponInputProps) {
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
    const { toast } = useToast()

    const handleApply = async () => {
        if (!code.trim()) {
            toast({
                title: "Error",
                description: "Ingresa un código de cupón",
                variant: "destructive",
            })
            return
        }

        setLoading(true)

        try {
            const response = await fetch(`/api/coupons/validate?code=${encodeURIComponent(code)}&subtotal=${subtotal}`)

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || "Cupón inválido")
            }

            const data: CouponValidation = await response.json()

            if (!data.valid || !data.discount_amount) {
                throw new Error(data.error || "Cupón inválido")
            }

            setAppliedCoupon(code)
            onCouponApplied(data.discount_amount, code)
            toast({
                title: "¡Cupón aplicado!",
                description: `Descuento de S/ ${data.discount_amount.toFixed(2)} aplicado`,
            })
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "No se pudo aplicar el cupón",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleRemove = () => {
        setCode("")
        setAppliedCoupon(null)
        onCouponApplied(0, "")
        toast({
            title: "Cupón removido",
            description: "El descuento ha sido eliminado",
        })
    }

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Código de cupón"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        disabled={loading || !!appliedCoupon}
                        className="pl-10"
                    />
                </div>
                {appliedCoupon ? (
                    <Button variant="outline" onClick={handleRemove}>
                        Remover
                    </Button>
                ) : (
                    <Button onClick={handleApply} disabled={loading || !code.trim()}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Aplicar
                    </Button>
                )}
            </div>
            {appliedCoupon && (
                <p className="text-sm text-green-600">
                    ✓ Cupón &quot;{appliedCoupon}&quot; aplicado
                </p>
            )}
        </div>
    )
}
