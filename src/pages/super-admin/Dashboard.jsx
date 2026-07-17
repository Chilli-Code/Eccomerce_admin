import { Store, Users, Package, CreditCard, TrendingUp, TrendingDown } from "../../lib/icons.js";

const STATS = [
  { id: "stores", label: "Tiendas activas", value: 12, icon: Store, change: "+2", positive: true },
  { id: "admins", label: "Admins registrados", value: 24, icon: Users, change: "+5", positive: true },
  { id: "widgets", label: "Widgets disponibles", value: 8, icon: Package, change: "+1", positive: true },
  { id: "plans", label: "Planes activos", value: 3, icon: CreditCard, change: "0", positive: true },
];

const RECENT_STORES = [
  { name: "TechZone", admin: "Carlos Méndez", plan: "Pro", date: "2026-07-14" },
  { name: "FashionShop", admin: "Ana López", plan: "Starter", date: "2026-07-12" },
  { name: "HomeDecor", admin: "Pedro Ramírez", plan: "Enterprise", date: "2026-07-10" },
  { name: "SportMax", admin: "Laura Gómez", plan: "Pro", date: "2026-07-08" },
];

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Panel Super Admin</h1>
          <p className="text-sm text-gray-400 mt-0.5">Métricas globales de la plataforma</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.id} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                <s.icon size={18} className="text-purple-600 dark:text-purple-400" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${s.positive ? "text-emerald-600" : "text-red-500"}`}>
                {s.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {s.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Distribución de planes</h3>
          <div className="space-y-3">
            {[
              { name: "Gratis", count: 3, color: "bg-gray-300", pct: 25 },
              { name: "Starter", count: 5, color: "bg-blue-500", pct: 42 },
              { name: "Pro", count: 3, color: "bg-primary-500", pct: 25 },
              { name: "Enterprise", count: 1, color: "bg-purple-500", pct: 8 },
            ].map(p => (
              <div key={p.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{p.name}</span>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">{p.count} tiendas</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${p.color}`} style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Últimas tiendas registradas</h3>
          <div className="space-y-3">
            {RECENT_STORES.map(s => (
              <div key={s.name} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{s.name}</p>
                  <p className="text-xs text-gray-400">Admin: {s.admin}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    s.plan === "Enterprise" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" :
                    s.plan === "Pro" ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300" :
                    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  }`}>{s.plan}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
