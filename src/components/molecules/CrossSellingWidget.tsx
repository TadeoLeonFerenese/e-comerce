import React from 'react';
import { Sparkles, PlusCircle } from 'lucide-react';
import type { CrossSellOffer } from '../../contracts/commerce.schema';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';

export interface CrossSellingWidgetProps {
  offer: CrossSellOffer | null;
  onAddCompanion: (productId: string) => void;
}

export const CrossSellingWidget: React.FC<CrossSellingWidgetProps> = ({
  offer,
  onAddCompanion,
}) => {
  if (!offer) return null;

  return (
    <div
      role="region"
      aria-label="Frecuentemente comprados juntos"
      className="p-3.5 sm:p-4 rounded-xl bg-orange-50/90 dark:bg-amber-950/25 border border-orange-200 dark:border-amber-800/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 h-fit"
    >
      <div className="flex items-center gap-3 h-fit">
        {offer.companionProduct.imageUrl && (
          <img
            src={offer.companionProduct.thumbnailUrl || offer.companionProduct.imageUrl}
            alt={offer.companionProduct.name}
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-orange-200 dark:border-amber-800/80 shrink-0"
            loading="lazy"
          />
        )}
        <div className="flex flex-col gap-1 h-fit">
          <div className="flex items-center gap-2 h-fit">
            <Sparkles className="w-4 h-4 text-[#f97316]" />
            <span className="text-xs font-bold uppercase tracking-wide text-[#f97316]">
              Frecuentemente comprados juntos (Motor SQL en Vivo)
            </span>
            <Badge variant="warning">15% OFF</Badge>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-zinc-100">
            {offer.bannerMessage}
          </p>
          <p className="text-xs text-slate-600 dark:text-zinc-300">
            Precio normal:{' '}
            <span className="line-through">${offer.companionProduct.price}</span> ·{' '}
            <strong className="text-[#16a34a]">
              Llevalo hoy por ${offer.discountedPrice}
            </strong>
          </p>
        </div>
      </div>

      <Button
        variant="primary"
        size="sm"
        onClick={() => onAddCompanion(offer.companionProduct.id)}
        className="bg-[#f97316] hover:bg-orange-600 border-orange-500 shrink-0"
      >
        <PlusCircle className="w-4 h-4" />
        <span>Sumar Combo 15% OFF</span>
      </Button>
    </div>
  );
};
