-- Actualizar imágenes lifestyle (Ronda 2)
-- Ejecutar en Supabase SQL Editor

-- 1. Aretes Corazón Verde y Rojo
UPDATE products 
SET lifestyle_image_url = '/images/lifestyle-corazon-verde-rojo.png'
WHERE image_url LIKE '%img-20251121-wa0241%' OR slug = 'aretes-corazon-verde-y-rojo';

-- 2. Aretes Corazón Dorado Negro
UPDATE products 
SET lifestyle_image_url = '/images/lifestyle-corazon-dorado-negro.png'
WHERE image_url LIKE '%img-20251121-wa0256%' OR slug = 'aretes-corazon-dorado-negro' OR slug = 'aretes-corazon-dorado-y-negro';

-- 3. Aretes Dorado con Gemas
UPDATE products 
SET lifestyle_image_url = '/images/lifestyle-dorado-gemas.png'
WHERE image_url LIKE '%img-20251121-wa0239%' OR slug = 'aretes-dorado-con-gemas';

-- 4. Aretes Corazón Piedras Verdes
UPDATE products 
SET lifestyle_image_url = '/images/lifestyle-corazon-piedras-verdes.png'
WHERE image_url LIKE '%img-20251121-wa0248%' OR slug = 'aretes-corazon-piedras-verdes';

-- Verificar cambios
SELECT name, lifestyle_image_url FROM products WHERE lifestyle_image_url IS NOT NULL;
