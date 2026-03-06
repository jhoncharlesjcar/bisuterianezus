"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { StarRating } from "@/components/star-rating"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

const reviewSchema = z.object({
    rating: z.number().min(1).max(5),
    title: z.string().optional(),
    comment: z.string().min(10, "El comentario debe tener al menos 10 caracteres"),
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface WriteReviewFormProps {
    productId: string
    onSuccess?: () => void
}

export function WriteReviewForm({ productId, onSuccess }: WriteReviewFormProps) {
    const { user } = useAuth()
    const { toast } = useToast()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            title: "",
            comment: "",
        },
    })

    const onSubmit = async (data: ReviewFormData) => {
        if (!user) {
            toast({
                title: "Error",
                description: "Debes iniciar sesión para escribir una reseña",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    product_id: productId,
                    ...data,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || "Failed to submit review")
            }

            toast({
                title: "¡Reseña enviada!",
                description: "Gracias por compartir tu opinión",
            })

            form.reset()
            router.refresh()
            onSuccess?.()
        } catch (error) {
            console.error("Error submitting review:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "No se pudo enviar la reseña",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!user) {
        return (
            <div className="bg-[#FAFAFA] p-8 border border-black/5 text-center">
                <p className="text-sm font-light text-black/60">
                    Por favor <a href="/login" className="text-black font-medium hover:underline underline-offset-4 decoration-black/20">inicia sesión</a> para compartir tu experiencia con esta pieza.
                </p>
            </div>
        )
    }

    return (
        <div className="bg-[#FAFAFA] p-8 lg:p-12 border border-black/5">
            <h3 className="text-2xl font-serif font-light text-black mb-8">Comparte tu experiencia</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs uppercase tracking-widest text-black/60 font-medium">Calificación</FormLabel>
                                <FormControl>
                                    <div className="pt-2">
                                        <StarRating
                                            rating={field.value}
                                            interactive
                                            size="lg"
                                            onRatingChange={field.onChange}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-xs text-red-500 font-light" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs uppercase tracking-widest text-black/60 font-medium">Resumen (Opcional)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ej: Artesanía excepcional"
                                        {...field}
                                        className="h-12 bg-white border-black/10 rounded-none focus-visible:ring-0 focus-visible:border-black font-light"
                                    />
                                </FormControl>
                                <FormMessage className="text-xs text-red-500 font-light" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs uppercase tracking-widest text-black/60 font-medium">Tu Experiencia</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Cuéntanos qué te pareció el diseño, la calidad de los materiales y el acabado..."
                                        className="min-h-[160px] bg-white border-black/10 rounded-none focus-visible:ring-0 focus-visible:border-black font-light resize-none py-4"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs text-red-500 font-light" />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto h-12 px-8 bg-black hover:bg-black/90 text-white rounded-none uppercase tracking-widest text-[10px] font-medium transition-all"
                    >
                        {isSubmitting ? "Enviando..." : "Publicar Reseña"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
