import React from 'react';
import { ShieldCheck, ShoppingCart, ShieldAlert, BarChart3, ShoppingBag } from 'lucide-react';
import { UserConfigMenu } from '../molecules/UserConfigMenu';
import { useThemeStore } from '../../store/useThemeStore';
import { useCommerceStore } from '../../store/useCommerceStore';
import { useAuthStore } from '../../store/useAuthStore';

export const AppHeader: React.FC = () => {
  const { role, adminTab, setRole, setAdminTab } = useThemeStore();
  const currentUser = useAuthStore((s) => s.currentUser);
  const transactions = useCommerceStore((s) => s.transactions);
  const cart = useCommerceStore((s) => s.cart);
  const setCartDrawerOpen = useCommerceStore((s) => s.setCartDrawerOpen);

  const flaggedCount = transactions.filter((t) => t.status === 'flagged').length;
  const totalCartUnits = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isAdminAuthenticated = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-30 bg-slate-900 dark:bg-[#16181f] text-white border-b border-slate-800 dark:border-zinc-800/80 shadow-sm h-fit">
      <div className="max-w-7xl mx-auto px-3 py-3 sm:px-6 sm:py-4 flex flex-col gap-3 h-fit">
        <div className="flex items-center justify-between gap-3 h-fit">
          <div className="flex items-center gap-3 h-fit">
            <div
              aria-label="Logo SentinelCommerce"
              className="relative p-2.5 rounded-xl bg-gradient-to-br from-[#2563eb] to-blue-700 text-white shadow-sm h-fit flex items-center justify-center"
            >
              <ShoppingCart className="w-5 h-5 stroke-[2.2]" />
              <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#16a34a] text-white ring-2 ring-slate-900 dark:ring-[#16181f] flex items-center justify-center">
                <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
              </span>
            </div>
            <div className="flex flex-col gap-0.5 h-fit">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white leading-tight">
                SentinelCommerce
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-slate-400 dark:text-zinc-400">
                <span>Tecnología &amp; Hardware</span>
                <span className="text-slate-600 dark:text-zinc-600" aria-hidden="true">
                  •
                </span>
                <span className="inline-flex items-center gap-1.5 text-emerald-400/90 font-medium">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                  <span>Escudo IA Activo</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Botón Carrito en Navbar */}
            <button
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              aria-label={`Ver carrito de compras con ${totalCartUnits} productos`}
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-700 dark:border-zinc-700 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Carrito</span>
              {totalCartUnits > 0 && (
                <span
                  data-testid="navbar-cart-badge"
                  className="px-1.5 py-0.2 bg-blue-600 text-white text-[11px] font-bold rounded-full min-w-[18px] text-center"
                >
                  {totalCartUnits}
                </span>
              )}
            </button>

            {/* Apartado de Mi Configuración (Modo Claro/Oscuro, Login y Acceso Privado Admin) */}
            <UserConfigMenu />
          </div>
        </div>

        {/* Barra de Herramientas del Backoffice — SOLO visible cuando el Administrador autenticado está dentro del Backoffice */}
        {isAdminAuthenticated && role === 'admin' && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 dark:border-zinc-800 h-fit">
            <div
              role="tablist"
              aria-label="Herramientas del Administrador"
              className="inline-flex items-center bg-slate-800 dark:bg-[#09090b] p-1 rounded-xl border border-slate-700 dark:border-[#27272a] h-fit"
            >
              <button
                type="button"
                role="tab"
                aria-selected={adminTab === 'security'}
                onClick={() => setAdminTab('security')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  adminTab === 'security'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-300 dark:text-zinc-400 hover:text-white dark:hover:text-zinc-100'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Escudo de Fraude</span>
                {flaggedCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] rounded-md bg-white/20 text-white font-bold">
                    {flaggedCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={adminTab === 'marketing'}
                onClick={() => setAdminTab('marketing')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  adminTab === 'marketing'
                    ? 'bg-[#f97316] text-white shadow-sm'
                    : 'text-slate-300 dark:text-zinc-400 hover:text-white dark:hover:text-zinc-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Inteligencia Comercial</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setRole('client')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
              <span>Volver a la Tienda</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
