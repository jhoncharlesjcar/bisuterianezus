-- ============================================================================
-- SCRIPT DE MIGRACIÓN: CATEGORÍAS Y ASIGNACIÓN AUTOMÁTICA
-- ============================================================================

-- 1. Insertar categorías base si no existen (usando ON CONFLICT si slug es unique)
-- Asumimos que la columna 'slug' tiene una restricción UNIQUE.

INSERT INTO categories (name, slug, image_url, description)
VALUES 
    ('Aretes', 'aretes', '/images/aretes-gota-dorada-cristales.jpg', 'Elegancia que resalta tu rostro'),
    ('Collares', 'collares', '/images/img-20251121-wa0250.jpg', 'El toque perfecto para tu cuello'),
    ('Pulseras', 'pulseras', '/images/img-20251121-wa0248.jpg', 'Detalles que adornan tus manos'),
    ('Anillos', 'anillos', '/images/img-20251121-wa0252.jpg', 'Símbolos de estilo y compromiso'),
    ('Medallas', 'medallas', '/images/img-20251121-wa0254.jpg', 'Recuerdos y significados especiales')
ON CONFLICT (slug) DO UPDATE 
SET 
  image_url = EXCLUDED.image_url,
  description = EXCLUDED.description;

-- 2. Asignar categorías a productos existentes basándose en el nombre
-- Esto busca palabras clave en el nombre del producto y actualiza el category_id

-- Actualizar ARETES
UPDATE products
SET category_id = (SELECT id FROM categories WHERE slug = 'aretes')
WHERE (name ILIKE '%arete%' OR name ILIKE '%pendiente%')
  AND category_id IS NULL;

-- Actualizar COLLARES
UPDATE products
SET category_id = (SELECT id FROM categories WHERE slug = 'collares')
WHERE (name ILIKE '%collar%' OR name ILIKE '%gargantilla%' OR name ILIKE '%cadena%')
  AND category_id IS NULL;

-- Actualizar PULSERAS
UPDATE products
SET category_id = (SELECT id FROM categories WHERE slug = 'pulseras')
WHERE (name ILIKE '%pulsera%' OR name ILIKE '%brazalete%')
  AND category_id IS NULL;

-- Actualizar ANILLOS
UPDATE products
SET category_id = (SELECT id FROM categories WHERE slug = 'anillos')
WHERE (name ILIKE '%anillo%' OR name ILIKE '%solitario%')
  AND category_id IS NULL;

-- Actualizar MEDALLAS
UPDATE products
SET category_id = (SELECT id FROM categories WHERE slug = 'medallas')
WHERE (name ILIKE '%medalla%' OR name ILIKE '%dije%')
  AND category_id IS NULL;

-- 3. Verificación (Opcional)
-- SELECT p.name, c.name as category_name 
-- FROM products p 
-- LEFT JOIN categories c ON p.category_id = c.id
-- WHERE p.category_id IS NOT NULL;
