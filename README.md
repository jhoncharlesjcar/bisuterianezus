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

## ✨ Refinamientos Recientes (v1.2)

Se han implementado mejoras estéticas para elevar la percepción premium de la marca:
- **Footer de Lujo**: Logo "NEZUS" en fuente serif (Playfair Display) con tracking optimizado.
- **Iconografía Social**: Rediseño de iconos (FB, IG, TikTok) en contenedores circulares minimalistas con inversión de color al pasar el cursor.
- **Interacción Estándar**: Restablecimiento del cursor del sistema con respuesta visual (puntero/manito) en elementos interactivos (botones e imágenes).
- **Limpieza de UI**: Simplificación de la barra inferior y actualización de geolocalización.

---

## 🏗️ Arquitectura y Documentación

Para una visión profunda del sistema, consulta nuestra documentación:
- 📑 **[Guía de Arquitectura](file:///C:/Users/Usuario/.gemini/antigravity/brain/5f20461e-2e06-40b5-8b0c-57488a4ea477/arquitectura_nezus.md)**: Detalle del stack y decisiones de ingeniería.
- 🔄 **[Último Walkthrough](file:///C:/Users/Usuario/.gemini/antigravity/brain/f460a5a4-95f2-41f2-88ce-da6f79795324/walkthrough.md)**: Historial de cambios rercientes en el diseño del footer y cursor.

---

## ✒️ Autoría
Diseñado y Desarrollado por **Jcar Labs** para Nezus.
