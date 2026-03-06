-- =====================================================
-- SCRIPT PARA CONFIGURAR ADMIN - Nezus Bisutería
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- 1. Crear tabla admin_roles si no existe
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  permissions TEXT[] DEFAULT ARRAY['products', 'orders', 'users', 'reviews', 'coupons'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar Row Level Security
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- 3. Eliminar políticas existentes si hay
DROP POLICY IF EXISTS "Users can read own admin role" ON admin_roles;
DROP POLICY IF EXISTS "Admins can read all" ON admin_roles;

-- 4. Crear políticas de seguridad
CREATE POLICY "Users can read own admin role" ON admin_roles
  FOR SELECT USING (auth.uid() = user_id);

-- 5. Insertar admin para almanacenromeroj@gmail.com
INSERT INTO admin_roles (user_id, role, permissions)
SELECT 
  id,
  'admin',
  ARRAY['products', 'orders', 'users', 'reviews', 'coupons']
FROM auth.users
WHERE email = 'almanacenromeroj@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
  role = 'admin',
  permissions = ARRAY['products', 'orders', 'users', 'reviews', 'coupons'],
  updated_at = NOW();

-- 6. Verificar que se creó correctamente
SELECT 
  ar.id,
  ar.role,
  ar.permissions,
  u.email
FROM admin_roles ar
JOIN auth.users u ON ar.user_id = u.id;
