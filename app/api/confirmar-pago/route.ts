
import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { createClient } from "@/lib/supabase/server"

// S1: Allowed image MIME types (whitelist)
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
// S2: Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function POST(req: NextRequest) {
    try {
        // S1: Authenticate user
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: "Debes iniciar sesión para confirmar un pago" },
                { status: 401 }
            )
        }

        const formData = await req.formData()
        const telefono = formData.get("telefono") as string
        const monto = formData.get("monto") as string
        const captura = formData.get("captura") as File
        const orderId = formData.get("orderId") as string

        const nombre = formData.get("nombre") as string
        const operacion = formData.get("operacion") as string
        const tipoComprobante = formData.get("tipoComprobante") as string
        const ruc = formData.get("ruc") as string
        const razonSocial = formData.get("razonSocial") as string
        const dni = formData.get("dni") as string
        const direccionFiscal = formData.get("direccionFiscal") as string

        const metodo = (formData.get("metodo") as string) || "Yape"

        // S2: Validate file presence
        if (!captura) {
            return NextResponse.json({ error: "No se subió ninguna captura" }, { status: 400 })
        }

        // S2: Validate file type
        if (!ALLOWED_MIME_TYPES.includes(captura.type)) {
            return NextResponse.json(
                { error: "Tipo de archivo no permitido. Solo se aceptan imágenes (JPEG, PNG, WebP)" },
                { status: 400 }
            )
        }

        // S2: Validate file size
        if (captura.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "El archivo es demasiado grande. Tamaño máximo: 5MB" },
                { status: 400 }
            )
        }

        // S1: Validate orderId belongs to the authenticated user
        if (orderId) {
            const { data: order, error: orderError } = await supabase
                .from("orders")
                .select("id, user_id")
                .eq("id", orderId)
                .single()

            if (orderError || !order) {
                return NextResponse.json(
                    { error: "Pedido no encontrado" },
                    { status: 404 }
                )
            }

            if (order.user_id !== user.id) {
                return NextResponse.json(
                    { error: "No tienes permiso para confirmar este pedido" },
                    { status: 403 }
                )
            }
        }

        const buffer = Buffer.from(await captura.arrayBuffer())

        // S5: Fail hard in production if SMTP credentials are missing
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            if (process.env.NODE_ENV === "production") {
                console.error("CRITICAL: EMAIL_USER or EMAIL_PASS not configured in production")
                return NextResponse.json(
                    { error: "Error de configuración del servidor. Contacte al administrador." },
                    { status: 500 }
                )
            }
            console.warn("Advertencia: EMAIL_USER o EMAIL_PASS no encontrados en .env.local. Simulando envío del comprobante al administrador.")
            return NextResponse.json({ ok: true, simulated: true, message: "Comprobante simulado con éxito (Falta configurar Email SMTP)" })
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })

        let comprobanteInfo = `<p><strong>Tipo de Comprobante:</strong> ${tipoComprobante || "Ticket"}</p>`
        if (tipoComprobante === "factura") {
            comprobanteInfo += `
            <p><strong>RUC:</strong> ${ruc}</p>
            <p><strong>Razón Social:</strong> ${razonSocial}</p>
            <p><strong>Dirección Fiscal:</strong> ${direccionFiscal}</p>
          `
        } else if (tipoComprobante === "boleta") {
            comprobanteInfo += `
            <p><strong>DNI:</strong> ${dni}</p>
            <p><strong>Dirección de Comprobante:</strong> ${direccionFiscal || "Misma que entrega"}</p>
            `
        } else {
            // Ticket
            comprobanteInfo += `<p><strong>DNI:</strong> ${dni || "-"}</p>`
        }

        // S2: Sanitize filename extension
        const ext = captura.name?.split(".").pop()?.toLowerCase() || "jpg"
        const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg"
        const safeFilename = `captura_${Date.now()}.${safeExt}`

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self
            subject: `Nuevo pago ${metodo} - S/ ${monto} - Pedido #${orderId || "N/A"}`,
            html: `
        <h2>Nuevo Pago ${metodo} Recibido</h2>
        <p><strong>Cliente:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>DNI/RUC:</strong> ${ruc || dni || "-"}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Monto:</strong> S/ ${monto}</p>
        <p><strong>Nro. Operación:</strong> ${operacion}</p>
        <hr />
        ${comprobanteInfo}
        <p><strong>ID del Pedido:</strong> ${orderId || "No especificado"}</p>
        <p>Revisar adjunto para ver la captura.</p>
      `,
            attachments: [{ filename: safeFilename, content: buffer }],
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error("Error sending email:", error)
        return NextResponse.json(
            { error: "Error al enviar el correo de confirmación" },
            { status: 500 }
        )
    }
}
