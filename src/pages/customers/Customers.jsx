import { useState } from "react";
import { Users, Eye, UserX } from "../../lib/icons.js";
import { allCustomers } from "../../data/mock.js";
import { StatusBadge, SearchInput, Pagination, Modal } from "../../components/ui/index.jsx";

export default function Customers() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const PER_PAGE = 6;

  const filtered = allCustomers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="text-sm text-gray-400 mt-0.5">{allCustomers.length} customers</p>
        </div>
        <button className="btn-secondary">Export CSV</button>
      </div>

      <div className="table-wrap">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="w-64">
            <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search customers…" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Joined</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(c => (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xs font-semibold flex-shrink-0">
                        {c.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-center font-medium">{c.orders}</td>
                  <td className="font-semibold text-gray-800 dark:text-gray-200">{c.spent}</td>
                  <td className="text-xs text-gray-400">{c.joined}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>
                    <button onClick={() => setSelected(c)} className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-primary-600">
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            <Users size={32} className="mx-auto mb-2 opacity-30" />No customers found
          </div>
        )}
        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </div>
<Modal open={!!selected} onClose={() => setSelected(null)} title="Customer Details"
  footer={<button className="btn-secondary" onClick={() => setSelected(null)}>Close</button>}
>
  {selected && (
    <div className="space-y-5">

      {/* Avatar + info principal */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl font-bold flex-shrink-0">
          {selected.name.split(" ").map(n => n[0]).join("")}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-gray-900 dark:text-white">{selected.name}</p>
          <p className="text-sm text-gray-400">{selected.email}</p>
          <div className="mt-1.5">
            <StatusBadge status={selected.status} />
          </div>
        </div>
      </div>

      {/* Stats en grid */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Orders", value: selected.orders, icon: "🛍" },
          { label: "Total Spent", value: selected.spent, icon: "💰" },
          { label: "Member Since", value: selected.joined, icon: "📅" },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">{icon}</div>
            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Info extra */}
      <div className="space-y-2">
        {[
          { label: "Email", value: selected.email },
          { label: "Status", value: selected.status === "active" ? "Active account" : "Blocked" },
          { label: "Customer ID", value: `#CUST-${String(selected.id).padStart(4, "0")}` },
          { label: "Avg. order value", value: selected.orders > 0
            ? `$${(parseFloat(selected.spent.replace(/[$,]/g, "")) / selected.orders).toFixed(2)}`
            : "—"
          },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <span className="text-xs text-gray-400">{label}</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{value}</span>
          </div>
        ))}
      </div>

    </div>
  )}
</Modal>
    </div>
  );
}
