import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Plus } from "../../lib/icons.js";
import { allTickets } from "../../data/mock.js";
import { SearchInput, Pagination } from "../../components/ui/index.jsx";
import clsx from "clsx";

const TABS = ["All", "Open", "In Progress", "Resolved"];

const PriorityBadge = ({ priority }) => {
  const map = {
    high:   "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    medium: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    low:    "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
  };
  return (
    <span className={clsx("badge", map[priority])}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};

const StatusBadgeTicket = ({ status }) => {
  const map = {
    open:        "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    in_progress: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    resolved:    "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
  };
  const labels = { in_progress: "In Progress" };
  return (
    <span className={clsx("badge", map[status])}>
      {labels[status] || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function Tickets() {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const PER_PAGE = 6;

  const filtered = allTickets.filter(t => {
    const tabMap = { "All": true, "Open": t.status === "open", "In Progress": t.status === "in_progress", "Resolved": t.status === "resolved" };
    const matchSearch =
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.customer.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    return tabMap[tab] && matchSearch;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = {
    open: allTickets.filter(t => t.status === "open").length,
    in_progress: allTickets.filter(t => t.status === "in_progress").length,
    resolved: allTickets.filter(t => t.status === "resolved").length,
  };

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Support Tickets</h1>
          <p className="text-sm text-gray-400 mt-0.5">{allTickets.length} total tickets</p>
        </div>
        <button className="btn-primary"><Plus size={15} /> New Ticket</button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Open", count: counts.open, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "In Progress", count: counts.in_progress, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { label: "Resolved", count: counts.resolved, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
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
        <div className="flex gap-1 px-5 pt-4 border-b border-gray-100 dark:border-gray-800">
          {TABS.map(t => (
            <button key={t} onClick={() => { setTab(t); setPage(1); }}
              className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === t
                  ? "border-primary-600 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
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
                    <p className="font-mono text-xs font-semibold text-primary-600 dark:text-primary-400">{t.id}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 max-w-[180px] truncate">{t.subject}</p>
                    </td>
                    <td>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 text-[10px] font-semibold flex-shrink-0">
                        {t.customer.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{t.customer}</p>
                        <p className="text-xs text-gray-400">{t.email}</p>
                        </div>
                    </div>
                    </td>
                    <td><span className="badge badge-gray">{t.category}</span></td>
                    <td className="font-mono text-xs text-gray-400">{t.order ?? "—"}</td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td><StatusBadgeTicket status={t.status} /></td>
                    <td className="text-xs text-gray-400">{t.date}</td>
                    <td>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                        <MessageSquare size={12} /> {t.messages}
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