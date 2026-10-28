import React from 'react';
import { ShieldCheck, ShoppingCart } from 'lucide-react';

export const AppFooter: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-[#141418] border-t-2 border-slate-200 dark:border-[#27272a] px-3 py-4 sm:px-6 mt-8 h-fit">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-zinc-400 h-fit">
        <div className="flex items-center gap-2 h-fit">
          <span className="relative inline-flex items-center justify-center p-1.5 rounded-lg bg-[#2563eb] text-white">
            <ShoppingCart className="w-3.5 h-3.5" />
            <ShieldCheck className="w-2.5 h-2.5 text-white bg-[#16a34a] rounded-full absolute -bottom-0.5 -right-0.5" />
          </span>
          <span className="font-bold text-slate-800 dark:text-zinc-200">
            SentinelCommerce
          </span>
          <span>· Tecnología, Hardware &amp; Compra Protegida</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 h-fit">
          <span>Pagos Seguros · Envío a todo el país · Garantía Oficial</span>
          <span className="hidden sm:inline text-slate-300 dark:text-zinc-700">|</span>
          <span className="inline-flex items-center gap-1.5 font-medium text-[#16a34a]">
            <span className="w-2 h-2 rounded-full bg-[#16a34a]" />
            Compra Protegida 24/7
          </span>
        </div>
      </div>
    </footer>
  );
};
