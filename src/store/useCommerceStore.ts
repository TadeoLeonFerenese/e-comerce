import { create } from 'zustand';
import type {
  CartItem,
  CrossSellingComboMetric,
  CrossSellOffer,
  ForensicReport,
  GeoCommercialZone,
  HourlySalesPoint,
  IdentitySimulationMode,
  Product,
  ProductCategory,
  TrafficSeriesPoint,
  TransactionRecord,
  TransactionStatus,
} from '../contracts/commerce.schema';
import { INITIAL_GEO_ZONES, fetchGeoCommercialZones } from '../services/geoCommerceApi';
import { INITIAL_PRODUCTS, fetchProductsCatalog } from '../services/productCatalogApi';

export function calculateCrossSellPrice(originalPrice: number): number {
  return Math.round(originalPrice * 0.85 * 100) / 100;
}

export function evaluateTransactionRisk(
  identityMode: IdentitySimulationMode,
  amount: number
): { riskScore: number; status: TransactionStatus; velocityPerMinute: number; ticketDeviationFactor: number } {
  if (identityMode === 'burst_fraudster') {
    return {
      riskScore: 94,
      status: 'flagged',
      velocityPerMinute: 19,
      ticketDeviationFactor: 2.4,
    };
  }
  if (identityMode === 'anomalous_amount') {
    return {
      riskScore: 86,
      status: 'flagged',
      velocityPerMinute: 3,
      ticketDeviationFactor: Math.max(4.8, Number((amount / 450).toFixed(1))),
    };
  }
  return {
    riskScore: 12,
    status: 'approved',
    velocityPerMinute: 1,
    ticketDeviationFactor: 1.0,
  };
}

export function buildForensicAnalysis(tx: TransactionRecord): ForensicReport {
  if (tx.identityMode === 'burst_fraudster') {
    return {
      transactionId: tx.id,
      executedAt: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      confidenceScore: 97,
      attackVector: 'Ataque de Ráfaga Automatizada (Carding Botnet Velocity)',
      triggeredRules: [
        'RULE_VELOCITY_BURST: 19 intentos de checkout en < 60 segundos desde el mismo fingerprint.',
        'RULE_IP_ASN_MISMATCH: Subred asociada a proxy rotativo no residencial.',
        'RULE_SESSION_CADENCE: Cadencia de clics sub-humana (< 140ms entre carrito y pago).',
      ],
      velocityPerMinute: 19,
      ticketDeviationFactor: 2.4,
      summary: `Dictamen Forense IA: Se detectó un patrón de ráfaga automatizada desde IP ${tx.ipAddress} (${tx.city}). Alta probabilidad de ataque de enumeración de tarjetas.`,
      recommendedAction: 'block_ip_and_user',
    };
  }

  if (tx.identityMode === 'anomalous_amount') {
    return {
      transactionId: tx.id,
      executedAt: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      confidenceScore: 89,
      attackVector: 'Desvío Extremo de Ticket Promedio (Account Takeover / High-Value Drain)',
      triggeredRules: [
        'RULE_AMOUNT_SIGMA_4: Monto supera en 5.2x la media histórica del segmento.',
        'RULE_LIQUID_ASSET_TARGET: Acumulación de hardware de alta reventa en un único checkout.',
      ],
      velocityPerMinute: 3,
      ticketDeviationFactor: 5.2,
      summary: `Dictamen Forense IA: El monto de $${tx.amount.toLocaleString('es-AR')} presenta una desviación estadística severa respecto al comportamiento estándar en ${tx.city}.`,
      recommendedAction: 'block_ip_and_user',
    };
  }

  return {
    transactionId: tx.id,
    executedAt: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    confidenceScore: 96,
    attackVector: 'Comportamiento Orgánico Verificado (Sin Anomalías)',
    triggeredRules: [
      'RULE_BEHAVIOR_NORMAL: Navegación humana consistente con historial del dispositivo.',
    ],
    velocityPerMinute: 1,
    ticketDeviationFactor: 1.0,
    summary: `Dictamen Forense IA: Transacción legítima verificada en ${tx.city}. Huella digital e IP residenciales consistentes.`,
    recommendedAction: 'approve',
  };
}

