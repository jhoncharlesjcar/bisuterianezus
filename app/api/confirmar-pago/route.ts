
import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
    try {
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

        if (!captura) {
            return NextResponse.json({ error: "No se subió ninguna captura" }, { status: 400 })
        }

        const buffer = Buffer.from(await captura.arrayBuffer())

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
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

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self
            subject: `Nuevo pago ${metodo} - S/ ${monto} - Pedido #${orderId || "N/A"}`,
            html: `
        <h2>Nuevo Pago ${metodo} Recibido</h2>
        <p><strong>Cliente:</strong> ${nombre}</p>
        <p><strong>DNI/RUC:</strong> ${ruc || dni || "-"}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Monto:</strong> S/ ${monto}</p>
        <p><strong>Nro. Operación:</strong> ${operacion}</p>
        <hr />
        ${comprobanteInfo}
        <p><strong>ID del Pedido:</strong> ${orderId || "No especificado"}</p>
        <p>Revisar adjunto para ver la captura.</p>
      `,
            attachments: [{ filename: "captura.jpg", content: buffer }],
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
