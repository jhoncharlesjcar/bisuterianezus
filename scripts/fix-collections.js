const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixCollections() {
    console.log('Inserting collection categories...');

    const collectionCategories = [
        { name: 'Resplandor Estival', slug: 'resplandor-estival', description: 'Una celebración del brillo vibrante.' },
        { name: 'Elegancia Nocturna', slug: 'elegancia-nocturna', description: 'El complemento definitivo para cenas de gala.' },
        { name: 'Geometría del Lujo', slug: 'geometria-del-lujo', description: 'El encanto de la geometría cristalina.' }
    ];

    for (const cat of collectionCategories) {
        const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .upsert(cat, { onConflict: 'slug' })
            .select();

        if (categoryError) {
            console.error(`Error inserting category ${cat.name}:`, categoryError);
            continue;
        }

        cat.id = categoryData[0].id;
    }

    const resplandorId = collectionCategories[0].id;
    const eleganciaId = collectionCategories[1].id;
    const geometriaId = collectionCategories[2].id;

    // Insert "Aretes Mandala Negro Celeste"
    const { error: err1 } = await supabase.from('products').upsert({
        name: 'Aretes Mandala Negro Celeste',
        slug: 'aretes-mandala-negro-celeste',
        description: 'Espectaculares aretes tejidos en forma de mandala con cristales negros y celestes.',
        price: 85.00,
        category_id: resplandorId,
        image_url: '/images/lifestyle/lifestyle-aretes-mandala-negro-celeste.png',
        in_stock: true,
        featured: true,
    }, { onConflict: 'slug' });
    if (err1) console.error('Error missing earings:', err1);

    // Re-categorize "Aretes Perlas Racimo" -> Elegancia Nocturna
    const { error: err2 } = await supabase.from('products').update({ category_id: eleganciaId }).eq('slug', 'aretes-perlas-racimo');
    if (err2) console.error('Error updating ', err2);

    // Re-categorize "Aretes Corazón Piedras Verdes" -> Geometría del Lujo
    const { error: err3 } = await supabase.from('products').update({ category_id: geometriaId }).eq('slug', 'aretes-corazon-piedras-verdes');
    if (err3) console.error('Error updating ', err3);

    console.log('Done mapping collections.');
}

fixCollections();
