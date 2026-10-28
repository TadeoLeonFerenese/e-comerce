import React, { useState } from 'react';
import { Eye, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import type { TransactionRecord, TransactionStatus } from '../../contracts/commerce.schema';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';

export interface LiveTransactionsTableProps {
  transactions: TransactionRecord[];
  riskFilter: 'all' | TransactionStatus;
  selectedTransactionId: string | null;
  onFilterChange: (filter: 'all' | TransactionStatus) => void;
  onSelectTransaction: (txId: string) => void;
}

function getStatusBadge(status: TransactionStatus) {
  if (status === 'approved') {
    return <Badge variant="success">Legítima</Badge>;
  }
  if (status === 'flagged') {
    return <Badge variant="warning">En Revisión IA</Badge>;
  }
  return <Badge variant="danger">Bloqueada</Badge>;
}

function getIdentityLabel(mode: TransactionRecord['identityMode']): string {
  if (mode === 'burst_fraudster') return 'Estafador Ráfaga';
  if (mode === 'anomalous_amount') return 'Monto Anómalo';
  return 'Usuario Legítimo';
}

export const LiveTransactionsTable: React.FC<LiveTransactionsTableProps> = ({
  transactions,
  riskFilter,
  selectedTransactionId,
  onFilterChange,
  onSelectTransaction,
}) => {
  const [showAllMobile, setShowAllMobile] = useState(false);

  const filtered =
    riskFilter === 'all'
      ? transactions
      : transactions.filter((t) => t.status === riskFilter);

  const mobileItems = showAllMobile ? filtered.slice(0, 10) : filtered.slice(0, 3);
  const desktopItems = filtered.slice(0, 10);

  return (
    <section
      aria-label="Tabla de Transacciones en Vivo"
      className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-[#27272a] rounded-xl p-3.5 sm:p-6 shadow-sm h-fit"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-[#27272a] h-fit">
        <div className="h-fit">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
            Telemetría de Transacciones en Vivo
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Seleccioná cualquier operación para abrir el Drawer de Mitigación y ejecutar el Forense IA
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-200 dark:border-zinc-800 h-fit">
          <Filter className="w-3.5 h-3.5 text-slate-500 ml-2" />
          {(['all', 'flagged', 'approved', 'blocked'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => onFilterChange(status)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                riskFilter === status
                  ? 'bg-[#2563eb] text-white'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
              }`}
            >
              {status === 'all'
                ? 'Todas'
                : status === 'flagged'
                  ? 'Sospechosas'
                  : status === 'approved'
                    ? 'Legítimas'
                    : 'Bloqueadas'}
            </button>
          ))}
        </div>
      </div>

      {/* Vista Mobile-First: Paginación Adaptativa (máximo 3 iniciales con Ver más / Ver menos) */}
      <div className="md:hidden flex flex-col gap-3 pt-3 h-fit" data-testid="mobile-tx-list">
        {mobileItems.map((tx) => (
          <div
            key={tx.id}
            className={`p-3 rounded-xl border transition-all h-fit ${
              selectedTransactionId === tx.id
                ? 'border-[#2563eb] bg-blue-50/40 dark:bg-blue-950/20'
                : 'border-slate-200 dark:border-[#27272a] bg-slate-50/60 dark:bg-zinc-900/50'
            }`}
          >
            <div className="flex items-center justify-between gap-2 h-fit">
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-zinc-100">
                {tx.id} · {tx.timestamp}
              </span>
              {getStatusBadge(tx.status)}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-600 dark:text-zinc-300 h-fit">
              <span>{tx.customerName} ({getIdentityLabel(tx.identityMode)})</span>
              <span className="font-bold text-slate-900 dark:text-zinc-100">
                ${tx.amount.toLocaleString('es-AR')}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 h-fit">
              <span className="text-xs text-slate-500 dark:text-zinc-400">
                Riesgo: <strong>{tx.riskScore}/100</strong> · {tx.city}
              </span>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onSelectTransaction(tx.id)}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Auditar / Mitigar</span>
              </Button>
            </div>
          </div>
        ))}

        {filtered.length > 3 && (
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            onClick={() => setShowAllMobile((prev) => !prev)}
          >
            {showAllMobile ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Ver menos</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>Ver más ({filtered.length - 3} adicionales)</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* Vista Desktop: 10 elementos en tabla simétrica */}
      <div className="hidden md:block overflow-x-auto pt-4 h-fit" data-testid="desktop-tx-table">
        <table className="w-full text-left border-collapse h-fit">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#27272a] text-xs uppercase text-slate-500 dark:text-zinc-400">
              <th className="py-2.5 px-3">ID / Hora</th>
              <th className="py-2.5 px-3">Cliente &amp; Perfil</th>
              <th className="py-2.5 px-3">Origen / IP</th>
              <th className="py-2.5 px-3">Monto</th>
              <th className="py-2.5 px-3">Score Riesgo</th>
              <th className="py-2.5 px-3">Estado</th>
              <th className="py-2.5 px-3 text-right">Acción Táctica</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-[#27272a] text-sm">
            {desktopItems.map((tx) => (
              <tr
                key={tx.id}
                className={`transition-colors ${
                  selectedTransactionId === tx.id
                    ? 'bg-blue-50/60 dark:bg-blue-950/30'
                    : 'hover:bg-slate-50 dark:hover:bg-zinc-900/60'
                }`}
              >
                <td className="py-3 px-3 font-mono text-xs font-semibold text-slate-900 dark:text-zinc-100">
                  <div>{tx.id}</div>
                  <div className="text-slate-500 dark:text-zinc-400">{tx.timestamp}</div>
                </td>
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-900 dark:text-zinc-100">
                    {tx.customerName}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-zinc-400">
                    {getIdentityLabel(tx.identityMode)}
                    {tx.crossSellApplied && ' · Combo 15% OFF'}
                  </div>
                </td>
                <td className="py-3 px-3 text-xs">
                  <div className="font-medium text-slate-800 dark:text-zinc-200">{tx.city}</div>
                  <div className="font-mono text-slate-500 dark:text-zinc-400">{tx.ipAddress}</div>
                </td>
                <td className="py-3 px-3 font-bold text-slate-900 dark:text-zinc-100">
                  ${tx.amount.toLocaleString('es-AR')}
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`inline-block font-mono text-xs font-bold px-2 py-1 rounded-lg ${
                      tx.riskScore >= 75
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                    }`}
                  >
                    {tx.riskScore}/100
                  </span>
                </td>
                <td className="py-3 px-3">{getStatusBadge(tx.status)}</td>
                <td className="py-3 px-3 text-right">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onSelectTransaction(tx.id)}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Auditar / Mitigar</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
