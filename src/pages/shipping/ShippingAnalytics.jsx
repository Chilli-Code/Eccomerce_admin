import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line
} from "recharts";
import { shippingAnalytics } from "../../data/mock.js";
import { TrendingUp, Truck, CheckCircle, XCircle } from "../../lib/icons.js";

const CITY_COLORS = {
  bogota:       "#4f46e5",
  medellin:     "#10b981",
  cali:         "#f59e0b",
  barranquilla: "#8b5cf6",
  otros:        "#94a3b8",
};

const CITY_LABELS = {
  bogota: "Bogotá", medellin: "Medellín",
  cali: "Cali", barranquilla: "Barranquilla", otros: "Otros",
};

export default function ShippingAnalytics() {
  const totalEnvios = shippingAnalytics.byMonth.reduce((s, m) =>
    s + m.bogota + m.medellin + m.cali + m.barranquilla + m.otros, 0
  );

  const lastMonth = shippingAnalytics.byMonth.at(-1);
  const prevMonth = shippingAnalytics.byMonth.at(-2);
  const lastTotal = lastMonth.bogota + lastMonth.medellin + lastMonth.cali + lastMonth.barranquilla + lastMonth.otros;
  const prevTotal = prevMonth.bogota + prevMonth.medellin + prevMonth.cali + prevMonth.barranquilla + prevMonth.otros;
  const growth = (((lastTotal - prevTotal) / prevTotal) * 100).toFixed(1);

  // top ciudad del último mes
  const topCity = Object.entries(lastMonth)
    .filter(([k]) => k !== "month")
    .sort(([, a], [, b]) => b - a)[0];

  return (
    <div className="space-y-4">
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total envíos (6m)",  value: totalEnvios, icon: Truck,       color: "text-primary-600 dark:text-primary-400", bg: "bg-primary-50 dark:bg-primary-900/30" },
          { label: "Este mes",           value: lastTotal,   icon: TrendingUp,  color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Crecimiento vs mes anterior", value: `${growth > 0 ? "+" : ""}${growth}%`, icon: TrendingUp, color: growth > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500", bg: growth > 0 ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-red-50 dark:bg-red-900/20" },
          { label: "Ciudad líder",       value: CITY_LABELS[topCity[0]], icon: CheckCircle, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
        ].map(k => (
          <div key={k.label} className="card px-4 py-3 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${k.bg}`}>
              <k.icon size={16} className={k.color} />
            </div>
            <div>
              <p className="text-xs text-gray-400">{k.label}</p>
              <p className={`text-lg font-semibold ${k.color}`}>{k.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Envíos por ciudad por mes - Stacked bar */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Envíos por ciudad / mes</h2>
          <p className="text-xs text-gray-400 mb-4">Volumen de envíos por ciudad en los últimos 6 meses</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={shippingAnalytics.byMonth} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-800" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {Object.entries(CITY_COLORS).map(([key, color]) => (
                <Bar key={key} dataKey={key} name={CITY_LABELS[key]} stackId="a" fill={color}
                  radius={key === "otros" ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tendencia por ciudad - Lines */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Tendencia por ciudad</h2>
          <p className="text-xs text-gray-400 mb-4">Evolución mensual de las principales ciudades</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={shippingAnalytics.byMonth}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-800" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {Object.entries(CITY_COLORS).slice(0, 4).map(([key, color]) => (
                <Line key={key} type="monotone" dataKey={key} name={CITY_LABELS[key]}
                  stroke={color} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rendimiento por transportadora */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Rendimiento por transportadora</h2>
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>Transportadora</th>
                <th>Entregados</th>
                <th>En tránsito</th>
                <th>Fallidos</th>
                <th>Tasa de éxito</th>
              </tr>
            </thead>
            <tbody>
              {shippingAnalytics.byCarrier.map(c => {
                const total = c.entregas + c.enTransito + c.fallidos;
                const rate  = ((c.entregas / total) * 100).toFixed(1);
                return (
                  <tr key={c.carrier}>
                    <td className="font-medium text-gray-800 dark:text-gray-200">{c.carrier}</td>
                    <td>
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle size={13} /> {c.entregas}
                      </span>
                    </td>
                    <td className="text-primary-600 dark:text-primary-400 font-semibold">{c.enTransito}</td>
                    <td>
                      <span className="flex items-center gap-1.5 text-red-500 font-semibold">
                        <XCircle size={13} /> {c.fallidos}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${rate}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-10">{rate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}