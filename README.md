# 🛡️ SentinelCommerce — Storefront E-commerce & Backoffice Antifraude IA

Plataforma demostrativa que unifica en tiempo real una **Tienda Comercial (Storefront)** optimizada para conversión (con motor de **Cross-Selling SQL en vivo**) y un **Panel de Herramientas de Administrador (Backoffice)** con **Escudo Antifraude IA (`SecurityView`)** e **Inteligencia Comercial Geoespacial (`MarketingView`)**.

Diseñada bajo **Spec-Driven Development (SDD)**, **TDD Estricto**, **Atomic Design** y un **Theme Provider Global (`☀️ Modo Claro | 🌙 Modo Táctico`)** aplicable a elección en ambos perfiles.

---

## 🚀 Comandos del Proyecto

| Comando | Descripción |
| :--- | :--- |
| `npm install` | Instala todas las dependencias del proyecto. |
| `npm run dev` | Levanta el servidor de desarrollo interactivo con Vite. |
| `npm test` | Ejecuta la suite completa de tests unitarios y de integración en Vitest (`vitest run`). |
| `npm run test:watch` | Ejecuta Vitest en modo interactivo/watch para desarrollo TDD. |
| `npm run lint` | Verifica la compilación estricta de tipos con TypeScript (`tsc --noEmit`). |
| `npm run build` | Compila y empaqueta la aplicación para producción (`tsc -b && vite build`). |

---

## 🛠️ Tecnologías Utilizadas

### Frontend & Arquitectura Reactiva
- **React 19 + TypeScript (`~5.7`)**: Componentes tipados de forma estricta (cero `any`).
- **Vite 6**: Bundler ultrarrápido y entorno de desarrollo con HMR.
- **Tailwind CSS v4 (`@tailwindcss/vite`)**: Estilizado utilitario con variante personalizada `@custom-variant dark` para soporte de tema claro/oscuro por clase y simetría matemática en múltiplos de `4px` / `8px`.
- **Zustand 5**: Gestión de estado global desacoplada en dos stores (`useThemeStore` y `useCommerceStore`) con persistencia en `localStorage`.
- **Zod**: Contratos de datos cerrados y esquemas de validación en `src/contracts/commerce.schema.ts`.

### Visualización de Datos & Cartografía (Herramientas de Administrador)
- **Recharts**: Gráficos analíticos de área y barras para monitoreo de tráfico legítimo vs. bloqueado y evolución de ventas por hora.
- **Leaflet + React-Leaflet 5**: Mapa de calor geográfico interactivo que conmuta automáticamente sus tiles cartográficos entre **CartoDB Positron (Modo Claro)** y **CartoDB Dark Matter (Modo Táctico Oscuro)**.
- **Lucide React**: Iconografía semántica para señales comerciales y telemetría de seguridad.

### Backend & Persistencia SQL (Referencia Fullstack)
- **Laravel (PHP 8.3/8.4)**: Controlador analítico en `backend/app/Http/Controllers/CommerceAnalyticsController.php` con la consulta SQL de correlación histórica (`order_items` self-join) para el motor de Cross-Selling (`15% OFF`) y evaluación de riesgo en checkout.

### Calidad & Testing (Strict TDD)
- **Vitest 3 + jsdom**: Runner de tests unitarios y de integración.
- **React Testing Library + `@testing-library/user-event`**: Pruebas de comportamiento real del usuario de punta a punta.

---

## 🏗️ Arquitectura del Proyecto

El sistema implementa **Atomic Design** combinado con el patrón **Container / Presentational**, garantizando que los átomos y moléculas sean puramente visuales y reutilizables mientras las vistas y stores coordinan el estado de negocio.

