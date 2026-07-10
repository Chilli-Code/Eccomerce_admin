import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Plus } from "../../lib/icons.js";
import { api } from "../../lib/api.js";
import { SearchInput, Pagination } from "../../components/ui/index.jsx";
import clsx from "clsx";
import { notify } from "../../lib/notifications.js";
import Loader from "../../components/ui/Loader.jsx";

const TABS = ["All", "Open", "In Progress", "Resolved"];

const PriorityBadge = ({ priority }) => {
  const map = {
    high: "bg-red-50 text-red-600",
    medium: "bg-amber-50 text-amber-600",
    low: "bg-gray-100 text-gray-500",
    critical: "bg-red-100 text-red-700",
  };
  return (
    <span className={clsx("badge", map[priority])}>
      {priority?.charAt(0).toUpperCase() + priority?.slice(1)}
    </span>
  );
};

const StatusBadgeTicket = ({ status }) => {
  const map = {
    open: "bg-blue-50 text-blue-600",
    in_progress: "bg-amber-50 text-amber-600",
    resolved: "bg-emerald-50 text-emerald-600",
    closed: "bg-gray-50 text-gray-600",
  };
  const labels = { in_progress: "In Progress" };
  return (
    <span className={clsx("badge", map[status])}>
      {labels[status] || status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const PER_PAGE = 6;

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await api.tickets.list();
      setTickets(data);
    } catch (err) {
      notify.error("Error al cargar tickets");
    } finally {
      setLoading(false);
    }
  };

  const filtered = tickets.filter(t => {
    const tabMap = {
      "All": true,
      "Open": t.status === "open",
      "In Progress": t.status === "in_progress",
      "Resolved": t.status === "resolved"
    };
    const matchSearch =
      t.subject?.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      t.id?.toLowerCase().includes(search.toLowerCase());
    return tabMap[tab] && matchSearch;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = {
    open: tickets.filter(t => t.status === "open").length,
    in_progress: tickets.filter(t => t.status === "in_progress").length,
    resolved: tickets.filter(t => t.status === "resolved").length,
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Loader size={80} />
      <p className="text-sm text-gray-400">Cargando Tickets...</p>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Support Tickets</h1>
          <p className="text-sm text-gray-400 mt-0.5">{tickets.length} total tickets</p>
        </div>
        <button className="btn-primary" onClick={() => navigate("/tickets/new")}>
          <Plus size={15} /> New Ticket
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Open", count: counts.open, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "In Progress", count: counts.in_progress, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Resolved", count: counts.resolved, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map(s => (
          <div key={s.label} className="card px-5 py-4 flex items-center gap-4">
            <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", s.bg)}>
              <MessageSquare size={18} className={s.color} />
            </div>
            <div>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className={clsx("text-2xl font-semibold", s.color)}>{s.count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        {/* Tabs */}
        <div className="flex gap-1 px-5 pt-4 border-b border-gray-100">
          {TABS.map(t => (
            <button key={t} onClick={() => { setTab(t); setPage(1); }}
              className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >{t}</button>
          ))}
        </div>

        <div className="px-5 py-3">
          <div className="w-64">
            <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search tickets…" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Customer</th>
                <th>Category</th>
                <th>Order</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                <th>Msgs</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(t => (
                <tr key={t.id} className="cursor-pointer" onClick={() => navigate(`/tickets/${t.id}`)}>
                  <td>
                    <p className="font-mono text-xs font-semibold text-primary-600">{t.id?.slice(0, 8)}</p>
                    <p className="text-xs text-gray-400 mt-0.5 max-w-[180px] truncate">{t.subject}</p>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-[10px] font-semibold flex-shrink-0">
                        {t.customerName?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{t.customerName || "Usuario"}</p>
                        
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-gray">{t.category || "General"}</span></td>
                  <td className="font-mono text-xs text-gray-400">{t.orderId?.slice(0, 8) || "—"}</td>
                  <td><PriorityBadge priority={t.priority} /></td>
                  <td><StatusBadgeTicket status={t.status} /></td>
                  <td className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleDateString()}</td>
<td>
  <span className="flex items-center gap-1 text-xs text-gray-400">
    <MessageSquare size={12} /> {t.messageCount || 0}
  </span>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
            No tickets found
          </div>
        )}

        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </div>
    </div>
  );
}