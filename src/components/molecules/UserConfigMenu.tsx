import React, { useState } from 'react';
import {
  Settings,
  Sun,
  Moon,
  LogIn,
  LogOut,
  ShieldAlert,
  BarChart3,
  ShoppingBag,
  User,
} from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useCommerceStore } from '../../store/useCommerceStore';

export const UserConfigMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, role, adminTab, toggleTheme, setRole, setAdminTab } = useThemeStore();
  const { currentUser, setLoginModalOpen, logout } = useAuthStore();
  const transactions = useCommerceStore((s) => s.transactions);
  const flaggedCount = transactions.filter((t) => t.status === 'flagged').length;

  const isAdminUser = currentUser?.role === 'admin';

  return (
    <div className="relative h-fit">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Mi Configuración"
        aria-expanded={isOpen}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-700 dark:border-zinc-700 text-xs font-semibold text-white transition-colors cursor-pointer"
      >
        <Settings className="w-4 h-4 text-slate-300" />
        <span className="hidden sm:inline">
          {currentUser ? currentUser.name : 'Mi Configuración'}
        </span>
      </button>

      {isOpen && (
        <div
          role="region"
          aria-label="Panel de Mi Configuración"
          className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl p-4 z-50 flex flex-col gap-3 text-slate-800 dark:text-zinc-100"
        >
          {/* Sección 1: Apariencia (Toggle Switch Modo Claro / Modo Oscuro) */}
          <div className="flex flex-col gap-1.5 pb-3 border-b border-slate-100 dark:border-zinc-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              Apariencia
            </span>
            <button
              type="button"
              aria-pressed={theme === 'dark'}
              onClick={toggleTheme}
              aria-label="Alternar tema claro u oscuro"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-xs font-semibold text-slate-800 dark:text-zinc-100 transition-colors cursor-pointer"
            >
              <span>{theme === 'light' ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}</span>

              <span
                aria-hidden="true"
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  theme === 'dark' ? 'bg-[#2563eb]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                    theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                >
                  {theme === 'light' ? (
                    <Sun className="w-3 h-3 text-amber-500" />
                  ) : (
                    <Moon className="w-3 h-3 text-[#2563eb]" />
                  )}
                </span>
              </span>
            </button>
          </div>

          {/* Sección 2: Estado de Cuenta */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              Mi Cuenta
            </span>

            {!currentUser ? (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Iniciá sesión para gestionar tu perfil y preferencias.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setLoginModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Iniciar Sesión</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/70 border border-slate-200/70 dark:border-zinc-700/70">
                  <div className="p-2 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                {/* Sección Exclusiva para Administrador Autenticado */}
                {isAdminUser && (
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100 dark:border-zinc-800">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Panel de Administrador
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setRole('client');
                        setIsOpen(false);
                      }}
                      className={`w-full h-9 flex items-center gap-2.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        role === 'client'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4 shrink-0" />
                      <span>Vista Tienda</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRole('admin');
                        setAdminTab('security');
                        setIsOpen(false);
                      }}
                      className={`w-full h-9 flex items-center justify-between gap-2 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        role === 'admin' && adminTab === 'security'
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>Admin Backoffice</span>
                      </span>
                      {flaggedCount > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] leading-none rounded-md bg-rose-600 text-white font-bold shrink-0">
                          {flaggedCount}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRole('admin');
                        setAdminTab('marketing');
                        setIsOpen(false);
                      }}
                      className={`w-full h-9 flex items-center gap-2.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        role === 'admin' && adminTab === 'marketing'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      <BarChart3 className="w-4 h-4 shrink-0" />
                      <span>Inteligencia Comercial</span>
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 mt-1 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
