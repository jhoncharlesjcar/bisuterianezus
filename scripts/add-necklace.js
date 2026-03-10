const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function addProduct() {
    console.log('Updating product...');

    // Get collares category ID
    const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', 'collares')
        .single();

    if (categoryError) {
        console.error('Error fetching category:', categoryError);
        return;
    }

    // Update the product with correct compare_at_price
    const { data, error } = await supabase
        .from('products')
        .upsert({
            name: 'Collar Perlas con Flor Lila',
            slug: 'collar-perlas-flor-lila',
            description: 'Hermoso collar de perlas de doble capa con dije de flor lila',
            price: 76.00,
            compare_at_price: 95.00,
            category_id: categoryData.id,
            image_url: 'https://res.cloudinary.com/dn36m0jer/image/upload/v1771387399/nezus/products/collar-perlas-flor-lila.jpg',
            in_stock: true,
            featured: true,
        }, { onConflict: 'slug' })
        .select();

    if (error) {
        console.error('Error adding product:', error);
    } else {
        console.log('Successfully added product:', data);
    }
}

addProduct();
