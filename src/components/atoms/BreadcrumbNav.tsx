import React from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface BreadcrumbNavProps {
  category: string;
  productName: string;
  onBack: () => void;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  category,
  productName,
  onBack,
}) => {
  return (
    <nav
      aria-label="Migas de pan"
      className="flex flex-wrap items-center gap-2 py-2 text-xs text-slate-500 dark:text-zinc-400 font-medium"
    >
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-semibold py-1 pr-2 border-r border-slate-300 dark:border-zinc-700"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver al listado</span>
      </button>

      <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="hover:text-slate-800 dark:hover:text-zinc-200">
          Tecnología
        </span>
        <ChevronRight className="w-3 h-3 text-slate-400 dark:text-zinc-500 shrink-0" />
        <span className="hover:text-slate-800 dark:hover:text-zinc-200">
          {category}
        </span>
        <ChevronRight className="w-3 h-3 text-slate-400 dark:text-zinc-500 shrink-0" />
        <span className="text-slate-800 dark:text-zinc-200 font-semibold truncate max-w-[200px] sm:max-w-xs">
          {productName}
        </span>
      </div>
    </nav>
  );
};