const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'TX-9048',
    timestamp: '12:54:10',
    customerName: 'Botnet_Cluster_X9',
    identityMode: 'burst_fraudster',
    amount: 2450,
    itemsCount: 3,
    crossSellApplied: false,
    ipAddress: '185.220.101.44',
    city: 'Buenos Aires (CABA)',
    coordinates: [-34.6037, -58.3816],
    deviceFingerprint: 'fp_headless_chromium_99a',
    riskScore: 95,
    status: 'flagged',
  },
  {
    id: 'TX-9047',
    timestamp: '12:51:04',
    customerName: 'Valentina Quiroga',
    identityMode: 'legitimate',
    amount: 1454,
    itemsCount: 2,
    crossSellApplied: true,
    ipAddress: '190.191.42.18',
    city: 'Córdoba Capital',
    coordinates: [-31.4201, -64.1888],
    deviceFingerprint: 'fp_safari_macos_18b',
    riskScore: 11,
    status: 'approved',
  },
  {
    id: 'TX-9046',
    timestamp: '12:47:39',
    customerName: 'Cuenta_Anomala_77',
    identityMode: 'anomalous_amount',
    amount: 6890,
    itemsCount: 5,
    crossSellApplied: false,
    ipAddress: '45.155.205.91',
    city: 'Rosario',
    coordinates: [-32.9442, -60.6505],
    deviceFingerprint: 'fp_spoofed_win11_71c',
    riskScore: 88,
    status: 'flagged',
  },
  {
    id: 'TX-9045',
    timestamp: '12:40:12',
    customerName: 'Martín Echeverría',
    identityMode: 'legitimate',
    amount: 400.75,
    itemsCount: 2,
    crossSellApplied: true,
    ipAddress: '181.47.110.25',
    city: 'Mendoza',
    coordinates: [-32.8895, -68.8458],
    deviceFingerprint: 'fp_chrome_android_33d',
    riskScore: 14,
    status: 'approved',
  },
  {
    id: 'TX-9044',
    timestamp: '12:32:50',
    customerName: 'Proxy_Velocity_Node',
    identityMode: 'burst_fraudster',
    amount: 1980,
    itemsCount: 4,
    crossSellApplied: false,
    ipAddress: '91.132.147.88',
    city: 'Mar del Plata',
    coordinates: [-38.0055, -57.5426],
    deviceFingerprint: 'fp_puppeteer_stealth_04e',
    riskScore: 97,
    status: 'blocked',
  },
];

const INITIAL_TRAFFIC_SERIES: TrafficSeriesPoint[] = [
  { slot: '09:00', legitimateCount: 42, blockedCount: 4 },
  { slot: '10:00', legitimateCount: 58, blockedCount: 7 },
  { slot: '11:00', legitimateCount: 74, blockedCount: 15 },
  { slot: '12:00', legitimateCount: 91, blockedCount: 23 },
  { slot: '13:00', legitimateCount: 86, blockedCount: 19 },
];

const INITIAL_HOURLY_SALES: HourlySalesPoint[] = [
  { hour: '09:00', revenue: 4200, crossSellOrders: 11 },
  { hour: '10:00', revenue: 6850, crossSellOrders: 18 },
  { hour: '11:00', revenue: 9120, crossSellOrders: 26 },
  { hour: '12:00', revenue: 12450, crossSellOrders: 35 },
  { hour: '13:00', revenue: 11380, crossSellOrders: 31 },
];

const INITIAL_COMBO_METRICS: CrossSellingComboMetric[] = [
  {
    comboId: 'combo-gpu-psu',
    primaryProductName: 'Placa de Video RTX 4080 Super 16GB GDDR6X',
    companionProductName: 'Fuente Modular 1000W 80 Plus Gold ATX 3.0',
    coPurchaseRatePercent: 68,
    impressions: 320,
    conversions: 218,
    conversionRatePercent: 68.1,
  },
  {
    comboId: 'combo-mic-arm',
    primaryProductName: 'Micrófono Dinámico Broadcast XLR/USB Pro',
    companionProductName: 'Brazo Articulado Hidráulico Low-Profile con Cable Oculto',
    coPurchaseRatePercent: 74,
    impressions: 210,
    conversions: 155,
    conversionRatePercent: 73.8,
  },
  {
    comboId: 'combo-sec-vpn',
    primaryProductName: 'Llave de Seguridad FIDO2 Biometric USB-C / NFC',
    companionProductName: 'Firewall & Router Dual-WAN Zero-Trust Wi-Fi 7',
    coPurchaseRatePercent: 65,
    impressions: 180,
    conversions: 117,
    conversionRatePercent: 65.0,
  },
];

