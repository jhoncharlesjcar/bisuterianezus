# 🔄 Flujos del Proyecto - Nezus
**Representación Visual de Procesos Clave**

---

## 1. Flujo de Compra (Checkout via WhatsApp)
Este flujo describe el camino desde que un usuario descubre un producto hasta que concreta la compra mediante una atención personalizada.

```mermaid
graph TD
    A[Inicio: Navegación en Tienda] --> B{¿Producto de interés?}
    B -- Sí --> C[Ver Detalle de Producto]
    C --> D[Añadir a la Bolsa]
    D --> E[Abrir Carrito / CartSheet]
    E --> F{¿Supera S/100?}
    F -- No --> G[Sugerencia de Envío Gratis]
    F -- Sí --> H[Indicador de Envío Gratis Aplicado]
    G --> I[Continuar Comprando]
    I --> A
    H --> J[Clic: Comprar por WhatsApp]
    J --> K[Generación de Mensaje Detallado]
    K --> L[Redirección a API WhatsApp]
    L --> M[Atención Personalizada & Cierre de Venta]
```

---

## 2. Flujo de Autenticación y Registro
Gestión de identidad de usuario utilizando Supabase Auth y sincronización de perfiles.

```mermaid
graph LR
    A[Usuario Nuevo] --> B[Registro / SignUp]
    B --> C[Supabase Auth Create User]
    C --> D[Insertar en Tabla 'profiles']
    D --> E[Enviar Email de Verificación]
    E --> F[Confirmación]
    
    G[Usuario Existente] --> H[Login / SignIn]
    H --> I[Supabase Auth Verify Credentials]
    I --> J{¿Éxito?}
    J -- Sí --> K[Actualizar AuthContext]
    K --> L[Cargar Perfil desde DB]
    J -- No --> M[Mostrar Error]
```

---

## 3. Flujo de Sincronización de Datos (System Flow)
Cómo fluye la información entre el servidor, la base de datos y la interfaz de usuario.

```mermaid
sequenceDiagram
    participant U as Usuario (Browser)
    participant C as Client Component (React)
    participant S as Server Component (Next.js)
    participant DB as Supabase (DB/Auth)

    U->>S: Request Page (e.g., /tienda)
    S->>DB: Fetch Products (Direct Access)
    DB-->>S: Real-time Data
    S-->>U: Rendered HTML (High Performance)
    U->>C: Interaction (Add to Cart)
    C->>DB: Auth Check / Analytics
    DB-->>C: Session Info
    C->>U: Update Local State (Framer Motion UI)
```

---

## 4. Estructura de Navegación (Site Map)
- **Home (`/`)**: Hero, Categorías, Productos Destacados, Nosotros, Testimonios.
- **Tienda (`/tienda`)**: Catálogo completo con filtros dinámicos.
- **Producto (`/producto/[id]`)**: Detalle, Galería, Opiniones.
- **Perfil (`/perfil`)**: Mis Pedidos, Favoritos, Ajustes.
- **Admin (`/admin`)**: Dashboard de gestión (Acceso Restringido).
