-- ============================================================================
-- SCRIPT DE MIGRACIÓN: PRODUCTOS DESDE LIB/PRODUCTS.TS
-- ============================================================================

-- Insertar productos y asignarlos a categorías automáticamente
-- Se usa DO UPDATE para no duplicar si el slug ya existe

INSERT INTO products (name, slug, description, price, image_url, category_id, in_stock, featured)
VALUES
-- 1. Aretes Flor Multicolor
('Aretes Flor Multicolor', 'aretes-flor-multicolor', 'Hermosos aretes con diseño de flor en colores vibrantes', 45, '/images/img-20251121-wa0240.jpg', (SELECT id FROM categories WHERE slug = 'aretes'), true, true),

-- 2. Aretes Elegantes Azul y Blanco
('Aretes Elegantes Azul y Blanco', 'aretes-elegantes-azul-y-blanco', 'Aretes colgantes con diseño elegante en azul y blanco', 52, '/images/img-20251121-wa0247.jpg', (SELECT id FROM categories WHERE slug = 'aretes'), true, false),

-- 3. Aretes Corazón Turquesa
('Aretes Corazón Turquesa', 'aretes-corazon-turquesa', 'Aretes con diseño de corazón y detalles en turquesa', 48, '/images/img-20251121-wa0242.jpg', (SELECT id FROM categories WHERE slug = 'aretes'), true, false),

-- 4. Aretes Corazón Dorado y Negro
('Aretes Corazón Dorado y Negro', 'aretes-corazon-dorado-y-negro', 'Elegantes aretes de corazón con cuentas doradas y negras', 50, '/images/img-20251121-wa0246.jpg', (SELECT id FROM categories WHERE slug = 'aretes'), true, false),

-- 5. Aretes Amatista y Cuarzo Rosa
('Aretes Amatista y Cuarzo Rosa', 'aretes-amatista-y-cuarzo-rosa', 'Aretes con amatista natural y cuarzo rosa', 65, '/images/img-20251121-wa0243.jpg', (SELECT id FROM categories WHERE slug = 'aretes'), true, true),

-- 6. Aretes Corazón Verde y Rojo
('Aretes Corazón Verde y Rojo', 'aretes-corazon-verde-y-rojo', 'Aretes con diseño de corazón en colores verde y rojo', 55, '/images/img-20251121-wa0241.jpg', (SELECT id FROM categories WHERE slug = 'aretes'), true, false),

-- 7. Aretes Dorado con Gemas
('Aretes Dorado con Gemas', 'aretes-dorado-con-gemas', 'Aretes dorados con piedras preciosas multicolor', 58, '/images/img-20251121-wa0239.jpg', (SELECT id FROM categories WHERE slug = 'aretes'), true, false),

-- 8. Aretes Largo Turquesa
('Aretes Largo Turquesa', 'aretes-largo-turquesa', 'Aretes largos con piedras turquesa', 62, '/images/img-20251121-wa0245.jpg', (SELECT id FROM categories WHERE slug = 'aretes'), true, false),

-- 9. Aretes Corazón Piedras Verdes
('Aretes Corazón Piedras Verdes', 'aretes-corazon-piedras-verdes', 'Hermosos aretes con corazón y piedras verdes', 60, '/images/img-20251121-wa0248.jpg', (SELECT id FROM categories WHERE slug = 'geometria-del-lujo'), true, false),

-- 10. Aretes Ovalados Multicolor
('Aretes Ovalados Multicolor', 'aretes-ovalados-multicolor', 'Aretes ovalados con cuentas multicolor', 47, '/images/img-20251121-wa0244.jpg', (SELECT id FROM categories WHERE slug = 'aretes'), true, false),

-- 11. Aretes Cuarzo Rosa Elegante
('Aretes Cuarzo Rosa Elegante', 'aretes-cuarzo-rosa-elegante', 'Elegantes aretes con cuarzo rosa y base triangular dorada', 68, '/images/img-20251121-wa0251.jpg', (SELECT id FROM categories WHERE slug = 'aretes'), true, true),

