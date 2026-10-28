import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';
import { useThemeStore } from '../store/useThemeStore';
import { useCommerceStore } from '../store/useCommerceStore';
import { useAuthStore } from '../store/useAuthStore';
import { DARK_TILE_URL, LIGHT_TILE_URL } from '../components/organisms/GeoSalesHeatmap';

// Mock liviano para el contenedor DOM de Leaflet en jsdom preservando la verificación de tiles y nodos
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-leaflet-map">{children}</div>
  ),
  TileLayer: ({ url }: { url: string }) => (
    <div data-testid="mock-leaflet-tile" data-url={url} />
  ),
  CircleMarker: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-leaflet-marker">{children}</div>
  ),
  Polygon: () => <div data-testid="mock-leaflet-polygon" />,
  Polyline: () => <div data-testid="mock-leaflet-polyline" />,
  Tooltip: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-leaflet-tooltip">{children}</div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('App Integration — Storefront, Identity Simulator & Administrator Tools', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove('dark');
    useAuthStore.getState().resetAuthState();
    useThemeStore.getState().resetThemeState();
    useCommerceStore.getState().resetCommerceStore();
  });

  it('enforces OpSec in Navbar, toggles Light/Dark theme inside Mi Configuración, and unlocks Backoffice only after Admin Login', async () => {
    const user = userEvent.setup();
    render(<App />);

    // 1. Verificación OpSec en Navbar: muestra "Escudo IA Activo", sin "Motor SQL" ni switcher público
    expect(screen.getByText(/Escudo IA Activo/i)).toBeInTheDocument();
    expect(screen.queryByText(/Motor SQL Cross-Selling/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Admin Backoffice/i })
    ).not.toBeInTheDocument();

    // 2. Abre el apartado "Mi Configuración" y alterna Modo Claro -> Modo Oscuro
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    await user.click(screen.getByRole('button', { name: /Mi Configuración/i }));

    const configPanel = screen.getByRole('region', { name: /Panel de Mi Configuración/i });
    expect(within(configPanel).getByText(/☀️ Modo Claro/i)).toBeInTheDocument();

    // Un visitante no autenticado jamás ve opciones de Backoffice dentro de Mi Configuración
    expect(
      within(configPanel).queryByRole('button', { name: /Admin Backoffice/i })
    ).not.toBeInTheDocument();

    await user.click(
      within(configPanel).getByRole('button', { name: /Alternar tema claro u oscuro/i })
    );
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(within(configPanel).getByText(/🌙 Modo Oscuro/i)).toBeInTheDocument();

    // 3. Inicia sesión como Administrador desde Mi Configuración
    await user.click(within(configPanel).getByRole('button', { name: /Iniciar Sesión/i }));
    const loginModal = screen.getByRole('dialog', {
      name: /Iniciar sesión en SentinelCommerce/i,
    });
    await user.click(within(loginModal).getByRole('button', { name: /Entrar como Admin/i }));

    // 4. Abre nuevamente Mi Configuración (ahora logueado como Tadeo SuperAdmin) y entra al Backoffice
    await user.click(screen.getByRole('button', { name: /Mi Configuración/i }));
    await user.click(
      screen.getByRole('button', { name: /Admin Backoffice/i })
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(
      screen.getByText(/Tráfico Legítimo vs\. Intentos Bloqueados/i)
    ).toBeInTheDocument();

    // Verifica que el navbar (banner) y el footer simple (contentinfo) estén presentes
    expect(screen.getByRole('banner')).toBeInTheDocument();
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveTextContent(/SentinelCommerce/i);
  });

  it('triggers simulated Burst Fraudster checkout from Storefront and audits/blocks it in Admin SecurityView', async () => {
    const user = userEvent.setup();
    useAuthStore.getState().login('admin@sentinel.com', 'admin123');
    render(<App />);

    // Verifica que el widget de Cross-Selling en vivo esté presente con 15% OFF, 68% y foto real
    const crossSellRegion = screen.getByRole('region', {
      name: /Frecuentemente comprados juntos/i,
    });
    expect(crossSellRegion).toHaveTextContent(
      /¡Llevá también Fuente Modular 1000W 80 Plus Gold ATX 3\.0 con 15% OFF! El 68% de los usuarios los compran juntos/i
    );
    expect(
      within(crossSellRegion).getByRole('img', { name: /Fuente Modular 1000W 80 Plus Gold ATX 3\.0/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /Placa de Video RTX 4080 Super 16GB GDDR6X/i })
    ).toBeInTheDocument();

    // Suma el combo de Cross-Selling y dispara compra como Estafador Ráfaga
    await user.click(screen.getByRole('button', { name: /Sumar Combo 15% OFF/i }));
    await user.click(
      screen.getByRole('button', { name: /Comprar como Estafador Ráfaga/i })
    );

    // Aparece el banner de alerta y navegamos a las herramientas del Administrador
    expect(screen.getByRole('status')).toHaveTextContent(/Alerta generada/i);
    await user.click(screen.getByRole('button', { name: /Ir al Escudo de Fraude/i }));

    // Estamos en SecurityView con la transacción recién disparada abierta en el Drawer de Mitigación
    expect(
      screen.getByLabelText(/Drawer de Mitigación y Forense IA/i)
    ).toBeInTheDocument();

    // Ejecutamos el Forense IA
    await user.click(screen.getByRole('button', { name: /🤖 Ejecutar Forense IA/i }));
    const forensicRegion = screen.getByRole('region', {
      name: /Resultado del Dictamen Forense IA/i,
    });
    expect(within(forensicRegion).getByText(/Ataque de Ráfaga Automatizada/i)).toBeInTheDocument();

    // Bloqueamos la amenaza desde el Drawer y verificamos que el KPI de bloqueos suba de 1 a 2
    expect(screen.getByTestId('kpi-blocked-count')).toHaveTextContent('1 bloqueos');
    await user.click(screen.getByRole('button', { name: /Bloquear Amenaza \/ IP/i }));
    expect(screen.getByTestId('kpi-blocked-count')).toHaveTextContent('2 bloqueos');
  });

  it('switches to Admin MarketingView and adapts React-Leaflet tiles automatically when toggling theme', async () => {
    const user = userEvent.setup();
    useAuthStore.getState().login('admin@sentinel.com', 'admin123');
    render(<App />);

    // Ir a Mi Configuración -> Inteligencia Comercial
    await user.click(screen.getByRole('button', { name: /Mi Configuración/i }));
    await user.click(
      screen.getByRole('button', { name: /Inteligencia Comercial/i })
    );

    const heatmapWrapper = screen.getByTestId('leaflet-heatmap-wrapper');
    expect(heatmapWrapper).toHaveAttribute('data-tile-url', LIGHT_TILE_URL);

    // Verifica que la API del Mapa muestre las Zonas de Comercio y el Producto Líder por zona
    expect(screen.getByText(/API Geo-Comercial: Zonas & Productos Líderes/i)).toBeInTheDocument();
    const zoneDetailRegion = screen.getByRole('region', {
      name: /Detalle de Zona Comercial y Producto Líder/i,
    });
    expect(
      within(zoneDetailRegion).getByText(/CABA — Polo Tecnológico/i)
    ).toBeInTheDocument();
    expect(
      within(zoneDetailRegion).getByText(/Placa de Video RTX 4080 Super 16GB GDDR6X/i)
    ).toBeInTheDocument();

    // Alternar a Modo Oscuro desde Mi Configuración y verificar que los tiles cambien a DARK_TILE_URL
    await user.click(screen.getByRole('button', { name: /Mi Configuración/i }));
    await user.click(screen.getByRole('button', { name: /Alternar tema claro u oscuro/i }));
    expect(screen.getByTestId('leaflet-heatmap-wrapper')).toHaveAttribute(
      'data-tile-url',
      DARK_TILE_URL
    );
  });

  it('navigates seamlessly to Mercado Libre style Product Detail Page (PDP) and operates Cart Drawer from Navbar', async () => {
    const user = userEvent.setup();
    render(<App />);

    // 1. Navbar muestra el botón de Carrito
    const cartButton = screen.getByRole('button', {
      name: /Ver carrito de compras/i,
    });
    expect(cartButton).toBeInTheDocument();

    // 2. Click en una tarjeta de producto del catálogo para navegar a la PDP
    const productCard = screen.getByRole('heading', {
      name: /Placa de Video RTX 4080 Super 16GB GDDR6X/i,
    });
    await user.click(productCard);

    // 3. Verifica elementos de la PDP estilo Mercado Libre
    expect(
      screen.getByRole('button', { name: /Volver al listado/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Nuevo \| \+100 vendidos/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Lo que tenés que saber de este producto/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Llega gratis mañana/i)).toBeInTheDocument();
    expect(screen.getByText(/Stock disponible/i)).toBeInTheDocument();

    // 4. Selector de imágenes en miniatura (thumbnails)
    const thumbnail2 = screen.getByRole('button', {
      name: /Ver imagen 2 de Placa de Video RTX 4080 Super 16GB GDDR6X/i,
    });
    await user.click(thumbnail2);
    expect(thumbnail2).toHaveClass('border-blue-600');

    // 5. Agregar al carrito desde el Buy Box
    await user.click(screen.getByRole('button', { name: /Agregar al carrito/i }));

    // 6. El Cart Drawer se abre automáticamente y el badge del navbar se actualiza
    const cartDialog = screen.getByRole('dialog', { name: /Carrito de compras/i });
    expect(cartDialog).toBeInTheDocument();
    expect(within(cartDialog).getByText(/Tu Carrito \(1\)/i)).toBeInTheDocument();
    expect(screen.getByTestId('navbar-cart-badge')).toHaveTextContent('1');

    // 7. Modificar cantidad dentro del Cart Drawer
    await user.click(within(cartDialog).getByRole('button', { name: /Sumar una unidad/i }));
    expect(within(cartDialog).getByText(/Tu Carrito \(2\)/i)).toBeInTheDocument();
    expect(screen.getByTestId('navbar-cart-badge')).toHaveTextContent('2');

    // 8. Cerrar Cart Drawer y volver al catálogo usando el breadcrumb
    await user.click(within(cartDialog).getByRole('button', { name: /Cerrar carrito/i }));
    expect(screen.queryByRole('dialog', { name: /Carrito de compras/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Volver al listado/i }));
    expect(
      screen.getByRole('heading', { name: /Todos los Productos/i })
    ).toBeInTheDocument();
  });
});
