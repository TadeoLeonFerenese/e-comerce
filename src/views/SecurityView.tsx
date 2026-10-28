import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { ShieldAlert, ShieldCheck, Activity, Lock } from 'lucide-react';
import { useCommerceStore } from '../store/useCommerceStore';
import { useThemeStore } from '../store/useThemeStore';
import { LiveTransactionsTable } from '../components/organisms/LiveTransactionsTable';
import { ForensicMitigationDrawer } from '../components/organisms/ForensicMitigationDrawer';

export const SecurityView: React.FC = () => {
  const theme = useThemeStore((s) => s.theme);
  const {
    transactions,
    trafficSeries,
    riskFilter,
    selectedTransactionId,
    setRiskFilter,
    setSelectedTransactionId,
    runForensicAnalysis,
    mitigateTransaction,
  } = useCommerceStore();

  const approvedCount = transactions.filter((t) => t.status === 'approved').length;
  const blockedCount = transactions.filter((t) => t.status === 'blocked').length;
  const flaggedCount = transactions.filter((t) => t.status === 'flagged').length;
  const avgRiskScore =
    transactions.length > 0
      ? Math.round(
          transactions.reduce((acc, item) => acc + item.riskScore, 0) / transactions.length
        )
      : 0;

  const activeTransaction =
    transactions.find((t) => t.id === selectedTransactionId) ?? transactions[0] ?? null;

  const axisColor = theme === 'dark' ? '#a1a1aa' : '#475569';
  const gridColor = theme === 'dark' ? '#27272a' : '#e2e8f0';

  return (
    <div className="max-w-7xl mx-auto p-2.5 sm:p-6 flex flex-col gap-3 sm:gap-6 h-fit">
      {/* KPIs Superiores del Escudo Antifraude */}
      <section
        aria-label="KPIs del Escudo de Fraude"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 h-fit"
      >
        <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-[#27272a] rounded-xl p-3.5 sm:p-6 shadow-sm h-fit">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
            <span>Tráfico Legítimo</span>
            <ShieldCheck className="w-4 h-4 text-[#16a34a]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 mt-2">
            {approvedCount} ops
          </p>
          <p className="text-xs text-[#16a34a] mt-1">Verificadas sin fricción</p>
        </div>

        <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-[#27272a] rounded-xl p-3.5 sm:p-6 shadow-sm h-fit">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
            <span>Amenazas Bloqueadas</span>
            <Lock className="w-4 h-4 text-rose-600" />
          </div>
          <p
            data-testid="kpi-blocked-count"
            className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2"
          >
            {blockedCount} bloqueos
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Mitigación activa por IP/ASN
          </p>
        </div>

        <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-[#27272a] rounded-xl p-3.5 sm:p-6 shadow-sm h-fit">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
            <span>Alertas en Revisión</span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <p
            data-testid="kpi-flagged-count"
            className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2"
          >
            {flaggedCount} pendientes
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Requieren Forense IA
          </p>
        </div>

        <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-[#27272a] rounded-xl p-3.5 sm:p-6 shadow-sm h-fit">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
            <span>Score Riesgo Promedio</span>
            <Activity className="w-4 h-4 text-[#2563eb]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 mt-2">
            {avgRiskScore}/100
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Motor heurístico en tiempo real
          </p>
        </div>
      </section>

      {/* Gráfico Recharts (Tráfico Legítimo vs Bloqueado) + Drawer Forense IA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 h-fit">
        <section
          aria-label="Gráfico de Tráfico Legítimo vs Bloqueado"
          className="lg:col-span-7 bg-white dark:bg-[#121215] border border-slate-200 dark:border-[#27272a] rounded-xl p-3.5 sm:p-6 shadow-sm flex flex-col gap-3 h-fit"
        >
          <div className="h-fit">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
              Tráfico Legítimo vs. Intentos Bloqueados (Tiempo Real)
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Correlación horaria entre ventas orgánicas y ráfagas de fraude interceptadas
            </p>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="slot" stroke={axisColor} fontSize={12} />
                <YAxis stroke={axisColor} fontSize={12} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="legitimateCount"
                  name="Tráfico Legítimo"
                  stroke="#16a34a"
                  fill="#16a34a"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="blockedCount"
                  name="Amenazas Bloqueadas"
                  stroke="#e11d48"
                  fill="#e11d48"
                  fillOpacity={0.25}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className="lg:col-span-5 h-fit">
          <ForensicMitigationDrawer
            transaction={activeTransaction}
            onClose={() => setSelectedTransactionId(null)}
            onRunForensic={runForensicAnalysis}
            onMitigate={mitigateTransaction}
          />
        </div>
      </div>

      {/* Tabla de Transacciones en Vivo */}
      <LiveTransactionsTable
        transactions={transactions}
        riskFilter={riskFilter}
        selectedTransactionId={activeTransaction?.id ?? null}
        onFilterChange={setRiskFilter}
        onSelectTransaction={setSelectedTransactionId}
      />
    </div>
  );
};
