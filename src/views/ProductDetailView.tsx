import React from 'react';
import { Star, Heart, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCommerceStore } from '../store/useCommerceStore';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { BreadcrumbNav } from '../components/atoms/BreadcrumbNav';
import { ProductGallery } from '../components/molecules/ProductGallery';
import { ProductBuyBox } from '../components/molecules/ProductBuyBox';
import { CrossSellingWidget } from '../components/molecules/CrossSellingWidget';

export const ProductDetailView: React.FC = () => {
  const {
    products,
    selectedProductViewId,
    closeProductDetail,
    getCrossSellOfferForProduct,
    addToCart,
    setCartDrawerOpen,
    simulateCheckout,
    lastSimulationBanner,
  } = useCommerceStore();

  const { setRole, setAdminTab } = useThemeStore();
  const currentUser = useAuthStore((s) => s.currentUser);
  const isAdmin = currentUser?.role === 'admin';

  const product =
    products.find((p) => p.id === selectedProductViewId) ?? products[0];

  const activeOffer = getCrossSellOfferForProduct(product.id);

  const handleAddToCart = (quantity: number) => {
    addToCart(product.id, false, quantity);
    setCartDrawerOpen(true);
  };

  const handleBuyNow = (quantity: number) => {
    addToCart(product.id, false, quantity);
    simulateCheckout('legitimate');
  };

  const handleAddCrossSell = () => {
    if (activeOffer) {
      addToCart(activeOffer.companionProduct.id, true, 1);
      setCartDrawerOpen(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 flex flex-col gap-6">
      {/* Banner de Simulación de Fraude si se ejecutó un checkout */}
      {lastSimulationBanner && (
        <aside
          role="status"
          aria-live="polite"
          className="p-4 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <p className="text-xs sm:text-sm font-medium">
              {lastSimulationBanner}
            </p>
          </div>
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                setRole('admin');
                setAdminTab('security');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shrink-0 cursor-pointer"
            >
              <span>Ir al Escudo de Fraude</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </aside>
      )}

      {/* Migas de Pan (Breadcrumb) */}
      <BreadcrumbNav
        category={product.category}
        productName={product.name}
        onBack={closeProductDetail}
      />

      {/* Grid Principal de la PDP estilo Mercado Libre (3 Columnas en Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna 1: Galería de Fotos (Miniaturas + Visor) */}
        <div className="lg:col-span-5 xl:col-span-5">
          <ProductGallery
            productName={product.name}
            mainImage={product.imageUrl}
            images={product.galleryImages}
          />
        </div>

        {/* Columna 2: Ficha Técnica Central & Precios */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-4">
          {/* Encabezado: Condición, Vendidos y Favoritos */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
            <span>{product.condition}</span>
            <button
              type="button"
              aria-label="Guardar en favoritos"
              className="p-1 rounded-full text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>

          {/* Título Principal */}
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 leading-snug">
            {product.name}
          </h1>

          {/* Calificación y Opiniones */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-800 dark:text-zinc-200">
              {product.rating}
            </span>
            <div className="flex items-center text-amber-500">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300 dark:text-zinc-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-slate-400 dark:text-zinc-500">
              ({product.reviewsCount} opiniones)
            </span>
          </div>

          {/* Precio y Cuotas */}
          <div className="flex flex-col gap-1 py-3 border-y border-slate-100 dark:border-zinc-800/80">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
                ${product.price}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                USD
              </span>
            </div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {product.installmentsText ?? 'Mismo precio en 6 cuotas fijas'}
            </p>
            <span className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline font-medium mt-1">
              Ver los medios de pago
            </span>
          </div>

          {/* Lo que tenés que saber de este producto (Highlights estilo ML) */}
          <div className="flex flex-col gap-2.5 pt-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
              Lo que tenés que saber de este producto
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
              {product.highlights && product.highlights.length > 0 ? (
                product.highlights.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-500 mt-1.5 shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-500 mt-1.5 shrink-0" />
                    <span>Rendimiento profesional y compatibilidad verificada.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-500 mt-1.5 shrink-0" />
                    <span>Empaque original sellado con garantía de fábrica.</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Columna 3: Buy Box (Caja de Compra lateral) */}
        <div className="lg:col-span-3 xl:col-span-3">
          <ProductBuyBox
            product={product}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        </div>
      </div>

      {/* Sección Inferior: Productos Relacionados y Cross-Selling 15% OFF */}
      {activeOffer && (
        <section
          aria-label="Productos relacionados y recomendados"
          className="mt-6 pt-6 border-t border-slate-200 dark:border-zinc-800 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
                Productos relacionados y combos recomendados
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Basado en compras frecuentes de clientes de SentinelCommerce
              </p>
            </div>
          </div>

          <CrossSellingWidget
            offer={activeOffer}
            onAddCompanion={handleAddCrossSell}
          />
        </section>
      )}
    </div>
  );
};
