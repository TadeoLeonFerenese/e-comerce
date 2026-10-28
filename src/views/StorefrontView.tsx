import React, { useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Truck,
  Star,
  ArrowRight,
} from 'lucide-react';
import { useCommerceStore } from '../store/useCommerceStore';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import type { ProductCategory } from '../contracts/commerce.schema';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';
import { CrossSellingWidget } from '../components/molecules/CrossSellingWidget';

const CATEGORIES: ProductCategory[] = [
  'Todos',
  'Hardware & Gaming',
  'Audio Pro',
  'Seguridad & Redes',
  'Accesorios',
];

export const StorefrontView: React.FC = () => {
  const {
    products,
    selectedCategory,
    searchQuery,
    activeProductId,
    lastSimulationBanner,
    setSearchQuery,
    setSelectedCategory,
    openProductDetail,
    getCrossSellOfferForProduct,
    addToCart,
    setCartDrawerOpen,
    syncProductsFromApi,
  } = useCommerceStore();

  useEffect(() => {
    void syncProductsFromApi();
  }, [syncProductsFromApi]);

  const { setRole, setAdminTab } = useThemeStore();
  const currentUser = useAuthStore((s) => s.currentUser);
  const isAdmin = currentUser?.role === 'admin';

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeOffer = getCrossSellOfferForProduct(activeProductId);

  return (
    <div className="max-w-7xl mx-auto p-2.5 sm:p-6 flex flex-col gap-4 sm:gap-6 h-fit">
      {/* Notificación de Impacto en Vivo — Botón de Backoffice exclusivo para rol Admin */}
      {lastSimulationBanner && (
        <div
          role="status"
          className="p-3.5 sm:p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex flex-wrap items-center justify-between gap-3 h-fit"
        >
          <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-zinc-100">
            {lastSimulationBanner}
          </span>
          {isAdmin && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                setRole('admin');
                setAdminTab('security');
              }}
            >
              <span>Ir al Escudo de Fraude</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}

      {/* Buscador Prominente y Filtros de Categoría */}
      <section
        aria-label="Buscador y Filtros del Catálogo"
        className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-[#27272a] rounded-xl p-3.5 sm:p-6 shadow-sm flex flex-col gap-3 h-fit"
      >
        <div className="relative w-full h-fit">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar placas de video, micrófonos, llaves FIDO2, routers..."
            aria-label="Buscar productos en el catálogo"
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-[#f8fafc] dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 h-fit">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === category
                  ? 'bg-[#2563eb] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Widget de Cross-Selling en el Catálogo */}
      <CrossSellingWidget
        offer={activeOffer}
        onAddCompanion={(companionId) => {
          addToCart(companionId, true);
          setCartDrawerOpen(true);
        }}
      />

      {/* Grilla Principal de Productos (Diseño Limpio y Espacioso de 3-4 columnas) */}
      <section aria-label="Catálogo de Productos" className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
            {selectedCategory === 'Todos' ? 'Todos los Productos' : selectedCategory} ({filteredProducts.length})
          </h2>
          <span className="text-xs text-slate-500 dark:text-zinc-400">
            Precios en USD · Tocá cualquier producto para ver su detalle
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-fit">
          {filteredProducts.map((product) => {
            const productOffer = getCrossSellOfferForProduct(product.id);
            return (
              <article
                key={product.id}
                onClick={() => openProductDetail(product.id)}
                className="group bg-white dark:bg-[#121215] border border-slate-200 dark:border-[#27272a] rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between gap-3 h-fit cursor-pointer"
              >
                <div className="flex flex-col gap-3 h-fit">
                  <div className="w-full h-48 overflow-hidden rounded-lg bg-slate-100 dark:bg-zinc-800 relative">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badgeText && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="primary">{product.badgeText}</Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 h-fit">
                    <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                      {product.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#16a34a] font-semibold h-fit">
                    {product.freeShipping && (
                      <span className="inline-flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" />
                        Envío Gratis
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {product.rating}
                    </span>
                  </div>
                </div>

                {/* Mini Indicador de Cross-Selling debajo de cada producto */}
                {productOffer && (
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[11px] text-slate-600 dark:text-zinc-300 h-fit">
                    <span className="font-semibold text-[#f97316]">
                      Combo disponible:
                    </span>{' '}
                    15% OFF con {productOffer.companionProduct.name}
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-zinc-800 h-fit">
                  <div className="h-fit">
                    <span className="text-lg font-extrabold text-slate-900 dark:text-zinc-100">
                      ${product.price.toLocaleString('es-AR')}
                    </span>
                    <p className="text-[11px] text-[#16a34a] font-medium">
                      En Stock ({product.stock} u.)
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product.id, false);
                      setCartDrawerOpen(true);
                    }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Agregar</span>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
