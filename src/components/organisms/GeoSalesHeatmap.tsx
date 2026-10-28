import React from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polygon,
  Polyline,
  Tooltip,
} from 'react-leaflet';
import { MapPin, Package, RefreshCw, Flame, Layers } from 'lucide-react';
import type {
  GeoCommercialZone,
  ThemeMode,
  TransactionRecord,
} from '../../contracts/commerce.schema';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';

export interface GeoSalesHeatmapProps {
  theme: ThemeMode;
  transactions: TransactionRecord[];
  geoZones: GeoCommercialZone[];
  selectedZoneId: string;
  onSelectZone: (zoneId: string) => void;
  onRefreshZones: () => void;
}

export const LIGHT_TILE_URL =
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
export const DARK_TILE_URL =
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png?mode=dark';

const TRANSPARENT_TILE_FALLBACK =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/**
 * Contorno geográfico vectorial real de Argentina (latitud, longitud)
 * Garantiza que el mapa sea 100% visible, navegable y preciso incluso detrás de firewalls corporativos que bloquean servidores de tiles externos.
 */
const ARGENTINA_BORDER_COORDS: [number, number][] = [
  [-21.78, -66.22], // Jujuy / Límite Norte
  [-22.05, -63.68], // Salta / Tartagal
  [-23.88, -60.82], // Formosa Oeste
  [-25.28, -57.64], // Clorinda / Asunción
  [-27.36, -55.89], // Posadas
  [-25.60, -54.57], // Iguazú
  [-27.15, -53.85], // Misiones Este
  [-30.18, -57.62], // Monte Caseros / Río Uruguay
  [-33.01, -58.51], // Gualeguaychú
  [-34.45, -58.50], // Delta / AMBA Norte
  [-34.60, -58.38], // Buenos Aires (CABA)
  [-35.45, -57.12], // Punta Indio / Bahía Samborombón
  [-36.69, -56.67], // San Clemente / Costa Atlántica
  [-38.00, -57.54], // Mar del Plata
  [-38.88, -60.52], // Tres Arroyos / Claromecó
  [-38.72, -62.26], // Bahía Blanca
  [-40.81, -62.99], // Viedma / Carmen de Patagones
  [-42.76, -65.03], // Puerto Madryn / Península Valdés
  [-45.86, -67.49], // Comodoro Rivadavia
  [-47.75, -65.90], // Puerto Deseado
  [-51.62, -69.21], // Río Gallegos
  [-54.80, -68.30], // Ushuaia / Tierra del Fuego
  [-52.30, -71.90], // Cordillera Austral
  [-45.57, -71.75], // Perito Moreno / Andes Patagónicos
  [-41.13, -71.31], // Bariloche
  [-38.95, -71.10], // Neuquén Cordillera
  [-32.89, -70.05], // Paso Cristo Redentor (Mendoza)
  [-29.90, -69.85], // San Juan Cordillera
  [-27.10, -68.55], // Catamarca Cordillera
  [-24.20, -68.10], // Salta / Socompa
];

const URUGUAY_BORDER_COORDS: [number, number][] = [
  [-30.18, -57.62],
  [-30.90, -55.55],
  [-32.65, -53.38],
  [-34.90, -54.95], // Punta del Este
  [-34.90, -56.16], // Montevideo
  [-34.45, -57.84], // Colonia
  [-33.01, -58.51],
];

const BUENOS_AIRES_PROVINCE_COORDS: [number, number][] = [
  [-33.28, -60.32],
  [-34.45, -58.50],
  [-34.60, -58.38],
  [-35.45, -57.12],
  [-36.69, -56.67],
  [-38.00, -57.54],
  [-38.88, -60.52],
  [-38.72, -62.26],
  [-40.81, -62.99],
  [-39.00, -63.38],
  [-34.38, -63.38],
];

const LOGISTICS_CORRIDORS: { id: string; name: string; points: [number, number][] }[] = [
  {
    id: 'rn-9',
    name: 'Corredor RN9 (CABA → Rosario → Córdoba)',
    points: [
      [-34.6037, -58.3816],
      [-32.9442, -60.6505],
      [-31.4201, -64.1888],
    ],
  },
  {
    id: 'rn-7',
    name: 'Corredor Bioceánico RN7 (CABA → Mendoza)',
    points: [
      [-34.6037, -58.3816],
      [-33.3017, -66.3378],
      [-32.8895, -68.8458],
    ],
  },
  {
    id: 'rn-2',
    name: 'Autovía RN2 (CABA → Mar del Plata)',
    points: [
      [-34.6037, -58.3816],
      [-38.0055, -57.5426],
    ],
  },
  {
    id: 'corredor-centro',
    name: 'Eje Central (Córdoba ↔ Mendoza)',
    points: [
      [-31.4201, -64.1888],
      [-32.8895, -68.8458],
    ],
  },
];

