import clsx from "clsx";

export function StatusBadge({ status }) {
  const map = {
    completed: "badge-green",
    active: "badge-green",
    published: "badge-green",
    processing: "badge-blue",
    pending: "badge-yellow",
    draft: "badge-yellow",
    out_of_stock: "badge-yellow",
    cancelled: "badge-red",
    expired: "badge-gray",
    blocked: "badge-red",
  };
  const labels = {
    out_of_stock: "Out of Stock",
  };
  return (
    <span className={clsx("badge", map[status] || "badge-gray")}>
      {labels[status] || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function StatCard({ label, value, change, up, sub }) {
  return (
    <div className="stat-card">
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
      <p className="text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
      <div className="flex items-center gap-1.5">
        <span className={clsx("text-xs font-semibold", up ? "text-emerald-600 dark:text-emerald-400" : "text-red-500")}>
          {change}
        </span>
        <span className="text-xs text-gray-400">{sub}</span>
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <Icon size={24} className="text-gray-400" />
        </div>
      )}
      <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-1">{title}</p>
      {desc && <p className="text-sm text-gray-400 mb-4">{desc}</p>}
      {action}
    </div>
  );
}

export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg text-gray-400">✕</button>
        </div>
        <div className="px-6 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder = "Search…" }) {
  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pl-9 py-2 text-sm w-full"
      />
    </div>
  );
}

export function Pagination({ page, total, perPage, onChange }) {
  const pages = Math.ceil(total / perPage);
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 dark:border-gray-800">
      <span className="text-xs text-gray-400">
        Showing {Math.min((page - 1) * perPage + 1, total)}–{Math.min(page * perPage, total)} of {total}
      </span>
      <div className="flex gap-1">
        <button
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          className="btn-ghost px-3 py-1.5 text-xs rounded-lg disabled:opacity-40"
        >
          ← Prev
        </button>
        {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={clsx(
              "px-3 py-1.5 text-xs rounded-lg font-medium transition-colors",
              p === page
                ? "bg-primary-600 text-white"
                : "btn-ghost"
            )}
          >
            {p}
          </button>
        ))}
        <button
          disabled={page === pages}
          onClick={() => onChange(page + 1)}
          className="btn-ghost px-3 py-1.5 text-xs rounded-lg disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
