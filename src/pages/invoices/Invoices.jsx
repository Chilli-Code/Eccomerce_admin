import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Download, Plus } from "../../lib/icons.js";
import { api } from "../../lib/api.js";
import { StatusBadge, SearchInput, Pagination } from "../../components/ui/index.jsx";

const TABS = ["All", "Paid", "Pending", "Overdue"];

export default function Invoices() {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [invoicesData, setInvoicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const PER_PAGE = 6;

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.invoices.list();
        setInvoicesData(data);
      } catch (err) {
        console.error("Error loading invoices:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = invoicesData.filter(inv => {
    const matchTab = tab === "All" || inv.status === tab.toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = !q ||
      inv.id?.toLowerCase().includes(q) ||
      (inv.customerName || "").toLowerCase().includes(q) ||
      (inv.orderId || "").toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const total = invoicesData.reduce((s, i) => s + parseFloat(i.amount || "0"), 0);
  const paid = invoicesData.filter(i => i.status === "paid").reduce((s, i) => s + parseFloat(i.amount || "0"), 0);
  const pending = invoicesData.filter(i => i.status === "pending").reduce((s, i) => s + parseFloat(i.amount || "0"), 0);
  const overdue = invoicesData.filter(i => i.status === "overdue").reduce((s, i) => s + parseFloat(i.amount || "0"), 0);

  const fmt = (v) => v.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) : "-";
  const initials = (name) => (name || "?").split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Facturas</h1>
          <p className="text-sm text-gray-400 mt-0.5">{invoicesData.length} facturas</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total facturado", value: `$${fmt(total)}`, color: "text-gray-900 dark:text-white" },
          { label: "Pagadas", value: `$${fmt(paid)}`, color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Pendientes", value: `$${fmt(pending)}`, color: "text-amber-500" },
          { label: "Vencidas", value: `$${fmt(overdue)}`, color: "text-red-500" },
        ].map(s => (
          <div key={s.label} className="card px-5 py-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        <div className="flex gap-1 px-5 pt-4 border-b border-gray-100 dark:border-gray-800">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setPage(1); }}
              className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === t
                  ? "border-primary-600 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="px-5 py-3">
          <div className="w-64">
            <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Buscar facturas…" />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Cargando facturas...</div>
        ) : (
          <>
        <div className="overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>Factura</th>
              <th>Orden</th>
              <th>Cliente</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Pago</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(inv => (
              <tr key={inv.id} className="cursor-pointer" onClick={() => navigate(`/invoices/${inv.id}`)}>
                <td className="font-mono text-xs font-semibold text-primary-600 dark:text-primary-400">{inv.id?.slice(0, 8)}</td>
                <td className="font-mono text-xs text-gray-400">#{inv.orderId?.slice(0, 8)}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 text-[10px] font-semibold flex-shrink-0">
                      {initials(inv.customerName)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{inv.customerName || "—"}</p>
                      <p className="text-xs text-gray-400">{inv.customerEmail || ""}</p>
                    </div>
                  </div>
                </td>
                <td className="font-semibold text-gray-800 dark:text-white">${fmt(inv.amount)}</td>
                <td className="text-xs text-gray-400">{fmtDate(inv.issuedAt)}</td>
                <td>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    inv.paymentMethod === "bold" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                    inv.paymentMethod === "stripe" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                    "bg-gray-100 text-gray-500"
                  }`}>
                    {inv.paymentMethod || "—"}
                  </span>
                </td>
                <td><StatusBadge status={inv.status} /></td>
                <td>
                  <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                    <button className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-primary-600">
                      <Eye size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">No se encontraron facturas</div>
        )}

        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
        </>
        )}
      </div>
    </div>
  );
}
