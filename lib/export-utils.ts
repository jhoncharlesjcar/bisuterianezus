/**
 * Utilidades para exportar datos a formato CSV/Excel
 */

export interface ExportColumn<T> {
    header: string
    accessor: keyof T | ((item: T) => string | number)
}

/**
 * Convierte un array de objetos a formato CSV
 */
export function toCSV<T extends Record<string, unknown>>(
    data: T[],
    columns: ExportColumn<T>[]
): string {
    // Header
    const header = columns.map(col => `"${col.header}"`).join(",")

    // Rows
    const rows = data.map(item => {
        return columns.map(col => {
            let value: unknown

            if (typeof col.accessor === "function") {
                value = col.accessor(item)
            } else {
                value = item[col.accessor]
            }

            // Escapar comillas y envolver en comillas
            const stringValue = String(value ?? "").replace(/"/g, '""')
            return `"${stringValue}"`
        }).join(",")
    })

    return [header, ...rows].join("\n")
}

/**
 * Descarga un archivo CSV
 */
export function downloadCSV(csv: string, filename: string): void {
    // Agregar BOM para que Excel reconozca UTF-8
    const BOM = "\uFEFF"
    const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `${filename}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

/**
 * Exporta pedidos a CSV
 */
export function exportOrdersToCSV(orders: Array<{
    id: string
    customer_name?: string
    customer_email?: string
    customer_phone?: string
    total: number
    status: string
    created_at: string
    shipping_address?: string
    items?: Array<{ product_name: string; quantity: number; unit_price: number }>
}>) {
    const columns = [
        { header: "ID Pedido", accessor: "id" as const },
        { header: "Cliente", accessor: "customer_name" as const },
        { header: "Email", accessor: "customer_email" as const },
        { header: "Teléfono", accessor: "customer_phone" as const },
        { header: "Dirección", accessor: "shipping_address" as const },
        { header: "Total (S/)", accessor: (o: typeof orders[0]) => o.total.toFixed(2) },
        { header: "Estado", accessor: "status" as const },
        { header: "Fecha", accessor: (o: typeof orders[0]) => new Date(o.created_at).toLocaleDateString("es-PE") },
        {
            header: "Productos", accessor: (o: typeof orders[0]) =>
                o.items?.map(i => `${i.product_name} x${i.quantity}`).join("; ") || ""
        },
    ]

    const csv = toCSV(orders, columns)
    const date = new Date().toISOString().split("T")[0]
    downloadCSV(csv, `pedidos_${date}`)
}

/**
 * Exporta productos a CSV
 */
export function exportProductsToCSV(products: Array<{
    id: string
    name: string
    sku?: string
    price: number
    stock_quantity: number
    in_stock: boolean
    category?: { name: string }
}>) {
    const columns = [
        { header: "ID", accessor: "id" as const },
        { header: "SKU", accessor: "sku" as const },
        { header: "Nombre", accessor: "name" as const },
        { header: "Categoría", accessor: (p: typeof products[0]) => p.category?.name || "" },
        { header: "Precio (S/)", accessor: (p: typeof products[0]) => p.price.toFixed(2) },
        { header: "Stock", accessor: "stock_quantity" as const },
        { header: "Disponible", accessor: (p: typeof products[0]) => p.in_stock ? "Sí" : "No" },
    ]

    const csv = toCSV(products, columns)
    const date = new Date().toISOString().split("T")[0]
    downloadCSV(csv, `productos_${date}`)
}
