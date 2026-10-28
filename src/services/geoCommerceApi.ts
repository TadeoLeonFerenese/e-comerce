import { GeoCommercialZoneSchema, type GeoCommercialZone } from '../contracts/commerce.schema';

export const INITIAL_GEO_ZONES: GeoCommercialZone[] = [
  {
    zoneId: 'zone-caba',
    zoneName: 'CABA — Polo Tecnológico Palermo & Microcentro',
    city: 'Buenos Aires (CABA)',
    coordinates: [-34.6037, -58.3816],
    topProduct: 'Placa de Video RTX 4080 Super 16GB GDDR6X',
    topCategory: 'Hardware & Gaming',
    companionProduct: 'Fuente Modular 1000W 80 Plus Gold ATX 3.0',
    totalVolume: 18450,
    ordersCount: 19,
    demandIntensity: 'alta',
  },
  {
    zoneId: 'zone-cordoba',
    zoneName: 'Córdoba Capital — Hub Nueva Córdoba & Parque',
    city: 'Córdoba Capital',
    coordinates: [-31.4201, -64.1888],
    topProduct: 'Micrófono Dinámico Broadcast XLR/USB Pro',
    topCategory: 'Audio Pro',
    companionProduct: 'Brazo Articulado Hidráulico Low-Profile con Cable Oculto',
    totalVolume: 11240,
    ordersCount: 14,
    demandIntensity: 'alta',
  },
  {
    zoneId: 'zone-rosario',
    zoneName: 'Rosario — Corredor Comercial Centro & Pichincha',
    city: 'Rosario',
    coordinates: [-32.9442, -60.6505],
    topProduct: 'Firewall & Router Dual-WAN Zero-Trust Wi-Fi 7',
    topCategory: 'Seguridad & Redes',
    companionProduct: 'Llave de Seguridad FIDO2 Biometric USB-C / NFC',
    totalVolume: 7890,
    ordersCount: 11,
    demandIntensity: 'media',
  },
  {
    zoneId: 'zone-mendoza',
    zoneName: 'Mendoza — Nodo Comercial Cuyo & Chacras',
    city: 'Mendoza',
    coordinates: [-32.8895, -68.8458],
    topProduct: 'Auriculares Planar Magnetic inalámbricos Ultra-Low Latency',
    topCategory: 'Audio Pro',
    companionProduct: 'Micrófono Dinámico Broadcast XLR/USB Pro',
    totalVolume: 6420,
    ordersCount: 9,
    demandIntensity: 'media',
  },
  {
    zoneId: 'zone-mdq',
    zoneName: 'Mar del Plata — Corredor Costa Atlántica',
    city: 'Mar del Plata',
    coordinates: [-38.0055, -57.5426],
    topProduct: 'UPS Online Senoidal Pura 1500VA con Panel LCD',
    topCategory: 'Seguridad & Redes',
    companionProduct: 'Fuente Modular 1000W 80 Plus Gold ATX 3.0',
    totalVolume: 4180,
    ordersCount: 6,
    demandIntensity: 'emergente',
  },
];

/**
 * Consulta la API de Zonas Comerciales y Productos Líderes (`/api/analytics/geo-zones`).
 * Si el backend Laravel no está levantado localmente en modo demo, retorna las zonas validadas con Zod.
 */
export async function fetchGeoCommercialZones(): Promise<GeoCommercialZone[]> {
  try {
    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
      const response = await window.fetch('/api/analytics/geo-zones', {
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        const json: unknown = await response.json();
        const parsed = GeoCommercialZoneSchema.array().safeParse(json);
        if (parsed.success && parsed.data.length > 0) {
          return parsed.data;
        }
      }
    }
  } catch {
    // Fallback determinista para la demo interactiva cuando corre sin servidor PHP externo
  }
  return INITIAL_GEO_ZONES;
}
