import { ProductSchema, type Product } from '../contracts/commerce.schema';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-gpu-4080',
    name: 'Placa de Video RTX 4080 Super 16GB GDDR6X',
    category: 'Hardware & Gaming',
    price: 1250,
    stock: 9,
    rating: 4.9,
    reviewsCount: 38,
    condition: 'Nuevo | +100 vendidos',
    freeShipping: true,
    protectedPurchase: true,
    badgeText: 'Más Vendido',
    imageUrl: '/products/gpu-4080.png',
    thumbnailUrl: '/products/gpu-4080.png',
    correlatedProductId: 'prod-psu-1000w',
    coPurchaseRatePercent: 68,
    installmentsText: 'Mismo precio en 6 cuotas de $208.33',
    highlights: [
      'Arquitectura Ada Lovelace con DLSS 3.5 y Ray Tracing de 3ra generación.',
      '16GB VRAM GDDR6X con bus de 256 bits y 10240 CUDA Cores.',
      'Sistema de refrigeración triple fan con rodamientos hidrodinámicos y backplate metálico.',
      'Conectores: 3x DisplayPort 1.4a y 1x HDMI 2.1a con soporte 4K a 240Hz / 8K a 60Hz.',
    ],
    galleryImages: [
      '/products/gpu-4080.png',
      '/products/psu-1000w.png',
      '/products/ups-1500.png',
    ],
  },
  {
    id: 'prod-psu-1000w',
    name: 'Fuente Modular 1000W 80 Plus Gold ATX 3.0',
    category: 'Hardware & Gaming',
    price: 240,
    stock: 18,
    rating: 4.8,
    reviewsCount: 29,
    condition: 'Nuevo | +50 vendidos',
    freeShipping: true,
    protectedPurchase: true,
    badgeText: 'Combo Ideal',
    imageUrl: '/products/psu-1000w.png',
    thumbnailUrl: '/products/psu-1000w.png',
    correlatedProductId: 'prod-ups-1500',
    coPurchaseRatePercent: 72,
    installmentsText: '3 cuotas sin interés de $80.00',
    highlights: [
      'Certificación 80 PLUS Gold con eficiencia superior al 92% en cargas medias.',
      'Estándar nativo ATX 3.0 con cable dedicado 12VHPWR PCIe 5.0 de 600W.',
      'Capacitores 100% japoneses de 105°C para máxima durabilidad y estabilidad.',
      'Ventilador FDB de 135mm ultrasilencioso con modo Zero RPM.',
    ],
    galleryImages: [
      '/products/psu-1000w.png',
      '/products/gpu-4080.png',
    ],
  },
  {
    id: 'prod-mic-shure',
    name: 'Micrófono Dinámico Broadcast XLR/USB Pro',
    category: 'Audio Pro',
    price: 320,
    stock: 14,
    rating: 4.9,
    reviewsCount: 52,
    condition: 'Nuevo | +200 vendidos',
    freeShipping: true,
    protectedPurchase: true,
    badgeText: 'Recomendado Studio',
    imageUrl: '/products/mic-shure.png',
    thumbnailUrl: '/products/mic-shure.png',
    correlatedProductId: 'prod-arm-boom',
    coPurchaseRatePercent: 74,
    installmentsText: '6 cuotas de $53.33',
    highlights: [
      'Salida dual simultánea XLR analógica y USB-C digital de 24-bit/96kHz.',
      'Tecnología de aislamiento por voz con patrón polar cardioide hiperpreciso.',
      'DSP integrado con ecualizador, compresor, limitador y salida de auriculares directa.',
    ],
    galleryImages: [
      '/products/mic-shure.png',
      '/products/arm-boom.png',
    ],
  },
  {
    id: 'prod-arm-boom',
    name: 'Brazo Articulado Hidráulico Low-Profile con Cable Oculto',
    category: 'Accesorios',
    price: 95,
    stock: 25,
    rating: 4.7,
    reviewsCount: 19,
    condition: 'Nuevo | +50 vendidos',
    freeShipping: true,
    protectedPurchase: true,
    imageUrl: '/products/arm-boom.png',
    thumbnailUrl: '/products/arm-boom.png',
    correlatedProductId: 'prod-mic-shure',
    coPurchaseRatePercent: 68,
    installmentsText: '3 cuotas fijas de $31.66',
    highlights: [
      'Diseño de bajo perfil que no bloquea la visión de monitores principales.',
      'Canal magnético de gestión de cableado oculto para estética clean desk.',
      'Construcción enteramente en aluminio aeronáutico anodizado de alta resistencia.',
    ],
    galleryImages: [
      '/products/arm-boom.png',
      '/products/mic-shure.png',
    ],
  },
  {
    id: 'prod-yubikey-bio',
    name: 'Llave de Seguridad FIDO2 Biometric USB-C / NFC',
    category: 'Seguridad & Redes',
    price: 140,
    stock: 30,
    rating: 5.0,
    reviewsCount: 44,
    condition: 'Nuevo | +500 vendidos',
    freeShipping: true,
    protectedPurchase: true,
    badgeText: 'Escudo Hardware',
    imageUrl: '/products/yubikey-bio.png',
    thumbnailUrl: '/products/yubikey-bio.png',
    correlatedProductId: 'prod-router-vpn',
    coPurchaseRatePercent: 65,
    installmentsText: '3 cuotas de $46.66',
    highlights: [
      'Sensor biométrico de huellas dactilares capacitivo integrado.',
      'Soporte universal FIDO2/WebAuthn, U2F, Smart Card (PIV) y OpenPGP.',
      'Conectividad dual USB-C nativa y NFC sin contacto.',
    ],
    galleryImages: [
      '/products/yubikey-bio.png',
      '/products/router-vpn.png',
    ],
  },
  {
    id: 'prod-router-vpn',
    name: 'Firewall & Router Dual-WAN Zero-Trust Wi-Fi 7',
    category: 'Seguridad & Redes',
    price: 410,
    stock: 11,
    rating: 4.8,
    reviewsCount: 16,
    condition: 'Nuevo | +20 vendidos',
    freeShipping: true,
    protectedPurchase: true,
    imageUrl: '/products/router-vpn.png',
    thumbnailUrl: '/products/router-vpn.png',
    correlatedProductId: 'prod-yubikey-bio',
    coPurchaseRatePercent: 68,
    installmentsText: '6 cuotas de $68.33',
    highlights: [
      'Procesador Quad-Core 2.2GHz con aceleración de cifrado WireGuard/IPsec.',
      'Doble puerto 10GbE WAN/LAN SFP+ y 4 puertos 2.5GbE PoE+.',
      'Filtrado de paquetes en capa 7 (DPI) e inspección IDS/IPS en tiempo real.',
    ],
    galleryImages: [
      '/products/router-vpn.png',
      '/products/yubikey-bio.png',
    ],
  },
  {
    id: 'prod-ups-1500',
    name: 'UPS Online Senoidal Pura 1500VA con Panel LCD',
    category: 'Seguridad & Redes',
    price: 380,
    stock: 8,
    rating: 4.7,
    reviewsCount: 12,
    condition: 'Nuevo | +15 vendidos',
    freeShipping: true,
    protectedPurchase: true,
    imageUrl: '/products/ups-1500.png',
    thumbnailUrl: '/products/ups-1500.png',
    correlatedProductId: 'prod-psu-1000w',
    coPurchaseRatePercent: 64,
    installmentsText: '6 cuotas de $63.33',
    highlights: [
      'Topología de doble conversión en línea con tiempo de transferencia cero ms.',
      'Onda senoidal pura apta para fuentes con PFC activo y servidores.',
      'Pantalla LCD multifunción con métricas de carga, voltaje y autonomía.',
    ],
    galleryImages: [
      '/products/ups-1500.png',
      '/products/psu-1000w.png',
    ],
  },
  {
    id: 'prod-headset-planar',
    name: 'Auriculares Planar Magnetic inalámbricos Ultra-Low Latency',
    category: 'Audio Pro',
    price: 390,
    stock: 12,
    rating: 4.9,
    reviewsCount: 28,
    condition: 'Nuevo | +40 vendidos',
    freeShipping: true,
    protectedPurchase: true,
    badgeText: 'Oferta Relámpago',
    imageUrl: '/products/headset-planar.png',
    thumbnailUrl: '/products/headset-planar.png',
    correlatedProductId: 'prod-mic-shure',
    coPurchaseRatePercent: 68,
    installmentsText: '6 cuotas de $65.00',
    highlights: [
      'Transductores plano-magnéticos de 90mm para distorsión armónica < 0.1%.',
      'Dongle inalámbrico 2.4GHz sin compresión y Bluetooth 5.3 multipunto.',
      'Almohadillas de espuma viscoelástica refrigerante con recubrimiento de gel.',
    ],
    galleryImages: [
      '/products/headset-planar.png',
      '/products/mic-shure.png',
    ],
  },
];

/**
 * Consulta la API de Catálogo de Productos (/api/products o endpoint externo compatible con DummyJSON).
 * Realiza un fallback enriquecido con fotos reales para garantizar que la demo y los tests funcionen en cualquier entorno.
 */
export async function fetchProductsCatalog(): Promise<Product[]> {
  try {
    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
      const response = await window.fetch('/api/products', {
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        const json: unknown = await response.json();
        const parsed = ProductSchema.array().safeParse(json);
        if (parsed.success && parsed.data.length > 0) {
          return parsed.data;
        }
      }
    }
  } catch {
    // Modo autónomo resiliente
  }
  return INITIAL_PRODUCTS;
}
