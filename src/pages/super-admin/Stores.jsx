import { useState } from "react";
import { Store, Users, Package, CreditCard, Search, ChevronDown } from "../../lib/icons.js";

const STORES = [
  { id: 1, name: "TechZone", admin: "Carlos Méndez", email: "carlos@techzone.com", plan: "Pro", widgets: 5, products: 340, status: "active", registered: "2026-05-10" },
  { id: 2, name: "FashionShop", admin: "Ana López", email: "ana@fashionshop.com", plan: "Starter", widgets: 3, products: 85, status: "active", registered: "2026-06-01" },
  { id: 3, name: "HomeDecor", admin: "Pedro Ramírez", email: "pedro@homedecor.com", plan: "Enterprise", widgets: 7, products: 520, status: "active", registered: "2026-04-20" },
  { id: 4, name: "SportMax", admin: "Laura Gómez", email: "laura@sportmax.com", plan: "Pro", widgets: 4, products: 210, status: "active", registered: "2026-06-15" },
  { id: 5, name: "GadgetHub", admin: "Miguel Rojas", email: "miguel@gadgethub.com", plan: "Starter", widgets: 2, products: 45, status: "inactive", registered: "2026-07-01" },
  { id: 6, name: "BookMarket", admin: "Sofía Torres", email: "sofia@bookmarket.com", plan: "Gratis", widgets: 1, products: 12, status: "active", registered: "2026-07-14" },
  { id: 7, name: "GreenLife", admin: "Jorge Castro", email: "jorge@greenlife.com", plan: "Pro", widgets: 4, products: 185, status: "active", registered: "2026-05-25" },
  { id: 8, name: "AutoParts", admin: "Ricardo Díaz", email: "ricardo@autoparts.com", plan: "Enterprise", widgets: 6, products: 430, status: "active", registered: "2026-03-10" },
  { id: 9, name: "PetShop", admin: "Valentina Paz", email: "valentina@petshop.com", plan: "Starter", widgets: 3, products: 67, status: "inactive", registered: "2026-07-08" },
];

const PLAN_COLORS = {
  "Enterprise": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  "Pro": "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
  "Starter": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Gratis": "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export default function Stores() {
  const [search, setSearch] = useState("");

  const filtered = STORES.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.admin.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tiendas</h1>
          <p className="text-sm text-gray-400 mt-0.5">Todas las tiendas registradas en la plataforma</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="input pl-9 text-sm w-60" placeholder="Buscar tienda o admin..." />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
            <Store size={18} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{STORES.filter(s => s.status === "active").length}</p>
            <p className="text-xs text-gray-400">Tiendas activas</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Store size={18} className="text-gray-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{STORES.filter(s => s.status === "inactive").length}</p>
            <p className="text-xs text-gray-400">Inactivas</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
            <CreditCard size={18} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              ${STORES.filter(s => s.plan === "Enterprise").length * 199 + STORES.filter(s => s.plan === "Pro").length * 79 + STORES.filter(s => s.plan === "Starter").length * 29}/mes
            </p>
            <p className="text-xs text-gray-400">Ingreso recurrente</p>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="table-base">
          <thead>
            <tr><th>Tienda</th><th>Admin</th><th>Plan</th><th>Widgets</th><th>Productos</th><th>Registro</th><th>Estado</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{s.name}</p>
                </td>
                <td>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{s.admin}</p>
                  <p className="text-xs text-gray-400">{s.email}</p>
                </td>
                <td>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${PLAN_COLORS[s.plan]}`}>{s.plan}</span>
                </td>
                <td className="text-sm text-gray-600 dark:text-gray-400">{s.widgets}</td>
                <td className="text-sm text-gray-600 dark:text-gray-400">{s.products}</td>
                <td className="text-sm text-gray-500">{s.registered}</td>
                <td>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    s.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                  }`}>{s.status === "active" ? "Activo" : "Inactivo"}</span>
                </td>
                <td>
                  <button className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-gray-600">
                    <ChevronDown size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
