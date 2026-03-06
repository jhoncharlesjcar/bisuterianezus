-- Añadir nuevo producto: Aretes Corazón Turquesa
-- Ejecutar en Supabase SQL Editor

INSERT INTO products (
  name,
  slug,
  description,
  price,
  category_id,
  image_url,
  stock_quantity,
  low_stock_threshold,
  in_stock,
  featured
)
SELECT
  'Aretes Corazón Turquesa',
  'aretes-corazon-turquesa',
  'Elegantes aretes en forma de corazón con delicados detalles en turquesa y acabado plateado. Perfectos para cualquier ocasión especial.',
  35.00,
  id,
  '/images/aretes-corazon-turquesa.jpg',
  20,
  5,
  true,
  true
FROM categories
WHERE slug = 'aretes'
LIMIT 1;

-- Verificar que se insertó
SELECT * FROM products WHERE slug = 'aretes-corazon-turquesa';
