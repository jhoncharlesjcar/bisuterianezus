import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        return NextResponse.json({ error: "Missing admin credentials" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        // 1. Insert the new Category "Edición Limitada"
        const newCollectionId = 'c0000000-0000-4000-a000-000000000005';
        const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .upsert({
                id: newCollectionId,
                name: 'Edición Limitada',
                slug: 'edicion-limitada',
                description: 'Exclusivas piezas efímeras navideñas creadas con luz y magia.',
                image_url: 'https://res.cloudinary.com/dn36m0jer/image/upload/v1771386092/nezus/products/christmas-tree-earrings-1.jpg'
            })
            .select();

        if (categoryError) throw categoryError;

        // 2. Fetch all products with Christmas themes
        const { data: christmasProducts, error: fetchError } = await supabase
            .from('products')
            .select('id, name')
            .or('name.ilike.%navidad%,name.ilike.%navideñ%,description.ilike.%navidad%,description.ilike.%navideñ%');

        if (fetchError) throw fetchError;

        if (!christmasProducts || christmasProducts.length === 0) {
            return NextResponse.json({ message: "No christmas products found, but category created." });
        }

        const updated = [];

        // 3. Update their category_id to the new Edición Limitada UUID
        for (const product of christmasProducts) {
            const { data, error } = await supabase
                .from('products')
                .update({
                    category_id: newCollectionId
                })
                .eq('id', product.id)
                .select();

            if (error) {
                console.error("Error updating product:", product.id, error);
            } else if (data && data.length > 0) {
                updated.push({ id: data[0].id, name: data[0].name });
            }
        }

        return NextResponse.json({ success: true, updatedCount: updated.length, products: updated });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
