import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  ShieldCheck,
  RotateCcw,
  Award,
  ShoppingCart,
  Zap,
} from 'lucide-react';
import type { Product } from '../../contracts/commerce.schema';
import { Button } from '../atoms/Button';

interface ProductBuyBoxProps {
  product: Product;
  onAddToCart: (quantity: number) => void;
  onBuyNow: (quantity: number) => void;
}

export const ProductBuyBox: React.FC<ProductBuyBoxProps> = ({
  product,
  onAddToCart,
  onBuyNow,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const maxStock = Math.min(product.stock, 10);

  const handleBuyNow = () => {
    onBuyNow(quantity);
  };

  const handleAddToCart = () => {
    onAddToCart(quantity);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 shadow-sm flex flex-col gap-5 h-fit text-slate-800 dark:text-zinc-200">
      {/* Promesa de Entrega / Envío estilo Mercado Libre */}
      <div className="flex flex-col gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800/80">
        <div className="flex items-start gap-3">
          <Truck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex flex-col text-xs leading-relaxed">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              Llega gratis mañana
            </span>
            <span className="text-slate-500 dark:text-zinc-400">
              Comprando dentro de las próximas 4 h 15 min
            </span>
            <span className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline font-medium mt-0.5">
              Más detalles y formas de entrega
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex flex-col text-xs leading-relaxed">
            <span className="text-slate-700 dark:text-zinc-300 font-semibold">
              Retirá gratis en correos y puntos de entrega
            </span>
            <span className="text-slate-500 dark:text-zinc-400">
              Tenés un punto de retiro a menos de 500 m
            </span>
            <span className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline font-medium mt-0.5">
              Ver en el mapa
            </span>
          </div>
        </div>
      </div>

      {/* Selector de Stock */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold text-slate-900 dark:text-zinc-100">
          Stock disponible
        </span>
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400">
          <span>Cantidad:</span>
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            aria-label="Seleccionar cantidad"
            className="bg-slate-100 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {Array.from({ length: maxStock }, (_, i) => i + 1).map((qty) => (
              <option key={qty} value={qty}>
                {qty} {qty === 1 ? 'unidad' : 'unidades'}
              </option>
            ))}
          </select>
          <span className="text-slate-400 dark:text-zinc-500">
            ({product.stock} disponibles)
          </span>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-col gap-2.5 pt-1">
        <Button
          variant="primary"
          onClick={handleBuyNow}
          className="w-full justify-center py-3 text-sm font-bold shadow-md bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all"
        >
          <Zap className="w-4 h-4 mr-1.5" />
          Comprar ahora
        </Button>

        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800/70 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          Agregar al carrito
        </button>
      </div>

      {/* Vendedor y Reputación */}
      <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex flex-col gap-1.5 text-xs text-slate-500 dark:text-zinc-400">
        <div>
          <span>Vendido por </span>
          <span className="font-bold text-slate-800 dark:text-zinc-200">
            SentinelOfficial Store
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span>MercadoLíder Platinum | +10.000 ventas</span>
        </div>
        <span className="text-[11px] text-slate-400 dark:text-zinc-500">
          Brinda buena atención y despacha sus productos a tiempo.
        </span>
      </div>

      {/* Sellos de Garantía */}
      <div className="flex flex-col gap-2.5 pt-3 border-t border-slate-100 dark:border-zinc-800/80 text-xs text-slate-600 dark:text-zinc-400">
        <div className="flex items-start gap-2.5">
          <RotateCcw className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-700 dark:text-zinc-300 font-semibold">
              Devolución gratis.
            </strong>{' '}
            Tenés 30 días desde que lo recibís.
          </span>
        </div>

        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-700 dark:text-zinc-300 font-semibold">
              Compra Protegida.
            </strong>{' '}
            Recibí el producto que esperabas o te devolvemos tu dinero.
          </span>
        </div>

        <div className="flex items-start gap-2.5">
          <Award className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-700 dark:text-zinc-300 font-semibold">
              12 meses de garantía oficial.
            </strong>{' '}
            Soporte técnico directo de fábrica.
          </span>
        </div>
      </div>
    </div>
  );
};
