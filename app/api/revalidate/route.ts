import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
    try {
        const signature = request.headers.get("x-supabase-signature");
        // En producción, valida el signature con SUPABASE_WEBHOOK_SECRET

        const body = await request.json();
        
        // Determinar qué invalidar basado en el cambio
        const table = body.table || "products";

        if (table === "categories") {
            revalidatePath("/api/categories", "page");
        } else if (table === "products") {
            revalidatePath("/", "page");
            revalidatePath("/tienda", "page");
            if (body.record?.slug) {
                revalidatePath(`/producto/${body.record.slug}`, "page");
            }
        }

        return NextResponse.json({ revalidated: true, now: Date.now() });
    } catch (err) {
        return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
    }
}
