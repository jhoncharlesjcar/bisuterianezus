"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface UploadFormProps {
    monto: string
    orderId: string
    metodo: "Yape" | "Plin"
}

const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 1200;
                const MAX_HEIGHT = 1200;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
                    } else {
                        reject(new Error("Canvas to Blob failed"));
                    }
                }, 'image/jpeg', 0.8);
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};

export function UploadForm({ monto, orderId, metodo }: UploadFormProps) {
    const [file, setFile] = useState<File | null>(null)
    const [telefono, setTelefono] = useState("")
    const [nombre, setNombre] = useState("")
    const [operacion, setOperacion] = useState("")
    const [tipoComprobante, setTipoComprobante] = useState("ticket")
    const [ruc, setRuc] = useState("")
    const [razonSocial, setRazonSocial] = useState("")
    const [dni, setDni] = useState("")
    const [direccionEntrega, setDireccionEntrega] = useState("")
    const [direccionFiscal, setDireccionFiscal] = useState("")
    const [enviado, setEnviado] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return

        setLoading(true)

        let fileToUpload = file;
        try {
            if (file.type.startsWith('image/')) {
                fileToUpload = await compressImage(file);
            }
        } catch (err) {
            console.error("Image compression failed, using original file", err);
        }

        const formData = new FormData()
        formData.append("captura", fileToUpload)
        formData.append("telefono", telefono)
        formData.append("nombre", nombre)
        formData.append("operacion", operacion)
        formData.append("tipoComprobante", tipoComprobante)
        formData.append("direccionEntrega", direccionEntrega)

        if (tipoComprobante === "factura") {
            formData.append("ruc", ruc)
            formData.append("razonSocial", razonSocial)
            formData.append("direccionFiscal", direccionFiscal)
        } else if (tipoComprobante === "boleta") {
            formData.append("dni", dni)
            formData.append("direccionFiscal", direccionFiscal)
        } else {
            // Ticket
            formData.append("dni", dni) // User requested DNI for ticket too
        }

        formData.append("monto", monto)
        formData.append("orderId", orderId)
        formData.append("metodo", metodo)

        try {
            const res = await fetch("/api/confirmar-pago", {
                method: "POST",
                body: formData,
            })

            if (res.ok) {
                setEnviado(true)
            } else {
                alert("Hubo un error al enviar la confirmación. Por favor intenta de nuevo.")
            }
        } catch (error) {
            console.error("Error submitting form:", error)
            alert("Error de conexión.")
        } finally {
            setLoading(false)
        }
    }

    if (enviado) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-green-800">
                <h3 className="font-bold text-lg mb-2">¡Comprobante Enviado!</h3>
                <p>Verificaremos tu pago con {metodo} y confirmaremos tu pedido pronto.</p>
                <Button className="mt-4 w-full" onClick={() => window.location.href = "/tienda"}>
                    Volver a la tienda
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-left bg-card p-4 rounded-lg shadow-sm border">
            <div>
                <Label htmlFor="nombre" className="text-base">Nombre Completo</Label>
                <Input
                    id="nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre y Apellidos"
                    required
                    className="mt-1"
                />
            </div>

            <div>
                <Label htmlFor="direccionEntrega" className="text-base">Dirección de Entrega</Label>
                <Input
                    id="direccionEntrega"
                    type="text"
                    value={direccionEntrega}
                    onChange={(e) => setDireccionEntrega(e.target.value)}
                    placeholder="Av. Principal 123, Distrito"
                    required
                    className="mt-1"
                />
            </div>

            <div>
                <Label htmlFor="operacion" className="text-base">Número de Operación</Label>
                <Input
                    id="operacion"
                    type="text"
                    value={operacion}
                    onChange={(e) => setOperacion(e.target.value)}
                    placeholder="123456"
                    required
                    className="mt-1"
                />
            </div>

            <div>
                <Label className="text-base mb-2 block">Tipo de Comprobante</Label>
                <div className="flex gap-4">
                    <label className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-muted w-full">
                        <input
                            type="radio"
                            name="tipoComprobante"
                            value="ticket"
                            checked={tipoComprobante === "ticket"}
                            onChange={(e) => setTipoComprobante(e.target.value)}
                            className="accent-primary"
                        />
                        <span>Ticket</span>
                    </label>
                    <label className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-muted w-full">
                        <input
                            type="radio"
                            name="tipoComprobante"
                            value="boleta"
                            checked={tipoComprobante === "boleta"}
                            onChange={(e) => setTipoComprobante(e.target.value)}
                            className="accent-primary"
                        />
                        <span>Boleta</span>
                    </label>
                    <label className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-muted w-full">
                        <input
                            type="radio"
                            name="tipoComprobante"
                            value="factura"
                            checked={tipoComprobante === "factura"}
                            onChange={(e) => setTipoComprobante(e.target.value)}
                            className="accent-primary"
                        />
                        <span>Factura</span>
                    </label>
                </div>
            </div>

            {(tipoComprobante === "ticket" || tipoComprobante === "boleta") && (
                <div>
                    <Label htmlFor="dni" className="text-base">DNI</Label>
                    <Input
                        id="dni"
                        type="text"
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                        placeholder="8 dígitos"
                        required
                        className="mt-1"
                        maxLength={8}
                    />
                </div>
            )}

            {tipoComprobante === "boleta" && (
                <div>
                    <Label htmlFor="direccionFiscal" className="text-base">Dirección de Comprobante (Opcional)</Label>
                    <Input
                        id="direccionFiscal"
                        type="text"
                        value={direccionFiscal}
                        onChange={(e) => setDireccionFiscal(e.target.value)}
                        placeholder="Si es diferente a la de entrega"
                        className="mt-1"
                    />
                </div>
            )}

            {tipoComprobante === "factura" && (
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
                    <div>
                        <Label htmlFor="ruc" className="text-base">RUC</Label>
                        <Input
                            id="ruc"
                            type="text"
                            value={ruc}
                            onChange={(e) => setRuc(e.target.value)}
                            placeholder="10/20..."
                            required={tipoComprobante === "factura"}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="razonSocial" className="text-base">Razón Social</Label>
                        <Input
                            id="razonSocial"
                            type="text"
                            value={razonSocial}
                            onChange={(e) => setRazonSocial(e.target.value)}
                            placeholder="Nombre de la empresa"
                            required={tipoComprobante === "factura"}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="direccionFiscal" className="text-base">Dirección Fiscal</Label>
                        <Input
                            id="direccionFiscal"
                            type="text"
                            value={direccionFiscal}
                            onChange={(e) => setDireccionFiscal(e.target.value)}
                            placeholder="Dirección legal de la empresa"
                            required={tipoComprobante === "factura"}
                            className="mt-1"
                        />
                    </div>
                </div>
            )}

            <div>
                <Label htmlFor="telefono" className="text-base">Tu número de celular</Label>
                <Input
                    id="telefono"
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="9XX XXX XXX"
                    required
                    className="mt-1"
                />
            </div>

            <div>
                <Label htmlFor="captura" className="text-base">Sube tu captura de pantalla</Label>
                <Input
                    id="captura"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    required
                    className="mt-1"
                />
            </div>

            <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-6 text-lg"
                disabled={loading}
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Enviando...
                    </>
                ) : (
                    "Confirmar Pago"
                )}
            </Button>
        </form>
    )
}
