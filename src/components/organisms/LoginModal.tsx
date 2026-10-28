import React, { useState } from 'react';
import { X, Lock, Mail, KeyRound, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../atoms/Button';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, authError, setLoginModalOpen, login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(email, password);
    if (ok) {
      setEmail('');
      setPassword('');
    }
  };

  const handleQuickFill = (targetEmail: string, targetPass: string) => {
    setEmail(targetEmail);
    setPassword(targetPass);
    login(targetEmail, targetPass);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Iniciar sesión en SentinelCommerce"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        onClick={() => setLoginModalOpen(false)}
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs"
      />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl p-6 flex flex-col gap-5 text-slate-900 dark:text-zinc-100">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">Iniciar Sesión</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Acceso a cuenta y permisos de usuario
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLoginModalOpen(false)}
            aria-label="Cerrar modal de inicio de sesión"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {authError && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300"
          >
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-email"
              className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
            >
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                aria-label="Correo electrónico"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-password"
              className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
            >
              Contraseña
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                aria-label="Contraseña"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth>
            Ingresar a mi cuenta
          </Button>
        </form>

        {/* Accesos rápidos para pruebas locales */}
        <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500">
            Cuentas preconfiguradas (Click para acceso rápido):
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@sentinel.com', 'admin123')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Entrar como Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('cliente@sentinel.com', 'cliente123')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Entrar como Cliente</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
