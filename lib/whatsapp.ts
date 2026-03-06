/**
 * Utilidades para integración con WhatsApp
 */

const BUSINESS_PHONE = "51935128673" // Número de WhatsApp del negocio

/**
 * Genera un link de WhatsApp para web
 */
export function getWhatsAppLink(phone: string, message: string): string {
    const cleanPhone = phone.replace(/\D/g, "")
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

/**
 * Genera link para contactar al negocio
 */
export function getBusinessWhatsAppLink(message: string): string {
    return getWhatsAppLink(BUSINESS_PHONE, message)
}

/**
 * Genera mensaje de confirmación de pedido
 */
export function getOrderConfirmationMessage(order: {
    id: string
    customer_name?: string
    total: number
    items?: Array<{ product_name: string; quantity: number }>
}): string {
    const itemsList = order.items
        ?.map(i => `• ${i.product_name} x${i.quantity}`)
        .join("\n") || ""

    return `🛍️ *Nezus Bisutería - Confirmación de Pedido*

Hola ${order.customer_name || ""},

Tu pedido #${order.id.substring(0, 8)} ha sido confirmado.

*Productos:*
${itemsList}

*Total:* S/ ${order.total.toFixed(2)}

Gracias por tu compra. ¡Pronto recibirás actualizaciones sobre el envío!

---
Nezus Bisutería ✨`
}

/**
 * Genera mensaje de envío de pedido
 */
export function getOrderShippedMessage(order: {
    id: string
    customer_name?: string
    tracking_number?: string
}): string {
    return `📦 *Nezus Bisutería - Pedido Enviado*

Hola ${order.customer_name || ""},

Tu pedido #${order.id.substring(0, 8)} ha sido enviado.

${order.tracking_number ? `*Número de seguimiento:* ${order.tracking_number}` : ""}

Recibirás tu paquete en los próximos días.

¿Tienes alguna pregunta? Responde a este mensaje.

---
Nezus Bisutería ✨`
}

/**
 * Genera mensaje para contactar cliente sobre su pedido
 */
export function getContactCustomerMessage(order: {
    id: string
    customer_name?: string
    status: string
}): string {
    const statusText: Record<string, string> = {
        pending: "pendiente",
        confirmed: "confirmado",
        preparing: "en preparación",
        shipped: "enviado",
        delivered: "entregado",
        cancelled: "cancelado",
    }

    return `Hola ${order.customer_name || ""}, 

Te contactamos de *Nezus Bisutería* sobre tu pedido #${order.id.substring(0, 8)} (${statusText[order.status] || order.status}).

`
}

/**
 * Genera link para que admin contacte al cliente
 */
export function getAdminContactLink(
    customerPhone: string,
    order: { id: string; customer_name?: string; status: string }
): string {
    const message = getContactCustomerMessage(order)
    return getWhatsAppLink(customerPhone, message)
}

/**
 * Abre WhatsApp en una nueva ventana
 */
export function openWhatsApp(phone: string, message: string): void {
    const link = getWhatsAppLink(phone, message)
    window.open(link, "_blank", "noopener,noreferrer")
}
