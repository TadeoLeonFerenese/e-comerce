import React, { useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { TrendingUp, Sparkles, DollarSign } from 'lucide-react';
import { useCommerceStore } from '../store/useCommerceStore';
import { useThemeStore } from '../store/useThemeStore';
import { GeoSalesHeatmap } from '../components/organisms/GeoSalesHeatmap';
import { Badge } from '../components/atoms/Badge';

export const MarketingView: React.FC = () => {
  const theme = useThemeStore((s) => s.theme);
  const {
    transactions,
    hourlySales,
    comboMetrics,
    geoZones,
    selectedZoneId,
    setSelectedZoneId,
    syncGeoZonesFromApi,
  } = useCommerceStore();

  useEffect(() => {
    void syncGeoZonesFromApi();
  }, [syncGeoZonesFromApi]);

  const approvedTransactions = transactions.filter((t) => t.status === 'approved');
  const totalRevenue = approvedTransactions.reduce((acc, t) => acc + t.amount, 0);
  const crossSellOrdersCount = transactions.filter((t) => t.crossSellApplied).length;
  const avgConversionRate =
    comboMetrics.length > 0
      ? (
          comboMetrics.reduce((acc, item) => acc + item.conversionRatePercent, 0) /
          comboMetrics.length
        ).toFixed(1)
      : '0.0';

  const axisColor = theme === 'dark' ? '#a1a1aa' : '#475569';
  const gridColor = theme === 'dark' ? '#27272a' : '#e2e8f0';

  return (
    <div className="max-w-7xl mx-auto p-2.5 sm:p-6 flex flex-col gap-3 sm:gap-6 h-fit">
      {/* KPIs Comerciales Superiores */}
      <section
        aria-label="KPIs de Inteligencia Comercial"
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 h-fit"
      >
        <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-[#27272a] rounded-xl p-3.5 sm:p-6 shadow-sm h-fit">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
            <span>Facturación Verificada</span>
            <DollarSign className="w-4 h-4 text-[#16a34a]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 mt-2">
            ${totalRevenue.toLocaleString('es-AR')}
          </p>
          <p className="text-xs text-[#16a34a] mt-1">
            Excluye intentos bloqueados por el Escudo IA
          </p>
        </div>

        <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-[#27272a] rounded-xl p-3.5 sm:p-6 shadow-sm h-fit">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
            <span>Conversión Motor Cross-Selling</span>
            <Sparkles className="w-4 h-4 text-[#f97316]" />
          </div>
          <p
            data-testid="marketing-cross-sell-rate"
            className="text-xl sm:text-2xl font-bold text-[#f97316] mt-2"
          >
            {avgConversionRate}%
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Aceptación promedio de combos con 15% OFF
          </p>
        </div>

        <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-[#27272a] rounded-xl p-3.5 sm:p-6 shadow-sm h-fit">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
            <span>Órdenes con Combo Aplicado</span>
            <TrendingUp className="w-4 h-4 text-[#2563eb]" />
          </div>
          <p
            data-testid="marketing-combo-orders"
            className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 mt-2"
          >
            {crossSellOrdersCount} órdenes
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Alimentado en vivo por correlación SQL
          </p>
        </div>
      </section>

      {/* Mapa de Calor React-Leaflet (Zonas Comerciales & Productos) + Ventas por Hora Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 h-fit">
        <div className="lg:col-span-7 h-fit">
          <GeoSalesHeatmap
            theme={theme}
            transactions={transactions}
            geoZones={geoZones}
            selectedZoneId={selectedZoneId}
            onSelectZone={setSelectedZoneId}
            onRefreshZones={() => {
              void syncGeoZonesFromApi();
            }}
          />
        </div>

        <section
          aria-label="Gráfico de Ventas por Hora"
          className="lg:col-span-5 bg-white dark:bg-[#121215] border border-slate-200 dark:border-[#27272a] rounded-xl p-3.5 sm:p-6 shadow-sm flex flex-col gap-3 h-fit"
        >
          <div className="h-fit">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
              Ventas por Hora &amp; Tracción de Combos
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Evolución horaria de ingresos y órdenes con Cross-Selling
            </p>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="hour" stroke={axisColor} fontSize={12} />
                <YAxis stroke={axisColor} fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="revenue"
                  name="Facturación ($)"
                  fill="#2563eb"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="crossSellOrders"
                  name="Combos 15% OFF"
                  fill="#f97316"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Rendimiento de Combos de Cross-Selling SQL */}
      <section
        aria-label="Métricas de Conversión de Combos Cross-Selling"
        className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-[#27272a] rounded-xl p-3.5 sm:p-6 shadow-sm flex flex-col gap-4 h-fit"
      >
        <div className="h-fit">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
            Rendimiento de Correlación SQL — Combos &quot;Frecuentemente Comprados Juntos&quot;
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Métricas en vivo de conversión de pares detectados por el motor de recomendaciones
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 h-fit">
          {comboMetrics.map((combo) => (
            <div
              key={combo.comboId}
              className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-[#27272a] flex flex-col justify-between gap-3 h-fit"
            >
              <div className="flex items-center justify-between gap-2 h-fit">
                <Badge variant="warning">15% OFF Combo</Badge>
                <span className="text-xs font-bold text-[#16a34a]">
                  {combo.conversionRatePercent}% conversión
                </span>
              </div>

              <div className="text-xs space-y-1 h-fit">
                <p className="font-bold text-slate-900 dark:text-zinc-100">
                  {combo.primaryProductName}
                </p>
                <p className="text-slate-500 dark:text-zinc-400">
                  + {combo.companionProductName}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 h-fit">
                <span>Impresiones: {combo.impressions}</span>
                <span className="font-semibold text-slate-900 dark:text-zinc-100">
                  Ventas: {combo.conversions}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
