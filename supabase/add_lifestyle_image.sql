-- Agregar columna para imagen lifestyle y actualizar producto
-- Ejecutar en Supabase SQL Editor

-- 1. Agregar columna si no existe
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'lifestyle_image_url') THEN 
        ALTER TABLE products ADD COLUMN lifestyle_image_url TEXT; 
    END IF; 
END $$;

-- 2. Actualizar el producto Aretes Corazón Turquesa con la nueva imagen
UPDATE products 
SET lifestyle_image_url = '/images/lifestyle-aretes-corazon-turquesa.png'
WHERE slug = 'aretes-corazon-turquesa';

-- Verificar
SELECT name, lifestyle_image_url FROM products WHERE slug = 'aretes-corazon-turquesa';
