import React from 'react';
import { ShieldAlert, ShoppingBag, Sun, Moon, BarChart3 } from 'lucide-react';
import type { AdminToolTab, ThemeMode, UserRole } from '../../contracts/commerce.schema';

export interface RoleSwitcherProps {
  role: UserRole;
  adminTab: AdminToolTab;
  theme: ThemeMode;
  flaggedCount: number;
  onRoleChange: (role: UserRole) => void;
  onAdminTabChange: (tab: AdminToolTab) => void;
  onToggleTheme: () => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  role,
  adminTab,
  theme,
  flaggedCount,
  onRoleChange,
  onAdminTabChange,
  onToggleTheme,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 w-full h-fit">
      {/* Conmutador de Rol Principal */}
      <div
        role="group"
        aria-label="Selector de Rol de Demostración"
        className="inline-flex items-center bg-slate-800 dark:bg-[#09090b] p-1 rounded-xl border border-slate-700 dark:border-[#27272a] h-fit"
      >
        <button
          type="button"
          onClick={() => onRoleChange('client')}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            role === 'client'
              ? 'bg-[#2563eb] text-white shadow-sm'
              : 'text-slate-300 dark:text-zinc-400 hover:text-white dark:hover:text-zinc-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>🛍️ Ver como Cliente (Tienda)</span>
        </button>

        <button
          type="button"
          onClick={() => onRoleChange('admin')}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            role === 'admin'
              ? 'bg-[#2563eb] text-white shadow-sm'
              : 'text-slate-300 dark:text-zinc-400 hover:text-white dark:hover:text-zinc-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>🛡️ Ver como Administrador (Backoffice)</span>
          {flaggedCount > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-md bg-rose-600 text-white font-bold">
              {flaggedCount}
            </span>
          )}
        </button>
      </div>

      {/* Herramientas del Administrador + Toggle Global de Tema */}
      <div className="flex flex-wrap items-center gap-2 h-fit">
        {role === 'admin' && (
          <div
            role="tablist"
            aria-label="Herramientas del Administrador"
            className="inline-flex items-center bg-slate-800 dark:bg-[#09090b] p-1 rounded-xl border border-slate-700 dark:border-[#27272a] h-fit"
          >
            <button
              type="button"
              role="tab"
              aria-selected={adminTab === 'security'}
              onClick={() => onAdminTabChange('security')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                adminTab === 'security'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-300 dark:text-zinc-400 hover:text-white dark:hover:text-zinc-100'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Escudo de Fraude</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={adminTab === 'marketing'}
              onClick={() => onAdminTabChange('marketing')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                adminTab === 'marketing'
                  ? 'bg-[#f97316] text-white shadow-sm'
                  : 'text-slate-300 dark:text-zinc-400 hover:text-white dark:hover:text-zinc-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Inteligencia Comercial</span>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label="Alternar tema claro u oscuro"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 dark:bg-[#09090b] dark:hover:bg-zinc-900 text-white border border-slate-700 dark:border-[#27272a] shadow-sm transition-all cursor-pointer h-fit"
        >
          {theme === 'light' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>☀️ Modo Claro</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-blue-400" />
              <span>🌙 Modo Táctico</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
