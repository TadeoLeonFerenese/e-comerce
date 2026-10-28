import React from 'react';
import { ShieldBan, CheckCircle2, X, Cpu, Globe, Fingerprint } from 'lucide-react';
import type { TransactionRecord } from '../../contracts/commerce.schema';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';

export interface ForensicMitigationDrawerProps {
  transaction: TransactionRecord | null;
  onClose: () => void;
  onRunForensic: (txId: string) => void;
  onMitigate: (txId: string, status: 'blocked' | 'approved') => void;
}

export const ForensicMitigationDrawer: React.FC<ForensicMitigationDrawerProps> = ({
  transaction,
  onClose,
  onRunForensic,
  onMitigate,
}) => {
  if (!transaction) return null;

  return (
    <aside
      aria-label="Drawer de Mitigación y Forense IA"
      className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-[#27272a] rounded-xl p-3.5 sm:p-6 shadow-md flex flex-col gap-4 h-fit"
    >
      <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-200 dark:border-[#27272a] h-fit">
        <div className="h-fit">
          <div className="flex items-center gap-2 h-fit">
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-zinc-100">
              Drawer de Mitigación · {transaction.id}
            </span>
            <Badge
              variant={
                transaction.status === 'blocked'
                  ? 'danger'
                  : transaction.status === 'flagged'
                    ? 'warning'
                    : 'success'
              }
            >
              Score {transaction.riskScore}/100
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Cliente: {transaction.customerName} · Ticket: ${transaction.amount.toLocaleString('es-AR')}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar Drawer de Mitigación"
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer h-fit"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Metadatos de Red y Huella Digital */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs h-fit">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 h-fit">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
            <Globe className="w-3.5 h-3.5" />
            <span>IP &amp; Geolocalización</span>
          </div>
          <p className="font-mono font-bold text-slate-900 dark:text-zinc-100 mt-1">
            {transaction.ipAddress}
          </p>
          <p className="text-slate-600 dark:text-zinc-400">{transaction.city}</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 h-fit">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
            <Fingerprint className="w-3.5 h-3.5" />
            <span>Device Fingerprint</span>
          </div>
          <p className="font-mono font-bold text-slate-900 dark:text-zinc-100 mt-1 truncate">
            {transaction.deviceFingerprint}
          </p>
          <p className="text-slate-600 dark:text-zinc-400">
            Modo: {transaction.identityMode}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 h-fit">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>Estado Operativo</span>
          </div>
          <p className="font-bold text-slate-900 dark:text-zinc-100 mt-1 uppercase">
            {transaction.status}
          </p>
          <p className="text-slate-600 dark:text-zinc-400">
            Ítems: {transaction.itemsCount}
          </p>
        </div>
      </div>

      {/* Botón de Disparo Forense IA */}
      <div className="flex flex-col gap-3 h-fit">
        <Button
          variant="primary"
          fullWidth
          onClick={() => onRunForensic(transaction.id)}
        >
          <span>🤖 Ejecutar Forense IA</span>
        </Button>

        {transaction.forensicReport && (
          <div
            role="region"
            aria-label="Resultado del Dictamen Forense IA"
            className="p-4 rounded-xl bg-slate-900 text-zinc-100 border border-zinc-700 flex flex-col gap-2.5 h-fit"
          >
            <div className="flex items-center justify-between gap-2 h-fit">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Dictamen Forense IA ({transaction.forensicReport.executedAt})
              </span>
              <Badge variant="warning">
                Confianza {transaction.forensicReport.confidenceScore}%
              </Badge>
            </div>
            <p className="text-sm font-bold text-white">
              Vector: {transaction.forensicReport.attackVector}
            </p>
            <p className="text-xs text-zinc-300">
              {transaction.forensicReport.summary}
            </p>
            <ul className="text-xs text-amber-300 space-y-1 list-disc list-inside">
              {transaction.forensicReport.triggeredRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Botones Semánticos de Mitigación (Atomic Design: danger / success) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-[#27272a] h-fit">
        <Button
          variant="danger"
          fullWidth
          onClick={() => onMitigate(transaction.id, 'blocked')}
        >
          <ShieldBan className="w-4 h-4" />
          <span>Bloquear Amenaza / IP</span>
        </Button>

        <Button
          variant="success"
          fullWidth
          onClick={() => onMitigate(transaction.id, 'approved')}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Liberar / Falso Positivo</span>
        </Button>
      </div>
    </aside>
  );
};
