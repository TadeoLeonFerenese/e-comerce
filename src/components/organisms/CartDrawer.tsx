import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';
import { useCommerceStore } from '../../store/useCommerceStore';
import { useAuthStore } from '../../store/useAuthStore';
import type { IdentitySimulationMode } from '../../contracts/commerce.schema';
import { Button } from '../atoms/Button';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
    simulateCheckout,
  } = useCommerceStore();
  const currentUser = useAuthStore((s) => s.currentUser);
  const isAdmin = currentUser?.role === 'admin';

  if (!isCartDrawerOpen) return null;

  const totalUnits = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce(
    (acc, item) => acc + item.unitPriceApplied * item.quantity,
    0
  );

  const handleCheckout = (mode: IdentitySimulationMode) => {
    simulateCheckout(mode);
    setCartDrawerOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Carrito de compras"
      className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        onClick={() => setCartDrawerOpen(false)}
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-white dark:bg-zinc-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100">
          {/* Header */}
          <div className="px-4 sm:px-5 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
              <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100 truncate">
                Tu Carrito ({totalUnits})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setCartDrawerOpen(false)}
              aria-label="Cerrar carrito"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3 sm:space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 gap-3 text-slate-500 dark:text-zinc-400">
                <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-zinc-700 stroke-1" />
                <p className="text-sm font-semibold">Tu carrito está vacío</p>
                <p className="text-xs max-w-xs">
                  ¡Explorá nuestro catálogo de tecnología y hardware de alto rendimiento!
                </p>
                <Button
                  variant="secondary"
                  onClick={() => setCartDrawerOpen(false)}
                  className="mt-2 text-xs"
                >
                  Continuar explorando
                </Button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.isCrossSellBundle ? 'bundle' : 'single'}`}
                  className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60 shadow-2xs"
                >
                  <img
                    src={item.product.thumbnailUrl ?? item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg border border-slate-200 dark:border-zinc-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-zinc-100 line-clamp-2 leading-snug">
                          {item.product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          aria-label={`Eliminar ${item.product.name} del carrito`}
                          className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 p-1 -mr-1 -mt-0.5 cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.isCrossSellBundle && (
                        <span className="inline-block px-1.5 py-0.5 mt-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 rounded">
                          Combo 15% OFF
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-2.5">
                      <div className="flex items-center border border-slate-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.product.id, item.quantity - 1)
                          }
                          aria-label="Restar una unidad"
                          className="px-2.5 py-1 text-xs text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-l-lg cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-800 dark:text-zinc-100">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.product.id, item.quantity + 1)
                          }
                          aria-label="Sumar una unidad"
                          className="px-2.5 py-1 text-xs text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-r-lg cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100">
                          ${(item.unitPriceApplied * item.quantity).toLocaleString('es-AR')}
                        </span>
                        {item.quantity > 1 && (
                          <span className="block text-[10px] text-slate-400 dark:text-zinc-500">
                            (${item.unitPriceApplied.toLocaleString('es-AR')} c/u)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-zinc-400">Subtotal:</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-zinc-100">
                  ${subtotal.toLocaleString('es-AR')}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>¡Envío gratis y Compra Protegida incluidos!</span>
              </div>

              {/* Botón Principal de Checkout */}
              <Button
                variant="primary"
                onClick={() => handleCheckout('legitimate')}
                className="w-full justify-center py-3 text-sm font-bold shadow-md bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                <Zap className="w-4 h-4 mr-1.5" />
                Finalizar Compra (${subtotal.toLocaleString('es-AR')})
              </Button>

              {/* Simuladores de Identidad para Pruebas Antifraude — Exclusivo para Administrador */}
              {isAdmin && (
                <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                    Simulador de Ataque para Auditoría IA:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleCheckout('burst_fraudster')}
                      aria-label="Comprar como Estafador Ráfaga"
                      className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 transition-colors cursor-pointer"
                    >
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>Estafador Ráfaga</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCheckout('anomalous_amount')}
                      aria-label="Comprar como Monto Anómalo"
                      className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 transition-colors cursor-pointer"
                    >
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>Monto Anómalo</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
