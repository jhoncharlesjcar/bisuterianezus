# 🛡️ Nezus - Arquitectura de Software & Guía del Proyecto
**Documentación Técnica de Alto Nivel para Ingenieros Senior**

---

## 1. Visión General
**Nezus** es una plataforma de comercio electrónico de lujo especializada en bisutería artesanal fina. El sistema está diseñado sobre una arquitectura moderna y escalable que prioriza la **experiencia de usuario premium**, la **seguridad** y el **rendimiento**.

## 2. Stack Tecnológico (The Power Stack)

### Core Framework
- **Next.js 16 (App Router)**: Motor principal de la aplicación, utilizando Server Components para SEO y Client Components para interactividad compleja.
- **React 19**: Aprovechando las últimas mejoras en el manejo de estado y componentes.
- **TypeScript**: Estricto tipado para garantizar la robustez del código y facilitar el mantenimiento.

### Backend & Database
- **Supabase**: Backend-as-a-Service (BaaS) que proporciona:
  - **PostgreSQL**: Base de datos relacional para productos, pedidos y perfiles.
  - **Supabase Auth**: Manejo seguro de sesiones y autenticación de usuarios.
  - **Storage**: Gestión de activos multimedia (con integración de Cloudinary para optimización).
- **Edge Computing**: Lógica de servidor optimizada para baja latencia.

### UI & Styling
- **Tailwind CSS**: Diseño atómico y responsivo con utilidades de bajo nivel.
- **Radix UI**: Componentes de interfaz accesibles y sin estilo (Headless UI).
- **Framer Motion**: Orquestación de animaciones fluidas y micro-interacciones de lujo.
- **Lucide Icons**: Set de iconos vectoriales consistentes.

## 3. Arquitectura del Proyecto

El proyecto sigue un patrón de **Modular Feature-Based Architecture**, lo que permite separar las preocupaciones de negocio de la infraestructura de routing.

### Estructura de Directorios
```bash
├── app/                  # NEXT.JS APP ROUTER
│   ├── api/              # Endpoints del servidor (Next.js API Routes)
│   ├── (auth)/           # Rutas de autenticación (Login, Registro)
│   ├── tienda/           # Catálogo y listado de productos
│   └── layout.tsx        # Layout raíz y proveedores globales
│
├── features/             # LÓGICA DE NEGOCIO MODULAR
│   ├── products/         # Componentes y hooks de catálogo
│   ├── cart/             # Gestión de carrito y checkout
│   ├── brand/            # Componentes de identidad (Hero, About, Promotions)
│   └── auth/             # Componentes de usuario y perfil
│
├── components/           # COMPONENTES REUTILIZABLES
│   ├── ui/               # Componentes base (Botones, Inputs, Modales - shadcn)
│   └── layout/           # Header, Footer y elementos estructurales
│
├── lib/                  # NÚCLEO Y UTILIDADES
│   ├── supabase/         # Configuración y clientes de base de datos
│   ├── contexts/         # Estado global (Auth, Cart, Wishlist)
│   └── utils.ts          # Helpers y lógica compartida
│
└── supabase/             # INFRAESTRUCTURA DE DATOS
    ├── migrations/       # Cambios de esquema controlados
    └── seed.sql          # Datos iniciales para desarrollo
```

## 4. Flujos Clave del Sistema

### Flujo de Datos (Data Fetching)
1. **Server Side**: Las páginas de productos utilizan `Server Components` para consultar Supabase directamente, optimizando el tiempo de carga y el SEO.
2. **Client Side**: La gestión del carrito y el perfil de usuario se manejan mediante `React Context`, sincronizando con `localStorage` y la API de Supabase en tiempo real.

### Ciclo de Compra
- **Descubrimiento**: Catálogo dinámico con filtros por categoría.
- **Interacción**: Motor de búsqueda optimizado y lista de deseos persistente.
- **Conversión**: El carrito de compras se integra con un flujo de **confirmación vía WhatsApp**, permitiendo una atención personalizada y segura para el mercado peruano.

## 5. Principios de Ingeniería Aplicados

- **Performance First**: Optimización de imágenes (LCP) y uso extensivo de `next/image`.
- **Typing Safety**: Definición de interfaces globales en `lib/types.ts` para evitar errores en tiempo de ejecución.
- **Responsive Mastery**: Diseño adaptativo "Mobile-First" con breakpoints específicos para una navegación fluida en cualquier dispositivo.
- **SEO Optimization**: Generación dinámica de metadatos y sitemap jerárquico.

---
> **Nota del Master Engineer**: Este proyecto está construido para evolucionar. La modularidad en `features/` permite añadir nuevas capacidades (como integración de pagos directos o sistemas de fidelidad) sin afectar la estabilidad del núcleo existente.
