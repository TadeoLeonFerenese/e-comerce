## 2. Reglas Estrictas de UI/UX (Arquitectura Dual de Temas)

El sistema debe implementar un **Theme Provider (Light / Dark Mode)** gestionado con Zustand y clases de Tailwind (`dark:`), aplicando psicología del color según el contexto de uso:

### A. Vista Tienda / Storefront (Modo Claro por Defecto - Psicología Comercial)

- **Objetivo**: Maximizar la conversión, confianza del comprador y lectura limpia del catálogo (estilo Mercado Libre / Tiendanube moderna).
- **Paleta Comercial (Light Mode)**:
  - Fondo Principal: `#f8fafc` (Slate 50 - Gris ultra claro para no cansar la vista) y `#ffffff` (Blanco puro) para las tarjetas de producto.
  - Acento Principal (Call to Action / Comprar): `#2563eb` (Azul Real vibrante - transmite seguridad financiera) o `#f97316` (Naranja energético para ofertas y Cross-Selling).
  - Señales de Confianza: `#16a34a` (Verde intenso para "Envío Gratis", "En Stock" y "Compra Protegida").
- **Layout Comercial**: Simétrico, tarjetas con bordes suaves (`rounded-xl`), sombras sutiles de elevación (`shadow-sm hover:shadow-md`), buscador prominente arriba y un widget de **"Frecuentemente comprados juntos"** (alimentado en vivo por el motor SQL de Cross-Selling) debajo de cada producto.

### B. Vista Backoffice / Panel Analítico (Tema Configurable desde el Perfil)

- **Selector de Tema**: En el menú de Perfil o en la barra superior del administrador, incluir un toggle `[☀️ Modo Claro | 🌙 Modo Táctico]` persistido en LocalStorage.
- **Modo Claro Administrativo**: Fondos blancos/grises limpios con gráficos de alto contraste (ideal para oficinas iluminadas y presentaciones comerciales de mercadotecnia).
- **Modo Oscuro Administrativo (Dark Táctico)**: Fondo `#09090b`, tarjetas `#121215` con bordes finos de `1px solid #27272a` y alertas en rojo/ámbar (ideal para monitoreo continuo de seguridad y lectura de mapas de calor sin fatiga visual).

---

## 6. Estructura de Vistas y Componentes (Frontend React)

El Header principal tendrá un ** Conmutador de Rol (Role Switcher)** bien visible para la demo del portfolio: `[🛍️ Ver como Cliente (Tienda)]` vs `[🛡️ Ver como Administrador (Backoffice)]`.

1. **Vista 0: Storefront E-commerce (`StorefrontView.tsx`) - [NUEVO]**
   - **Catálogo Dinámico**: Grilla simétrica de productos con filtros por categoría.
   - **Sección de Cross-Selling en Vivo**: Al abrir un producto o el carrito, el sistema consulta a Laravel qué productos tienen mayor correlación histórica y muestra el cartel: _"¡Llevá también [Producto B] con 15% OFF! El 68% de los usuarios los compran juntos"_.
   - **Checkout con Simulador de Identidad**: En el carrito, además del botón "Comprar ahora", agregar un pequeño panel de pruebas (_"Modo Demo: Comprar como Usuario Legítimo / Comprar como Estafador Ráfaga / Comprar con Monto Anómalo"_) para que el reclutador pueda disparar la compra desde la tienda brillante y ver cómo impacta en el panel de seguridad.

2. **Vista 1: Backoffice - Escudo de Fraude (`SecurityView.tsx`)**
   - KPIs superiores, gráfico de tráfico legítimo vs bloqueado (`Recharts`), tabla de transacciones en vivo y Drawer de Mitigación con el botón `[🤖 Ejecutar Forense IA]` y acciones de bloqueo.

3. **Vista 2: Backoffice - Inteligencia Comercial (`MarketingView.tsx`)**
   - Mapa de calor geográfico (`React-Leaflet` adaptando sus tiles automáticamente según si el admin eligió tema claro u oscuro), métricas de conversión de los combos de Cross-Selling y gráfico de ventas por hora.