interface CommerceStoreState {
  products: Product[];
  selectedCategory: ProductCategory;
  searchQuery: string;
  activeProductId: string;
  selectedProductViewId: string | null;
  isCartDrawerOpen: boolean;
  cart: CartItem[];
  transactions: TransactionRecord[];
  selectedTransactionId: string | null;
  riskFilter: 'all' | TransactionStatus;
  trafficSeries: TrafficSeriesPoint[];
  hourlySales: HourlySalesPoint[];
  comboMetrics: CrossSellingComboMetric[];
  geoZones: GeoCommercialZone[];
  selectedZoneId: string;
  lastSimulationBanner: string | null;

  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: ProductCategory) => void;
  setActiveProductId: (productId: string) => void;
  openProductDetail: (productId: string) => void;
  closeProductDetail: () => void;
  setCartDrawerOpen: (isOpen: boolean) => void;
  setRiskFilter: (filter: 'all' | TransactionStatus) => void;
  setSelectedTransactionId: (txId: string | null) => void;
  setSelectedZoneId: (zoneId: string) => void;
  syncGeoZonesFromApi: () => Promise<void>;
  syncProductsFromApi: () => Promise<void>;
  getCrossSellOfferForProduct: (productId: string) => CrossSellOffer | null;
  addToCart: (productId: string, isCrossSellBundle?: boolean, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  simulateCheckout: (identityMode: IdentitySimulationMode) => TransactionRecord | null;
  runForensicAnalysis: (txId: string) => ForensicReport | null;
  mitigateTransaction: (txId: string, targetStatus: 'blocked' | 'approved') => void;
  resetCommerceStore: () => void;
}