-- 12. Pulsera Tejida Multicolor
('Pulsera Tejida Multicolor', 'pulsera-tejida-multicolor', 'Pulsera tejida con cuentas multicolor', 35, '/images/img-20251121-wa0258.jpg', (SELECT id FROM categories WHERE slug = 'pulseras'), true, false),

-- 13. Aretes Perlas Elegantes
('Aretes Perlas Elegantes', 'aretes-perlas-elegantes', 'Aretes con racimo de perlas y base triangular dorada', 70, '/images/img-20251121-wa0253.jpg', (SELECT id FROM categories WHERE slug = 'aretes'), true, true),

-- 14. Aretes Cuarzo Rosa Largos
('Aretes Cuarzo Rosa Largos', 'aretes-cuarzo-rosa-largos', 'Aretes largos con cuarzo rosa y base dorada', 65, '/images/img-20251121-wa0252.jpg', (SELECT id FROM categories WHERE slug = 'aretes'), true, false),

-- 15. Broche Estrella Multicolor
('Broche Estrella Multicolor', 'broche-estrella-multicolor', 'Hermoso broche en forma de estrella con piedras multicolor', 42, '/images/img-20251121-wa0255.jpg', (SELECT id FROM categories WHERE slug = 'anillos'), true, false),

-- 16. Aretes Luna y Perla Azul
('Aretes Luna y Perla Azul', 'aretes-luna-y-perla-azul', 'Aretes con diseño de luna y perla azul natural', 55, '/images/img-20251121-wa0249.jpg', (SELECT id FROM categories WHERE slug = 'aretes'), true, false),

-- 17. Aretes Perlas Racimo
('Aretes Perlas Racimo', 'aretes-perlas-racimo', 'Elegantes aretes con racimo de perlas', 68, '/images/img-20251121-wa0254.jpg', (SELECT id FROM categories WHERE slug = 'elegancia-nocturna'), true, false),

-- 18. Aretes Corazón Verde Esmeralda
('Aretes Corazón Verde Esmeralda', 'aretes-corazon-verde-esmeralda', 'Aretes de corazón con piedras verdes esmeralda', 58, '/images/img-20251121-wa0257.jpg', (SELECT id FROM categories WHERE slug = 'aretes'), true, false),

-- 19. Aretes Corazón Dorado Negro
('Aretes Corazón Dorado Negro', 'aretes-corazon-dorado-negro', 'Aretes de corazón con cuentas doradas y negras', 56, '/images/img-20251121-wa0256.jpg', (SELECT id FROM categories WHERE slug = 'aretes'), true, false),

-- 20. Aretes Luna Cristal Azul
('Aretes Luna Cristal Azul', 'aretes-luna-cristal-azul', 'Aretes con diseño de luna y cristales azules', 60, '/images/img-20251121-wa0250.jpg', (SELECT id FROM categories WHERE slug = 'aretes'), true, false),

-- 26. Aretes Gota Dorada con Cristales (Extra from list)
('Aretes Gota Dorada con Cristales', 'aretes-gota-dorada-con-cristales', 'Elegantes aretes en forma de gota con alambre dorado y cristales champagne', 75, '/images/aretes-gota-dorada-cristales.jpg', (SELECT id FROM categories WHERE slug = 'aretes'), true, true),

-- 27. Collar Perlas con Flor Lila
('Collar Perlas con Flor Lila', 'collar-perlas-flor-lila', 'Hermoso collar de perlas de doble capa con dije de flor lila', 95, '/images/collar-perlas-flor-lila.jpg', (SELECT id FROM categories WHERE slug = 'collares'), true, true),

-- 28. Aretes Mandala Negro Celeste
('Aretes Mandala Negro Celeste', 'aretes-mandala-negro-celeste', 'Espectaculares aretes tejidos en forma de mandala con cristales negros y celestes.', 85, '/images/lifestyle/lifestyle-aretes-mandala-negro-celeste.png', (SELECT id FROM categories WHERE slug = 'resplandor-estival'), true, true)

ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  category_id = EXCLUDED.category_id;
