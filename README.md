# Nezus Bisutería - E-commerce de Lujo

![Nezus Banner](https://res.cloudinary.com/dn36m0jer/image/upload/v1771386096/nezus/products/img-20251121-wa0240.jpg)

> **Bisutería Artesanal Fina** - Plataforma concebida bajo estándares de alta costura (Swarovski/Dior) con un enfoque radical en seguridad, arquitectura escalable y estética premium.

## 🏗️ Arquitectura y Stack Tecnológico

La plataforma utiliza un stack moderno de alto rendimiento, optimizado para una experiencia de usuario (UX) fluida y una indexación SEO superior.

- **Framework:** Next.js 16 (App Router)
- **Renderizado:** Server-Side Rendering (SSR) e Incremental Static Regeneration (ISR) para catálogos ultrarrápidos.
- **Estilos:** Tailwind CSS v4 + Framer Motion para micro-animaciones con aceleración de hardware.
- **Base de Datos & Auth:** Supabase (PostgreSQL) con integración SSR profunda.
- **Infraestructura:** API Caching (`unstable_cache`) para optimización de consultas al catálogo.
- **Notificaciones:** Sistema automatizado de correos vía Nodemailer para confirmación de pedidos.

---

## 🔒 Postura de Seguridad (S1 - S8)

Tras una auditoría multidisciplinaria, el sitio implementa medidas de seguridad de nivel empresarial:

1.  **Content Security Policy (CSP):** Políticas restrictivas que mitigan riesgos de XSS e inyecciones de código.
2.  **Rate Limiting:** Sistema de limitación de tasa en APIs críticas (pagos, reseñas) para prevenir ataques de fuerza bruta y abuso.
3.  **Middleware de Protección:** Capa de interceptación centralizada para rutas de `/admin` y `/perfil`.
4.  **Validación de Entorno:** Sistema `fail-fast` que asegura la integridad de las llaves de API antes del arranque.
5.  **Seguridad en Pagos:** Validación estricta de archivos (MIME/Size) y vinculación determinista de comprobantes al ID del usuario autenticado.

---

## ✨ Filosofía de Diseño Premium (D1 - D9)

El diseño ha sido elevado para reflejar exclusividad y sofisticación:

- **Efecto Shimmer Dorado:** Skeletons personalizados y detalles en `#D4AF37` que emulan el brillo del oro y los diamantes.
- **Tipografía Editorial:** Ajustes de `letter-spacing` y `tracking` inspirados en marcas de lujo.
- **Navegación Fluida:** Transiciones de página cinematográficas (fade + slide) mediante `AnimatePresence`.
- **Detalles de Inmersión:** Cursor personalizado "Gold Dot" y degradados rosa sutiles en lugar de colores planos.
- **Resiliencia Visual:** Error Boundaries personalizados con UI elegante para fallos inesperados.

---

## 🚀 Guía de Desarrollo

### Requisitos Previos
- Node.js (v20+)
- Cuenta de Supabase con el esquema actualizado.
- Variables de entorno configuradas en `.env.local`.

### Instalación

1.  **Clonar e Instalar**
    ```bash
    git clone <repository_url>
    npm install
    ```

2.  **Configuración de Entorno**
    ```env
    NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_anonima
    EMAIL_USER=tu_correo_gmail
    EMAIL_PASS=tu_app_password_google
    ```

3.  **Ejecutar**
    ```bash
    npm run dev
    ```

---

## 🏗️ Estructura del Proyecto

- `/app` - Definiciones de rutas y APIs (Next.js App Router).
- `/components` - Componentes modulares (UI, Blocks, Layout).
- `/lib` - Utilidades de seguridad, validación de env, y clientes Supabase.
- `/public` - Assets estáticos y emblemas 3D corporativos.

---

*Diseñado bajo la visión de un equipo multidisciplinario senior para ofrecer la máxima sofisticación en joyería artesanal peruana.*