export function resolveLeafletTileUrl(theme: ThemeMode): string {
  return theme === 'dark' ? DARK_TILE_URL : LIGHT_TILE_URL;
}

export const GeoSalesHeatmap: React.FC<GeoSalesHeatmapProps> = ({
  theme,
  transactions,
  geoZones,
  selectedZoneId,
  onSelectZone,
  onRefreshZones,
}) => {
  const tileUrl = resolveLeafletTileUrl(theme);
  const activeZone =
    geoZones.find((z) => z.zoneId === selectedZoneId) ?? geoZones[0] ?? null;

  return (
    <section
      aria-label="Mapa de Calor Geográfico de Ventas y Seguridad"
      className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-[#27272a] rounded-xl p-3.5 sm:p-6 shadow-sm flex flex-col gap-4 h-fit"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 h-fit">
        <div className="h-fit">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#f97316]" />
            <span>API Geo-Comercial: Zonas &amp; Productos Líderes</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Endpoint <code className="font-mono text-[#2563eb]">GET /api/analytics/geo-zones</code> · Tiles:{' '}
            {theme === 'dark' ? 'Cartografía Híbrida Táctica Oscura' : 'Cartografía Híbrida Comercial Clara'}
          </p>
        </div>

        <div className="flex items-center gap-2 h-fit">
          <Badge variant={theme === 'dark' ? 'primary' : 'secondary'}>
            Tiles: {theme === 'dark' ? 'Modo Táctico Oscuro' : 'Modo Claro Comercial'}
          </Badge>
          <Button size="sm" variant="secondary" onClick={onRefreshZones}>
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sincronizar API</span>
          </Button>
        </div>
      </div>

      {/* Mapa Interactivo React-Leaflet con Cartografía Vectorial Resiliente + Tiles OSM */}
      <div
        data-testid="leaflet-heatmap-wrapper"
        data-tile-url={tileUrl}
        className={`w-full h-80 rounded-xl overflow-hidden border border-slate-200 dark:border-[#27272a] ${
          theme === 'dark'
            ? '[&_.leaflet-container]:!bg-[#0c1424] [&_.leaflet-tile-pane]:invert [&_.leaflet-tile-pane]:hue-rotate-180 [&_.leaflet-tile-pane]:brightness-95 [&_.leaflet-tile-pane]:contrast-90'
            : '[&_.leaflet-container]:!bg-[#dbeafe]'
        }`}
      >
        <MapContainer
          center={[-34.2, -62.5]}
          zoom={5}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            key={tileUrl}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'
            url={tileUrl}
            errorTileUrl={TRANSPARENT_TILE_FALLBACK}
            opacity={0.75}
          />

          {/* Base Cartográfica Vectorial de Argentina y Uruguay (garantiza visibilidad 100% aún con proxy corporativo) */}
          <Polygon
            positions={URUGUAY_BORDER_COORDS}
            pathOptions={{
              color: theme === 'dark' ? '#334155' : '#94a3b8',
              fillColor: theme === 'dark' ? '#18181b' : '#f1f5f9',
              fillOpacity: 0.55,
              weight: 1,
            }}
          />
          <Polygon
            positions={ARGENTINA_BORDER_COORDS}
            pathOptions={{
              color: theme === 'dark' ? '#38bdf8' : '#2563eb',
              fillColor: theme === 'dark' ? '#1e293b' : '#f8fafc',
              fillOpacity: 0.65,
              weight: 1.8,
            }}
          />
          <Polygon
            positions={BUENOS_AIRES_PROVINCE_COORDS}
            pathOptions={{
              color: theme === 'dark' ? '#475569' : '#94a3b8',
              fillColor: theme === 'dark' ? '#0f172a' : '#e2e8f0',
              fillOpacity: 0.35,
              weight: 1,
              dashArray: '4 4',
            }}
          />

          {/* Rutas Nacionales Comerciales (RN9, RN7, RN2) */}
          {LOGISTICS_CORRIDORS.map((corridor) => (
            <Polyline
              key={corridor.id}
              positions={corridor.points}
              pathOptions={{
                color: theme === 'dark' ? '#60a5fa' : '#3b82f6',
                weight: 2,
                opacity: 0.65,
                dashArray: '6 6',
              }}
            />
          ))}

          {/* Marcadores de Zonas Comerciales y Producto Estrella */}
          {geoZones.map((zone) => {
            const isSelected = zone.zoneId === activeZone?.zoneId;
            const color =
              zone.demandIntensity === 'alta'
                ? '#f97316'
                : zone.demandIntensity === 'media'
                  ? '#2563eb'
                  : '#16a34a';
            const radius = isSelected ? 22 : 15;

            return (
              <CircleMarker
                key={zone.zoneId}
                center={zone.coordinates}
                radius={radius}
                eventHandlers={{
                  click: () => onSelectZone(zone.zoneId),
                }}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: isSelected ? 0.75 : 0.45,
                  weight: isSelected ? 3.5 : 2,
                }}
              >
                <Tooltip
                  permanent
                  direction="top"
                  offset={[0, -10]}
                  opacity={0.95}
                >
                  <span className="font-bold text-[11px]">
                    {zone.city} {isSelected ? '★' : ''}
                  </span>
                </Tooltip>
                <Popup>
                  <div className="text-xs space-y-1">
                    <p className="font-bold">{zone.zoneName}</p>
                    <p>
                      <strong>Producto Líder:</strong> {zone.topProduct}
                    </p>
                    <p>
                      <strong>Combo Frecuente:</strong> {zone.companionProduct}
                    </p>
                    <p>
                      <strong>Volumen:</strong> ${zone.totalVolume.toLocaleString('es-AR')} ({zone.ordersCount} pedidos)
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

          {/* Nodos de transacciones recientes superpuestos */}
          {transactions.map((tx) => {
            const isHighRisk = tx.status !== 'approved';
            const color = isHighRisk ? '#e11d48' : '#16a34a';
            return (
              <CircleMarker
                key={tx.id}
                center={tx.coordinates}
                radius={7}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.85,
                  weight: 1,
                }}
              >
                <Popup>
                  <div className="text-xs">
                    <strong>{tx.city}</strong> ({tx.id}) — ${tx.amount.toLocaleString('es-AR')}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Inspector de la Zona Comercial Seleccionada (Producto + Categoría + Combo) */}
      {activeZone && (
        <div
          role="region"
          aria-label="Detalle de Zona Comercial y Producto Líder"
          className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex flex-col gap-2.5 h-fit"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 h-fit">
            <div className="flex items-center gap-2 h-fit">
              <Flame className="w-4 h-4 text-[#f97316]" />
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100">
                {activeZone.zoneName}
              </span>
            </div>
            <Badge
              variant={
                activeZone.demandIntensity === 'alta'
                  ? 'warning'
                  : activeZone.demandIntensity === 'media'
                    ? 'primary'
                    : 'success'
              }
            >
              Demanda {activeZone.demandIntensity.toUpperCase()} · {activeZone.ordersCount} órdenes
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs h-fit">
            <div className="p-2.5 rounded-lg bg-white dark:bg-[#121215] border border-slate-200 dark:border-[#27272a] h-fit">
              <span className="text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-[#2563eb]" />
                Producto Más Vendido en Zona
              </span>
              <p className="font-bold text-slate-900 dark:text-zinc-100 mt-1">
                {activeZone.topProduct}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-white dark:bg-[#121215] border border-slate-200 dark:border-[#27272a] h-fit">
              <span className="text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#f97316]" />
                Combo Asociado en la Zona (15% OFF)
              </span>
              <p className="font-bold text-slate-900 dark:text-zinc-100 mt-1">
                {activeZone.companionProduct}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-white dark:bg-[#121215] border border-slate-200 dark:border-[#27272a] h-fit">
              <span className="text-slate-500 dark:text-zinc-400">
                Facturación Acumulada Zona ({activeZone.topCategory})
              </span>
              <p className="text-sm font-extrabold text-[#16a34a] mt-1">
                ${activeZone.totalVolume.toLocaleString('es-AR')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Selector Rápido de Zonas Comerciales y su Producto Líder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs h-fit">
        {geoZones.map((zone) => {
          const isSelected = zone.zoneId === activeZone?.zoneId;
          return (
            <button
              key={zone.zoneId}
              type="button"
              onClick={() => onSelectZone(zone.zoneId)}
              className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 h-fit ${
                isSelected
                  ? 'border-[#2563eb] bg-blue-50/60 dark:bg-blue-950/30 shadow-sm'
                  : 'border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/60 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2 w-full h-fit">
                <span className="font-bold text-slate-900 dark:text-zinc-100 truncate">
                  {zone.city}
                </span>
                <span className="font-bold text-[#16a34a]">
                  ${zone.totalVolume.toLocaleString('es-AR')}
                </span>
              </div>
              <span className="text-slate-600 dark:text-zinc-300 truncate">
                Top: <strong>{zone.topProduct}</strong>
              </span>
              <span className="text-slate-500 dark:text-zinc-400">
                {zone.topCategory} · {zone.ordersCount} pedidos
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