export const useCommerceStore = create<CommerceStoreState>((set, get) => ({
  products: INITIAL_PRODUCTS,
  selectedCategory: 'Todos',
  searchQuery: '',
  activeProductId: INITIAL_PRODUCTS[0].id,
  selectedProductViewId: null,
  isCartDrawerOpen: false,
  cart: [
    {
      product: INITIAL_PRODUCTS[0],
      quantity: 1,
      isCrossSellBundle: false,
      unitPriceApplied: INITIAL_PRODUCTS[0].price,
    },
  ],
  transactions: INITIAL_TRANSACTIONS,
  selectedTransactionId: null,
  riskFilter: 'all',
  trafficSeries: INITIAL_TRAFFIC_SERIES,
  hourlySales: INITIAL_HOURLY_SALES,
  comboMetrics: INITIAL_COMBO_METRICS,
  geoZones: INITIAL_GEO_ZONES,
  selectedZoneId: INITIAL_GEO_ZONES[0].zoneId,
  lastSimulationBanner: null,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setActiveProductId: (activeProductId) => set({ activeProductId }),
  setRiskFilter: (riskFilter) => set({ riskFilter }),
  setSelectedTransactionId: (selectedTransactionId) => set({ selectedTransactionId }),
  setSelectedZoneId: (selectedZoneId) => set({ selectedZoneId }),

  syncGeoZonesFromApi: async () => {
    const zones = await fetchGeoCommercialZones();
    set({ geoZones: zones });
  },

  syncProductsFromApi: async () => {
    const products = await fetchProductsCatalog();
    set({ products });
  },

  getCrossSellOfferForProduct: (productId) => {
    const { products } = get();
    const source = products.find((p) => p.id === productId);
    if (!source) return null;
    const companion = products.find((p) => p.id === source.correlatedProductId);
    if (!companion) return null;

    const discountedPrice = calculateCrossSellPrice(companion.price);
    return {
      sourceProductId: source.id,
      companionProduct: companion,
      discountPercent: 15,
      discountedPrice,
      coPurchaseRatePercent: source.coPurchaseRatePercent,
      bannerMessage: `¡Llevá también ${companion.name} con 15% OFF! El ${source.coPurchaseRatePercent}% de los usuarios los compran juntos`,
    };
  },

  openProductDetail: (productId: string) => {
    set({ selectedProductViewId: productId, activeProductId: productId });
  },

  closeProductDetail: () => {
    set({ selectedProductViewId: null });
  },

  setCartDrawerOpen: (isOpen: boolean) => {
    set({ isCartDrawerOpen: isOpen });
  },

  addToCart: (productId, isCrossSellBundle = false, quantity = 1) => {
    const { products, cart } = get();
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const unitPriceApplied = isCrossSellBundle
      ? calculateCrossSellPrice(product.price)
      : product.price;

    const existingIndex = cart.findIndex(
      (item) => item.product.id === productId && item.isCrossSellBundle === isCrossSellBundle
    );

    const qtyToAdd = Math.max(1, quantity);

    if (existingIndex >= 0) {
      const updated = cart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + qtyToAdd } : item
      );
      set({ cart: updated, activeProductId: productId });
    } else {
      set({
        cart: [
          ...cart,
          {
            product,
            quantity: qtyToAdd,
            isCrossSellBundle,
            unitPriceApplied,
          },
        ],
        activeProductId: productId,
      });
    }
  },

  updateCartQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set({
      cart: get().cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    });
  },

  removeFromCart: (productId) => {
    set({
      cart: get().cart.filter((item) => item.product.id !== productId),
    });
  },

  clearCart: () => set({ cart: [] }),

  simulateCheckout: (identityMode) => {
    const { cart, transactions, trafficSeries, hourlySales, comboMetrics, geoZones, products } = get();
    const baseItems: CartItem[] =
      cart.length > 0
        ? cart
        : [
            {
              product: INITIAL_PRODUCTS[0],
              quantity: 1,
              isCrossSellBundle: false,
              unitPriceApplied: INITIAL_PRODUCTS[0].price,
            },
          ];

    const leadItem = baseItems[baseItems.length - 1];
    const companionProduct =
      products.find((p) => p.id === leadItem.product.correlatedProductId) ?? INITIAL_PRODUCTS[1];

    const rawAmount = baseItems.reduce(
      (acc, item) => acc + item.unitPriceApplied * item.quantity,
      0
    );
    const simulatedAmount =
      identityMode === 'anomalous_amount'
        ? Math.max(rawAmount * 4, 5800)
        : Number(rawAmount.toFixed(2));

    const itemsCount = baseItems.reduce((acc, item) => acc + item.quantity, 0);
    const crossSellApplied = baseItems.some((item) => item.isCrossSellBundle);

    const evaluation = evaluateTransactionRisk(identityMode, simulatedAmount);

    const profileMeta: Record<
      IdentitySimulationMode,
      { zoneId: string; customerName: string; ip: string; city: string; coords: [number, number]; fp: string }
    > = {
      legitimate: {
        zoneId: 'zone-caba',
        customerName: 'Cliente Demo Verificado',
        ip: '190.210.88.14',
        city: 'Buenos Aires (Palermo)',
        coords: [-34.588, -58.4305],
        fp: 'fp_verified_chrome_131',
      },
      burst_fraudster: {
        zoneId: 'zone-caba',
        customerName: 'Bot_Ráfaga_Simulado',
        ip: '185.220.101.99',
        city: 'Buenos Aires (Microcentro)',
        coords: [-34.6037, -58.3816],
        fp: 'fp_burst_script_headless',
      },
      anomalous_amount: {
        zoneId: 'zone-cordoba',
        customerName: 'Orden_Ticket_Anómalo',
        ip: '45.142.214.77',
        city: 'Córdoba Capital',
        coords: [-31.4201, -64.1888],
        fp: 'fp_anomalous_high_ticket',
      },
    };

    const meta = profileMeta[identityMode];
    const newTx: TransactionRecord = {
      id: `TX-${9049 + transactions.length}`,
      timestamp: new Date().toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      customerName: meta.customerName,
      identityMode,
      amount: simulatedAmount,
      itemsCount,
      crossSellApplied,
      ipAddress: meta.ip,
      city: meta.city,
      coordinates: meta.coords,
      deviceFingerprint: meta.fp,
      riskScore: evaluation.riskScore,
      status: evaluation.status,
    };

    const updatedGeoZones = geoZones.map((zone) => {
      if (zone.zoneId !== meta.zoneId) return zone;
      return {
        ...zone,
        topProduct: leadItem.product.name,
        topCategory: leadItem.product.category,
        companionProduct: companionProduct.name,
        ordersCount: zone.ordersCount + 1,
        totalVolume:
          identityMode === 'legitimate'
            ? Math.round(zone.totalVolume + simulatedAmount)
            : zone.totalVolume,
      };
    });

    const updatedTraffic = trafficSeries.map((point, index) => {
      if (index !== trafficSeries.length - 1) return point;
      return {
        ...point,
        legitimateCount:
          identityMode === 'legitimate' ? point.legitimateCount + 1 : point.legitimateCount,
        blockedCount:
          identityMode !== 'legitimate' ? point.blockedCount + 1 : point.blockedCount,
      };
    });

    const updatedHourlySales = hourlySales.map((point, index) => {
      if (index !== hourlySales.length - 1) return point;
      return {
        ...point,
        revenue:
          identityMode === 'legitimate'
            ? Math.round(point.revenue + simulatedAmount)
            : point.revenue,
        crossSellOrders: crossSellApplied ? point.crossSellOrders + 1 : point.crossSellOrders,
      };
    });

    const updatedComboMetrics = comboMetrics.map((metric, idx) => {
      if (idx === 0 && crossSellApplied) {
        const nextImpressions = metric.impressions + 1;
        const nextConversions = metric.conversions + 1;
        return {
          ...metric,
          impressions: nextImpressions,
          conversions: nextConversions,
          conversionRatePercent: Number(((nextConversions / nextImpressions) * 100).toFixed(1)),
        };
      }
      return metric;
    });

    const bannerMsg =
      identityMode === 'legitimate'
        ? `Compra aprobada (${newTx.id}) por $${simulatedAmount.toLocaleString('es-AR')} — Impactó en Zona Comercial (${meta.city}).`
        : `Alerta generada (${newTx.id} — Riesgo ${evaluation.riskScore}/100) — Abriendo telemetría en Escudo de Fraude.`;

    set({
      transactions: [newTx, ...transactions],
      selectedTransactionId: newTx.id,
      trafficSeries: updatedTraffic,
      hourlySales: updatedHourlySales,
      comboMetrics: updatedComboMetrics,
      geoZones: updatedGeoZones,
      selectedZoneId: meta.zoneId,
      lastSimulationBanner: bannerMsg,
    });

    return newTx;
  },

  runForensicAnalysis: (txId) => {
    const target = get().transactions.find((t) => t.id === txId);
    if (!target) return null;

    const report = buildForensicAnalysis(target);
    set({
      transactions: get().transactions.map((t) =>
        t.id === txId ? { ...t, forensicReport: report } : t
      ),
    });
    return report;
  },

  mitigateTransaction: (txId, targetStatus) => {
    const { transactions, trafficSeries } = get();
    const updated = transactions.map((t) =>
      t.id === txId ? { ...t, status: targetStatus } : t
    );

    const updatedTraffic = trafficSeries.map((point, index) => {
      if (index !== trafficSeries.length - 1) return point;
      return {
        ...point,
        blockedCount: targetStatus === 'blocked' ? point.blockedCount + 1 : point.blockedCount,
      };
    });

    set({
      transactions: updated,
      trafficSeries: updatedTraffic,
    });
  },

  resetCommerceStore: () => {
    set({
      products: INITIAL_PRODUCTS,
      selectedCategory: 'Todos',
      searchQuery: '',
      activeProductId: INITIAL_PRODUCTS[0].id,
      selectedProductViewId: null,
      isCartDrawerOpen: false,
      cart: [],
      transactions: INITIAL_TRANSACTIONS,
      selectedTransactionId: null,
      riskFilter: 'all',
      trafficSeries: INITIAL_TRAFFIC_SERIES,
      hourlySales: INITIAL_HOURLY_SALES,
      comboMetrics: INITIAL_COMBO_METRICS,
      geoZones: INITIAL_GEO_ZONES,
      selectedZoneId: INITIAL_GEO_ZONES[0].zoneId,
      lastSimulationBanner: null,
    });
  },
}));
