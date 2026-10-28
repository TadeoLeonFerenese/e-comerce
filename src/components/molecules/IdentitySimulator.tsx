import React from 'react';
import { ShieldCheck, Zap, AlertTriangle } from 'lucide-react';
import type { IdentitySimulationMode } from '../../contracts/commerce.schema';
import { Button } from '../atoms/Button';

export interface IdentitySimulatorProps {
  onSimulateCheckout: (mode: IdentitySimulationMode) => void;
  disabled?: boolean;
}

export const IdentitySimulator: React.FC<IdentitySimulatorProps> = ({
  onSimulateCheckout,
  disabled = false,
}) => {
  return (
    <div
      role="region"
      aria-label="Simulador de Identidad para Demo"
      className="p-3.5 sm:p-4 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-[#27272a] flex flex-col gap-3 h-fit"
    >
      <div className="h-fit">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-200">
          Modo Demo: Simulador de Identidad en Checkout
        </p>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Dispará una compra con distintos perfiles para auditar su impacto en las herramientas del Administrador
        </p>
      </div>

      <div className="flex flex-col gap-2 h-fit">
        <Button
          variant="success"
          size="sm"
          fullWidth
          disabled={disabled}
          onClick={() => onSimulateCheckout('legitimate')}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Comprar como Usuario Legítimo</span>
        </Button>

        <Button
          variant="danger"
          size="sm"
          fullWidth
          disabled={disabled}
          onClick={() => onSimulateCheckout('burst_fraudster')}
        >
          <Zap className="w-4 h-4" />
          <span>Comprar como Estafador Ráfaga</span>
        </Button>

        <Button
          variant="secondary"
          size="sm"
          fullWidth
          disabled={disabled}
          onClick={() => onSimulateCheckout('anomalous_amount')}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Comprar con Monto Anómalo</span>
        </Button>
      </div>
    </div>
  );
};
