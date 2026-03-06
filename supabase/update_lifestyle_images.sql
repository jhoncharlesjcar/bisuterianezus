-- PASO 1: Agregar columna para imagen lifestyle
-- Ejecutar en Supabase SQL Editor

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'lifestyle_image_url') THEN 
        ALTER TABLE products ADD COLUMN lifestyle_image_url TEXT; 
    END IF; 
END $$;

-- PASO 2: Actualizar productos existentes con las imágenes que acabamos de generar
-- Aretes Corazón Turquesa (si ya existe)
UPDATE products 
SET lifestyle_image_url = '/images/lifestyle-aretes-corazon-turquesa.png'
WHERE slug = 'aretes-corazon-turquesa';

-- Aretes Gota Dorada
UPDATE products 
SET lifestyle_image_url = '/images/lifestyle-aretes-gota-dorada.png'
WHERE image_url LIKE '%aretes-gota-dorada%';

-- Christmas Tree 1
UPDATE products 
SET lifestyle_image_url = '/images/lifestyle-christmas-tree-1.png'
WHERE image_url LIKE '%christmas-tree-earrings-1%';

-- Christmas Tree 2
UPDATE products 
SET lifestyle_image_url = '/images/lifestyle-christmas-tree-2.png'
WHERE image_url LIKE '%christmas-tree-earrings-2%';

-- Christmas Tree 3
UPDATE products 
SET lifestyle_image_url = '/images/lifestyle-christmas-tree-3.png'
WHERE image_url LIKE '%christmas-tree-earrings-3%';

-- Christmas Wire
UPDATE products 
SET lifestyle_image_url = '/images/lifestyle-christmas-wire.png'
WHERE image_url LIKE '%christmas-wire-earrings%';

-- Verificar cambios
SELECT name, lifestyle_image_url FROM products WHERE lifestyle_image_url IS NOT NULL;
