# 💎 Nezus Bisutería Artesanal Fina

> **Plataforma E-commerce de Lujo** construida con Next.js 16, React 19 y Supabase.

---

## 🚀 Tecnologías Principales

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS.
- **Backend/DB**: Supabase (PostgreSQL, Auth, Storage).
- **Animaciones**: Framer Motion (Experiencia Premium).
- **UI Components**: Radix UI + Lucide Icons.
- **Integración**: Checkout personalizado vía WhatsApp.

---

## 📂 Estructura del Proyecto

```bash
├── app/          # Rutas y Endpoints (App Router)
├── features/     # Módulos de Negocio (Cart, Products, Auth)
├── components/   # Reutilizables (UI, Layout)
├── lib/          # Configuración, Contextos y Utils
└── public/       # Activos Estáticos
```

---

## 🛠️ Configuración de Desarrollo

1. **Clonar el repositorio.**
2. **Instalar dependencias**:
   ```bash
   npm install
   ```
3. **Configurar variables de entorno**:
   Crea un archivo `.env.local` con las credenciales de Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
   ```
4. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

---

## 🏗️ Arquitectura y Flujos

Para una visión profunda del sistema, consulta nuestra documentación especializada:
- 📑 **[Guía de Arquitectura](file:///C:/Users/Usuario/.gemini/antigravity/brain/5f20461e-2e06-40b5-8b0c-57488a4ea477/arquitectura_nezus.md)**: Detalle del stack y decisiones de ingeniería.
- 🔄 **[Diagramas de Flujo](file:///C:/Users/Usuario/.gemini/antigravity/brain/5f20461e-2e06-40b5-8b0c-57488a4ea477/flujos_proyecto.md)**: Visualización de procesos de compra y autenticación.

---

## ✒️ Autoría
Diseñado y Desarrollado por **Jcar Labs** para Nezus.