```text
ecomerce/
├── Agent.md                                        # Especificación funcional base
├── .atl/
│   └── skill-registry.md                           # Catálogo de reglas SDD (spec-architect, worker-engineer, strict-judge)
├── backend/
│   └── app/Http/Controllers/
│       └── CommerceAnalyticsController.php         # Consultas SQL de Cross-Selling y scoring antifraude en Laravel
├── src/
│   ├── contracts/
│   │   └── commerce.schema.ts                      # Esquemas Zod y tipos estrictos (Product, TransactionRecord, ForensicReport)
│   ├── store/
│   │   ├── useThemeStore.ts                        # Tema global (light | dark), Role Switcher (client | admin) y pestañas Admin
│   │   ├── useCommerceStore.ts                     # Motor Cross-Selling (15% OFF), Simulador de Identidad, Forense IA y mitigación
│   │   └── __tests__/                              # Tests unitarios de stores y funciones puras
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── Button.tsx                          # Variantes cerradas: primary | secondary | success | danger
│   │   │   └── Badge.tsx                           # Etiquetas semánticas de estado, riesgo y descuentos
│   │   ├── molecules/
│   │   │   ├── RoleSwitcher.tsx                    # Conmutador Cliente/Admin + pestañas Admin + Toggle de Tema
│   │   │   ├── CrossSellingWidget.tsx              # Banner en vivo de correlación SQL con 15% OFF
│   │   │   └── IdentitySimulator.tsx               # Panel Demo: Legítimo | Estafador Ráfaga | Monto Anómalo
│   │   └── organisms/
│   │       ├── AppHeader.tsx                       # Cabecera principal diferenciada con estado de alertas activas
│   │       ├── AppFooter.tsx                       # Footer simple con estado de telemetría y stack
│   │       ├── LiveTransactionsTable.tsx           # Tabla en vivo con paginación adaptativa (3 en móvil / 10 en desktop)
│   │       ├── ForensicMitigationDrawer.tsx        # Drawer táctico con botón [🤖 Ejecutar Forense IA] y bloqueo/liberación
│   │       └── GeoSalesHeatmap.tsx                 # Mapa React-Leaflet con cambio automático de tiles Claro/Oscuro
│   ├── views/
│   │   ├── StorefrontView.tsx                      # Vista 0: Catálogo comercial, Cross-Selling y Checkout simulado
│   │   ├── SecurityView.tsx                        # Vista 1 (Admin): KPIs, Recharts, tabla en vivo y Drawer Forense IA
│   │   └── MarketingView.tsx                       # Vista 2 (Admin): Mapa de calor, conversión de combos y ventas por hora
│   └── __tests__/
│       └── AppIntegration.test.tsx                 # Suite de integración de punta a punta
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Decisiones Arquitectónicas Clave

1. **Tema Global Unificado (`light` / `dark`)**:
   - Controlado desde `useThemeStore` y persistido en `localStorage` (`sentinel_global_theme`).
   - Respeta la elección del usuario tanto en el **Storefront** como en el **Backoffice de Administrador**, sincronizando al instante la clase `.dark` del documento, las grillas de `Recharts` y las capas de `React-Leaflet`.
2. **Herramientas Centrales del Perfil Administrador**:
   - **Escudo de Fraude (`SecurityView.tsx`)**: Monitoreo de KPIs en vivo, curva comparativa de tráfico legítimo vs. bloqueado, tabla de auditoría con filtros de estado y **Drawer de Mitigación** capaz de ejecutar el dictamen **Forense IA** (vector de ataque, reglas disparadas, score de confianza) y bloquear o liberar transacciones.
   - **Inteligencia Comercial (`MarketingView.tsx`)**: Mapa de calor geográfico adaptativo, tasa de conversión de los combos de Cross-Selling del `15% OFF` y facturación horaria.
3. **Mobile-First & Simetría Matemática**:
   - Contenedores dinámicos con `h-fit` (sin alturas fijas que generen scroll fantasma).
   - **Paginación Adaptativa** en `LiveTransactionsTable.tsx`: muestra máximo **3 registros iniciales en móvil** (`md:hidden`) con botón desplegable `"Ver más / Ver menos"` y **10 registros en desktop** (`hidden md:block`).

---

## 🧪 Cómo Probar el Flujo Completo (Modo Demo Portfolio)

1. Ejecutá `npm run dev` y abrí la aplicación en el navegador.
2. En la vista **🛍️ Ver como Cliente (Tienda)**:
   - Explorá el catálogo o sumá el combo sugerido por el banner **"Frecuentemente comprados juntos (15% OFF)"**.
   - En el panel derecho (**Modo Demo: Simulador de Identidad en Checkout**), dispará una compra con:
     - **Comprar como Usuario Legítimo**
     - **Comprar como Estafador Ráfaga**
     - **Comprar con Monto Anómalo**
3. Cambiá en el Header a **🛡️ Ver como Administrador (Backoffice)**:
   - En **Escudo de Fraude**, seleccioná la transacción recién creada, pulsá **`🤖 Ejecutar Forense IA`** dentro del Drawer de Mitigación y probá bloquear la amenaza (`Bloquear Amenaza / IP`) o aprobarla (`Liberar / Falso Positivo`).
   - Cambiá a la pestaña **Inteligencia Comercial** y alterná el botón **`☀️ Modo Claro / 🌙 Modo Táctico`** para observar cómo el mapa de calor `React-Leaflet` y las métricas de conversión se actualizan en tiempo real.
