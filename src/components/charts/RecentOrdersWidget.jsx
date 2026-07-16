import { useState } from "react";
import { Link } from "react-router-dom";
import { SlidersHorizontal } from "../../lib/icons.js";
import { StatusBadge } from "../ui/index.jsx";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-CO", { month: "short", day: "numeric", year: "numeric" });
}

export default function RecentOrdersWidget({ orders = [] }) {
  const [filter, setFilter] = useState("all");

  const filtered = orders
    .filter(o => filter === "all" || o.status === filter)
    .slice(0, 5);

  return (
    <div className="table-wrap">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Pedidos Recientes</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="appearance-none pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-400 cursor-pointer"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="processing">Procesando</option>
              <option value="in_transit">En camino</option>
              <option value="delivered">Entregados</option>
              <option value="cancelled">Cancelados</option>
            </select>
            <SlidersHorizontal size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <Link to="/orders" className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Ver todos
          </Link>
        </div>
      </div>
<div className="overflow-x-auto">
      <table className="table-base">
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(o => (
            <tr key={o.id}>
              <td>
                <Link to={`/orders/${o.id}`} className="font-mono text-xs text-primary-600 dark:text-primary-400 hover:underline">
                  {o.id?.slice(0, 8)}...
                </Link>
              </td>
              <td className="font-semibold text-gray-800 dark:text-gray-200">${Number(o.total).toLocaleString("es-CO")}</td>
              <td><StatusBadge status={o.status} /></td>
              <td className="text-xs text-gray-400">{formatDate(o.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>

</div>

      {filtered.length === 0 && (
        <div className="py-8 text-center text-xs text-gray-400">No hay pedidos con este filtro</div>
      )}
    </div>
  );
}
