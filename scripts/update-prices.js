const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const priceConfig = [
    { slugs: ['aretes', 'anillos'], price: 35 }, // Simples
    { slugs: ['pulseras', 'collares', 'resplandor-estival', 'elegancia-nocturna', 'geometria-del-lujo'], price: 45 }, // Other Collections/Items
    { slugs: ['coleccion-estelar'], price: 36 }, // Stellar (S/45 - 20% = 36)
    { slugs: ['edicion-limitada'], price: 52 } // Limited (S/65 - 20% = 52)
];

async function updatePrices() {
    console.log('--- Starting Price Update ---');

    const { data: stellarCat } = await supabase.from('categories').upsert({
        name: 'Colección Estelar',
        slug: 'coleccion-estelar',
        description: 'Una curaduría de piezas con destellos celestiales.'
    }, { onConflict: 'slug' }).select();

    const stellarId = stellarCat[0].id;

    // 0.1 Move relevant products to 'coleccion-estelar'
    console.log('Moving featured products to "coleccion-estelar"...');
    await supabase.from('products')
        .update({ category_id: stellarId })
        .eq('slug', 'aretes-amatista-y-cuarzo-rosa');

    // 1. Get Categories to map slugs to IDs
    const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('id, slug');

    if (catError) {
        console.error('Error fetching categories:', catError);
        return;
    }

    const slugToId = {};
    categories.forEach(cat => {
        slugToId[cat.slug] = cat.id;
    });

    // 2. Update products for each config group
    let totalUpdated = 0;

    for (const config of priceConfig) {
        const categoryIds = config.slugs
            .map(slug => slugToId[slug])
            .filter(id => id);

        if (categoryIds.length === 0) {
            console.log(`No categories found for slugs: ${config.slugs.join(', ')}`);
            continue;
        }

        console.log(`Updating prices to S/${config.price} for categories: ${config.slugs.join(', ')}...`);

        const { data, error, count } = await supabase
            .from('products')
            .update({ 
                price: config.price,
                compare_at_price: (config.slugs.includes('coleccion-estelar') || config.slugs.includes('edicion-limitada')) 
                    ? (config.slugs.includes('edicion-limitada') ? 65 : 45) 
                    : null
            })
            .in('category_id', categoryIds)
            .select();

        if (error) {
            console.error(`Error updating group with price ${config.price}:`, error);
        } else {
            console.log(`Successfully updated ${data?.length || 0} products.`);
            totalUpdated += data?.length || 0;
        }
    }

    console.log(`--- Finished. Total products updated: ${totalUpdated} ---`);
}

updatePrices();
