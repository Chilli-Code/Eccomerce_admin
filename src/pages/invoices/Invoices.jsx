import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Download, Plus } from "../../lib/icons.js";
import { allInvoices } from "../../data/mock.js";
import { StatusBadge, SearchInput, Pagination } from "../../components/ui/index.jsx";

const TABS = ["All", "Paid", "Pending", "Overdue"];

export default function Invoices() {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const PER_PAGE = 6;

  const filtered = allInvoices.filter(inv => {
    const matchTab = tab === "All" || inv.status === tab.toLowerCase();
    const matchSearch =
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const total = allInvoices.reduce((s, i) => s + i.amount, 0);
  const paid = allInvoices.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const pending = allInvoices.filter(i => i.status === "pending").reduce((s, i) => s + i.amount, 0);
  const overdue = allInvoices.filter(i => i.status === "overdue").reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Invoices</h1>
          <p className="text-sm text-gray-400 mt-0.5">{allInvoices.length} invoices total</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary">Export PDF</button>
          <button className="btn-primary"><Plus size={15} /> New Invoice</button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Invoiced", value: `$${total.toFixed(2)}`, color: "text-gray-900 dark:text-white" },
          { label: "Paid", value: `$${paid.toFixed(2)}`, color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Pending", value: `$${pending.toFixed(2)}`, color: "text-amber-500" },
          { label: "Overdue", value: `$${overdue.toFixed(2)}`, color: "text-red-500" },
        ].map(s => (
          <div key={s.label} className="card px-5 py-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        {/* Tabs */}
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
            <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search invoices…" />
          </div>
        </div>
        <div className="overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Order</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Due Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(inv => (
              <tr key={inv.id} className="cursor-pointer" onClick={() => navigate(`/invoices/${inv.id}`)}>
                <td className="font-mono text-xs font-semibold text-primary-600 dark:text-primary-400">{inv.id}</td>
                <td className="font-mono text-xs text-gray-400">{inv.order}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 text-[10px] font-semibold flex-shrink-0">
                      {inv.customer.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{inv.customer}</p>
                      <p className="text-xs text-gray-400">{inv.email}</p>
                    </div>
                  </div>
                </td>
                <td className="font-semibold text-gray-800 dark:text-white">${inv.amount.toFixed(2)}</td>
                <td className="text-xs text-gray-400">{inv.date}</td>
                <td className={`text-xs font-medium ${inv.status === "overdue" ? "text-red-500" : "text-gray-400"}`}>
                  {inv.due}
                </td>
                <td><StatusBadge status={inv.status} /></td>
                <td>
                  <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                    <button className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-primary-600">
                      <Eye size={14} />
                    </button>
                    <button className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-primary-600">
                      <Download size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">No invoices found</div>
        )}

        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </div>
    </div>
  );
}