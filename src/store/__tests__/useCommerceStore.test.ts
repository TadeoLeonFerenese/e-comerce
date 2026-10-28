import { describe, it, expect, beforeEach } from 'vitest';
import {
  useCommerceStore,
  calculateCrossSellPrice,
  evaluateTransactionRisk,
  buildForensicAnalysis,
} from '../useCommerceStore';

describe('useCommerceStore — Cross-Selling Engine, Identity Simulator & Admin Forensic Tools', () => {
  beforeEach(() => {
    useCommerceStore.getState().resetCommerceStore();
  });

  it('calculates exact 15% OFF Cross-Selling bundle offer and correlation message', () => {
    expect(calculateCrossSellPrice(1000)).toBe(850);
    expect(calculateCrossSellPrice(200)).toBe(170);

    const store = useCommerceStore.getState();
    const firstProduct = store.products[0];
    const offer = store.getCrossSellOfferForProduct(firstProduct.id);

    expect(offer).not.toBeNull();
    expect(offer?.discountPercent).toBe(15);
    expect(offer?.bannerMessage).toContain('15% OFF');
    expect(offer?.bannerMessage).toContain(`${firstProduct.coPurchaseRatePercent}% de los usuarios los compran juntos`);
  });

  it('provides real product images and allows syncing catalog from API', async () => {
    const store = useCommerceStore.getState();
    expect(store.products.length).toBeGreaterThanOrEqual(8);
    for (const product of store.products) {
      expect(product.imageUrl).toBeTruthy();
      expect(product.imageUrl).toMatch(/^(\/products\/|https?:\/\/)/);
    }
    await store.syncProductsFromApi();
    expect(store.products[0].imageUrl).toBe('/products/gpu-4080.png');
  });

  it('evaluates risk score and status accurately across Identity Simulator modes (triangulation)', () => {
    const legitEval = evaluateTransactionRisk('legitimate', 450);
    expect(legitEval.status).toBe('approved');
    expect(legitEval.riskScore).toBeLessThan(30);

    const burstEval = evaluateTransactionRisk('burst_fraudster', 450);
    expect(burstEval.status).toBe('flagged');
    expect(burstEval.riskScore).toBeGreaterThanOrEqual(85);

    const anomalousEval = evaluateTransactionRisk('anomalous_amount', 9800);
    expect(anomalousEval.status).toBe('flagged');
    expect(anomalousEval.riskScore).toBeGreaterThanOrEqual(78);
  });

  it('processes simulated checkout and immediately updates SecurityView KPIs and MarketingView metrics', () => {
    const store = useCommerceStore.getState();
    const initialTotalTx = store.transactions.length;
    const primaryProduct = store.products[0];

    store.addToCart(primaryProduct.id, false);
    const offer = store.getCrossSellOfferForProduct(primaryProduct.id);
    expect(offer).not.toBeNull();
    if (offer) {
      store.addToCart(offer.companionProduct.id, true);
    }

    const createdTx = useCommerceStore
      .getState()
      .simulateCheckout('burst_fraudster');

    expect(createdTx).not.toBeNull();
    expect(createdTx?.identityMode).toBe('burst_fraudster');
    expect(createdTx?.crossSellApplied).toBe(true);
    expect(createdTx?.status).toBe('flagged');

    const updatedStore = useCommerceStore.getState();
    expect(updatedStore.transactions.length).toBe(initialTotalTx + 1);
    expect(updatedStore.transactions[0].id).toBe(createdTx?.id);
  });

  it('executes AI Forensic analysis and allows Administrator to block or approve a flagged transaction', () => {
    const store = useCommerceStore.getState();
    store.addToCart(store.products[0].id, false);
    const tx = useCommerceStore.getState().simulateCheckout('burst_fraudster');
    expect(tx).not.toBeNull();
    if (!tx) return;

    const report = buildForensicAnalysis(tx);
    expect(report.confidenceScore).toBeGreaterThanOrEqual(90);
    expect(report.recommendedAction).toBe('block_ip_and_user');

    useCommerceStore.getState().runForensicAnalysis(tx.id);
    const afterForensic = useCommerceStore
      .getState()
      .transactions.find((item) => item.id === tx.id);
    expect(afterForensic?.forensicReport?.attackVector).toContain('Ráfaga');

    useCommerceStore.getState().mitigateTransaction(tx.id, 'blocked');
    const afterBlock = useCommerceStore
      .getState()
      .transactions.find((item) => item.id === tx.id);
    expect(afterBlock?.status).toBe('blocked');
  });

  it('provides geo-commercial zones with top product telemetry and updates zone volume on checkout', () => {
    const initialZones = useCommerceStore.getState().geoZones;
    expect(initialZones.length).toBeGreaterThanOrEqual(4);
    expect(initialZones[0].zoneName).toContain('CABA');
    expect(initialZones[0].topProduct).toBe('Placa de Video RTX 4080 Super 16GB GDDR6X');

    const initialCabaOrders = initialZones[0].ordersCount;
    useCommerceStore.getState().addToCart('prod-mic-shure', false);
    useCommerceStore.getState().simulateCheckout('legitimate');

    const updatedCabaZone = useCommerceStore.getState().geoZones[0];
    expect(updatedCabaZone.ordersCount).toBe(initialCabaOrders + 1);
    expect(updatedCabaZone.topProduct).toBe('Micrófono Dinámico Broadcast XLR/USB Pro');
  });

  it('manages PDP navigation state, cart drawer visibility and cart quantity updates', () => {
    const store = useCommerceStore.getState();
    expect(store.selectedProductViewId).toBeNull();
    expect(store.isCartDrawerOpen).toBe(false);

    // Navega a PDP
    store.openProductDetail('prod-gpu-4080');
    expect(useCommerceStore.getState().selectedProductViewId).toBe('prod-gpu-4080');
    expect(useCommerceStore.getState().activeProductId).toBe('prod-gpu-4080');

    // Cierra PDP y vuelve a catálogo
    store.closeProductDetail();
    expect(useCommerceStore.getState().selectedProductViewId).toBeNull();

    // Toggle de Cart Drawer
    store.setCartDrawerOpen(true);
    expect(useCommerceStore.getState().isCartDrawerOpen).toBe(true);
    store.setCartDrawerOpen(false);
    expect(useCommerceStore.getState().isCartDrawerOpen).toBe(false);

    // Agregar con cantidad específica y actualizar cantidades
    store.addToCart('prod-gpu-4080', false, 2);
    expect(useCommerceStore.getState().cart[0].quantity).toBe(2);

    store.updateCartQuantity('prod-gpu-4080', 5);
    expect(useCommerceStore.getState().cart[0].quantity).toBe(5);

    // Si la cantidad es 0 se remueve
    store.updateCartQuantity('prod-gpu-4080', 0);
    expect(useCommerceStore.getState().cart.length).toBe(0);
  });
});
